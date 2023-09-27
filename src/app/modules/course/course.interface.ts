import { Course } from '@prisma/client';

export type ICourse = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: {
    courseId: string;
    isDeleted: boolean;
  }[];
};
export type ICourseCreateResponse =
  | (Course & {
      preRequisite?: {
        courseId: string;
        preRequisiteId: string;
      }[];
      preRequisiteFor?: {
        courseId: string;
        preRequisiteId: string;
      }[];
    })
  | null;

export type IPrequisite = {
  courseId: string;
  prerequisiteId: string;
};
export type ICourseFilterRequest = {
  searchTerm?: string | undefined;
};
