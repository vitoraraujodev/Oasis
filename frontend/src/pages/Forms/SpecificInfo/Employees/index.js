import React from 'react';

import OpEmployees from './OpEmployees';
import InstallEmployees from './InstallEmployees';

import FormBlock from '~/components/FormBlock';

export default function Employees({
  documentType,
  employees,
  installEmployees,
  onChangeEmployees,
  onChangeInstallEmployees,
  editable,
}) {
  return (
    <FormBlock>
      <p className="block-title">Funcionários</p>
      <p className="block-description">
        Preencha os campos abaixo com dados que forneçam o número e tipo de
        funcionários que trabalham atualmente na empresa.
      </p>

      <OpEmployees
        documentType={documentType}
        employees={employees}
        onChangeEmployees={onChangeEmployees}
        editable={editable}
      />

      {(documentType === 'LAI' ||
        documentType === 'LI' ||
        documentType === 'LAU') && (
        <InstallEmployees
          employees={installEmployees}
          onChangeEmployees={onChangeInstallEmployees}
          editable={editable}
        />
      )}
    </FormBlock>
  );
}
