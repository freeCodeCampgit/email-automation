import { readFile, writeFile } from "fs/promises";
import { join } from "path";

(async () => {
  const emailsToFilter = [
    ...new Set(
      (
        await readFile(join(process.cwd(), "data", "to-filter.csv"), "utf-8")
      ).split("\n")
    ),
  ];
  const filtered = ["email,unsubscribeId"];
  const fullList = (
    await readFile(join(process.cwd(), "data", "emailList.bak.csv"), "utf-8")
  ).split("\n");
  for (const email of emailsToFilter) {
    const emailIndex = fullList.findIndex((line) => line.startsWith(email));
    if (emailIndex === -1) {
      continue;
    }
    const removed = fullList.splice(emailIndex, 1);
    filtered.push(...removed);
  }
  await writeFile(
    join(process.cwd(), "data", "emailList.csv"),
    fullList.join("\n"),
    "utf-8"
  );
  await writeFile(
    join(process.cwd(), "data", "newList.csv"),
    filtered.join("\n"),
    "utf-8"
  );
})();
