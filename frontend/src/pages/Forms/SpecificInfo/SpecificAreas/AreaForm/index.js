import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function AreaForm({
  specificArea,
  onChangeArea,
  onDeleteArea,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [kind, setKind] = useState(specificArea.kind);
  const [area, setArea] = useState(specificArea.area);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: specificArea.id,
      kind: Capitalize(kind),
      area,
    };

    try {
      const response = await api.post('specific-area', data);
      onChangeArea(response.data);
      setSaveButton(false);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const response = await api.delete(`specific-area/${specificArea.id}`);
      if (response.data.okay) onDeleteArea(specificArea.id);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  function handleArea(value) {
    setArea(value ? parseFloat(value) : '');
  }

  useEffect(() => {
    if (kind !== specificArea.kind || area !== specificArea.area) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [kind, area]); // eslint-disable-line

  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Tipo de área</p>
          <input
            value={kind}
            className="input"
            disabled={!editable}
            onChange={(e) => setKind(e.target.value)}
            placeholder="Administrativa, produtiva..."
          />
        </div>

        <div className="input-group">
          <p className="input-label small">Área em m²</p>
          <input
            value={area}
            type="number"
            className="input small"
            disabled={!editable}
            onChange={(e) => handleArea(e.target.value)}
            placeholder="01"
          />
        </div>
      </div>

      <div className="accordion-buttons">
        {editable && (
          <button
            type="button"
            className="delete-form-button"
            onClick={!loading ? handleDelete : null}
          >
            {loading ? (
              'Carregando...'
            ) : (
              <>
                <span className="delete-icon">
                  <FaTrash size={16} color="#fff" style={{ marginRight: 8 }} />
                </span>
                Excluir
              </>
            )}
          </button>
        )}

        {saveButton && (
          <button
            type="button"
            className="save-form-button"
            onClick={!loading ? handleSubmit : null}
          >
            {loading ? (
              'Carregando...'
            ) : (
              <>
                <FaCheck size={16} color="#fff" style={{ marginRight: 8 }} />
                Salvar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
