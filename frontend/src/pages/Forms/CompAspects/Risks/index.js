import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import RiskForm from './RiskForm';
import Storage from './Storage';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Risks({ risks, onChangeRisks, editable }) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [substance, setSubstance] = useState('');
  const [physicalState, setPhysicalState] = useState('');
  const [storages, setStorages] = useState([
    {
      id: Date.now(),
      identification: '',
      amount: '',
      capacity: '',
      unit: '',
    },
  ]);

  function handleUpdate(r) {
    const newRisks = risks.map((risk) => (risk.id === r.id ? r : risk));

    onChangeRisks(newRisks);
  }

  function handleDelete(id) {
    onChangeRisks(risks.filter((risk) => risk.id !== id));
  }

  function handleAddStorage() {
    if (loading) return;

    const storage = {
      id: Date.now(),
      identification: '',
      amount: '',
      capacity: '',
      unit: '',
    };
    setStorages([...storages, storage]);

    setSaveButton(true);
  }

  function handleUpdateStorages(storage, index) {
    if (loading) return;

    const newStorages = storages.map((s, i) => (i === index ? storage : s));
    setStorages(newStorages);

    setSaveButton(true);
  }

  function handleDeleteStorage(index) {
    if (loading) return;

    const newStorages = [...storages];
    newStorages.splice(index, 1);
    setStorages(newStorages);

    setSaveButton(true);
  }

  // When adding new element, "saves" it to change Accordeon height
  function handleRiskFormStorages(s, id) {
    const newRisks = risks.map((risk) =>
      risk.id === id ? { ...risk, storages: s } : risk
    );
    onChangeRisks(newRisks);
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      substance: Capitalize(substance),
      physical_state: Capitalize(physicalState),
      storages: storages.map((storage) => ({
        identification: Capitalize(storage.identification),
        amount: storage.amount,
        capacity: storage.capacity,
        unit: storage.unit,
      })),
    };

    try {
      const response = await api.post('Risk', data);
      onChangeRisks([...risks, response.data]);
      setSubstance('');
      setPhysicalState('');
      setStorages([]);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (substance || physicalState || storages.length > 1) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [substance, physicalState, storages]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Risco Ambiental</p>
      <p className="block-description">
        Identifique as substâncias cujo armazenamento confere risco ambiental
        significativo, em conjunto com os respectivos reservatórios, e outras
        especificidades.
      </p>

      {risks.length > 0 &&
        risks.map((risk, index) => (
          <Accordion
            key={risk.id}
            number={index + 1}
            title={risk.substance}
            length={risk.storages.length}
            editable={editable}
          >
            <RiskForm
              risk={risk}
              onChangeRisk={(r) => handleUpdate(r)}
              onDeleteRisk={(id) => handleDelete(id)}
              onChangeStorages={(s) => handleRiskFormStorages(s, risk.id)}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Substância</p>
            <input
              value={substance}
              className="input"
              disabled={!editable}
              onChange={(e) => setSubstance(e.target.value)}
              placeholder="Óleo diesel, gás GLP...."
            />
          </div>

          <div className="input-group">
            <p className="input-label b">Forma física</p>
            <input
              value={physicalState}
              className="input medium"
              disabled={!editable}
              onChange={(e) => setPhysicalState(e.target.value)}
              placeholder="Sól., Líq. ou Gás."
            />
          </div>
        </div>

        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Reservatórios</p>
            <p className="block-subdescription">
              Informações sobre cada forma específica de armazenamento desta
              substância.
            </p>

            {storages.map((storage, index) => (
              <Storage
                key={storage.id}
                storage={storage}
                onChangeStorage={(s) => {
                  handleUpdateStorages(s, index);
                }}
                onDeleteStorage={() => handleDeleteStorage(index)}
                editable={editable}
              />
            ))}
            {editable && (
              <button
                type="button"
                className="add-subform-button"
                onClick={handleAddStorage}
              >
                <FaPlus size={16} color="#3366BB" style={{ marginRight: 8 }} />
                Adicionar um reservatório
              </button>
            )}
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
                Salvar substância
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
