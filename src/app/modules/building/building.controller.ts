import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { buildingFilterableFields } from './building.constants';
import { BuildingService } from './building.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const result = await BuildingService.insertIntoDB(data);

  sendResponse(res, {
    message: 'Building Successfully created',
    success: true,
    statusCode: httpStatus.OK,
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filter = pick(req.query, buildingFilterableFields);
  const pagination = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await BuildingService.getAllFromDB(filter, pagination);

  sendResponse(res, {
    message: 'fetch data Successfully',
    success: true,
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const BuildingController = {
  insertIntoDB,
  getAllFromDB,
};
