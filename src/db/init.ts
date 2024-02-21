import { asyncExec } from "../utils/asyncExec";
import { logHandler } from "../utils/logHandler";

(async () => {
  logHandler.log("info", "Copying mongo.env to db-query");
  await asyncExec(
    `scp data/mongo.env db-query:/home/freecodecamp/scripts/emails/.env`
  );

  logHandler.log("info", "Droplet ready to start database query.");
  logHandler.log("info", "Run the database query on db-query.");
  logHandler.log(
    "info",
    "Your commands will be: `cd scripts/emails && screen`, then `node get-emails.js email.csv`"
  );
  logHandler.log(
    "info",
    "Once the query is complete, return here and run `pnpm run db:teardown`."
  );
})();
