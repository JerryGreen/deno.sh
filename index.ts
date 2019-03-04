import { IncomingMessage, ServerResponse } from "http";
import axios from "axios";
import * as DATABASE from "./database.json";

/**
 * Group 1: repo
 * Group 2: @
 * Group 3: branch
 * Group 4: rest
 */
export const MATCHER = /^\/([^\/@]+)(@)?([^\/]*)(.*)/;

export default (req: IncomingMessage, resp: ServerResponse) => {
  try {
    if (req.url === "/") {
      resp.statusCode = 301;
      resp.setHeader("Location", "https://github.com/zhmushan/deno.sh");
      resp.end();
    }
    if (!MATCHER.test(req.url)) {
      throw new InvalidUrlException();
    }
    const [, repo, versionSpecified, branch, rest] = MATCHER.exec(req.url);
    if (!repo || !DATABASE[repo]) {
      throw new InvalidUrlException();
    }
    if (!rest) {
      resp.statusCode = 301;
      resp.setHeader("Location", DATABASE[repo].repo);
      resp.end();
    }
    axios
      .get(
        `${DATABASE[repo].url}/${versionSpecified ? branch : "master"}${rest}`
      )
      .then(body => {
        resp.setHeader("Content-Type", "text/plain");
        resp.statusCode = 200;
        resp.end(body.data);
      })
      .catch(err => {
        resp.statusCode = 404;
        resp.end("Not Found");
        if (rest.endsWith(".js")) {
          // TODO: https://github.com/denoland/registry/issues/39
        }
      });
  } catch (err) {
    resp.statusCode = err.status;
    resp.end(err.message);
  }
};

class InvalidUrlException extends Error {
  message = "Invalid URL";
  status = 500;
}
