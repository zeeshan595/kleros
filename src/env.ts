export enum Environment {
  Dev = "dev",
  Prod = "prod",
}

export const environment =
  (process.env.VITE_ENV as Environment) ?? Environment.Dev;

export const config = {
  [Environment.Dev]: {
    NETWORK_CHAIN_ID: 11155111, // sepolia
  },
  [Environment.Prod]: {
    NETWORK_CHAIN_ID: 11155111, // todo: change to another network
  },
} as const;

export function getConfig() {
  if (!(environment in config)) {
    throw new Error("invalid environment");
  }
  return config[environment];
}
