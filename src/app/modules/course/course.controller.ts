import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourseService } from './course.service';

const insertIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const result = await CourseService.insertIntoDB(data);

  sendResponse(res, {
    success: true,
    message: 'Course created successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const CourseController = {
  insertIntoDB,
};
