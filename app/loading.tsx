export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      <p className="text-sm text-foreground/70">Loading your workspace...</p>
    </main>
  );
}
