import "./feedback.css";

function Feedback({ text, emoji }) {
  return (
    <div id="feedbackContainer">
      <p>{`${text} ${emoji}`}</p>
    </div>
  );
}

export default Feedback;
