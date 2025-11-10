import { ethers } from "ethers";
import { useEthers } from "./ethers.hook";
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

export enum GameStateType {
  Created = "created", // smart contract is created
  Played = "played", // opponenet has made their turn
  Finished = "finished", //solve was claled on the smart contract
}

export function useRpsGame() {
  const { create, callFunc, verify, getValue, getMyAccounts } = useEthers(
    abi,
    bytecode
  );

  function getGameState(
    stake: ethers.BigNumberish,
    opponentMove: ethers.BigNumberish
  ) {
    if (opponentMove === BigInt(0)) {
      return GameStateType.Created;
    }

    if (stake !== BigInt(0)) {
      return GameStateType.Played;
    } else {
      return GameStateType.Finished;
    }
  }

  async function newGame(
    move: MoveType,
    stake: string,
    opponentAddress: string
  ) {
    const salt = ethers.hexlify(ethers.randomBytes(32));
    const hash = ethers.keccak256(
      ethers.solidityPacked(["uint8", "uint256"], [move, salt])
    );
    const result = await create(hash, opponentAddress, {
      value: ethers.parseEther(stake),
    });
    return { ...result, salt, hash };
  }

  async function play(contractAddress: string, move: MoveType, stake: string) {
    await verify(contractAddress);
    return await callFunc(contractAddress, "play", move as number, {
      value: ethers.parseEther(stake),
    });
  }

  async function solve(contractAddress: string, move: MoveType, salt: string) {
    await verify(contractAddress);

    return await callFunc(contractAddress, "solve", move, BigInt(salt));
  }

  async function getContractInfo(contractAddress: string) {
    await verify(contractAddress);
    const [opponentMove, stake, ownerAddress, opponentAddress] =
      await Promise.all([
        getValue<ethers.BigNumberish>(contractAddress, "c2"),
        getValue<ethers.BigNumberish>(contractAddress, "stake"),
        getValue<string>(contractAddress, "j1"),
        getValue<string>(contractAddress, "j2"),
      ]);

    const gameState = getGameState(stake, opponentMove);

    return {
      gameState,
      stake: ethers.formatEther(stake),
      ownerAddress,
      opponentAddress,
    };
  }

  async function refresh(contractAddress: string) {
    const [lastActionBig, stake, opponentMove] = await Promise.all([
      getValue<ethers.BigNumberish>(contractAddress, "lastAction"),
      getValue<ethers.BigNumberish>(contractAddress, "stake"),
      getValue<ethers.BigNumberish>(contractAddress, "c2"),
    ]);

    const gameState = getGameState(stake, opponentMove);

    if (stake === BigInt(0)) {
      return {
        timeout: false,
        gameState,
      };
    }

    const lastAction = ethers.toNumber(lastActionBig);
    const fiveMinAgo = Date.now() / 1000 - 300;
    if (lastAction >= fiveMinAgo) {
      return {
        timeout: false,
        gameState,
      };
    }

    if (opponentMove !== BigInt(0)) {
      await callFunc(contractAddress, "j1Timeout");
    } else {
      await callFunc(contractAddress, "j2Timeout");
    }
    return {
      timeout: true,
      gameState: GameStateType.Finished,
    };
  }

  return {
    newGame,
    play,
    solve,
    getContractInfo,
    getMyAccounts,
    refresh,
  };
}
