import { extendTheme } from "@chakra-ui/react";
import heading from "@/theme/components/heading"
import textStyles from "@/theme/textStyles";
import fonts from "@/theme/fonts";
import input from "./components/input";
import colors from "./colors";

const theme = extendTheme({
  components: {
    Heading: heading,
    Input: input,
  },
  colors,
  fonts,
  textStyles,
});

export default theme;
