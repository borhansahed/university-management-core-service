import { Course, CourseFaculty } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { preRequisite } from '../../../shared/prerequisite';
import prisma from '../../../shared/prisma';
import { courseSearchableFields } from './course.constants';
import {
  ICourse,
  ICourseCreateResponse,
  ICourseFilterRequest,
} from './course.interface';

const insertIntoDB = async (
  data: ICourse
): Promise<ICourseCreateResponse | undefined> => {
  const { preRequisiteCourses, ...courseData } = data;
  const newCourse = await prisma.$transaction(async transactionCourse => {
    const result = await transactionCourse.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'unable to create courses');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      for (let index = 0; index < preRequisiteCourses.length; index++) {
        await transactionCourse.courseToPrerequisite.create({
          data: {
            courseId: result.id,
            preRequisiteId: preRequisiteCourses[index].courseId,
          },
        });
      }
    }

    return result;
  });

  if (newCourse) {
    const result = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },

        faculties: {
          include: {
            faculty: true,
          },
        },
      },
    });
    return result;
  }
};

const getAllFromDB = async (
  filters: ICourseFilterRequest,
  options: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: courseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.course.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
      faculties: {
        include: {
          faculty: true,
        },
      },
    },

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.course.count();
  const resultCount = await prisma.course.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      resultCount,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
      faculties: {
        include: {
          faculty: true,
        },
      },
    },
  });
  return result;
};

const updateOneInDB = async (id: string, payload: ICourse) => {
  const { preRequisiteCourses, ...payloadData } = payload;
  const updatedResult = await prisma.$transaction(async transactionCourse => {
    const result = await transactionCourse.course.update({
      where: {
        id,
      },
      data: payloadData,
    });

    if (preRequisiteCourses.length > 0) {
      const deletedPrerequisiteCourse = preRequisiteCourses.filter(item => {
        return item.isDeleted;
      });
      const createPrerequisiteCourse = preRequisiteCourses.filter(item => {
        return item.isDeleted !== true;
      });

      await preRequisite(deletedPrerequisiteCourse, async obj => {
        await transactionCourse.courseToPrerequisite.deleteMany({
          where: {
            AND: [
              { courseId: id },
              {
                preRequisiteId: obj.courseId,
              },
            ],
          },
        });
      });

      await preRequisite(createPrerequisiteCourse, async course => {
        await transactionCourse.courseToPrerequisite.create({
          data: {
            courseId: id,
            preRequisiteId: course.courseId,
          },
        });
      });
    }
    return result;
  });

  if (updatedResult) {
    const result = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });

    return result;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'unable to update course data');
};

const deleteByIdFromDB = async (id: string): Promise<Course> => {
  await prisma.courseToPrerequisite.deleteMany({
    where: {
      OR: [
        {
          courseId: id,
        },
        {
          preRequisiteId: id,
        },
      ],
    },
  });

  const result = await prisma.course.delete({
    where: {
      id,
    },
  });
  return result;
};

const assignFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(facultyId => ({
      courseId: id,
      facultyId,
    })),
  });

  const result = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });

  return result;
};
const removeFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: payload,
      },
    },
  });

  const result = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });

  return result;
};

export const CourseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  assignFaculties,
  removeFaculties,
};
