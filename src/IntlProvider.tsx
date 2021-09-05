import { option, taskEither } from "fp-ts";
import { identity } from "io-ts";
import { useEffect, useState } from "react";
import { Option } from "fp-ts/Option";
import { constant, pipe } from "fp-ts/function";
import { IntlProvider as InternalIntlProvider } from "react-intl";
import { Waiting } from "./blocks/Common/Waiting";

type Locale = "it";

type Props = {
  children: JSX.Element;
  locale: Locale;
};

function loadLocaleData(locale: Locale) {
  return taskEither.tryCatch(() => {
    switch (locale) {
      case "it":
        return import("./messages/it.json").then((messages) => ({
          ...messages.default,
        }));
    }
  }, identity);
}

export function IntlProvider(props: Props) {
  const [messages, setMessages] = useState<Option<Record<string, string>>>(
    option.none
  );

  useEffect(() => {
    pipe(
      loadLocaleData(props.locale),
      taskEither.map((messages) => setMessages(option.some(messages)))
    )();
  }, [props.locale]);

  return pipe(
    messages,
    option.fold(constant(<Waiting />), (messages) => (
      <InternalIntlProvider messages={messages} locale={props.locale}>
        {props.children}
      </InternalIntlProvider>
    ))
  );
}
