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
  smallDescription: z.string().min(1, 'Small description is required').max(200, 'Small description must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters'),
  fileKey: z.string().min(1, 'Thumbnail image is required'),
  level: courseLevelSchema,
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 hour').max(500, 'Duration must be less than 500 hours'),
  status: courseStatusSchema,
});

export const chapterSchema = z.object({
  name: z.string().min(3, {message:"Name must be atleast 3 characters long"}),
  courseId: z.string().uuid({message: "Invalid course id"})
})

export const lessonSchema = z.object({
  name: z.string().min(3, {message:"Name must be atleast 3 characters long"}),
  chapterId: z.string().uuid({message: "Invalid chapter id"}),
  courseId: z.string().uuid({message: "Invalid corrse id"}),
  description: z.string().min(3, {message:"Name must be atleast 3 characters long"}).optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
})


export type CourseSchemaType = z.infer<typeof courseSchema>;
export type chapterSchemaType = z.infer<typeof chapterSchema>;
export type lessonSchemaType = z.infer<typeof lessonSchema>;