import { unlink, open } from "fs/promises";
import { join } from "path";

import { getCount } from "./utils/getCount";
import { logHandler } from "./utils/logHandler";
import { range } from "./utils/range";

(async () => {
  logHandler.log("info", "Cleaning files.");
  const count = getCount();
  await unlink(join(process.cwd(), "data", "emailList.csv"));
  const listHandle = await open(
    join(process.cwd(), "data", "emailList.csv"),
    "w"
  );
  await listHandle.close();
  for (const num of range(count)) {
    await unlink(join(process.cwd(), "data", `email${num}.csv`));
    const handle = await open(
      join(process.cwd(), "data", `email${num}.csv`),
      "w"
    );
    await handle.close();
  }
  logHandler.log(
    "info",
    "Files are cleaned. Run `npm run teardown` to destroy the droplets."
  );
})();
