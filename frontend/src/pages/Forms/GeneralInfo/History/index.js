import React from 'react';

import ConcludedProcess from './ConcludedProcess';
import PendingProcess from './PendingProcess';

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
        Explicação breve sobre o tópico do formulário, lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Pellentesque finibus commodo ornare.
      </p>

      <ConcludedProcess
        concludedProcesses={concludedProcesses}
        onChangeConcludedProcesses={onChangeConcludedProcesses}
        editable={editable}
      />

      <PendingProcess
        pendingProcesses={pendingProcesses}
        onChangePendingProcesses={onChangePendingProcesses}
        editable={editable}
      />
    </FormBlock>
  );
}
