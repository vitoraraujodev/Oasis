import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import CompanyController from './app/controllers/CompanyController';
import SessionController from './app/controllers/SessionController';

import AddressController from './app/controllers/AddressController';
import RepresentativeController from './app/controllers/RepresentativeController';
import OperatingInfoController from './app/controllers/OperatingInfoController';
import HistoryController from './app/controllers/HistoryController';
import GeneralInfoController from './app/controllers/GeneralInfoController';

import ContactInfoController from './app/controllers/ContactInfoController';
import ContactManagerController from './app/controllers/ContactManagerController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/company', authMiddleware, CompanyController.index);
routes.post('/company', CompanyController.store);
routes.put('/company', authMiddleware, CompanyController.update);
routes.delete('/company', authMiddleware, CompanyController.delete);

routes.post('/address', authMiddleware, AddressController.store);
routes.post('/representative', authMiddleware, RepresentativeController.store);
routes.post('/operating-info', authMiddleware, OperatingInfoController.store);
routes.post('/history', authMiddleware, HistoryController.store);
routes.delete('/history/:id', authMiddleware, HistoryController.delete);

routes.get('/general-info', authMiddleware, GeneralInfoController.index);

routes.post('/contact-info', authMiddleware, ContactInfoController.store);
routes.post('/contact-manager', authMiddleware, ContactManagerController.store);

export default routes;
