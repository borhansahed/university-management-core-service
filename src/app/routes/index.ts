import express from 'express';
import { AcademicDepartmentRoute } from '../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRouter } from '../modules/academicSemester/academicSemester.route';
import { BuildingRoute } from '../modules/building/building.route';
import { CourseRouter } from '../modules/course/course.route';
import { FacultyRoute } from '../modules/faculty/faculty.route';
import { RoomRouter } from '../modules/room/room.route';
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
  {
    path: '/faculty',
    route: FacultyRoute,
  },
  {
    path: '/buildings',
    route: BuildingRoute,
  },
  {
    path: '/rooms',
    route: RoomRouter,
  },
  {
    path: '/courses',
    route: CourseRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
