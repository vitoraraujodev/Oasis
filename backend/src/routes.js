import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import CompanyController from './app/controllers/CompanyController';
import SessionController from './app/controllers/SessionController';
import AddressController from './app/controllers/AddressController';
import RepresentativeController from './app/controllers/RepresentativeController';
import OperatingInfoController from './app/controllers/OperatingInfoController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/company', authMiddleware, CompanyController.index);
routes.post('/company', CompanyController.store);
routes.put('/company', authMiddleware, CompanyController.update);
routes.delete('/company', authMiddleware, CompanyController.delete);

routes.get('/address', authMiddleware, AddressController.index);
routes.post('/address', authMiddleware, AddressController.store);
routes.put('/address', authMiddleware, AddressController.update);

routes.post('/representative', authMiddleware, RepresentativeController.store);
routes.put('/representative', authMiddleware, RepresentativeController.update);

routes.post('/operating-info', authMiddleware, OperatingInfoController.store);
routes.put('/operating-info', authMiddleware, OperatingInfoController.update);

export default routes;
