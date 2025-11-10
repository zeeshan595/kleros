import { useState } from "react";
import { GameStateType, MoveType } from "../../hooks/game.hook";
import Button from "../../components/core/button";
import MoveSelector from "../../components/move-selector";
import Input from "../../components/core/input";

export type Props = {
  gameState: GameStateType;
  contractAddress: string;
  onSolve?: (move: MoveType, salt: string) => void;
};

export default function Owner(props: Props) {
  const [move, setMove] = useState<MoveType>(
    Number.parseInt(
      window.localStorage.getItem(`${props.contractAddress}:move`) || "0"
    )
  );
  const [salt, setSalt] = useState(
    window.localStorage.getItem(`${props.contractAddress}:salt`) ?? ""
  );

  function onSolve() {
    if (props.onSolve) {
      props.onSolve(move, salt);
    }
    window.localStorage.removeItem(`${props.contractAddress}:move`);
    window.localStorage.removeItem(`${props.contractAddress}:salt`);
  }

  function onClickCopyToClipboard() {
    window.navigator.clipboard.writeText(window.location.href);
  }

  if (props.gameState === GameStateType.Created) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Give your opponent this url</h2>
        <Input type="text" value={window.location.href} />
        <Button onClick={onClickCopyToClipboard}>Copy to clipboard</Button>
      </div>
    );
  }

  if (props.gameState === GameStateType.Played) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Please reveal your move</h2>
        <MoveSelector onChange={setMove} value={move} />
        <Input type="text" value={salt} onChange={setSalt} />
        <Button onClick={onSolve}>Reveal Move</Button>
      </div>
    );
  }

  return null;
}
