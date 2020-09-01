import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import CompanyController from './app/controllers/CompanyController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/company', authMiddleware, CompanyController.index);
routes.post('/company', CompanyController.store);
routes.put('/company', authMiddleware, CompanyController.update);
routes.delete('/company', authMiddleware, CompanyController.delete);

export default routes;
