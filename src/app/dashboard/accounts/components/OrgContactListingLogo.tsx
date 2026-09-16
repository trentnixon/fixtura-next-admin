"use client";

import SafeImage from "@/components/ui-library/media/SafeImage";
import { isUsableImageSrc } from "@/lib/utils/imageSrc";
import { ImageIcon } from "lucide-react";

type OrgContactListingLogoProps = {
  logoUrl: string | null | undefined;
  orgName: string | null;
};

export function OrgContactListingLogo({
  logoUrl,
  orgName,
}: OrgContactListingLogoProps) {
  if (!isUsableImageSrc(logoUrl)) {
    return (
      <div className="flex items-center justify-center">
        <ImageIcon className="h-5 w-5 text-muted-foreground" aria-hidden />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <SafeImage
        src={logoUrl}
        alt={`${orgName ?? "Organisation"} logo`}
        width={40}
        height={40}
        className="rounded object-contain"
        style={{
          maxWidth: "40px",
          maxHeight: "40px",
        }}
      />
    </div>
  );
}
