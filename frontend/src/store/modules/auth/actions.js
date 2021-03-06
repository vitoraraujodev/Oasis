export function signInRequest(email, password) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { email, password },
  };
}

export function signInSuccess(token, company) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, company },
  };
}

export function signFailure() {
  return { type: '@auth/SIGN_FAILURE' };
}

export function signOutRequest() {
  return {
    type: '@auth/SIGN_OUT_REQUEST',
  };
}

export function signOutSuccess() {
  return {
    type: '@auth/SIGN_OUT',
  };
}
