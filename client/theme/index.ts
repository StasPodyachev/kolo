import { extendTheme } from "@chakra-ui/react";
import global  from "@/theme/global";
import fonts from "@/theme/fonts";

const theme = extendTheme({
  styles: {
    global,
  },
  fonts,
});

export default theme;
