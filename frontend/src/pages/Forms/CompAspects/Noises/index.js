import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import NoiseForm from './NoiseForm';
import NoiseInfoBlock from './NoiseInfoBlock';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Noises({
  noises,
  onChangeNoises,
  noiseInfo,
  onChangeNoiseInfo,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [source, setSource] = useState('');
  const [protection, setProtection] = useState('');

  function handleUpdate(n) {
    const newNoises = noises.map((noise) => (noise.id === n.id ? n : noise));

    onChangeNoises(newNoises);
  }

  function handleDelete(id) {
    onChangeNoises(noises.filter((noise) => noise.id !== id));
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      source: Capitalize(source),
      protection: Capitalize(protection),
    };

    try {
      const response = await api.post('noise', data);
      onChangeNoises([...noises, response.data]);
      setSource('');
      setProtection('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (source || protection) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [source, protection]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Ruído</p>
      <p className="block-description">
        Identifique as fontes significativas de geração de ruído, e suas
        especificidades.
      </p>

      <NoiseInfoBlock
        noiseInfo={noiseInfo}
        onChangeNoiseInfo={onChangeNoiseInfo}
        editable={editable}
      />

      {noises.length > 0 &&
        noises.map((noise, index) => (
          <Accordion
            key={noise.id}
            number={index + 1}
            title={noise.source}
            editable={editable}
          >
            <NoiseForm
              noise={noise}
              onChangeNoise={(n) => handleUpdate(n)}
              onDeleteNoise={(id) => handleDelete(id)}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
        <div className="input-line">
          <div className="input-group">
            <p className="input-label">Fonte/Origem</p>
            <input
              value={source}
              className="input"
              disabled={!editable}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Equipamentos, processos..."
            />
          </div>

          <div className="input-group">
            <p className="input-label">Proteção acústica</p>
            <input
              value={protection}
              className="input"
              disabled={!editable}
              onChange={(e) => setProtection(e.target.value)}
              placeholder="Barreira acústica, isolamento, espumas..."
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
                Salvar ruído
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
