"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createWorkgroup } from "@/app/actions";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  );
}

export function AddForm() {
  // useActionState is available with React 19 (Next.js App Router)
  const [state, formAction] = useActionState(createWorkgroup, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="workgroup">Enter Task</label>
      <input type="text" id="workgroup" name="workgroup" required />
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  );
}
