import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

export function Error() {
  return (
    <Box display="flex" width={1} alignItems="center" justifyContent="center">
      <Typography variant="h6">
        <FormattedMessage id="genericError" />
      </Typography>
    </Box>
  );
}
