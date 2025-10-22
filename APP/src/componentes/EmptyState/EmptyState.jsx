import { ShoppingBag } from "lucide-react";
import "./EmptyState.css";

function EmptyState({ title, description, actionText, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <ShoppingBag className="empty-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="empty-state-button">
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
