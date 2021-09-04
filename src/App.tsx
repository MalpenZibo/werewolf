import { pipe, constant } from "fp-ts/function";
import "./App.css";
import { foldLocation } from "./Router/RouterProvider";
import { useRouter } from "./routing";

function App(): JSX.Element {
  const router = useRouter();

  return pipe(
    router.current,
    foldLocation({
      Home: constant(<div></div>),
      Roles: constant(<div></div>),
      Game: constant(<div></div>),
      Players: constant(<div></div>),
    })
  );
}

export default App;
