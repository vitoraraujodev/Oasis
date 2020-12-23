import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from 'react-icons/fa';

import Supplies from './Supplies';

import TitleBlock from '~/components/TitleBlock';
import Header from '~/components/Header';

import api from '~/services/api';
import history from '~/services/history';

import '../styles.css';

export default function ProductiveProcess() {
  const ENV = process.env.NODE_ENV;

  const [editable, setEditable] = useState(ENV !== 'production');
  const [loading, setLoading] = useState(false);

  const [supplies, setSupplies] = useState([]);

  async function loadProductiveProcess() {
    setLoading(true);

    try {
      const response = await api.get('productive-process');
      console.tron.log(response.data.supplies);
      if (response.data.supplies) setSupplies(response.data.supplies);
    } catch (err) {
      if (err.respose) alert(err.respose.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProductiveProcess();
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
          title="Processos Produtivos"
          description="Descrição detalhada dos insumos, equipamentos e produtos que compõem toda a cadeia produtiva da empresa."
        />

        {loading ? (
          <div className="loader-container">
            <div className="loader" />
            Carregando...
          </div>
        ) : (
          <>
            <Supplies
              supplies={supplies}
              onChangeSupplies={setSupplies}
              editable={editable}
            />
          </>
        )}

        {!loading && (
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
              onClick={() => history.push('/form/acompanhamento')}
            >
              <strong style={{ marginRight: 12 }}>Avançar</strong>
              <FaArrowRight size={21} color="#fff" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
