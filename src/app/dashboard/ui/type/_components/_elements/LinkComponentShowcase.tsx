"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import StyledLink from "@/components/ui-library/foundation/Link";

/**
 * Link Component Showcase
 *
 * Displays examples of Link component variants and sizes
 */
export default function LinkComponentShowcase() {
  return (
    <SectionContainer
      title="Link Component"
      description="Styled links for navigation"
    >
      <div className="space-y-4">
        <div>
          <SubsectionTitle>Link Variants</SubsectionTitle>
          <div className="flex flex-wrap gap-4 mt-2">
            <StyledLink href="/dashboard/ui">Default Link</StyledLink>
            <StyledLink href="/dashboard/ui" variant="muted">
              Muted Link
            </StyledLink>
            <StyledLink href="/dashboard/ui" variant="destructive">
              Destructive Link
            </StyledLink>
          </div>
        </div>

        <div>
          <SubsectionTitle>Link Sizes</SubsectionTitle>
          <div className="flex flex-wrap gap-4 mt-2">
            <StyledLink href="/dashboard/ui" size="small">
              Small Link
            </StyledLink>
            <StyledLink href="/dashboard/ui" size="default">
              Default Link
            </StyledLink>
            <StyledLink href="/dashboard/ui" size="large">
              Large Link
            </StyledLink>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
