"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createWorkgroup } from "@/app/actions";

const initialState = { name: "", text: "", config: "{}", message: "", };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      Create
    </button>
  );
}

export function AddForm() {
  // useActionState is available with React 19 (Next.js App Router)
  const [state, formAction] = useActionState(createWorkgroup, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="name">Workgroup name</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="text">Short description (optional)</label>
      <input type="text" id="text" name="text" />
      <label htmlFor="config">Config (optional)</label>
      <input type="text" id="config" name="config" />
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
