import React from 'react';

export default function Notification({ type = 'info', text, onClose }) {
  return (
    <div className={`notification ${type}`}>
      <span>{text}</span>
      <button onClick={onClose} className="close">×</button>
    </div>
  );
}
