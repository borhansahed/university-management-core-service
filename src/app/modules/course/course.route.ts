import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.post('/', CourseController.insertIntoDB);
router.get('/', CourseController.getAllFromDB);
router.patch('/:id', CourseController.updateOneInDB);

export const CourseRouter = router;
