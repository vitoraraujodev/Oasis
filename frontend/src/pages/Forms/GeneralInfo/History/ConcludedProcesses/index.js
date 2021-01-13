import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { FaPlus } from 'react-icons/fa';

import ConcludedProcessForm from './ConcludedProcessForm';

import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize, formatDate } from '~/util/format';

export default function ConcludedProcess({
  concludedProcesses,
  onChangeConcludedProcesses,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [instrument, setInstrument] = useState('');
  const [number, setNumber] = useState('');
  const [process, setProcess] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [objective, setObjective] = useState('');

  function handleUpdate(p) {
    const processes = concludedProcesses.map((concludedProcess) =>
      concludedProcess.id === p.id ? p : concludedProcess
    );

    onChangeConcludedProcesses(processes);
  }

  function handleDelete(id) {
    onChangeConcludedProcesses(
      concludedProcesses.filter(
        (concludedProcess) => concludedProcess.id !== id
      )
    );
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      instrument: Capitalize(instrument),
      number,
      process,
      expiration_date: formatDate(expirationDate),
      objective,
    };

    try {
      const response = await api.post('history', data);
      onChangeConcludedProcesses([...concludedProcesses, response.data]);
      setInstrument('');
      setNumber('');
      setProcess('');
      setExpirationDate('');
      setObjective('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (instrument || number || process || expirationDate || objective) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [instrument, number, process, expirationDate, objective]); // eslint-disable-line

  return (
    <>
      <p className="block-subtitle">Processos concluídos</p>

      {concludedProcesses.length > 0 &&
        concludedProcesses.map((concludedProcess, index) => (
          <Accordion
            key={concludedProcess.id}
            number={index + 1}
            title={concludedProcess.instrument}
            editable={editable}
          >
            <ConcludedProcessForm
              concludedProcess={concludedProcess}
              onChangeConcludedProcess={handleUpdate}
              onDeleteConcludedProcess={handleDelete}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
        <div className="input-line">
          <div className="input-group">
            <p className="input-label">Instrumento obtido</p>
            <input
              value={instrument}
              className="input"
              disabled={!editable}
              onChange={(e) => setInstrument(Capitalize(e.target.value))}
              placeholder="LP, LI, LO..."
            />
          </div>

          <div className="input-group">
            <p className="input-label">Número</p>
            <input
              value={number}
              type="tel"
              className="input"
              disabled={!editable}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="LO N°IN000000"
            />
          </div>
        </div>

        <div className="input-line">
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

          <div className="input-group">
            <p className="input-label">Data de validade</p>
            <InputMask
              value={expirationDate}
              type="tel"
              mask="99/99/9999"
              className="input"
              disabled={!editable}
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              onChange={(e) => setExpirationDate(e.target.value)}
              placeholder="25/12/2020"
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
