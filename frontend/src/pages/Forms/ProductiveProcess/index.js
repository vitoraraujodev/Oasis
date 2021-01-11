import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from 'react-icons/fa';

import Supplies from './Supplies';
import Equipments from './Equipments';
import Products from './Products';

import TitleBlock from '~/components/TitleBlock';
import Header from '~/components/Header';

import api from '~/services/api';
import history from '~/services/history';

import '../styles.css';

export default function ProductiveProcess() {
  const ENV = process.env.NODE_ENV;

  const [editable, setEditable] = useState(ENV !== 'production');
  const [loading, setLoading] = useState(false);

  const [supplies, setSupplies] = useState([]);
  const [productiveEquipments, setProductiveEquipments] = useState([]);
  const [auxiliaryEquipments, setAuxiliaryEquipments] = useState([]);
  const [controlEquipments, setControlEquipments] = useState([]);
  const [products, setProducts] = useState([]);

  async function loadProductiveProcess() {
    setLoading(true);

    try {
      const response = await api.get('productive-process');

      if (!response.data) {
        setEditable(true);
      } else {
        if (response.data.supplies) setSupplies(response.data.supplies);
        if (response.data.equipments) {
          setProductiveEquipments(
            response.data.equipments.filter(
              (equipment) => equipment.kind === 'productive'
            )
          );
          setAuxiliaryEquipments(
            response.data.equipments.filter(
              (equipment) => equipment.kind === 'auxiliary'
            )
          );
          setControlEquipments(
            response.data.equipments.filter(
              (equipment) => equipment.kind === 'control'
            )
          );
        }
        if (response.data.products) setProducts(response.data.products);
      }
    } catch (err) {
      if (err.response) alert(err.response.data.error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProductiveProcess();
  }, []);

  return (
    <div id="form-page">
      <Header />

      <div className="container">
        <div className="form-buttons">
          <button
            type="button"
            className="page-button"
            onClick={() => history.push('/form')}
          >
            <FaArrowLeft size={21} color="#fff" />
            <strong style={{ marginLeft: 12 }}>Voltar</strong>
          </button>

          <button
            type="button"
            className="edit-button"
            onClick={() => setEditable(!editable)}
          >
            {editable ? (
              <FaLockOpen size={21} color="#fff" />
            ) : (
              <FaLock size={21} color="#fff" />
            )}
            <strong style={{ marginLeft: 12 }}>Editar</strong>
          </button>
        </div>

        <TitleBlock
          title="Processos Produtivos"
          description="Descrição detalhada dos insumos, equipamentos e produtos que compõem toda a cadeia produtiva da empresa."
        />

        {loading ? (
          <div className="loader-container">
            <div className="loader" />
            Carregando...
          </div>
        ) : (
          <>
            <Supplies
              supplies={supplies}
              onChangeSupplies={setSupplies}
              editable={editable}
            />

            <Equipments
              productiveEquipments={productiveEquipments}
              onChangeProductiveEquipments={setProductiveEquipments}
              auxiliaryEquipments={auxiliaryEquipments}
              onChangeAuxiliaryEquipments={setAuxiliaryEquipments}
              controlEquipments={controlEquipments}
              onChangeControlEquipments={setControlEquipments}
              editable={editable}
            />

            <Products
              products={products}
              onChangeProducts={setProducts}
              editable={editable}
            />
          </>
        )}

        {!loading && (
          <div className="form-buttons">
            <button
              type="button"
              className="page-button"
              onClick={() => history.push('/form')}
            >
              <FaArrowLeft size={21} color="#fff" />
              <strong style={{ marginLeft: 12 }}>Voltar</strong>
            </button>

            <button
              type="button"
              className="page-button"
              onClick={() => history.push('/form/aspectos-ambientais')}
            >
              <strong style={{ marginRight: 12 }}>Avançar</strong>
              <FaArrowRight size={21} color="#fff" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
