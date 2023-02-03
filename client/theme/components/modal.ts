const modal = {
  parts: ['dialog', 'closeButton', 'body', 'footer'],
  baseStyle: {
    dialog: {
      bg: 'gray.700',
      borderRadius: 'md',
      p: "66px 32px",
      h: "300px",
      textAlign: "center",
      alignItems: "center",
    },
    closeButton: {
      p: "32px",
      transition: "all .3s"
    },
    body: {
      display: "flex",
      alignItems: "center"
    },
    footer: {
      justifyContent: "space-around",
      w: "100%"
    },
  },
}

export default modal;
