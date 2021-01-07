import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function PendingProcessForm({
  pendingProcess,
  onChangePendingProcess,
  onDeletePendingProcess,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(true);

  const [instrument, setInstrument] = useState(pendingProcess.instrument);
  const [process, setProcess] = useState(pendingProcess.process);
  const [objective, setObjective] = useState(pendingProcess.objective);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: pendingProcess.id,
      instrument: Capitalize(instrument),
      process,
      objective,
    };

    try {
      const response = await api.post('pending', data);
      setSaveButton(false);
      onChangePendingProcess({
        id: response.data.id,
        instrument: response.data.instrument,
        process: response.data.process,
        objective: response.data.objective,
      });
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const response = await api.delete(`pending/${pendingProcess.id}`);
      if (response.data.okay) onDeletePendingProcess(pendingProcess.id);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (
      instrument !== pendingProcess.instrument ||
      process !== pendingProcess.process ||
      objective !== pendingProcess.objective
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [instrument, process, objective]); // eslint-disable-line

  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Instrumento requerido</p>
          <input
            value={instrument}
            className="input"
            disabled={!editable}
            onChange={(e) => setInstrument(Capitalize(e.target.value))}
            placeholder="Licença Ambiental"
          />
        </div>

        <div className="input-group">
          <p className="input-label">Processo</p>
          <input
            value={process}
            className="input"
            disabled={!editable}
            onChange={(e) => setProcess(e.target.value)}
            placeholder="PD-00/000.000/0000"
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Objeto</p>
          <textarea
            value={objective}
            length="192"
            className="input"
            style={{ padding: '8px 16px', height: 64 }}
            disabled={!editable}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Descreva a finalidade do documento"
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
