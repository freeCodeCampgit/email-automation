import { readFile, writeFile } from "fs/promises";
import { join } from "path";

(async () => {
  const formResponses = await readFile(
    join(process.cwd(), "data", "form-responses.csv"),
    "utf-8"
  );
  const { emailsToFilter, emailsToManuallyCheck } = formResponses
    .trim()
    .split("\n")
    .slice(1)
    .reduce(
      (arrays, line) => {
        const [, email, ...notes] = line.split(",");
        if (!notes.some((note) => note.includes("@"))) {
          arrays.emailsToFilter.push(email);
          return arrays;
        }
        arrays.emailsToManuallyCheck.push(email);
        return arrays;
      },
      {
        emailsToFilter: [] as string[],
        emailsToManuallyCheck: [] as string[],
      }
    );
  await writeFile(
    join(process.cwd(), "data", "to-filter.csv"),
    emailsToFilter.join("\n"),
    "utf-8"
  );
  await writeFile(
    join(process.cwd(), "data", "check-these.csv"),
    emailsToManuallyCheck.join("\n"),
    "utf-8"
  );
})();
