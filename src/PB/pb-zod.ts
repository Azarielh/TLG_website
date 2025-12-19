import { z } from "zod";

// AUTO-GENERATED FILE – DO NOT EDIT

// Skipped _mfas (no records)

// Skipped _otps (no records)


export const _externalAuthsSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  collectionRef: z.string(),
  created: z.string(),
  id: z.string(),
  provider: z.string(),
  providerId: z.string(),
  recordRef: z.string(),
  updated: z.string(),
});


export const _authOriginsSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  collectionRef: z.string(),
  created: z.string(),
  fingerprint: z.string(),
  id: z.string(),
  recordRef: z.string(),
  updated: z.string(),
});


export const _superusersSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  email: z.string(),
  emailVisibility: z.boolean(),
  id: z.string(),
  updated: z.string(),
  verified: z.boolean(),
});


export const usersSchema = z.object({
  avatar: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  email: z.string(),
  emailVisibility: z.boolean(),
  id: z.string(),
  name: z.string(),
  rank_bis: z.array(z.string()),
  role: z.string(),
  staffword: z.string(),
  updated: z.string(),
  verified: z.boolean(),
});


export const NewsSchema = z.object({
  Parution_Date: z.string(),
  author: z.string(),
  collectionId: z.string(),
  collectionName: z.string(),
  content: z.string(),
  created: z.string(),
  do_publish: z.boolean(),
  event_date: z.string(),
  headlines: z.string(),
  id: z.string(),
  image: z.string(),
  image_url: z.string(),
  tags: z.array(z.string()),
  title: z.string(),
  updated: z.string(),
  video_url: z.string(),
});


export const TagsSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  id: z.string(),
  name: z.string(),
  picture: z.string(),
});


export const RoleSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  description: z.string(),
  id: z.string(),
  list: z.string(),
  name: z.string(),
  updated: z.string(),
});


export const recrutementSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  id: z.string(),
  name: z.string(),
  updated: z.string(),
});


export const GamesSchema = z.object({
  collectionId: z.string(),
  collectionName: z.string(),
  created: z.string(),
  how_many_roster: z.number(),
  id: z.string(),
  name: z.string(),
  status: z.string(),
  updated: z.string(),
  winrate: z.string(),
});


export const NewsExpandSchema = z.object({
  tags: z.array(z.lazy(() => TagsSchema)).optional(),
});

export const NewsWithExpandSchema = NewsSchema.extend({
  expand: NewsExpandSchema.optional(),
});


export const recrutementExpandSchema = z.object({
  name: z.lazy(() => RoleSchema).optional(),
});

export const recrutementWithExpandSchema = recrutementSchema.extend({
  expand: recrutementExpandSchema.optional(),
});