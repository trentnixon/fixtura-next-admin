"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isUsableImageSrc } from "@/lib/utils/imageSrc";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackClassName?: string;
};

export default function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  width,
  height,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!isUsableImageSrc(src) || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-slate-50 text-muted-foreground",
          className,
          fallbackClassName,
        )}
        style={{
          width: typeof width === "number" ? width : undefined,
          height: typeof height === "number" ? height : undefined,
        }}
        aria-hidden={!alt}
      >
        <ImageIcon className="h-5 w-5 shrink-0 opacity-60" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
      unoptimized
      {...props}
    />
  );
}
