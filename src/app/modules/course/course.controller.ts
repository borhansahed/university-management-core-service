import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { courseFilterableFields } from './course.constants';
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
const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  console.log(req.query);
  const filters = pick(req.query, courseFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await CourseService.getAllFromDB(filters, options);

  sendResponse(res, {
    success: true,
    message: 'Fetched course data successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

const updateOneInDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

export const CourseController = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
};
