import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { FaCheck } from 'react-icons/fa';

import CheckInput from '~/components/CheckInput';

import api from '~/services/api';
import { formatDate } from '~/util/format';

export default function NoiseInfoBlock({
  noiseInfo,
  onChangeNoiseInfo,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [isReporting, setIsReporting] = useState(
    Object.values(noiseInfo).length === 0 ? null : !!noiseInfo.report_date
  );
  const [reportDate, setReportDate] = useState(
    formatDate(noiseInfo.report_date || '')
  );

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      report_date: isReporting ? formatDate(reportDate) : '',
    };

    try {
      const response = await api.post('noise-info', data);
      setSaveButton(false);
      onChangeNoiseInfo(response.data);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (
      (reportDate !== formatDate(noiseInfo.report_date) &&
        reportDate !== '' &&
        reportDate !== '__/__/____') ||
      (Object.values(noiseInfo).length === 0 && isReporting === false)
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [reportDate, isReporting]); // eslint-disable-line

  return (
    <div className="block-form">
      <div className="input-line">
        <div className="input-group">
          <p className="input-label b">
            A empresa está reportando o Relatório Técnico de Avaliação de
            Ruídos?
          </p>
          <CheckInput
            editable={editable}
            value={isReporting}
            onChange={(value) => {
              setIsReporting(value);
            }}
          />
        </div>
      </div>

      {isReporting && (
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Data do relatório</p>
            <InputMask
              value={reportDate}
              type="tel"
              mask="99/99/9999"
              className="input"
              disabled={!editable}
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              onChange={(e) => setReportDate(e.target.value)}
              placeholder="25/12/2020"
            />
          </div>
        </div>
      )}

      {saveButton && (
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
      )}
    </div>
  );
}
