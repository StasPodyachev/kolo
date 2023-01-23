import { extendTheme } from "@chakra-ui/react";
import heading from "@/theme/components/heading"
import textStyles from "@/theme/textStyles";

const theme = extendTheme({
  components: {
    Heading: heading,
  },
  textStyles,
});

export default theme;
