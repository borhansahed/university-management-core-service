import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
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

export const BuildingController = {
  insertIntoDB,
};
