import producer from 'immer';

const INITIAL_STATE = {
  company: null,
};

export default function company(state = INITIAL_STATE, action) {
  return producer(state, (draft) => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.company = action.payload.company;
        break;
      }
      case '@company/UPDATE_COMPANY_SUCCESS': {
        draft.company = action.payload.company;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.company = null;
        break;
      }
      default:
    }
  });
}
