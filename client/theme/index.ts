import { extendTheme } from "@chakra-ui/react";
import heading from "@/theme/components/heading"
import textStyles from "@/theme/textStyles";
import fonts from "@/theme/fonts";
import input from "./components/input";
import colors from "./colors";
import modal from "./components/modal";
import button from "./components/button";

const theme = extendTheme({
  components: {
    Heading: heading,
    Input: input,
    Modal: modal,
    Button: button,
  },
  colors,
  fonts,
  textStyles,
});

export default theme;
