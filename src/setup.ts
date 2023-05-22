import { asyncExec } from "./utils/asyncExec";
import { getCount } from "./utils/getCount";
import { logHandler } from "./utils/logHandler";
import { range } from "./utils/range";

const getData = (data: string) => {
  const parsed = JSON.parse(data);
  const id: string = parsed[0].id;
  const ip: string = parsed[0].networks.v4.find(
    (network: Record<string, unknown>) => network.type === "public"
  ).ip_address;
  return { id, ip };
};

(async () => {
  const count = getCount();
  const countRange = range(count);
  const lines = [
    "=== Droplets Ready ===",
    "",
    "Please update your SSH config (located at ~/.ssh/config) with the following:",
    "",
  ];
  for (const num of countRange) {
    logHandler.log("info", `Generating droplet ${num}...`);
    const { stdout } = await asyncExec(
      `doctl compute droplet create --enable-monitoring --enable-private-networking --region nyc3 --size s-4vcpu-8gb --image ${process.env.SNAPSHOT_ID} --ssh-keys ${process.env.SSH_KEY_ID} --wait email-${num} --context fcc`
    );
    const { id, ip } = getData(stdout);
    logHandler.log("info", "Assigning droplet to project.");
    await asyncExec(
      `doctl projects resources assign ${process.env.PROJECT_ID} --resource=do:droplet:${id}`
    );
    lines.push(`Host email${num}`);
    lines.push(`  HostName ${ip}`);
    lines.push(`  User freecodecamp`);
    lines.push("");
  }

  lines.push("When you are ready to start the process, run `npm run init`");
  logHandler.log("info", lines.join("\n"));
})();
