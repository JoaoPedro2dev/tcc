function Loading() {
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.spinner}></div>
        <div style={styles.text}>Carregando...</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  container: {
    textAlign: "center",
  },
  spinner: {
    margin: "0 auto 10px",
    width: 60,
    height: 60,
    border: "8px solid #cce4ff",
    borderTop: "8px solid #007bff", // azul
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    fontSize: 18,
    color: "#007bff",
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
