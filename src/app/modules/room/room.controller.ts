import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RoomService } from './room.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const result = await RoomService.insertIntoDB(data);

  sendResponse(res, {
    success: true,
    message: 'Room created successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const RoomController = {
  insertIntoDB,
};
