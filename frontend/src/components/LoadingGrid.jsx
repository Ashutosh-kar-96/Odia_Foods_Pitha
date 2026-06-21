export default function LoadingGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-80 rounded-lg bg-gradient-to-r from-haldi/10 via-white to-haldi/10 bg-[length:700px_100%] animate-shimmer" />
      ))}
    </div>
  );
}
