import { Router } from 'express';

import CompanyController from './app/controllers/CompanyController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/company', CompanyController.store);
routes.post('/sessions', SessionController.store);

export default routes;
