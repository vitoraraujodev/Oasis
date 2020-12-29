import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize, formatDate } from '~/util/format';

export default function ConcludedProcessForm({
  concludedProcess,
  onChangeConcludedProcess,
  onDeleteConcludedProcess,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(true);

  const [instrument, setInstrument] = useState(concludedProcess.instrument);
  const [number, setNumber] = useState(concludedProcess.number);
  const [process, setProcess] = useState(concludedProcess.process);
  const [objective, setObjective] = useState(concludedProcess.objective);
  const [expirationDate, setExpirationDate] = useState(
    formatDate(concludedProcess.expiration_date)
  );

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: concludedProcess.id,
      instrument: Capitalize(instrument),
      number,
      process,
      expiration_date: formatDate(expirationDate),
      objective,
    };

    try {
      const response = await api.post('history', data);
      setSaveButton(false);
      onChangeConcludedProcess({
        id: response.data.id,
        instrument: response.data.instrument,
        number: response.data.number,
        process: response.data.process,
        expiration_date: formatDate(response.data.expiration_date),
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
      const response = await api.delete(`history/${concludedProcess.id}`);
      if (response.data.okay) onDeleteConcludedProcess(concludedProcess.id);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (
      instrument !== concludedProcess.instrument ||
      number !== concludedProcess.number ||
      process !== concludedProcess.process ||
      expirationDate !== formatDate(concludedProcess.expiration_date) ||
      objective !== concludedProcess.objective
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [instrument, number, process, expirationDate, objective]); // eslint-disable-line

  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Instrumento obtido</p>
          <input
            value={instrument}
            className="input"
            disabled={!editable}
            onChange={(e) => setInstrument(Capitalize(e.target.value))}
            placeholder="Licença Ambiental"
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
          <p className="input-label">Data de válidade</p>
          <InputMask
            value={expirationDate}
            type="tel"
            mask="99/99/9999"
            className="input"
            disabled={!editable}
            onChange={(e) => {
              setExpirationDate(e.target.value);
            }}
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
