import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaLock, FaLockOpen } from 'react-icons/fa';

import Emissions from './Emissions';
import Risks from './Risks';
import Noises from './Noises';

import TitleBlock from '~/components/TitleBlock';
import Header from '~/components/Header';

import api from '~/services/api';
import history from '~/services/history';

import '../styles.css';

export default function CompAspects() {
  const ENV = process.env.NODE_ENV;

  const [editable, setEditable] = useState(ENV !== 'production');
  const [loading, setLoading] = useState(false);

  const [emissionInfo, setEmissionInfo] = useState({});
  const [emissions, setEmissions] = useState([]);
  const [risks, setRisks] = useState([]);
  const [noiseInfo, setNoiseInfo] = useState({});
  const [noises, setNoises] = useState([]);

  async function loadCompAspects() {
    setLoading(true);

    try {
      const response = await api.get('comp-aspect');

      if (!response.data) {
        setEditable(true);
      } else {
        if (response.data.emissionInfo) {
          setEmissionInfo(response.data.emissionInfo);
        }
        if (response.data.emissions) {
          setEmissions(response.data.emissions);
        }
        if (response.data.risks) {
          setRisks(response.data.risks);
        }
        if (response.data.noiseInfo) {
          setNoiseInfo(response.data.noiseInfo);
        }
        if (response.data.noises) {
          setNoises(response.data.noises);
        }
      }
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCompAspects();
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
          title="Aspectos Ambientais Complementares"
          description="Descrição detalhada das emissões atmosféricas, riscos ambientais e ruídos gerados pelas atividades desenvolvidas pela empresa."
        />

        {loading ? (
          <div className="loader-container">
            <div className="loader" />
            Carregando...
          </div>
        ) : (
          <>
            <Emissions
              emissionInfo={emissionInfo}
              onChangeEmissionInfo={setEmissionInfo}
              emissions={emissions}
              onChangeEmissions={setEmissions}
              editable={editable}
            />

            <Risks risks={risks} onChangeRisks={setRisks} editable={editable} />

            <Noises
              noiseInfo={noiseInfo}
              onChangeNoiseInfo={setNoiseInfo}
              noises={noises}
              onChangeNoises={setNoises}
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
              onClick={() => history.push('/form')}
            >
              <strong style={{ marginRight: 12 }}>Concluir</strong>
              <FaCheck size={21} color="#fff" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
