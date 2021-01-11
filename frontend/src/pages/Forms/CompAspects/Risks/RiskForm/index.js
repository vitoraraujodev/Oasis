import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash, FaPlus } from 'react-icons/fa';

import Storage from '../Storage';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function RiskForm({
  risk,
  onChangeRisk,
  onDeleteRisk,
  onChangeStorages,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [substance, setSubstance] = useState(risk.substance);
  const [physicalState, setPhysicalState] = useState(risk.physical_state);
  const [storages, setStorages] = useState(risk.storages);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: risk.id,
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
      const response = await api.post('risk', data);
      onChangeRisk(response.data);
      setSaveButton(false);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (window.confirm('Deseja excluir permanentemente esse item?')) {
      setLoading(true);

      try {
        const response = await api.delete(`risk/${risk.id}`);
        setLoading(false);
        if (response.data.okay) onDeleteRisk(risk.id);
      } catch (err) {
        if (err.response) alert(err.response.data.error);
        setLoading(false);
      }
    }
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
    onChangeStorages([...storages, storage]);
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
    onChangeStorages(newStorages);

    setSaveButton(true);
  }

  useEffect(() => {
    if (substance !== risk.substance || physicalState !== risk.physical_state) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [substance, physicalState]); // eslint-disable-line

  return (
    <div className="accordion-form">
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
