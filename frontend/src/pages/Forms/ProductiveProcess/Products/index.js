import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import NumberFormat from 'react-number-format';

import ProductForm from './ProductForm';
import Storage from './Storage';

import FormBlock from '~/components/FormBlock';
import Accordion from '~/components/Accordion';

import api from '~/services/api';

import { Capitalize } from '~/util/format';

export default function Products({ products, onChangeProducts, editable }) {
  const [loading, setLoading] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const [identification, setIdentification] = useState('');
  const [physicalState, setPhysicalState] = useState('');
  const [quantity, setQuantity] = useState('');
  const [capacity, setCapacity] = useState('');
  const [unit, setUnit] = useState('');
  const [transport, setTransport] = useState('');
  const [packaging, setPackaging] = useState('');
  const [storages, setStorages] = useState([
    {
      id: Date.now(),
      location: '',
      identification: '',
      amount: '',
      capacity: '',
      unit: '',
    },
  ]);

  function handleUpdate(p) {
    const newProducts = products.map((product) =>
      product.id === p.id ? p : product
    );

    onChangeProducts(newProducts);
  }

  function handleDelete(id) {
    onChangeProducts(products.filter((product) => product.id !== id));
  }

  function handleAddStorage() {
    if (loading) return;

    const storage = {
      id: Date.now(),
      location: '',
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
  function handleProductFormStorages(s, id) {
    const newProducts = products.map((product) =>
      product.id === id ? { ...product, storages: s } : product
    );
    onChangeProducts(newProducts);
  }

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const data = {
      identification: Capitalize(identification),
      physical_state: Capitalize(physicalState),
      quantity,
      capacity,
      unit,
      transport: Capitalize(transport),
      packaging: Capitalize(packaging),
      storages: storages.map((storage) => ({
        location: storage.location,
        identification: storage.identification,
        amount: storage.amount,
        capacity: storage.capacity,
        unit: storage.unit,
      })),
    };

    try {
      const response = await api.post('product', data);
      onChangeProducts([...products, response.data]);
      setIdentification('');
      setPhysicalState('');
      setCapacity('');
      setUnit('');
      setQuantity('');
      setTransport('');
      setPackaging('');
      setStorages([
        {
          id: Date.now(),
          location: '',
          identification: '',
          amount: '',
          capacity: '',
          unit: '',
        },
      ]);
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
      quantity ||
      capacity ||
      unit ||
      transport ||
      packaging ||
      storages.length > 1
    ) {
      if (!saveButton) setSaveButton(true);
    } else {
      setSaveButton(false);
    }
  }, [identification, physicalState, quantity, capacity, unit, transport, packaging, storages]); // eslint-disable-line

  return (
    <FormBlock>
      <p className="block-title">Produtos</p>
      <p className="block-description">
        Preencha os campos abaixo identificando cada um dos produtos e as
        respectivas especificidades, formas de armazenamento e expedição.
      </p>

      {products.length > 0 &&
        products.map((product, index) => (
          <Accordion
            key={product.id}
            number={index + 1}
            title={product.identification}
            length={product.storages.length}
            editable={editable}
          >
            <ProductForm
              product={product}
              onChangeProduct={(p) => handleUpdate(p)}
              onDeleteProduct={(id) => handleDelete(id)}
              onChangeStorages={(s) => handleProductFormStorages(s, product.id)}
              editable={editable}
            />
          </Accordion>
        ))}

      <div className="block-form">
        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Identificação do produto</p>
            <input
              value={identification}
              className="input"
              disabled={!editable}
              onChange={(e) => setIdentification(e.target.value)}
              placeholder="Produto"
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
            <p className="input-label b">Capacidade produtiva média/ano</p>
            <input
              value={capacity}
              type="number"
              className="input"
              disabled={!editable}
              onChange={(e) => handleCapacity(e.target.value)}
              placeholder="01"
            />
          </div>

          <div className="input-group">
            <p className="input-label b">Unidade de medida</p>
            <input
              value={unit}
              className="input"
              disabled={!editable}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Kg, L, m³..."
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
        </div>

        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Armazenamento</p>
            <p className="block-subdescription">
              Informações sobre cada forma específica de armazenamento deste
              produto.
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
                Adicionar um armazenamento
              </button>
            )}
          </div>
        </div>

        <div className="input-line">
          <div className="input-group">
            <p className="input-label b">Expedição</p>
            <p className="block-subdescription">
              Informações sobre o meio de transporte para o recebimento deste
              produto.
            </p>

            <div className="input-line">
              <div className="input-group">
                <p className="input-label">Meio de transporte</p>
                <input
                  value={transport}
                  className="input"
                  disabled={!editable}
                  onChange={(e) => setTransport(e.target.value)}
                  placeholder="Caminhões, ferrovia..."
                />
              </div>

              <div className="input-group">
                <p className="input-label">Acondicionamento</p>
                <input
                  value={packaging}
                  className="input"
                  disabled={!editable}
                  onChange={(e) => setPackaging(e.target.value)}
                  placeholder="Galões, sacas, barrís..."
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
                Salvar produto
              </>
            )}
          </button>
        )}
      </div>
    </FormBlock>
  );
}
