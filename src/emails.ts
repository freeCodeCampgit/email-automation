import { readFile, writeFile } from "fs/promises";
import { join } from "path";

import { asyncExec } from "./utils/asyncExec";
import { getCount } from "./utils/getCount";
import { logHandler } from "./utils/logHandler";
import { range } from "./utils/range";

const parseEmail = (line: string) => line.split(",")[0];

(async () => {
  const count = getCount();
  const countRange = range(count);
  logHandler.log("info", "Fetching email list from server...");
  await asyncExec(
    "scp email1:/home/freecodecamp/email-blast/prod/email.csv ../data/emailList.csv"
  );
  logHandler.log("info", "Reading emails...");
  const emails = await readFile(
    join(process.cwd(), "data", "emailList.csv"),
    "utf-8"
  );
  // remove the header
  const emailList = emails.trim().split("\n").slice(1);
  const batchSize = Math.floor(emailList.length / count);
  logHandler.log(
    "info",
    `Found ${emailList.length} emails. Splitting into ${count} files of ${batchSize} emails...`
  );
  for (const num of countRange) {
    const emails = emailList.splice(0, batchSize);
    logHandler.log(
      "info",
      `Writing email${num}.csv from ${parseEmail(emails[0])} to ${parseEmail(
        emails[emails.length - 1]
      )}`
    );
    await writeFile(
      join(process.cwd(), "data", "email1.csv"),
      "email,unsubscribe\n" + emails.join("\n")
    );
    logHandler.log("info", `Copying email${num}.csv to email${num}...`);
    await asyncExec(
      `scp ../data/email1.csv email${num}:/home/freecodecamp/email-blast/prod/validEmails.csv`
    );
  }
  logHandler.log("info", "Servers are ready to send email.");
  logHandler.log(
    "info",
    "Validate that the email lists look correct manually."
  );
  logHandler.log("info", "Then ssh into the servers and start the process.");
  logHandler.log(
    "info",
    "When you are satisfied with the emails, run `npm run clean` to clean up your local files for security."
  );
})();
