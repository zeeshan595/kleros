import { ethers } from "ethers";
import { getConfig } from "../env";

let provider: ethers.BrowserProvider;

export function useEthers(
  abi: ethers.Interface | ethers.InterfaceAbi,
  bytecode: string
) {
  async function init() {
    if (!window.ethereum) {
      throw new Error("metamask not found");
    }
    const { ethers } = await import("ethers");
    provider = new ethers.BrowserProvider(window.ethereum);
  }

  async function switchToNetwork() {
    if (!provider) await init();
    const config = getConfig();
    const network = await provider.getNetwork();
    if (network.chainId === BigInt(config.NETWORK_CHAIN_ID)) return;

    const SEPOLIA_CHAIN_ID_HEX = `0x${config.NETWORK_CHAIN_ID.toString(16)}`;
    await window.ethereum!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  }

  async function callFunc<Return>(
    contractAddress: string,
    funcName: string,
    ...args: unknown[]
  ): Promise<Return> {
    if (!provider) await init();
    await switchToNetwork();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    if (!(funcName in contract)) {
      throw new Error(`cannot find ${funcName} function inside smart contract`);
    }
    const func = await contract[funcName]!(...args);
    const result = await func.wait();
    return result as Return;
  }

  async function getValue<Return>(contractAddress: string, parameter: string) {
    if (!provider) await init();
    await switchToNetwork();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    if (!(parameter in contract)) {
      throw new Error(
        `cannot find ${parameter} parameter inside smart contract`
      );
    }
    const result = contract[parameter]!();
    return result as Return;
  }

  async function create(...args: unknown[]) {
    if (!provider) await init();
    await switchToNetwork();
    const signer = await provider.getSigner();
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    return { contractAddress };
  }

  async function verify(contractAddress: string) {
    if (!provider) await init();
    const code = await provider.getCode(contractAddress);
    const computedHash = ethers.keccak256(code);
    const expectedHash = ethers.keccak256(ethers.getBytes(`0x${bytecode}`));
    // if (expectedHash !== computedHash) {
    //   console.error(expectedHash, "!=", computedHash);
    //   throw new Error("contract bytecode does not match expected hash");
    // }
  }

  async function getMyAccounts() {
    if (!provider) await init();
    const accounts = await provider.listAccounts();
    return accounts.map((account) => account.address);
  }

  return {
    callFunc,
    getValue,
    create,
    verify,
    getMyAccounts,
  };
}
