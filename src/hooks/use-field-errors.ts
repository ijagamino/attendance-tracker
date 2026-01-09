import { useState } from "react";
import { z, type ZodError } from "zod";

export default function useFieldErrors() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, { message?: string }[]>>({})

  function handleSetFieldErrors(errors: ZodError<Record<string, string>>) {
    const flattened = z.flattenError(errors).fieldErrors

    const formattedErrors = Object.fromEntries(
      Object.entries(flattened).map(([key, messages]) => [
        key,
        (messages ?? []).map(message => ({ message })),
      ])
    )

    setFieldErrors(formattedErrors)
  }

  function emptyFieldErrors() {
    setFieldErrors({})
  }

  return { fieldErrors, handleSetFieldErrors, emptyFieldErrors }
}
