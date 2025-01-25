"use client";

import GenericErrorPage from "@/app/components/GenericErrorPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <GenericErrorPage error={error} reset={reset} />;
}
