import { pathToFileURL } from "node:url";

export function main(): void {
  console.log("rate-limiter");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
