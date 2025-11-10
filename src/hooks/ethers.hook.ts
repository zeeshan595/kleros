import { ethers } from "ethers";
import { getConfig } from "../env";
import { useState } from "react";

export type CompiledContract = {
  abi: ethers.Interface | ethers.InterfaceAbi;
  evm: {
    bytecode: {
      object: string;
    };
    deployedBytecode: {
      object: string;
    };
  };
};

export function useEthers() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  async function getProvider() {
    if (!window.ethereum) {
      throw new Error("metamask not found");
    }
    if (provider) {
      return provider;
    }
    const { ethers } = await import("ethers");
    const p = new ethers.BrowserProvider(window.ethereum);
    setProvider(p);
    return p;
  }

  async function switchToNetwork() {
    const config = getConfig();
    const provider = await getProvider();
    const network = await provider.getNetwork();
    if (network.chainId === BigInt(config.NETWORK_CHAIN_ID)) return;

    const SEPOLIA_CHAIN_ID_HEX = `0x${config.NETWORK_CHAIN_ID.toString(16)}`;
    await window.ethereum!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  }

  async function getMyAccounts() {
    const provider = await getProvider();
    const accounts = await provider.listAccounts();
    return accounts.map((account) => account.address);
  }

  class Contract {
    constructor(private readonly compiledContract: CompiledContract) {}

    async callFunc<Return>(
      contractAddress: string,
      funcName: string,
      ...args: unknown[]
    ): Promise<Return> {
      const provider = await getProvider();
      await switchToNetwork();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        this.compiledContract.abi,
        signer
      );
      if (!(funcName in contract)) {
        throw new Error(
          `cannot find ${funcName} function inside smart contract`
        );
      }
      const func = await contract[funcName]!(...args);
      const result = await func.wait();
      return result as Return;
    }

    async getValue<Return>(contractAddress: string, parameter: string) {
      const provider = await getProvider();
      await switchToNetwork();
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        this.compiledContract.abi,
        signer
      );
      if (!(parameter in contract)) {
        throw new Error(
          `cannot find ${parameter} parameter inside smart contract`
        );
      }
      const result = contract[parameter]!();
      return result as Return;
    }

    async deploy(...args: unknown[]) {
      const provider = await getProvider();
      await switchToNetwork();
      const signer = await provider.getSigner();
      const factory = new ethers.ContractFactory(
        this.compiledContract.abi,
        this.compiledContract.evm.bytecode.object,
        signer
      );
      const contract = await factory.deploy(...args);
      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();
      return { contractAddress };
    }

    async verify(contractAddress: string) {
      const provider = await getProvider();
      await switchToNetwork();
      const code = await provider.getCode(contractAddress);
      const computedHash = ethers.keccak256(code);
      const compiledHash = ethers.keccak256(
        `0x${this.compiledContract.evm.deployedBytecode.object}`
      );
      if (computedHash !== compiledHash) {
        throw new Error("Smart contract failed validation");
      }
    }
  }

  return {
    Contract,
    getMyAccounts,
  };
}
