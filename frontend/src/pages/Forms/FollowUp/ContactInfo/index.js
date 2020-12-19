import React, { useState, useEffect } from 'react';
import Input from 'react-input-mask';
import { FaCheck } from 'react-icons/fa';

import FormBlock from '~/components/FormBlock';

import api from '~/services/api';

export default function ContactInfo({
  contactInfo,
  onChangeContactInfo,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [startAt, setStartAt] = useState(contactInfo.start_at);
  const [endAt, setEndAt] = useState(contactInfo.end_at);
  const [phoneNumber, setPhoneNumber] = useState(contactInfo.phone_number);

  useEffect(() => {
    if (
      startAt !== contactInfo.start_at ||
      endAt !== contactInfo.end_at ||
      phoneNumber !== contactInfo.phone_number
    ) {
      setSaveButton(true);
    } else if (saveButton) {
      setSaveButton(false);
    }
  }, [startAt, endAt, phoneNumber]); // eslint-disable-line

  async function handleSubmit() {
    setLoading(true);

    const data = {
      start_at: startAt,
      end_at: endAt,
      phone_number: phoneNumber,
    };

    try {
      const response = await api.post('contact-info', data);
      setSaveButton(false);
      onChangeContactInfo(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  function handlePhoneNumber(e) {
    const phone = e.target.value.replace(/[^0-9]+/g, '');
    setPhoneNumber(phone);
  }

  function handleStartHour(value) {
    const hour = value ? parseInt(value, 10) : '';
    if ((hour >= 0 && hour < 24) || hour === '') {
      setStartAt(hour);
    }
  }

  function handleEndHour(value) {
    const hour = value ? parseInt(value, 10) : '';
    if ((hour >= 0 && hour < 24) || hour === '') {
      setEndAt(hour);
    }
  }

  return (
    <FormBlock>
      <p className="block-title">Informações para contato</p>

      <div className="input-line">
        <div className="input-group medium">
          <p className="input-label">Telefone</p>
          <Input
            value={phoneNumber}
            type="custom"
            inputMode="numeric"
            mask={
              phoneNumber.length <= 10 ? '(99) 9999-9999?' : '(99) 99999-9999'
            }
            formatChars={{ 9: '[0-9]', '?': '[0-9 ]' }}
            maskChar={null}
            className="input medium"
            disabled={!editable}
            onChange={handlePhoneNumber}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="input-group" style={{ marginLeft: 32 }}>
          <p className="input-label">Horário de atendimento</p>
          <div className="input-line">
            <div className="input-group small">
              <input
                value={startAt}
                inputMode="numeric"
                maxLength="2"
                className="input small"
                disabled={!editable}
                onKeyDown={(e) => {
                  if ((e.key < 0 || e.key > 9) && e.key !== 'Backspace')
                    e.preventDefault();
                }}
                onChange={(e) => handleStartHour(e.target.value)}
                placeholder="00h"
              />
            </div>

            <div className="input-group small">
              <input
                value={endAt}
                inputMode="numeric"
                maxLength="2"
                className="input small"
                disabled={!editable}
                onKeyDown={(e) => {
                  if ((e.key < 0 || e.key > 9) && e.key !== 'Backspace')
                    e.preventDefault();
                }}
                onChange={(e) => handleEndHour(e.target.value)}
                placeholder="23h"
              />
            </div>
          </div>
        </div>
      </div>

      {saveButton && (
        <button
          type="button"
          className="save-block-button"
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
      )}
    </FormBlock>
  );
}
