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
      preRequisite?: IPrequisite[];
      preRequisiteFor?: IPrequisite[];
    })
  | null;

export type IPrequisite = {
  courseId: string;
  preRequisiteId: string;
};
export type ICourseFilterRequest = {
  searchTerm?: string | undefined;
};
