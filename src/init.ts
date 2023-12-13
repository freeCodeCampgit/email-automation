import { readFile, stat } from "fs/promises";
import { join } from "path";

import { asyncExec } from "./utils/asyncExec";
import { getCount } from "./utils/getCount";
import { logHandler } from "./utils/logHandler";
import { range } from "./utils/range";

(async () => {
  const status = await stat(join(process.cwd(), "data", "email1.csv")).catch(
    () => null
  );
  if (status) {
    logHandler.log(
      "error",
      "Found existing email lists. Please run `pnpm run clean`."
    );
    return;
  }
  const count = getCount();
  const countRange = range(count);

  logHandler.log("info", "Checking email data.");
  const env = await readFile(
    join(process.cwd(), "data", "emails.env"),
    "utf-8"
  );
  const subjectLine = env
    .split("\n")
    .find((line) => line.startsWith("MAIL_SUBJECT="))
    ?.split("=")[1];
  logHandler.log("info", `Subject Line: ${subjectLine}`);
  const body = await readFile(
    join(process.cwd(), "data", "emailBody.txt"),
    "utf-8"
  );
  const quote = body
    .split("\n")
    .find((line) => line.startsWith("Quote of the Week: "));
  logHandler.log("info", quote);

  logHandler.log("info", "Copying email data to servers.");
  for (const num of countRange) {
    logHandler.log("info", `Copying email body to email${num}...`);
    await asyncExec(
      `scp data/emailBody.txt email${num}:/home/freecodecamp/email-blast/prod/emailBody.txt`
    );
    logHandler.log("info", `Copying .env to email${num}...`);
    await asyncExec(
      `scp data/emails.env email${num}:/home/freecodecamp/email-blast/.env`
    );
  }
  logHandler.log(
    "info",
    "Servers are ready to receive email list. Run `pnpm run emails`."
  );
})();
