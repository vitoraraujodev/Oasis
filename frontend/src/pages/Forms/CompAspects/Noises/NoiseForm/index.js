import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function NoiseForm({
  noise,
  onChangeNoise,
  onDeleteNoise,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [source, setSource] = useState(noise.source);
  const [protection, setProtection] = useState(noise.protection);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: noise.id,
      source: Capitalize(source),
      protection: Capitalize(protection),
    };

    try {
      const response = await api.post('noise', data);
      onChangeNoise(response.data);

      setSaveButton(false);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (window.confirm('Deseja excluir permanentemente esse item?')) {
      setLoading(true);

      try {
        const response = await api.delete(`noise/${noise.id}`);
        setLoading(false);
        if (response.data.okay) onDeleteNoise(noise.id);
      } catch (err) {
        if (err.response) alert(err.response.data.error);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (source !== noise.source || protection !== noise.protection) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [source, protection]); // eslint-disable-line

  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Fonte/Origem</p>
          <input
            value={source}
            className="input"
            disabled={!editable}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Equipamentos, processos..."
          />
        </div>

        <div className="input-group">
          <p className="input-label">Proteção acústica</p>
          <input
            value={protection}
            className="input"
            disabled={!editable}
            onChange={(e) => setProtection(e.target.value)}
            placeholder="..."
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
