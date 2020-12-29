import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import PendingProcessForm from './PendingProcessForm';

import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function PendingProcess({
  pendingProcesses,
  onChangePendingProcesses,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [instrument, setInstrument] = useState('');
  const [process, setProcess] = useState('');
  const [objective, setObjective] = useState('');

  function handleUpdate(p) {
    const processes = pendingProcesses.map((pendingProcess) =>
      pendingProcess.id === p.id ? p : pendingProcess
    );

    onChangePendingProcesses(processes);
  }

  function handleDelete(id) {
    onChangePendingProcesses(
      pendingProcesses.filter((pendingProcess) => pendingProcess.id !== id)
    );
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      instrument: Capitalize(instrument),
      process,
      objective,
    };

    try {
      const response = await api.post('pending', data);
      onChangePendingProcesses([...pendingProcesses, response.data]);
      setInstrument('');
      setProcess('');
      setObjective('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (instrument || process || objective) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [instrument, process, objective]); // eslint-disable-line

  return (
    <>
      <p className="block-subtitle">Processos em andamento</p>

      {pendingProcesses.length > 0 &&
        pendingProcesses.map((pendingProcess, index) => (
          <Accordion
            key={pendingProcess.id}
            number={index + 1}
            title={pendingProcess.instrument}
            editable={editable}
          >
            <PendingProcessForm
              pendingProcess={pendingProcess}
              onChangePendingProcess={handleUpdate}
              onDeletePendingProcess={handleDelete}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
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
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
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
                <FaPlus size={16} color="#fff" style={{ marginRight: 8 }} />
                Salvar processo
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
