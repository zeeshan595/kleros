import solc from "solc";
import * as fs from "fs";

const COMPILER_VERSION = "v0.4.26+commit.4563c3fc";
const CONTRACTS_INPUT_DIR = "src";
const CONTRACTS_OUTPUT_DIR = "dist";

async function main() {
  const sol = await new Promise<typeof solc>((resolve, reject) => {
    solc.loadRemoteVersion(
      COMPILER_VERSION,
      (error: Error, value: typeof solc) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      }
    );
  });

  if (fs.existsSync(CONTRACTS_OUTPUT_DIR)) {
    fs.rmSync(CONTRACTS_OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(CONTRACTS_OUTPUT_DIR);

  const contracts = fs.readdirSync(CONTRACTS_INPUT_DIR);
  for (const contractName of contracts) {
    if (!contractName) continue;
    if (!contractName.endsWith(".sol")) continue;

    const content = fs.readFileSync(`${CONTRACTS_INPUT_DIR}/${contractName}`, {
      encoding: "utf8",
    });
    const input = JSON.stringify({
      language: "Solidity",
      sources: {
        [contractName]: { content },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"],
          },
        },
      },
    });
    const result = sol.compile(input);
    fs.writeFileSync(
      `${CONTRACTS_OUTPUT_DIR}/${contractName.replace(".sol", ".json")}`,
      result,
      {
        encoding: "utf8",
      }
    );
  }
}
main();
