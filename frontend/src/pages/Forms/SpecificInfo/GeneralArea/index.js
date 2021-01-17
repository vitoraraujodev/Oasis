import React, { useState, useEffect } from 'react';
import { FaCheck, FaImage } from 'react-icons/fa';
import NumberFormat from 'react-number-format';

import FormBlock from '~/components/FormBlock';

import api from '~/services/api';

export default function GeneralArea({
  generalArea,
  onChangeGeneralArea,
  editable,
}) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [area, setArea] = useState(generalArea.area);
  const [file, setFile] = useState();
  const [image, setImage] = useState(
    generalArea.image ? generalArea.image.url : null
  );

  useEffect(() => {
    if (
      area !== generalArea.area ||
      (generalArea.image && image !== generalArea.image.url) ||
      (!generalArea.image && image !== null)
    ) {
      setSaveButton(true);
    } else if (saveButton) {
      setSaveButton(false);
    }
  }, [area, image]); // eslint-disable-line

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    try {
      if (file) {
        const data = new FormData();
        data.append('file', file);

        const result = await api.post('file', data);
        const { id, url } = result.data;

        const response = await api.post('general-area', { area, image_id: id });

        setImage(url);
        onChangeGeneralArea(response.data);
      } else {
        const response = await api.post('general-area', {
          area,
          image_id: generalArea.image.id,
        });

        onChangeGeneralArea(response.data);
      }
      setSaveButton(false);
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  function handleArea(value) {
    setArea(value ? parseFloat(value) : '');
  }

  async function handleChangeImage(e) {
    setFile(e.target.files[0]);

    setImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <FormBlock>
      <p className="block-title">Área do empreendimento</p>
      <p className="block-description">
        Informe o valor total da área em m² do empreendimento, onde serão
        desenvolvidas as atividades no presente requerimento. E em seguida,
        anexar imagem panorâmica da referida área demarcada por poligonal,
        informando as coordenadas geográficas e o datum utilizado.
      </p>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Área total em m²</p>
          <NumberFormat
            value={area}
            thousandSeparator="."
            decimalSeparator=","
            className="input medium"
            disabled={!editable}
            onValueChange={(values) => handleArea(values.value)}
            placeholder="01"
          />
        </div>
      </div>

      <div className="input-line">
        <div className="input-group">
          <p className="input-label">Imagem panorâmica com área poligonal</p>

          <label htmlFor="image">
            <input
              id="image"
              type="file"
              accept="image/*"
              disabled={!editable}
              data-file={image}
              onChange={handleChangeImage}
            />
            {image ? (
              <div className="image-container">
                <img
                  src={image}
                  onError={() => setImage(null)}
                  className={editable ? 'area-image' : 'area-image-disabled'}
                  alt=""
                />
              </div>
            ) : (
              <div
                className={
                  editable
                    ? 'image-icon-container'
                    : 'image-icon-container-disabled'
                }
              >
                <div className="add-image-icon">
                  <FaImage size={40} />
                  Adicionar foto
                </div>
              </div>
            )}
          </label>
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
