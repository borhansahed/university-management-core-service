import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.get('/', StudentController.getAllFromDB);

router.get('/:id', StudentController.getByIdFromDB);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(StudentValidation.create),
  StudentController.insertIntoDB
);
router.patch(
  '/:id',
  validateRequest(StudentValidation.update),
  StudentController.updateIntoDb
);
router.delete('/:id', StudentController.deleteIntoDb);

export const StudentRoute = router;
