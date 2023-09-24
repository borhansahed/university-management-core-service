import express from 'express';
import { AcademicDepartmentRoute } from '../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRouter } from '../modules/academicSemester/academicSemester.route';
import { StudentRoute } from '../modules/student/student.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academicSemester',
    route: AcademicSemesterRouter,
  },
  {
    path: '/academicDepartment',
    route: AcademicDepartmentRoute,
  },
  {
    path: '/academicFaculty',
    route: AcademicFacultyRoute,
  },
  {
    path: '/student',
    route: StudentRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
