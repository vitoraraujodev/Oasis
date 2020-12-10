export function updateCompanyRequest(company) {
  return {
    type: '@company/UPDATE_COMPANY_REQUEST',
    payload: { company },
  };
}

export function updateCompanySuccess(company) {
  return {
    type: '@company/UPDATE_COMPANY_SUCCESS',
    payload: { company },
  };
}
