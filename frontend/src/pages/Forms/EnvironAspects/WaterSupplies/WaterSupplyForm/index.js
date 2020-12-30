import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash, FaPlus } from 'react-icons/fa';

import Use from '../Use';

import CheckInput from '~/components/CheckInput';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function WaterSupplyForm({
  waterSupply,
  onChangeWaterSupply,
  onDeleteWaterSupply,
  onRefreshAccordionSize,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [source, setSource] = useState(waterSupply.source);
  const [hasLicense, setHasLicense] = useState(!!waterSupply.license);
  const [license, setLicense] = useState(waterSupply.license || '');
  const [supplyFlow, setSupplyFlow] = useState(0);
  const [uses, setUses] = useState(waterSupply.uses);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: waterSupply.id,
      source: Capitalize(source),
      license: hasLicense ? license : '',
      uses: uses.map((use) => ({
        usage: use.usage,
        flow: use.flow,
      })),
    };

    console.tron.log(data);

    try {
      const response = await api.post('water-supply', data);
      onChangeWaterSupply(response.data);
      setSaveButton(false);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);

    try {
      const response = await api.delete(`water-supply/${waterSupply.id}`);
      setLoading(false);
      if (response.data.okay) onDeleteWaterSupply(waterSupply.id);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
      setLoading(false);
    }
  }

  function handleAddUse() {
    if (loading) return;

    const use = {
      id: Date.now(),
      usage: '',
      flow: '',
    };
    setUses([...uses, use]);
    onRefreshAccordionSize();

    setSaveButton(true);
  }

  function handleUpdateUses(use, index) {
    if (loading) return;

    const newUses = uses.map((u, i) => (i === index ? use : u));
    setUses(newUses);

    setSaveButton(true);
  }

  function handleDeleteUse(index) {
    if (loading) return;

    const newUses = [...uses];
    newUses.splice(index, 1);
    setUses(newUses);
    onRefreshAccordionSize();

    setSaveButton(true);
  }

  useEffect(() => {
    if (
      source !== waterSupply.source ||
      license !== (waterSupply.license || '') ||
      (license && !hasLicense)
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [source, license, hasLicense]); // eslint-disable-line

  useEffect(() => {
    if (waterSupply.uses.length > 0) {
      const totalFlow = waterSupply.uses
        .map((use) => use.flow)
        .reduce((total, amount) => total + amount);
      setSupplyFlow(totalFlow);
    } else {
      setSupplyFlow(0);
    }
  }, [waterSupply.uses]);

  return (
    <div id="accordion-form" className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Fonte da água</p>
          <input
            value={source}
            className="input"
            disabled={!editable}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Rio, poço, caminhão-pipa..."
          />
        </div>

        <div className="input-group">
          <p className="input-label b">Vazão total em m³/dia</p>
          <input value={supplyFlow} className="input medium" disabled />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">
            A empresa possui Outorga para essa fonte hídrica?
          </p>
          <CheckInput
            editable={editable}
            value={hasLicense}
            onChange={(value) => {
              onRefreshAccordionSize();
              setHasLicense(value);
            }}
          />
        </div>
      </div>
      {hasLicense && (
        <div className="input-line">
          <div className="input-group">
            <p className="input-label">N° de Outorga/Requerimento de Outorga</p>
            <input
              value={license}
              className="input"
              disabled={!editable}
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="PD-00/000.000/0000"
            />
          </div>
        </div>
      )}

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Usos dessa fonte</p>
          <p className="block-subdescription">
            Informações especificas sobre cada uso desta fonte hídrica.
          </p>

          {uses.map((use, index) => (
            <Use
              key={use.id}
              use={use}
              onChangeUse={(u) => {
                handleUpdateUses(u, index);
              }}
              onDeleteUse={() => handleDeleteUse(index)}
              editable={editable}
            />
          ))}
          {editable && (
            <button
              type="button"
              className="add-subform-button"
              onClick={handleAddUse}
            >
              <FaPlus size={16} color="#3366BB" style={{ marginRight: 8 }} />
              Adicionar um uso
            </button>
          )}
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
