import { Router } from 'express';

import CompanyController from './app/controllers/CompanyController';

const routes = new Router();

routes.post('/company', CompanyController.store);

export default routes;
