import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import AreaForm from './AreaForm';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function SpecificAreas({
  specificAreas,
  onChangeAreas,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [kind, setKind] = useState('');
  const [area, setArea] = useState('');

  function handleUpdate(a) {
    const newAreas = specificAreas.map((specificArea) =>
      specificArea.id === a.id ? a : specificArea
    );

    onChangeAreas(newAreas);
  }

  function handleDelete(id) {
    onChangeAreas(
      specificAreas.filter((specificArea) => specificArea.id !== id)
    );
  }

  async function handleSubmit() {
    setLoading(true);

    const data = {
      kind: Capitalize(kind),
      area,
    };

    try {
      const response = await api.post('specific-area', data);
      onChangeAreas([...specificAreas, response.data]);
      setKind('');
      setArea('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handleArea(value) {
    setArea(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (kind || area) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [kind, area]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Áreas específicas </p>
      <p className="block-description">
        Preencher os campos abaixo identificando todas as áreas do
        empreendimento e os respectivos valores em m².
      </p>

      {specificAreas.length > 0 &&
        specificAreas.map((specificArea, index) => (
          <Accordion
            key={specificArea.id}
            number={index + 1}
            title={specificArea.kind}
            editable={editable}
          >
            <AreaForm
              specificArea={specificArea}
              onChangeArea={(a) => handleUpdate(a)}
              onDeleteArea={(id) => handleDelete(id)}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
        <div className="input-line">
          <div className="input-group">
            <p className="input-label">Tipo de área</p>
            <input
              value={kind}
              className="input"
              disabled={!editable}
              onChange={(e) => setKind(e.target.value)}
              placeholder="Administrativa, produtiva..."
            />
          </div>

          <div className="input-group">
            <p className="input-label medium">Área em m²</p>
            <input
              value={area}
              type="number"
              className="input medium"
              disabled={!editable}
              onChange={(e) => handleArea(e.target.value)}
              placeholder="01"
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
                Salvar área
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
