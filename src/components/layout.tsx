import { type PropsWithChildren } from "react";
import Loading from "./loading";
import Broken from "./Broken";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 p-2 my-4 items-center justify-center">
      <Loading />
      <Broken />
      {props.children}
    </div>
  );
}
