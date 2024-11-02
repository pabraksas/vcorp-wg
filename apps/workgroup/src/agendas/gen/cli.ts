import type { Argv } from "yargs";
import type { ArgsFromOptions } from "../../interfaces.js";

import { generateAgendas } from "./index.js";
import { loadConfig } from "../../config.js";

export function options(yargs: Argv) {
  return yargs
    .positional("year", { type: "string", demandOption: true })
    .positional("month", { type: "string", demandOption: true })
    .example("$0 2024 1", "Generate agendas for Jan 2024");
}

export async function run(args: ArgsFromOptions<typeof options>) {
  const config = await loadConfig();
  await generateAgendas(config, {
    year: args.year,
    month: args.month,
  });
}
