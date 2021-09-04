import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

export function useBreakpoint(): {
  isSM: boolean;
  isMD: boolean;
  isLG: boolean;
  isXL: boolean;
  foldBreakpoints: <A>(f: {
    ifExtraLarge: () => A;
    ifLarge: () => A;
    ifMedium: () => A;
    ifSmall: () => A;
    ifExtraSmall: () => A;
  }) => A;
} {
  const theme = useTheme();
  const isSM = useMediaQuery(theme.breakpoints.up("sm"));
  const isMD = useMediaQuery(theme.breakpoints.up("md"));
  const isLG = useMediaQuery(theme.breakpoints.up("lg"));
  const isXL = useMediaQuery(theme.breakpoints.up("xl"));

  return {
    isSM,
    isMD,
    isLG,
    isXL,
    foldBreakpoints: ({
      ifExtraLarge,
      ifLarge,
      ifMedium,
      ifSmall,
      ifExtraSmall,
    }) => {
      if (isXL) return ifExtraLarge();
      if (isLG) return ifLarge();
      if (isMD) return ifMedium();
      if (isSM) return ifSmall();
      return ifExtraSmall();
    },
  };
}
