import React from 'react';

import ConcludedProcesses from './ConcludedProcesses';
import PendingProcesses from './PendingProcesses';

import FormBlock from '~/components/FormBlock';

export default function History({
  concludedProcesses,
  pendingProcesses,
  onChangeConcludedProcesses,
  onChangePendingProcesses,
  editable,
}) {
  return (
    <FormBlock>
      <p className="block-title">Histórico da empresa no INEA</p>
      <p className="block-description">
        Preencher os campos abaixo fornecendo um breve histórico dos processos
        administrativos concluídos e em andamento, da empresa, junto ao órgão
        ambiental.
      </p>

      <ConcludedProcesses
        concludedProcesses={concludedProcesses}
        onChangeConcludedProcesses={onChangeConcludedProcesses}
        editable={editable}
      />

      <PendingProcesses
        pendingProcesses={pendingProcesses}
        onChangePendingProcesses={onChangePendingProcesses}
        editable={editable}
      />
    </FormBlock>
  );
}
