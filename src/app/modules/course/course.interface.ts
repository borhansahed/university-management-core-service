import { Course } from '@prisma/client';

export type ICourse = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: {
    courseId: string;
  }[];
};
export type ICourseCreateResponse =
  | (Course & {
      preRequisite: {
        courseId: string;
        preRequisiteId: string;
      }[];
      preRequisiteFor: {
        courseId: string;
        preRequisiteId: string;
      }[];
    })
  | null;
