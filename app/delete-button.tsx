"use client";

import { TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type DeleteButtonProps = { workEntryId: string };

export function DeleteButton({ workEntryId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isMutating, setIsMutating] = useState(false);
  const isBusy = isPending || isMutating;
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        setIsMutating(true);
        await fetch(`/api/entries/${workEntryId}`, { method: "DELETE" });
        setIsMutating(false);

        startTransition(() => {
          router.refresh();
        });
      }}
      disabled={isBusy}
      className="hidden self-end group-hover:block text-slate-700 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
}
