import { extendTheme } from "@chakra-ui/react";
import fonts from "@/theme/fonts";
import heading from "@/theme/components/heading"
import textStyles from "@/theme/textStyles";

const theme = extendTheme({
  components: {
    Heading: heading,
  },
  fonts,
  textStyles,
});

export default theme;
