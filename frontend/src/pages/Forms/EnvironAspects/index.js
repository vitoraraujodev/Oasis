import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from 'react-icons/fa';

import WaterSupplies from './WaterSupplies';
import Effluents from './Effluents';
import Residues from './Residues';

import TitleBlock from '~/components/TitleBlock';
import Header from '~/components/Header';

import api from '~/services/api';
import history from '~/services/history';

import '../styles.css';

export default function EnvironAspects() {
  const ENV = process.env.NODE_ENV;

  const [editable, setEditable] = useState(ENV !== 'production');
  const [loading, setLoading] = useState(false);

  const [waterSupplies, setWaterSupplies] = useState([]);
  const [sanitary, setSanitary] = useState({});
  const [sanitaryEffluents, setSanitaryEffluents] = useState([]);
  const [industrialEffluents, setIndustrialEffluents] = useState([]);
  const [oilyEffluents, setOilyEffluents] = useState([]);
  const [residueInfo, setResidueInfo] = useState({});
  const [residues, setResidues] = useState([]);

  async function loadEnvironAspects() {
    setLoading(true);

    try {
      const response = await api.get('environ-aspect');

      if (!response.data) {
        setEditable(true);
      } else {
        if (response.data.waterSupplies) {
          setWaterSupplies(response.data.waterSupplies);
        }
        if (response.data.sanitary) {
          setSanitary(response.data.sanitary);
        }
        if (response.data.sanitaryEffluents) {
          setSanitaryEffluents(response.data.sanitaryEffluents);
        }
        if (response.data.industrialEffluents) {
          setIndustrialEffluents(response.data.industrialEffluents);
        }
        if (response.data.oilyEffluents) {
          setOilyEffluents(response.data.oilyEffluents);
        }
        if (response.data.residueInfo) {
          setResidueInfo(response.data.residueInfo);
        }
        if (response.data.residues) {
          setResidues(response.data.residues);
        }
      }
    } catch (err) {
      if (err.respose) alert(err.respose.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEnvironAspects();
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
          title="Aspectos Ambientais"
          description="Descrição detalhada do abastecimento hídrico e dos efluentes e resíduos gerados pelas atividades desenvolvidas pela empresa."
        />

        {loading ? (
          <div className="loader-container">
            <div className="loader" />
            Carregando...
          </div>
        ) : (
          <>
            <WaterSupplies
              waterSupplies={waterSupplies}
              onChangeWaterSupplies={setWaterSupplies}
              editable={editable}
            />

            <Effluents
              sanitary={sanitary}
              onChangeSanitary={setSanitary}
              sanitaryEffluents={sanitaryEffluents}
              onChangeSanitaryEffluents={setSanitaryEffluents}
              industrialEffluents={industrialEffluents}
              onChangeIndustrialEffluents={setIndustrialEffluents}
              oilyEffluents={oilyEffluents}
              onChangeOilyEffluents={setOilyEffluents}
              editable={editable}
            />

            <Residues
              residueInfo={residueInfo}
              onChangeResidueInfo={setResidueInfo}
              residues={residues}
              onChangeResidues={setResidues}
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
              onClick={() =>
                history.push('/form/aspectos-ambientais-complementares')
              }
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
