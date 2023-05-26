import { unlink, open, readFile } from "fs/promises";
import { join } from "path";

import { asyncExec } from "./utils/asyncExec";
import { getCount } from "./utils/getCount";
import { logHandler } from "./utils/logHandler";
import { range } from "./utils/range";

(async () => {
  const count = getCount();
  const countRange = range(count);

  logHandler.log("info", "Cleaning files.");
  await unlink(join(process.cwd(), "data", "emailList.csv"));
  const listHandle = await open(
    join(process.cwd(), "data", "emailList.csv"),
    "w"
  );
  await listHandle.close();
  for (const num of countRange) {
    await unlink(join(process.cwd(), "data", `email${num}.csv`));
    const handle = await open(
      join(process.cwd(), "data", `email${num}.csv`),
      "w"
    );
    await handle.close();
  }

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

  logHandler.log("info", "Copying mongo.env to email1");
  await asyncExec(
    `scp data/mongo.env email1:/home/freecodecamp/scripts/emails/.env`
  );

  logHandler.log("info", "Servers are ready to start the database query.");
  logHandler.log("info", "Run the database query on email1.");
  logHandler.log("info", "Set the output file to email.csv");
  logHandler.log(
    "info",
    "Once the query is complete, return here and run `npm run emails`."
  );
})();
