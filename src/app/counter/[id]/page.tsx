import { Suspense } from "react";
import { CounterDetail } from "@/components/counter-detail";

interface CounterPageProps {
  params: Promise<{ id: string }>;
}

export default async function CounterPage({ params }: CounterPageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <CounterDetail counterId={id} />
    </Suspense>
  );
}
