import { GameStateType, MoveType } from "../../hooks/game.hook";
import { useState } from "react";
import Button from "../../components/core/button";
import Input from "../../components/core/input";
import MoveSelector from "../../components/move-selector";

export type Props = {
  gameState: GameStateType;
  stake: string;
  onSubmitMove?: (move: MoveType) => void;
};

export default function Opponent(props: Props) {
  const [move, setMove] = useState(MoveType.None);

  function onSubmitMove() {
    if (props.onSubmitMove) {
      props.onSubmitMove(move);
    }
  }

  if (props.gameState === GameStateType.Created) {
    return (
      <div className="flex flex-col gap-2">
        <Input readOnly type="text" value={props.stake} />
        <MoveSelector onChange={setMove} value={move} />
        <Button onClick={onSubmitMove}>Submit Move</Button>
      </div>
    );
  }

  if (props.gameState === GameStateType.Played) {
    return (
      <div className="flex flex-col gap-2">
        <h2>Waiting for other player to solve their move</h2>
      </div>
    );
  }

  return null;
}
