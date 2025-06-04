export default function SkeletonColumn() {
  return (
    <div className="bg-muted w-[300px] shrink-0 animate-pulse space-y-4 rounded-md p-4">
      <div className="bg-muted-foreground/40 h-6 w-2/3 rounded" />
      <div className="bg-muted-foreground/20 h-4 w-full rounded" />
      <div className="bg-muted-foreground/20 h-4 w-5/6 rounded" />
      <div className="bg-muted-foreground/20 h-4 w-4/5 rounded" />
    </div>
  );
}
