import prisma from '../config/db.js';
import { success, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const slugify = (name) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: { _count: { select: { services: true } } },
  });
  return success(res, 200, 'Categories fetched', categories);
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!category) throw new ApiError(404, 'Category not found');
  return success(res, 200, 'Category fetched', category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, iconUrl } = req.body;
  const category = await prisma.category.create({
    data: { name, description, iconUrl, slug: slugify(name) },
  });
  return success(res, 201, 'Category created', category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);
  const category = await prisma.category.update({ where: { id: req.params.id }, data });
  return success(res, 200, 'Category updated', category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await prisma.category.update({ where: { id: req.params.id }, data: { isActive: false } });
  return success(res, 200, 'Category deactivated');
});
