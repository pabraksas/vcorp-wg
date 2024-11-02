"use server";

import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { z } from "zod";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

// CREATE TABLE workgroups (
//   id SERIAL PRIMARY KEY,
//   text TEXT NOT NULL
// );

export async function createWorkgroup(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    workgroup: z.string().min(1),
  });
  const parse = schema.safeParse({
    workgroup: formData.get("workgroup"),
  });

  if (!parse.success) {
    return { message: "Failed to create workgroup" };
  }

  const data = parse.data;

  try {
    await sql`
      INSERT INTO workgroups (text)
      VALUES (${data.workgroup})
    `;

    revalidatePath("/");
    return { message: `Added workgroup ${data.workgroup}` };
  } catch (e) {
    return { message: "Failed to create workgroup" };
  }
}

export async function deleteWorkgroup(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    id: z.string().min(1),
    workgroup: z.string().min(1),
  });
  const data = schema.parse({
    id: formData.get("id"),
    workgroup: formData.get("workgroup"),
  });

  try {
    await sql`
      DELETE FROM workgroups
      WHERE id = ${data.id};
    `;

    revalidatePath("/");
    return { message: `Deleted workgroup ${data.workgroup}` };
  } catch (e) {
    return { message: "Failed to delete workgroup" };
  }
}
