import React from 'react';
import { FaTrash } from 'react-icons/fa';

export default function Storage({
  storage,
  onChangeStorage,
  onDeleteStorage,
  editable,
}) {
  function handleAmount(value) {
    onChangeStorage({ ...storage, amount: value ? parseInt(value, 10) : '' });
  }

  function handleCapacity(value) {
    onChangeStorage({ ...storage, capacity: value ? parseFloat(value) : '' });
  }

  return (
    <div className="subform">
      <div className="input-line">
        <div className="input-group">
          <div className="input-line">
            <div className="input-group">
              <p className="input-label">Forma do armazenamento</p>
              <input
                value={storage.identification}
                className="input"
                disabled={!editable}
                onChange={(e) =>
                  onChangeStorage({
                    ...storage,
                    identification: e.target.value,
                  })
                }
                placeholder="Galões, sacas, barrís..."
              />
            </div>

            <div className="input-group">
              <p className="input-label">Quantidade</p>
              <input
                value={storage.amount}
                type="number"
                className="input small"
                disabled={!editable}
                onChange={(e) => handleAmount(e.target.value)}
                placeholder="01"
              />
            </div>
          </div>

          <div className="input-line">
            <div className="input-group medium">
              <p className="input-label">Capacidade unitária</p>
              <input
                value={storage.capacity}
                type="number"
                className="input medium"
                disabled={!editable}
                onChange={(e) => handleCapacity(e.target.value)}
                placeholder="01"
              />
            </div>

            <div className="input-group medium">
              <p className="input-label">Unidade de medida</p>
              <input
                value={storage.unit}
                className="input medium"
                disabled={!editable}
                onChange={(e) =>
                  onChangeStorage({ ...storage, unit: e.target.value })
                }
                placeholder="Kg, L, m³..."
              />
            </div>
          </div>
        </div>

        {editable && (
          <button
            type="button"
            className="delete-subform-button"
            onClick={onDeleteStorage}
          >
            <FaTrash size={18} color="#DD3C3C" />
          </button>
        )}
      </div>
    </div>
  );
}
