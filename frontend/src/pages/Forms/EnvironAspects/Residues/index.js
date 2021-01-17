import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import NumberFormat from 'react-number-format';

import ResidueForm from './ResidueForm';
import ResidueInfoBlock from './ResidueInfoBlock';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Residues({
  residues,
  onChangeResidues,
  residueInfo,
  onChangeResidueInfo,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [identification, setIdentification] = useState('');
  const [physicalState, setPhysicalState] = useState('');
  const [constituent, setConstituent] = useState('');
  const [source, setSource] = useState('');
  const [treatment, setTreatment] = useState('');
  const [classification, setClassification] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('');
  const [storageForm, setStorageForm] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [capacityUnit, setCapacityUnit] = useState('');

  function handleUpdate(r) {
    const newResidues = residues.map((residue) =>
      residue.id === r.id ? r : residue
    );

    onChangeResidues(newResidues);
  }

  function handleDelete(id) {
    onChangeResidues(residues.filter((residue) => residue.id !== id));
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
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
      onChangeResidues([...residues, response.data]);
      setIdentification('');
      setPhysicalState('');
      setConstituent('');
      setSource('');
      setTreatment('');
      setClassification('');
      setQuantity('');
      setQuantityUnit('');
      setStorageForm('');
      setStorageLocation('');
      setCapacity('');
      setCapacityUnit('');
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handleQuantity(value) {
    setQuantity(value ? parseInt(value, 10) : '');
  }

  function handleCapacity(value) {
    setCapacity(value ? parseInt(value, 10) : '');
  }

  useEffect(() => {
    if (
      identification ||
      physicalState ||
      constituent ||
      source ||
      treatment ||
      classification ||
      quantity ||
      quantityUnit ||
      storageForm ||
      storageLocation ||
      capacity ||
      capacityUnit
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [identification, physicalState, constituent, source, treatment, classification, quantity, quantityUnit, storageForm, storageLocation, capacity, capacityUnit]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Resíduos</p>
      <p className="block-description">
        Identifique cada um dos resíduos gerados pelas atividades desenvolvidas
        pela empresa, assim como, as respectivas especificidades, disposições
        internas e destinações finais.
      </p>

      <ResidueInfoBlock
        residueInfo={residueInfo}
        onChangeResidueInfo={onChangeResidueInfo}
        editable={editable}
      />

      {residues.length > 0 &&
        residues.map((residue, index) => (
          <Accordion
            key={residue.id}
            number={index + 1}
            title={residue.identification}
            editable={editable}
          >
            <ResidueForm
              residue={residue}
              onChangeResidue={(r) => handleUpdate(r)}
              onDeleteResidue={(id) => handleDelete(id)}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
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
              <div className="input-group medium">
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
                Salvar resíduo
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
