import React from 'react';

import './styles.css';

export default function CheckInput({ value = null, onChange, editable }) {
  return (
    <div id="check-input">
      <button
        type="button"
        className="check-option"
        style={
          editable ? { color: '#444' } : { color: '#9c9c9c', cursor: 'default' }
        }
        onClick={value === true || !editable ? null : () => onChange(true)}
      >
        <div className="check-button">
          {value === true && <div className="check" />}
        </div>
        Sim
      </button>

      <button
        type="button"
        className="check-option"
        style={
          editable ? { color: '#444' } : { color: '#9c9c9c', cursor: 'default' }
        }
        onClick={value === false || !editable ? null : () => onChange(false)}
      >
        <div className="check-button">
          {value === false && <div className="check" />}
        </div>
        Não
      </button>
    </div>
  );
}
