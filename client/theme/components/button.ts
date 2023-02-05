const button = {
  baseStyle: {
    minH: "48px",
    borderRadius: 0,
    color: "white",
    transition: "all .3s"
  },
  variants: {
    blue: {
      bg: 'blue.primary',
      _hover: {
        bg: 'blue.hover',
      },
    },
    darkBlue: {
      bg: 'blue.secondaryDark',
      _hover: {
        bg: 'blue.active',
      }
    },
  }
};

export default button;
