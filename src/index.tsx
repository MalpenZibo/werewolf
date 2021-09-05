import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { IntlProvider } from "./IntlProvider";
import { StrictMode } from "react";
import { BuildConfigProvider } from "./ConfigProvider";
import { buildConfig } from "./config";

const locale = "it";

ReactDOM.render(
  <StrictMode>
    <BuildConfigProvider {...buildConfig}>
      <IntlProvider locale={locale}>
        <App />
      </IntlProvider>
    </BuildConfigProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
