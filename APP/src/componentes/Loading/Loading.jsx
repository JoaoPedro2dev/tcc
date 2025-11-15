function Loading() {
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <strong style={styles.logo}>DNV WEAR</strong>

        <div style={styles.spinner}></div>
        <div style={styles.text}>Carregando...</div>
        <p>Isso pode levar alguns segundos</p>
      </div>
    </div>
  );
}

const styles = {
  logo: {
    fontSize: "xx-large",
    marginBottom: "50px",
    color: "black",
    fontFamily: "Anton",
    cursor: "default",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  container: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  spinner: {
    margin: "0 auto 10px",
    width: 60,
    height: 60,
    border: "8px solid #fff",
    borderTop: "8px solid #000000ff", // azul
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
};

// Adicionando a animação spin com CSS-in-JS
const styleSheet = document.styleSheets[0];
const keyframes = `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Loading;
