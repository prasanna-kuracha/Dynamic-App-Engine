import { z } from 'zod';

export const FieldSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'date', 'email', 'password']),
  required: z.boolean().default(false),
  default: z.any().optional(),
});

export const ModelSchema = z.object({
  name: z.string(),
  fields: z.array(FieldSchema),
});

export const ViewSchema = z.object({
  id: z.string(),
  type: z.enum(['table', 'form', 'dashboard']),
  model: z.string(),
  title: z.string(),
  columns: z.array(z.string()).optional(),
  fields: z.array(z.string()).optional(),
});

export const NavigationSchema = z.object({
  label: z.string(),
  path: z.string(),
  icon: z.string().optional(),
});

export const AuthSchema = z.object({
  enabled: z.boolean().default(true),
  methods: z.array(z.enum(['email', 'google', 'github'])).default(['email']),
  allowRegistration: z.boolean().default(true),
});

export const AppConfigSchema = z.object({
  appName: z.string(),
  auth: AuthSchema.optional(),
  models: z.array(ModelSchema),
  views: z.array(ViewSchema),
  navigation: z.array(NavigationSchema),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
export type ModelDef = z.infer<typeof ModelSchema>;
export type ViewDef = z.infer<typeof ViewSchema>;
export type FieldDef = z.infer<typeof FieldSchema>;
