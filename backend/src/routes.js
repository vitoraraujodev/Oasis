import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import CompanyController from './app/controllers/CompanyController';
import SessionController from './app/controllers/SessionController';

import AddressController from './app/controllers/GeneralInfo/AddressController';
import RepresentativeController from './app/controllers/GeneralInfo/RepresentativeController';
import OperatingInfoController from './app/controllers/GeneralInfo/OperatingInfoController';
import HistoryController from './app/controllers/GeneralInfo/HistoryController';
import GeneralInfoController from './app/controllers/GeneralInfo/GeneralInfoController';

import ContactInfoController from './app/controllers/FollowUp/ContactInfoController';
import ContactManagerController from './app/controllers/FollowUp/ContactManagerController';
import TechnicalManagerController from './app/controllers/FollowUp/TechnicalManagerController';
import FollowUpController from './app/controllers/FollowUp/FollowUpController';

import EmployeeController from './app/controllers/SpecificInfo/EmployeeController';
import SpecificController from './app/controllers/SpecificInfo/SpecificController';
import GeneralAreaController from './app/controllers/SpecificInfo/GeneralAreaController';
import SpecificAreaController from './app/controllers/SpecificInfo/SpecificAreaController';
import FileController from './app/controllers/SpecificInfo/FileController';
import SpecificInfoController from './app/controllers/SpecificInfo/SpecificInfoController';

import SupplyController from './app/controllers/ProductiveProcess/SupplyController';
import ProductController from './app/controllers/ProductiveProcess/ProductController';
import EquipmentController from './app/controllers/ProductiveProcess/EquipmentController';
import ProductiveProcessController from './app/controllers/ProductiveProcess/ProductiveProcess';

import ResidueInfoController from './app/controllers/EnvironAspect/ResidueInfoController';
import ResidueController from './app/controllers/EnvironAspect/ResidueController';
import WaterSupplyController from './app/controllers/EnvironAspect/WaterSupplyController';
import OilyController from './app/controllers/EnvironAspect/OilyController';
import SanitaryController from './app/controllers/EnvironAspect/SanitaryController';
import IndustrialController from './app/controllers/EnvironAspect/IndustrialController';
import EffluentController from './app/controllers/EnvironAspect/EffluentController';
import EnvironAspectController from './app/controllers/EnvironAspect/EnvironAspectController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.post(
  '/file',
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
routes.post('/specific', authMiddleware, SpecificController.store);
routes.post('/general-area', authMiddleware, GeneralAreaController.store);
routes.post('/specific-area', authMiddleware, SpecificAreaController.store);
routes.delete(
  '/specific-area/:id',
  authMiddleware,
  SpecificAreaController.delete
);

routes.get('/specific-info', authMiddleware, SpecificInfoController.index);

routes.post('/supply', authMiddleware, SupplyController.store);
routes.delete('/supply/:id', authMiddleware, SupplyController.delete);
routes.post('/product', authMiddleware, ProductController.store);
routes.delete('/product/:id', authMiddleware, ProductController.delete);
routes.post('/equipment', authMiddleware, EquipmentController.store);
routes.delete('/equipment/:id', authMiddleware, EquipmentController.delete);

routes.get(
  '/productive-process',
  authMiddleware,
  ProductiveProcessController.index
);

routes.post('/residue-info', authMiddleware, ResidueInfoController.store);
routes.post('/residue', authMiddleware, ResidueController.store);
routes.delete('/residue/:id', authMiddleware, ResidueController.delete);
routes.post('/water-supply', authMiddleware, WaterSupplyController.store);
routes.delete(
  '/water-supply/:id',
  authMiddleware,
  WaterSupplyController.delete
);
routes.post('/sanitary', authMiddleware, SanitaryController.store);
routes.post('/industrial', authMiddleware, IndustrialController.store);
routes.post('/oily', authMiddleware, OilyController.store);
routes.post('/effluent', authMiddleware, EffluentController.store);
routes.delete('/effluent/:id', authMiddleware, EffluentController.delete);

routes.get('/environ-aspect', authMiddleware, EnvironAspectController.index);

export default routes;
