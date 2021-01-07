import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import EmissionForm from './EmissionForm';
import EmissionInfoBlock from './EmissionInfoBlock';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Emissions({
  emissions,
  onChangeEmissions,
  emissionInfo,
  onChangeEmissionInfo,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [source, setSource] = useState('');
  const [pollutant, setPollutant] = useState('');
  const [concentration, setConcentration] = useState('');
  const [unit, setUnit] = useState('');
  const [controlSystem, setControlSystem] = useState('');

  function handleUpdate(e) {
    const newEmissions = emissions.map((emission) =>
      emission.id === e.id ? e : emission
    );

    onChangeEmissions(newEmissions);
  }

  function handleDelete(id) {
    onChangeEmissions(emissions.filter((emission) => emission.id !== id));
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      source: Capitalize(source),
      pollutant,
      concentration,
      unit,
      control_system: Capitalize(controlSystem),
    };

    try {
      const response = await api.post('emission', data);
      onChangeEmissions([...emissions, response.data]);
      setSource('');
      setPollutant('');
      setConcentration('');
      setUnit('');
      setControlSystem('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handleConcentration(value) {
    setConcentration(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (source || pollutant || concentration || unit || controlSystem) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [source, pollutant, concentration, unit, controlSystem]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Emissões atmosféricas</p>
      <p className="block-description">
        Identifique cada fonte de emissão atmosférica, com seus respectivos
        poluentes gerados, e outras especificidades.
      </p>

      <EmissionInfoBlock
        emissionInfo={emissionInfo}
        onChangeEmissionInfo={onChangeEmissionInfo}
        editable={editable}
      />

      {emissions.length > 0 &&
        emissions.map((emission, index) => (
          <Accordion
            key={emission.id}
            number={index + 1}
            title={emission.source}
            editable={editable}
          >
            <EmissionForm
              emission={emission}
              onChangeEmission={(e) => handleUpdate(e)}
              onDeleteEmission={(id) => handleDelete(id)}
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
              placeholder="Chaminés, exaustores..."
            />
          </div>

          <div className="input-group">
            <p className="input-label">Poluente gerado</p>
            <input
              value={pollutant}
              className="input medium"
              disabled={!editable}
              onChange={(e) => setPollutant(e.target.value)}
              placeholder="CO2, CO, CFC..."
            />
          </div>
        </div>

        <div className="input-line">
          <div className="input-group medium">
            <p className="input-label">Concentração</p>
            <input
              value={concentration}
              className="input medium"
              disabled={!editable}
              onChange={(e) => handleConcentration(e.target.value)}
              placeholder="01"
            />
          </div>

          <div className="input-group ">
            <p className="input-label">Unidade de medida</p>
            <input
              value={unit}
              className="input medium"
              disabled={!editable}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="mg/Nm³..."
            />
          </div>
        </div>

        <div className="input-line">
          <div className="input-group">
            <p className="input-label">Sistema de controle</p>
            <input
              value={controlSystem}
              className="input medium"
              disabled={!editable}
              onChange={(e) => setControlSystem(e.target.value)}
              placeholder="Lavador de gases, filtro manga..."
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
                Salvar emissão
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
