const modal = {
  parts: ['dialog', 'closeButton', 'body', 'footer'],
  baseStyle: {
    dialog: {
      bg: 'gray.700',
      p: "66px 32px",
      h: "300px",
      borderRadius: 0,
      textAlign: "center",
      alignItems: "center",
    },
    closeButton: {
      p: "32px",
      transition: "all .3s",
      cursor: "pointer",
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
