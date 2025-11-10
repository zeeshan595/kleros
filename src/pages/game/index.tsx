import { useNavigate, useParams } from "react-router-dom";
import { GameStateType, MoveType, useRpsGame } from "../../hooks/game.hook";
import { useContext, useEffect, useState } from "react";
import Opponent from "./opponent";
import Owner from "./owner";
import { LoadingContext } from "../../context/loading.context";
import { ErrorContext } from "../../context/error.context";
import { tryCatch } from "../../helpers/tryCatch";
import Button from "../../components/core/button";
import Layout from "../../components/layout";

export default function Game() {
  const { getMyAccounts, getContractInfo, play, solve, refresh } = useRpsGame();
  const { setLoading } = useContext(LoadingContext);
  const { setError } = useContext(ErrorContext);
  const { contractAddress } = useParams();
  const [isOpponent, setIsOpponent] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [gameState, setGameState] = useState<GameStateType>(
    GameStateType.Created
  );
  const [stake, setStake] = useState("0.1");
  const navigate = useNavigate();

  useEffect(() => {
    if (!contractAddress) return;
    // fetch initial data
    async function init() {
      const [result, error] = await tryCatch(
        () => Promise.all([getContractInfo(contractAddress!), getMyAccounts()]),
        setLoading
      );
      if (!result || error) {
        setError(String(error));
        return;
      }
      const [contractInfo, accounts] = result;
      setIsOwner(accounts.includes(contractInfo.ownerAddress));
      setIsOpponent(accounts.includes(contractInfo.opponentAddress));
      setGameState(contractInfo.gameState);
      setStake(contractInfo.stake);
    }
    init();

    // start polling for a refresh to verify state and handle timeout
    const refreshInterval = setInterval(async () => {
      const result = await refresh(contractAddress);
      setGameState(result.gameState);
      if (result.timeout) {
        clearInterval(refreshInterval);
      }
    }, 10_000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, [contractAddress]);

  if (!contractAddress) {
    return <div>404 - not found</div>;
  }

  async function onOpponentPlay(move: MoveType) {
    const [_, error] = await tryCatch(
      () => play(contractAddress!, move, stake),
      setLoading
    );
    if (error) {
      setError(String(error));
      return;
    }
    setGameState(GameStateType.Played);
  }

  async function onOwnerSolve(move: MoveType, salt: string) {
    const [_, error] = await tryCatch(
      () => solve(contractAddress!, move, salt),
      setLoading
    );
    if (error) {
      setError(String(error));
      return;
    }
    setGameState(GameStateType.Finished);
  }

  function onClickPlayAgain() {
    navigate("/");
  }

  function showOpponentControls() {
    if (isOpponent && isOwner) {
      return gameState === GameStateType.Created;
    }
    return isOpponent;
  }
  function showOwnerControls() {
    if (isOpponent && isOwner) {
      return gameState === GameStateType.Played;
    }
    return isOwner;
  }

  return (
    <Layout>
      <h1 className="text-4xl">RPS Game</h1>
      {showOpponentControls() && (
        <Opponent
          gameState={gameState}
          stake={stake}
          onSubmitMove={onOpponentPlay}
        />
      )}
      {showOwnerControls() && (
        <Owner
          gameState={gameState}
          contractAddress={contractAddress}
          onSolve={onOwnerSolve}
        />
      )}

      {gameState === GameStateType.Finished && (
        <div className="flex flex-col gap-2">
          <h1>Game Finished</h1>
          <Button onClick={onClickPlayAgain}>Play Again?</Button>
        </div>
      )}
    </Layout>
  );
}
