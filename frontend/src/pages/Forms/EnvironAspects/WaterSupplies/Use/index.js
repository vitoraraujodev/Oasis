import React from 'react';
import { FaTrash } from 'react-icons/fa';

export default function Use({ use, onChangeUse, onDeleteUse, editable }) {
  function handleFlow(value) {
    onChangeUse({ ...use, flow: value ? parseFloat(value) : '' });
  }

  return (
    <div className="subform">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Tipo de uso</p>
          <input
            value={use.usage}
            className="input"
            disabled={!editable}
            onChange={(e) =>
              onChangeUse({
                ...use,
                usage: e.target.value,
              })
            }
            placeholder="Produção, limpeza..."
          />
        </div>

        <div className="input-group">
          <p className="input-label">Vazão em m³/dia</p>
          <input
            value={use.flow}
            type="number"
            className="input medium"
            disabled={!editable}
            onChange={(e) => handleFlow(e.target.value)}
            placeholder="01"
          />
        </div>

        {editable && (
          <button
            type="button"
            className="delete-subform-button"
            onClick={onDeleteUse}
          >
            <FaTrash size={18} color="#DD3C3C" />
          </button>
        )}
      </div>
    </div>
  );
}
