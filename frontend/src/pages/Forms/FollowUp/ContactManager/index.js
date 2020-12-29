import React, { useState, useEffect } from 'react';
import Input from 'react-input-mask';
import { FaCheck } from 'react-icons/fa';

import FormBlock from '~/components/FormBlock';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function ContactManager({
  contactManager,
  onChangeContactManager,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [name, setName] = useState(contactManager.name);
  const [cpf, setCpf] = useState(contactManager.cpf);
  const [email, setEmail] = useState(contactManager.email);
  const [phoneNumber, setPhoneNumber] = useState(contactManager.phone_number);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      name: Capitalize(name),
      cpf,
      email,
      phone_number: phoneNumber,
    };

    try {
      const response = await api.post('contact-manager', data);
      setSaveButton(false);
      onChangeContactManager(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handlePhoneNumber(e) {
    const phone = e.target.value.replace(/[^0-9]+/g, '');
    setPhoneNumber(phone);
  }

  useEffect(() => {
    if (
      name !== contactManager.name ||
      cpf !== contactManager.cpf ||
      email !== contactManager.email ||
      phoneNumber !== contactManager.phone_number
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [name, cpf, email, phoneNumber]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Pessoa de contato</p>
      <p className="block-description">
        Preencha os campos abaixo com dados que permitam direcionar a
        comunicação entre algum colaborador ou prestador de serviço da empresa e
        o órgão ambiental.
      </p>

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
          <p className="input-label ">CPF</p>
          <Input
            value={cpf}
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
          <p className="input-label ">Telefone</p>
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

      {saveButton && (
        <button
          type="button"
          className="save-block-button"
          onClick={!loading ? handleSubmit : null}
        >
          {loading ? (
            'Carregando...'
          ) : (
            <>
              <FaCheck size={21} color="#fff" style={{ marginRight: 8 }} />
              Salvar
            </>
          )}
        </button>
      )}
    </FormBlock>
  );
}
