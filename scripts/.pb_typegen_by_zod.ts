// scripts/pb_typegen_by_zod.ts
import { writeFile } from "fs/promises";
import path from 'path';
import PocketBase from "pocketbase";

const pbUrl = process.env.VITE_PB_URL;
const pbAdminEmail = process.env.PB_ADMIN_EMAIL;
const pbAdminPassword = process.env.PB_ADMIN_PASSWORD;

if (!pbUrl || !pbAdminEmail || !pbAdminPassword) {
  throw new Error("Missing PocketBase env vars");
}

const PB = new PocketBase(pbUrl);

type CollectionWithSample = {
  name: string;
  record: any | null;
};

/* ------------------ FETCH ------------------ */

async function fetchCollectionsWithSample(): Promise<CollectionWithSample[]> {
  await PB.admins.authWithPassword(pbAdminEmail as string, pbAdminPassword as string);

  const collections = await PB.collections.getFullList();
  const result: CollectionWithSample[] = [];

  for (const c of collections) {
    try {
      const records = await PB.collection(c.name).getFullList({ perPage: 1 });
      const record = records[0];

      if (!record) {
        result.push({ name: c.name, record: null });
        continue;
      }
      const relationFields = Object.entries(record)
        .filter(([_, v]) => typeof v === "string" || Array.isArray(v))
        .map(([k, _]) => k);
        
      // Fetch expanded relations
      const recordsWithExpand = await PB.collection(c.name).getOne(record.id, {
        expand: relationFields.join(","),
      });
      if (recordsWithExpand) {
        result.push({
          name: c.name,
          record: recordsWithExpand ?? null,
        });
      }
    } catch {
      result.push({ name: c.name, record: null });
    }
  }

  return result;
}

/* ------------------ TYPE INFERENCE ------------------ */

function inferPrimitiveZod(value: any): string {
  if (typeof value === "string") return "z.string()";
  if (typeof value === "number") return "z.number()";
  if (typeof value === "boolean") return "z.boolean()";
  if (Array.isArray(value)) return "z.array(z.any())"; // fallback
  if (typeof value === "object" && value !== null)
    return "z.object({}).passthrough()";
  return "z.any()";
}

/* ------------------ GENERATOR ------------------ */

async function generate() {
  const collections = await fetchCollectionsWithSample();

  const baseSchemas: string[] = [];
  const expandSchemas: string[] = [];

  for (const c of collections) {
    if (!c.record) {
      baseSchemas.push(`// Skipped ${c.name} (no records)\n`);
      continue;
    }

    const baseFields: string[] = [];
    const expandFields: string[] = [];

    const record = c.record;
    const expand = record.expand ?? {};

    for (const [key, value] of Object.entries(record)) {
      if (key === "expand") continue;

      /* -------- relation multiple (array of ids) -------- */
      if (Array.isArray(value) && value.every(v => typeof v === "string")) {
        baseFields.push(`  ${key}: z.array(z.string()),`);

        const expanded = expand[key];
        if (Array.isArray(expanded) && expanded.length > 0) {
          const target = expanded[0]?.collectionName;
          if (target) {
            expandFields.push(
              `  ${key}: z.array(z.lazy(() => ${target}Schema)).optional(),`
            );
          }
        }
        continue;
      }

      /* -------- relation simple (id) -------- */
      if (typeof value === "string" && expand[key]) {
        baseFields.push(`  ${key}: z.string(),`);

        const target = expand[key]?.collectionName;
        if (target) {
          expandFields.push(
            `  ${key}: z.lazy(() => ${target}Schema).optional(),`
          );
        }
        continue;
      }

      /* -------- normal field -------- */
      baseFields.push(`  ${key}: ${inferPrimitiveZod(value)},`);
    }

    baseSchemas.push(`
export const ${c.name}Schema = z.object({
${baseFields.join("\n")}
});
`);

    if (expandFields.length) {
      expandSchemas.push(`
export const ${c.name}ExpandSchema = z.object({
${expandFields.join("\n")}
});

export const ${c.name}WithExpandSchema = ${c.name}Schema.extend({
  expand: ${c.name}ExpandSchema.optional(),
});
`);
    }
  }

  const content = `
import { z } from "zod";

// AUTO-GENERATED FILE – DO NOT EDIT

${baseSchemas.join("\n")}
${expandSchemas.join("\n")}
`;
const Root= process.cwd();
const OutputDir = 'src/PB';
const outPath = path.join(Root, OutputDir, "pb-zod.ts");
  await writeFile(outPath, content.trim());
  console.log("✅ pb-zod.ts generated");
}

generate();
