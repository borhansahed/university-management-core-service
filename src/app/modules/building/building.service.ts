import { Building } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { buildingSearchableFields } from './building.constants';
import { IBuildingFilterRequest } from './building.interface';

const insertIntoDB = async (data: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data,
  });

  return result;
};

const getAllFromDB = async (
  filter: IBuildingFilterRequest,
  pagination: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { searchTerm } = filter;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: buildingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereCondition = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.building.findMany({
    skip,
    take: limit,

    where: whereCondition,

    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.building.count({
    where: {},
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const BuildingService = {
  insertIntoDB,
  getAllFromDB,
};
