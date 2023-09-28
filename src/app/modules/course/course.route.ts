import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.post('/', CourseController.insertIntoDB);
router.get('/', CourseController.getAllFromDB);
router.get('/:id', CourseController.getByIdFromDB);
router.patch('/:id', CourseController.updateOneInDB);
router.post('/:id/assign-faculties', CourseController.assignFaculties);
router.delete('/:id/remove-faculties', CourseController.removeFaculties);

export const CourseRouter = router;
