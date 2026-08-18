import { initials } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Avatar({
  name,
  src,
  size = "md",
}: {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-11 w-11 text-sm", lg: "h-16 w-16 text-lg" };
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name ?? ""} className={cn("rounded-full object-cover", sizes[size])} />
    );
  }
  return (
    <div className={cn("grid place-items-center rounded-full bg-forest text-cream", sizes[size])}>
      {initials(name)}
    </div>
  );
}
