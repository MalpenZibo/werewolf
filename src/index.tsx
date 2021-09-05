import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { IntlProvider } from "./IntlProvider";
import { RouterProvider, routing } from "./routing";
import { StrictMode } from "react";
import { option } from "fp-ts";

const locale = "it";

ReactDOM.render(
  <StrictMode>
    <IntlProvider locale={locale}>
      <RouterProvider basepath={option.some("wherewolf")} routing={routing}>
        <App />
      </RouterProvider>
    </IntlProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
