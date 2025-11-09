import Button from "../components/button";
import { MoveType, useRpsGame } from "../hooks/game.hook";

export enum Options {
  Rock = "rock",
  Paper = "paper",
  Scissor = "scissor",
  Lizard = "lizard",
  Spock = "spock",
}

export default function Home() {
  const { newGame, play, solve } = useRpsGame();

  return (
    <div className="flex flex-col">
      <h1>Kleros - RPS</h1>
      <p>Make your choice!</p>
      <div className="flex gap-4">
        {Object.values(Options).map((option) => (
          <Button key={option}>{option}</Button>
        ))}
      </div>
    </div>
  );
}
