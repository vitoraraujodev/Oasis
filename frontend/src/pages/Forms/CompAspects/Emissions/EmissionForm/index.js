import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function EmissionForm({
  emission,
  onChangeEmission,
  onDeleteEmission,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [source, setSource] = useState(emission.source);
  const [pollutant, setPollutant] = useState(emission.pollutant);
  const [concentration, setConcentration] = useState(emission.concentration);
  const [unit, setUnit] = useState(emission.unit);
  const [controlSystem, setControlSystem] = useState(emission.control_system);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: emission.id,
      source: Capitalize(source),
      pollutant,
      concentration,
      unit,
      control_system: Capitalize(controlSystem),
    };

    try {
      const response = await api.post('emission', data);
      onChangeEmission(response.data);

      setSaveButton(false);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const response = await api.delete(`emission/${emission.id}`);
      setLoading(false);
      if (response.data.okay) onDeleteEmission(emission.id);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
      setLoading(false);
    }
  }

  function handleConcentration(value) {
    setConcentration(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (
      source !== emission.source ||
      pollutant !== emission.pollutant ||
      concentration !== emission.concentration ||
      unit !== emission.unit ||
      controlSystem !== emission.control_system
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [source, pollutant, concentration, unit, controlSystem]); // eslint-disable-line

  return (
    <div className="accordion-form">
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

      <div className="accordion-buttons">
        {editable && (
          <button
            type="button"
            className="delete-form-button"
            onClick={!loading ? handleDelete : null}
          >
            {loading ? (
              'Carregando...'
            ) : (
              <>
                <span className="delete-icon">
                  <FaTrash size={16} color="#fff" style={{ marginRight: 8 }} />
                </span>
                Excluir
              </>
            )}
          </button>
        )}

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
                <FaCheck size={16} color="#fff" style={{ marginRight: 8 }} />
                Salvar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
