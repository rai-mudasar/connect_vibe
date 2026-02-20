import Image from "next/image";
import { cn } from "@/lib/utils"; // Shadcn utility for classes

export default function SafeImage({ 
  src, 
  alt, 
  className, 
  priority = false, 
  fill = false,
  width,
  height,
  ...props 
}) {
  // 1. Return null or a placeholder if no src exists
  if (!src) return <div className={cn("bg-gray-200", className)} />;

  return (
    <Image
      src={src}
      alt={alt || "Image"}
      priority={priority}
      fill={fill}
      // 2. If not using 'fill', Next.js needs these, 
      // but we add style to prevent aspect ratio distortion
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      style={!fill ? { width: "100%", height: "auto" } : { objectFit: "cover" }}
      className={cn("transition-opacity duration-300", className)}
      // 3. Optional: Cloudinary optimization sizes
      sizes={fill ? "(max-width: 768px) 100vw, 50vw" : undefined}
      {...props}
    />
  );
}