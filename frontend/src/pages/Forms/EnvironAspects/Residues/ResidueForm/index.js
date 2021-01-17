import React, { useState, useEffect } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';
import NumberFormat from 'react-number-format';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function ResidueForm({
  residue,
  onChangeResidue,
  onDeleteResidue,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [identification, setIdentification] = useState(residue.identification);
  const [physicalState, setPhysicalState] = useState(residue.physical_state);
  const [constituent, setConstituent] = useState(residue.constituent);
  const [source, setSource] = useState(residue.source);
  const [treatment, setTreatment] = useState(residue.treatment);
  const [classification, setClassification] = useState(residue.classification);
  const [quantity, setQuantity] = useState(residue.quantity);
  const [quantityUnit, setQuantityUnit] = useState(residue.quantity_unit);
  const [storageForm, setStorageForm] = useState(residue.storage_form);
  const [storageLocation, setStorageLocation] = useState(
    residue.storage_location
  );
  const [capacity, setCapacity] = useState(residue.capacity);
  const [capacityUnit, setCapacityUnit] = useState(residue.capacity_unit);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      id: residue.id,
      identification: Capitalize(identification),
      physical_state: Capitalize(physicalState),
      constituent: Capitalize(constituent),
      source: Capitalize(source),
      treatment: Capitalize(treatment),
      classification: Capitalize(classification),
      quantity,
      quantity_unit: quantityUnit,
      storage_form: Capitalize(storageForm),
      storage_location: Capitalize(storageLocation),
      capacity,
      capacity_unit: capacityUnit,
    };

    try {
      const response = await api.post('residue', data);
      onChangeResidue(response.data);
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
        const response = await api.delete(`residue/${residue.id}`);
        setLoading(false);
        if (response.data.okay) onDeleteResidue(residue.id);
      } catch (err) {
        if (err.response) alert(err.response.data.error);
        setLoading(false);
      }
    }
  }

  function handleQuantity(value) {
    setQuantity(value ? parseInt(value, 10) : '');
  }

  function handleCapacity(value) {
    setCapacity(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (
      identification !== residue.identification ||
      physicalState !== residue.physical_state ||
      constituent !== residue.constituent ||
      source !== residue.source ||
      treatment !== residue.treatment ||
      classification !== residue.classification ||
      quantity !== residue.quantity ||
      quantityUnit !== residue.quantity_unit ||
      storageForm !== residue.storage_form ||
      storageLocation !== residue.storage_location ||
      capacity !== residue.capacity ||
      capacityUnit !== residue.capacity_unit
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [identification, physicalState, constituent, source, treatment, classification, quantity, quantityUnit, storageForm, storageLocation, capacity, capacityUnit]); // eslint-disable-line


  return (
    <div className="accordion-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Identificação do resíduo</p>
          <input
            value={identification}
            className="input"
            disabled={!editable}
            onChange={(e) => setIdentification(e.target.value)}
            placeholder="Resíduo"
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
          <p className="input-label b">Principais constituintes</p>
          <input
            value={constituent}
            className="input"
            disabled={!editable}
            onChange={(e) => setConstituent(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="input-group">
          <p className="input-label b">Fonte do resíduo</p>
          <input
            value={source}
            className="input"
            disabled={!editable}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Equipamento, produção, escritório... "
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Classificação</p>
          <input
            value={classification}
            className="input medium"
            disabled={!editable}
            onChange={(e) => setClassification(e.target.value)}
            placeholder="Classe I, Classe II... "
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group medium">
          <p className="input-label b">Quantidade média/ano</p>
          <NumberFormat
            value={quantity}
            thousandSeparator="."
            decimalSeparator=","
            className="input medium"
            onValueChange={(values) => handleQuantity(values.value)}
            placeholder="01"
          />
        </div>

        <div className="input-group ">
          <p className="input-label b">Unidade de medida</p>
          <input
            value={quantityUnit}
            className="input medium"
            disabled={!editable}
            onChange={(e) => setQuantityUnit(e.target.value)}
            placeholder="Kg, L, m³..."
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Disposição interna</p>
          <p className="block-subdescription">
            Informações sobre a forma de armazenamento interna deste resíduo.
          </p>

          <div className="input-line">
            <div className="input-group">
              <p className="input-label">Local de armazenamento</p>
              <input
                value={storageLocation}
                className="input"
                disabled={!editable}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="Central de resíduos, armazém..."
              />
            </div>

            <div className="input-group">
              <p className="input-label">Forma de armazenamento</p>
              <input
                value={storageForm}
                className="input"
                disabled={!editable}
                onChange={(e) => setStorageForm(e.target.value)}
                placeholder="Caçamba, contêiner..."
              />
            </div>
          </div>

          <div className="input-line">
            <div className="input-group">
              <p className="input-label">Capacidade total</p>
              <input
                value={capacity}
                type="number"
                className="input medium"
                disabled={!editable}
                onChange={(e) => handleCapacity(e.target.value)}
                placeholder="01"
              />
            </div>

            <div className="input-group ">
              <p className="input-label">Unidade de medida</p>
              <input
                value={capacityUnit}
                className="input medium"
                disabled={!editable}
                onChange={(e) => setCapacityUnit(e.target.value)}
                placeholder="Kg, L, m³..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Destinação</p>
          <p className="block-subdescription">
            Informações sobre a forma de tratamento deste resíduo.
          </p>

          <div className="input-line">
            <div className="input-group">
              <p className="input-label">Sistema de tratamento</p>
              <input
                value={treatment}
                className="input"
                disabled={!editable}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Reciclagem, compostagem, incineração..."
              />
            </div>
          </div>
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
