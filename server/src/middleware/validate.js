import { ApiError } from '../utils/apiResponse.js';

// Wraps a Zod schema; validates req.body and replaces it with the parsed result.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    throw new ApiError(400, 'Validation failed', errors);
  }
  req.body = result.data;
  next();
};
