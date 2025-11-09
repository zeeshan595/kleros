import { ethers } from "ethers";
import { getConfig } from "../env";

export function useContract(
  abi: ethers.Interface | ethers.InterfaceAbi,
  bytecode: string
) {
  if (!window.ethereum) {
    throw new Error("metamask not found");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const expectedHash = ethers.keccak256(ethers.getBytes(`0x${bytecode}`));

  async function switchToNetwork() {
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
    await switchToNetwork();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    if (!(funcName in contract)) {
      throw new Error(`cannot find ${funcName} function inside smart contract`);
    }
    const func = await contract[funcName]!(args);
    const result = await func.wait();
    return result as Return;
  }

  async function getValue<Return>(contractAddress: string, parameter: string) {
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
    await switchToNetwork();
    const signer = await provider.getSigner();
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    return { contractAddress };
  }

  async function verify(contractAddress: string) {
    const code = await provider.getCode(contractAddress);
    const computedHash = ethers.keccak256(code);
    if (expectedHash !== computedHash) {
      throw new Error("contract bytecode does not match expected hash");
    }
  }

  return {
    callFunc,
    getValue,
    create,
    verify,
  };
}
