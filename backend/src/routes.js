import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import CompanyController from './app/controllers/CompanyController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import AddressController from './app/controllers/AddressController';
import RepresentativeController from './app/controllers/RepresentativeController';
import OperatingInfoController from './app/controllers/OperatingInfoController';
import HistoryController from './app/controllers/HistoryController';
import GeneralInfoController from './app/controllers/GeneralInfoController';

import ContactInfoController from './app/controllers/ContactInfoController';
import ContactManagerController from './app/controllers/ContactManagerController';
import TechnicalManagerController from './app/controllers/TechnicalManagerController';
import FollowUpController from './app/controllers/FollowUpController';

import EmployeeController from './app/controllers/EmployeeController';
import SpecificInfoController from './app/controllers/SpecificInfoController';
import GeneralAreaController from './app/controllers/GeneralAreaController';
import SpecificAreaController from './app/controllers/SpecificAreaController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.post(
  '/files',
  authMiddleware,
  upload.single('file'),
  FileController.store
);
routes.delete('/file/:id', authMiddleware, FileController.delete);

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

routes.post(
  '/technical-manager',
  authMiddleware,
  TechnicalManagerController.store
);

routes.get('/follow-up', authMiddleware, FollowUpController.index);

routes.post('/employee', authMiddleware, EmployeeController.store);
routes.delete('/employee/:id', authMiddleware, EmployeeController.delete);
routes.post('/specific-info', authMiddleware, SpecificInfoController.store);
routes.post('/general-area', authMiddleware, GeneralAreaController.store);
routes.post('/specific-area', authMiddleware, SpecificAreaController.store);
routes.delete(
  '/specific-area/:id',
  authMiddleware,
  SpecificAreaController.delete
);

export default routes;
