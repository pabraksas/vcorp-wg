import postgres from "postgres";

import { AddForm } from "@/app/add-form";
import { DeleteForm } from "@/app/delete-form";

let sql = postgres(process.env.DATABASE_URL || process.env.POSTGRES_URL!, {
  ssl: "allow",
});

export default async function Home() {
  let workgroup = await sql`SELECT * FROM workgroup`;

  return (
    <main>
      <h1 className="sr-only">Workgroups</h1>
      <AddForm />
      <ul>
        {workgroup.map((workgroup) => (
          <li key={workgroup.id}>
            {workgroup.text}
            <DeleteForm id={workgroup.id} todo={workgroup.text} />
          </li>
        ))}
      </ul>
    </main>
  );
}
