import React from 'react';

import ProductiveEquipments from './ProductiveEquipments';
import AuxiliaryEquipments from './AuxiliaryEquipments';
import ControlEquipments from './ControlEquipments';

import FormBlock from '~/components/FormBlock';

export default function Equipments({
  productiveEquipments,
  auxiliaryEquipments,
  controlEquipments,
  onChangeProductiveEquipments,
  onChangeAuxiliaryEquipments,
  onChangeControlEquipments,
  editable,
}) {
  return (
    <FormBlock>
      <p className="block-title">Equipamentos</p>
      <p className="block-description">
        Descrição detalhada de todos os equipamentos da empresa,
        especificamente, os produtivos, auxiliares e de controle, assim como, as
        respectivas características.
      </p>

      <ProductiveEquipments
        productiveEquipments={productiveEquipments}
        onChangeProductiveEquipments={onChangeProductiveEquipments}
        editable={editable}
      />

      <AuxiliaryEquipments
        auxiliaryEquipments={auxiliaryEquipments}
        onChangeAuxiliaryEquipments={onChangeAuxiliaryEquipments}
        editable={editable}
      />

      <ControlEquipments
        controlEquipments={controlEquipments}
        onChangeControlEquipments={onChangeControlEquipments}
        editable={editable}
      />
    </FormBlock>
  );
}
