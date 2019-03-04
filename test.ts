import { MATCHER } from "./index";

const cases = [
  {
    repo: "abc",
    branch: "master",
    rest: "/mod.ts"
  },
  {
    repo: "abc",
    branch: "",
    rest: "/mod.ts"
  }
];

test("matcher", () => {
  for (const c of cases) {
    const url = `/${c.repo}${c.branch ? `@${c.branch}` : ""}${c.rest}`;
    const [, repo, versionSpecified, branch, rest] = MATCHER.exec(url);
    expect(
      () =>
        repo === c.repo &&
        (versionSpecified === undefined || versionSpecified === "@") &&
        branch === c.branch &&
        rest === c.rest
    ).toBeTruthy();
  }
});
