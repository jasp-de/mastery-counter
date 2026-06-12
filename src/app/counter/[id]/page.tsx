import { CounterDetail } from "@/components/counter-detail";

interface CounterPageProps {
  params: Promise<{ id: string }>;
}

export default async function CounterPage({ params }: CounterPageProps) {
  const { id } = await params;
  return <CounterDetail counterId={id} />;
}
