import { ethers } from "ethers";
import { useContract } from "./contract.hook";
import RPS from "../contracts/RPS.json";

const abi = RPS.contracts["RPS.sol"].RPS.abi;
const bytecode = RPS.contracts["RPS.sol"].RPS.evm.bytecode.object;

export enum MoveType {
  None = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
  Spock = 4,
  Lizard = 5,
}

export function useRpsGame() {
  const { create, callFunc, verify } = useContract(abi, bytecode);

  async function newGame(
    move: MoveType,
    stake: string,
    opponentAddress: string
  ) {
    const salt = BigInt(`0x${crypto.randomUUID().replaceAll("-", "")}`);
    const hash = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint8", "uint256"],
        [move, salt]
      )
    );
    return await create(hash, opponentAddress, {
      value: ethers.parseEther(stake),
    });
  }

  async function play(contractAddress: string, move: MoveType, stake: string) {
    await verify(contractAddress);
    return await callFunc(contractAddress, "play", move, {
      value: ethers.parseEther(stake),
    });
  }

  async function solve(contractAddress: string, move: MoveType, salt: string) {
    await verify(contractAddress);
    return await callFunc(contractAddress, "solve", move, salt);
  }

  return {
    newGame,
    play,
    solve,
  };
}
