import express from 'express';
import { AcademicSemesterRouter } from '../modules/academicSemester/academicSemester.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academicSemester',
    route: AcademicSemesterRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
