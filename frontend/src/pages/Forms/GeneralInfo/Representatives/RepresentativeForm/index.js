import React, { useState, useEffect } from 'react';
import Input from 'react-input-mask';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function RepresentativeForm({
  representative,
  onChangeRepresentative,
  onDeleteRepresentative,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [name, setName] = useState(representative.name);
  const [cpf, setCpf] = useState(representative.cpf);
  const [email, setEmail] = useState(representative.email);
  const [phoneNumber, setPhoneNumber] = useState(representative.phone_number);

  async function handleSubmit() {
    if (loading) return;

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
    if (window.confirm('Deseja excluir permanentemente esse item?')) {
      setLoading(true);

      try {
        const response = await api.delete(
          `representative/${representative.id}`
        );
        if (response.data.okay) onDeleteRepresentative(representative.id);
      } catch (err) {
        if (err.response) alert(err.response.data.error);
      }

      setLoading(false);
    }
  }

  function handlePhoneNumber(e) {
    const phone = e.target.value.replace(/[^0-9]+/g, '');
    setPhoneNumber(phone);
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
            disabled={!editable}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
          />
        </div>

        <div className="input-group">
          <p className="input-label">CPF</p>
          <Input
            value={cpf}
            type="tel"
            mask="999.999.999-99"
            className="input medium"
            disabled={!editable}
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
          <Input
            value={phoneNumber}
            type="custom"
            inputMode="numeric"
            mask={
              phoneNumber.length <= 10 ? '(99) 9999-9999?' : '(99) 99999-9999'
            }
            formatChars={{ 9: '[0-9]', '?': '[0-9 ]' }}
            maskChar={null}
            className="input medium"
            disabled={!editable}
            onChange={handlePhoneNumber}
            placeholder="(11) 99999-9999"
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
