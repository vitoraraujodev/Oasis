import { combineReducers } from 'redux';

import auth from './auth/reducer';
import company from './company/reducer';

export default combineReducers({ auth, company });
