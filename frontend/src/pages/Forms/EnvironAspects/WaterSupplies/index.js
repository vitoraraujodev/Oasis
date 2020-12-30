import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import WaterSupplyForm from './WaterSupplyForm';
import Use from './Use';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';
import CheckInput from '~/components/CheckInput';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function WaterSupplies({
  waterSupplies,
  onChangeWaterSupplies,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const [refreshAccordion, setRefreshAccordion] = useState(false);

  const [source, setSource] = useState('');
  const [hasLicense, setHasLicense] = useState(false);
  const [license, setLicense] = useState('');
  const [supplyFlow, setSupplyFlow] = useState(0);
  const [uses, setUses] = useState([
    {
      id: Date.now(),
      usage: '',
      flow: '',
    },
  ]);

  function handleUpdate(ws) {
    const newWaterSupplies = waterSupplies.map((waterSupply) =>
      waterSupply.id === ws.id ? ws : waterSupply
    );

    onChangeWaterSupplies(newWaterSupplies);
  }

  function handleDelete(id) {
    onChangeWaterSupplies(
      waterSupplies.filter((waterSupply) => waterSupply.id !== id)
    );
  }

  function handleAddUse() {
    if (loading) return;

    const use = {
      id: Date.now(),
      usage: '',
      flow: '',
    };
    setUses([...uses, use]);

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

    setSaveButton(true);
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
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
      onChangeWaterSupplies([...waterSupplies, response.data]);
      setSource('');
      setLicense('');
      setUses([]);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (source || license || uses.length > 1) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [source, license, uses]); // eslint-disable-line

  useEffect(() => {
    if (uses.length > 0) {
      const totalFlow = uses
        .map((use) => use.flow)
        .reduce((total, amount) => total + amount);
      setSupplyFlow(totalFlow);
    } else {
      setSupplyFlow(0);
    }
  }, [uses]);

  return (
    <FormBlock>
      <p className="block-title">Abastecimento hídrico</p>
      <p className="block-description">
        Preencha os campos abaixo identificando cada fonte de água, as
        respectivas vazões em m³/dia, e outras especificidades.
      </p>

      {waterSupplies.length > 0 &&
        waterSupplies.map((waterSupply, index) => (
          <Accordion
            key={waterSupply.id}
            number={index + 1}
            title={waterSupply.source}
            refreshAccordion={refreshAccordion}
            length={waterSupply.uses.length}
            editable={editable}
          >
            <WaterSupplyForm
              waterSupply={waterSupply}
              onChangeWaterSupply={(s) => handleUpdate(s)}
              onDeleteWaterSupply={(id) => handleDelete(id)}
              onRefreshAccordionSize={() =>
                setRefreshAccordion(!refreshAccordion)
              }
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
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
              onChange={setHasLicense}
            />
          </div>
        </div>
        {hasLicense && (
          <div className="input-line">
            <div className="input-group">
              <p className="input-label">
                N° de Outorga/Requerimento de Outorga
              </p>
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
                Salvar Fonte
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
