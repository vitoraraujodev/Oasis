import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { FaPlus, FaCheck } from 'react-icons/fa';

import Shift from './Shift';

import FormBlock from '~/components/FormBlock';
import CheckInput from '~/components/CheckInput';

import api from '~/services/api';

import { Capitalize, formatDate } from '~/util/format';

export default function OperatingInfo({
  operatingInfo,
  onChangeOperatingInfo,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [date, setDate] = useState(formatDate(operatingInfo.date));
  const [rural, setRural] = useState(operatingInfo.rural);
  const [ruralPast, setRuralPast] = useState(operatingInfo.registration);
  const [registration, setRegistration] = useState(operatingInfo.registration);
  const [observation, setObservation] = useState(operatingInfo.observation);
  const [shifts, setShifts] = useState(
    operatingInfo.shifts.length > 0
      ? operatingInfo.shifts
      : [
          {
            start_at: '',
            end_at: '',
            week: '0000000',
          },
        ]
  );

  useEffect(() => {
    if (
      date !== formatDate(operatingInfo.date) ||
      rural !== operatingInfo.rural ||
      registration !== operatingInfo.registration ||
      observation !== operatingInfo.observation
    ) {
      setSaveButton(true);
    } else if (saveButton) {
      setSaveButton(false);
    }
  }, [date, rural, registration, observation]); // eslint-disable-line

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      date: formatDate(date),
      rural,
      registration: registration || false,
      observation: Capitalize(observation),
      shifts,
    };

    try {
      const response = await api.post('operating-info', data);
      setSaveButton(false);
      onChangeOperatingInfo(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  function handleUpdateShifts(shift, index) {
    if (loading) return;

    const newShifts = shifts.map((s, i) => (i === index ? shift : s));
    setShifts(newShifts);

    setSaveButton(true);
  }

  function handleAddShift() {
    if (loading) return;

    const shift = {
      start_at: '',
      end_at: '',
      week: '0000000',
    };
    setShifts([...shifts, shift]);

    setSaveButton(true);
  }

  function handleDelete(index) {
    if (loading) return;

    const newShifts = [...shifts];
    newShifts.splice(index, 1);
    setShifts(newShifts);

    setSaveButton(true);
  }

  return (
    <FormBlock>
      <p className="block-title">Informações de funcionamento</p>
      <p className="block-description">
        Preencher os campos abaixo com os dados referentes aos turnos e
        respectivos horários de atividades que apresentam possibilidade de
        geração de impacto ambiental significativo.
      </p>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Data de início da empresa</p>
          <InputMask
            value={date}
            type="tel"
            mask="99/99/9999"
            className="input medium"
            disabled={!editable}
            onChange={(e) => setDate(e.target.value)}
            placeholder="25/12/2020"
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">A empresa se encontra em zona rural?</p>
          <CheckInput editable={editable} value={rural} onChange={setRural} />
        </div>
      </div>

      {rural ? (
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">A empresa possui cadastro no CAR?</p>
            <CheckInput
              editable={editable}
              value={registration}
              onChange={setRegistration}
            />
          </div>
        </div>
      ) : (
        <>
          {parseInt(date.substr(6, 4), 10) >= 1000 &&
            parseInt(date.substr(6, 4), 10) <= 1989 &&
            rural === false && (
              <>
                <div className="input-line">
                  <div className="input-group">
                    <p className="input-label b">
                      A empresa já esteve inserida em zona rural antes de 1989?
                    </p>
                    <CheckInput
                      editable={editable}
                      value={ruralPast}
                      onChange={setRuralPast}
                    />
                  </div>
                </div>

                {ruralPast && (
                  <div className="input-line">
                    <div className="input-group">
                      <p className="input-label b">
                        A empresa possui cadastro no CAR?
                      </p>
                      <CheckInput
                        editable={editable}
                        value={registration}
                        onChange={setRegistration}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
        </>
      )}

      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">Turnos de funcionamento</p>
          {shifts.map((shift, index) => (
            <Shift
              shift={shift}
              onChangeShift={(s) => {
                handleUpdateShifts(s, index);
              }}
              onDeleteShift={() => handleDelete(index)}
              editable={editable}
            />
          ))}
          <button
            type="button"
            className="add-subform-button"
            onClick={handleAddShift}
          >
            <FaPlus size={16} color="#3366BB" style={{ marginRight: 8 }} />
            Adicionar um turno
          </button>
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label">
            Existe alguma outra atividade secundária auxiliar que tenha um
            horário distinto?
            <span className="hint" style={{ marginLeft: 4 }}>
              (Opcional)
            </span>
          </p>
          <textarea
            value={observation}
            length="192"
            className="input"
            style={{ padding: '8px 16px', height: 64 }}
            disabled={!editable}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Em caso de setores com horários diferenciados, detalhe aqui..."
          />
          <p className="hint">
            Ex.: Setor Administrativo das 09:00 às 15:00 (Segunda à sexta).
          </p>
        </div>
      </div>

      {saveButton && (
        <div className="input-line">
          <button
            type="button"
            className="save-block-button bottom"
            onClick={!loading ? handleSubmit : null}
          >
            {loading ? (
              'Carregando...'
            ) : (
              <>
                <FaCheck size={21} color="#fff" style={{ marginRight: 8 }} />
                Salvar
              </>
            )}
          </button>
        </div>
      )}
    </FormBlock>
  );
}
