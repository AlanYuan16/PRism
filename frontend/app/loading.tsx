export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1B1B1B] px-4 py-8 text-white">
      <div className="space-y-4 rounded-[28px] border border-white/10 bg-[#242424] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-[#582688]/40" />
        <p className="text-lg font-semibold">Loading PRism dashboard...</p>
        <p className="max-w-md text-sm text-[#A0A0A0]">Fetching the latest review data and issue summaries from your API.</p>
      </div>
    </div>
  );
}
