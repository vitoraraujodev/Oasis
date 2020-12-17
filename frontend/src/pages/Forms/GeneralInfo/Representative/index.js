import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import RepresentativeForm from './RepresentativeForm';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Representative({
  representatives,
  onChangeRepresentatives,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  function handleUpdate(r) {
    const newRepresentatives = representatives.map((representative) =>
      representative.id === r.id ? r : representative
    );

    onChangeRepresentatives(newRepresentatives);
  }

  function handleDelete(id) {
    onChangeRepresentatives(
      representatives.filter((representative) => representative.id !== id)
    );
  }

  async function handleSubmit() {
    setLoading(true);

    const data = {
      name: Capitalize(name),
      cpf,
      email,
      phone_number: phoneNumber,
    };

    try {
      const response = await api.post('representative', data);
      onChangeRepresentatives(response.data);
      setName('');
      setCpf('');
      setEmail('');
      setPhoneNumber('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (name || cpf || email || phoneNumber) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [name, cpf, email, phoneNumber]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Representante Legal</p>
      <p className="block-description">
        Explicação breve sobre o tópico do formulário, lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Pellentesque finibus commodo ornare.
      </p>

      {representatives.length > 0 &&
        representatives.map((representative, index) => (
          <Accordion
            key={representative.id}
            number={index + 1}
            title={representative.name}
          >
            <RepresentativeForm
              representative={representative}
              onChangeRepresentative={(r) => handleUpdate(r)}
              onDeleteRepresentative={(id) => handleDelete(id)}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
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
                Salvar representante
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
