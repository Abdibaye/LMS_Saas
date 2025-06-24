import { z } from 'zod';

export const courseStatusSchema = z.enum(['draft', 'published', 'archived'], {
  errorMap: () => ({ message: 'Status is required' }), });

export const courseCategorySchema = z.enum(['web-development', 'data-science', 'design', 'marketing', 'business'], {
  errorMap: () => ({ message: 'Category is required' }),
});

export const courseLevelSchema = z.enum(['beginner', 'intermediate', 'advanced'], {
  errorMap: () => ({ message: 'Level is required' }),
});

export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: courseCategorySchema,
  smalldescription: z.string().min(1, 'Small description is required').max(200, 'Small description must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters'),
  fileKey: z.string().min(1, 'File key is required'),
  level:courseLevelSchema,
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  duration: z.coerce.string().min(1, 'Duration is required').max(500, 'Duration must be less than 500 characters'),
  status: courseStatusSchema,
});

export type CourseSchemaType = z.infer<typeof courseSchema>;