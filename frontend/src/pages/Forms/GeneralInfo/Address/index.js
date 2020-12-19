import React, { useState, useEffect } from 'react';
import { FaCheck, FaCheckCircle } from 'react-icons/fa';

import Cep from 'react-simple-cep-mask';
import axios from 'axios';

import FormBlock from '~/components/FormBlock';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Address({ address, onChangeAddress, editable }) {
  const [validCep, setValidCep] = useState(false);
  const [invalidCep, setInvalidCep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [cep, setCep] = useState(address.cep);
  const [city, setCity] = useState(address.city);
  const [neighborhood, setNeighborhood] = useState(address.neighborhood);
  const [municipality, setMunicipality] = useState(address.municipality);
  const [street, setStreet] = useState(address.street);
  const [number, setNumber] = useState(address.number);
  const [complement, setComplement] = useState(address.complement);

  async function handleCep() {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        setInvalidCep(true);
        setValidCep(false);
      } else {
        const { ibge } = response.data;
        const result = await axios.get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${ibge}`
        );

        setValidCep(true);
        setCity(response.data.localidade);
        setNeighborhood(response.data.bairro);
        setMunicipality(result.data.nome);
        setStreet(response.data.logradouro);
      }
    } catch (err) {
      alert(
        'Houve um erro ao verificar o CEP. Por favor, tente novamente mais tarde.'
      );
    }
  }

  useEffect(() => {
    if (
      cep !== address.cep ||
      parseInt(number, 10) !== address.number ||
      complement !== address.complement
    ) {
      setSaveButton(true);
    } else if (saveButton) {
      setSaveButton(false);
    }
  }, [cep, number, complement]); // eslint-disable-line

  useEffect(() => {
    if (cep.length === 9) {
      handleCep();
    } else if (validCep || invalidCep) {
      setValidCep(false);
      setInvalidCep(false);
    }
  }, [cep]); // eslint-disable-line

  async function handleSubmit() {
    setLoading(true);

    const data = {
      cep,
      city,
      neighborhood,
      municipality,
      street: Capitalize(street),
      number,
      complement,
    };

    try {
      const response = await api.post('address', data);
      setSaveButton(false);
      onChangeAddress(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }
  return (
    <FormBlock>
      <p className="block-title">Endereço</p>

      <p className="input-label">Informe seu CEP</p>
      <div className="input-line">
        <Cep
          type="number"
          inputMode="numeric"
          value={cep}
          className="input medium"
          maxLength={9}
          style={
            invalidCep
              ? { background: '#fde8e8', border: '2px solid #ff4d4d' }
              : null
          }
          onFocus={() => {
            if (cep.length !== 9 && invalidCep) {
              setInvalidCep(false);
            }
          }}
          onBlur={() => {
            if (cep.length < 9) {
              setInvalidCep(true);
            }
          }}
          onChange={(c) => setCep(c)}
          disabled={!editable}
          placeholder="00000-000"
        />

        {cep && validCep && (
          <FaCheckCircle size={25} color="#64B34D" style={{ marginLeft: 16 }} />
        )}
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Cidade</p>
          <input
            value={city}
            className="input"
            disabled
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cidade"
          />
        </div>

        <div className="input-group">
          <p className="input-label">Bairro</p>
          <input
            value={neighborhood}
            className="input"
            disabled
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Bairro"
          />
        </div>

        <div className="input-group">
          <p className="input-label">Município</p>
          <input
            value={municipality}
            className="input"
            disabled
            onChange={(e) => setMunicipality(e.target.value)}
            placeholder="Município"
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Logradouro</p>
          <input
            value={street}
            className="input"
            disabled
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Rua, Estrada, Avenida..."
          />
        </div>

        <div className="input-group small">
          <p className="input-label">Número</p>
          <input
            value={number}
            type="number"
            inputMode="numeric"
            className="input small"
            disabled={!editable}
            onKeyDown={(e) => {
              if (e.key < 0 || e.key > 9) e.preventDefault();
            }}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="22"
          />
        </div>

        <div className="input-group">
          <p className="input-label">Complemento</p>
          <input
            value={complement}
            className="input"
            disabled={!editable}
            onChange={(e) => setComplement(e.target.value)}
            placeholder="Apto., bloco, lote..."
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
