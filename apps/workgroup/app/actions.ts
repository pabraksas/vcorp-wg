'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// import postgres from "postgres";
// let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, { ssl: "allow", });

// CREATE TABLE workgroup (
//  id SERIAL PRIMARY KEY,
//  name VARCHAR(255) NOT NULL,
//  text TEXT,
//  config JSONB,
//  updated_at TIMESTAMP
// );

export async function createWorkgroup(prevState: { message: string }, formData: FormData) {
  const schema = z.object({ workgroup: z.string().min(1) })
  const parse = schema.safeParse({ workgroup: formData.get('workgroup') })
  if (!parse.success) {
    return { message: 'Failed to create workgroup' }
  }
  // const data = parse.data

  const date = new Date().toISOString().split('T')[0]
  const wg = {
    name: formData.get('name'),
    text: formData.get('text'),
    config: formData.get('config'),
    updated_at: date,
  }

  try {
    await sql`
      INSERT INTO workgroup (name, text, config, updated_at)
      VALUES (${wg.name}, ${wg.text}, ${wg.config}, ${wg.updated_at})
      RETURNING id
    `
    revalidatePath(`/workgroup/${id}`)
    redirect(`/workgroup/${id}`)
    return { message: `Added workgroup ${wg.name}` }
  } catch (e) {
    return { message: 'Failed to create workgroup' }
  }
}

export async function deleteWorkgroup(prevState: { message: string }, formData: FormData) {
  const schema = z.object({
    id: z.string().min(1),
    // name: z.string().min(1),
  })
  const data = schema.parse({
    id: formData.get('id'),
    // name: formData.get('name'),
  })

  try {
    await sql`
      DELETE FROM workgroup
      WHERE id = ${data.id};
    `
    revalidatePath('/')
    //revalidatePath(`/workgroups`)
    redirect(`/workgroups`)
    return { message: `Deleted workgroup ${data.id}` }
  } catch (e) {
    return { message: 'Failed to delete workgroup' }
  }
}
