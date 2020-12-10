import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
import history from '~/services/history';

import { updateCompanySuccess } from './actions';

export function* updateCompany({ payload }) {
  try {
    const response = yield call(api.put, 'company', payload.Company);

    yield put(updateCompanySuccess(response.data));

    history.push('/empresa');
  } catch (err) {
    if (err.response.data) {
      alert(err.response.data.error);
    }
  }
}

export default all([
  takeLatest('@company/UPDATE_COMPANY_REQUEST', updateCompany),
]);
