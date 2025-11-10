import { useContext } from "react";
import { MoveType, useRpsGame } from "../../hooks/game.hook";
import { useNavigate } from "react-router-dom";
import { tryCatch } from "../../helpers/tryCatch";
import { LoadingContext } from "../../context/loading.context";
import { ErrorContext } from "../../context/error.context";
import NewGame from "./new-game";
import Layout from "../../components/layout";

export enum Options {
  Rock = "rock",
  Paper = "paper",
  Scissor = "scissor",
  Lizard = "lizard",
  Spock = "spock",
}

export default function Home() {
  const { setLoading } = useContext(LoadingContext);
  const { setError } = useContext(ErrorContext);
  const { newGame } = useRpsGame();
  const navigate = useNavigate();

  async function onNewGameClick(
    opponentAddress: string,
    move: MoveType,
    stake: string
  ) {
    setLoading(true);
    const [result, error] = await tryCatch(
      () => newGame(move, stake, opponentAddress),
      setLoading
    );
    if (!result || error) {
      setError(String(error));
      return;
    }
    window.localStorage.setItem(`${result.contractAddress}:move`, `${move}`);
    window.localStorage.setItem(`${result.contractAddress}:salt`, result.salt);
    navigate(`/game/${result.contractAddress}`);
  }

  return (
    <Layout>
      <h1 className="text-4xl">Kleros - RPS</h1>
      <p className="text-2xl">New Game</p>
      <NewGame onNewGameClick={onNewGameClick} />
    </Layout>
  );
}
