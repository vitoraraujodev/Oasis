import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Representative({
  editable,
  representative,
  onChangeRepresentative,
  onDeleteRepresentative,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [name, setName] = useState(representative.name);
  const [cpf, setCpf] = useState(representative.cpf);
  const [email, setEmail] = useState(representative.email);
  const [phoneNumber, setPhoneNumber] = useState(representative.phone_number);

  async function handleSubmit() {
    setLoading(true);

    const data = {
      id: representative.id,
      name: Capitalize(name),
      cpf,
      email,
      phone_number: phoneNumber,
    };

    try {
      const response = await api.post('representative', data);
      onChangeRepresentative(response.data);
      setSaveButton(false);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const response = await api.delete(`representative/${representative.id}`);
      if (response.data.okay) onDeleteRepresentative(representative.id);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (
      name !== representative.name ||
      cpf !== representative.cpf ||
      email !== representative.email ||
      phoneNumber !== representative.phone_number
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [name, cpf, email, phoneNumber]); // eslint-disable-line

  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Nome completo</p>
          <input
            value={name}
            className="input"
            style={{ textTransform: 'capitalize' }}
            disabled={!editable}
            onChange={(e) => setName(e.target.value)}
            placeholder="nome completo"
          />
        </div>

        <div className="input-group">
          <p className="input-label">CPF</p>
          <input
            value={cpf}
            type="tel"
            className="input"
            disabled={!editable}
            onKeyDown={(e) => {
              if (e.key === ' ') e.preventDefault();
            }}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="123.456.789-01"
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Email</p>
          <input
            value={email}
            type="email"
            className="input"
            disabled={!editable}
            onKeyDown={(e) => {
              if (e.key === ' ') e.preventDefault();
            }}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@email.com"
          />
        </div>
        <div className="input-group">
          <p className="input-label">Telefone</p>
          <input
            value={phoneNumber}
            type="tel"
            className="input"
            disabled={!editable}
            onKeyDown={(e) => {
              if (e.key === ' ') e.preventDefault();
            }}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div className="accordion-buttons">
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
