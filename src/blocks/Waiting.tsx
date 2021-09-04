import { Box, CircularProgress } from "@material-ui/core";

export function Waiting() {
  return (
    <Box
      display="flex"
      width={1}
      height={1}
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
}
