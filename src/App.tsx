import { pipe, constant } from "fp-ts/function";
import "./App.css";
import { Home } from "./Pages/Home";
import { Roles } from "./Pages/Roles";
import { foldLocation } from "./Router/RouterProvider";
import { useRouter } from "./routing";

function App(): JSX.Element {
  const router = useRouter();

  return pipe(
    router.current,
    foldLocation({
      Home: constant(<Home />),
      Roles: constant(<Roles />),
      Game: constant(<div></div>),
      Players: constant(<div></div>),
    })
  );
}

export default App;
