import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from 'react-icons/fa';

import Address from './Address';
import Representative from './Representative';

import TitleBlock from '~/components/TitleBlock';
import Header from '~/components/Header';

import api from '~/services/api';
import history from '~/services/history';

import '../styles.css';

export default function GeneralInfo() {
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    cep: '',
    city: '',
    neighborhood: '',
    municipality: '',
    street: '',
    number: '',
    complement: '',
  });

  const [representatives, setRepresentatives] = useState([]);

  async function loadGeneralInfo() {
    setLoading(true);

    try {
      const response = await api.get('general-info');
      if (response.data.address) setAddress(response.data.address);
      if (response.data.representatives)
        setRepresentatives(response.data.representatives);
    } catch (err) {
      if (err.respose) alert(err.respose.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadGeneralInfo();
  }, []);

  return (
    <div id="form-page">
      <Header />

      <div className="container">
        <div className="form-buttons">
          <button
            type="button"
            className="page-button"
            onClick={() => history.push('/form')}
          >
            <FaArrowLeft size={21} color="#fff" />
            <strong style={{ marginLeft: 12 }}>Voltar</strong>
          </button>

          <button
            type="button"
            className="edit-button"
            onClick={() => setEditable(!editable)}
          >
            {editable ? (
              <FaLockOpen size={21} color="#fff" />
            ) : (
              <FaLock size={21} color="#fff" />
            )}
            <strong style={{ marginLeft: 12 }}>Editar</strong>
          </button>
        </div>

        <TitleBlock
          title="Informações Gerais"
          description="Explicação breve sobre o tópico do formulário, lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque finibus commodo ornare."
        />

        {loading ? (
          <div className="loader-container">
            <div className="loader" />
            Carregando...
          </div>
        ) : (
          <>
            <Address
              address={address}
              onChangeAdress={(a) => setAddress(a)}
              editable={editable}
            />

            <Representative
              representatives={representatives}
              onChangeRepresentatives={(r) => {
                setRepresentatives(r);
              }}
              editable={editable}
            />
          </>
        )}

        <div className="form-buttons">
          <button
            type="button"
            className="page-button"
            onClick={() => history.push('/form')}
          >
            <FaArrowLeft size={21} color="#fff" />
            <strong style={{ marginLeft: 12 }}>Voltar</strong>
          </button>

          <button
            type="button"
            className="page-button"
            onClick={() => setEditable(!editable)}
          >
            <strong style={{ marginRight: 12 }}>Avançar</strong>
            <FaArrowRight size={21} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
