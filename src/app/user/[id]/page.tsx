export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>{params.id}</h1>
    </main>
  );
}
