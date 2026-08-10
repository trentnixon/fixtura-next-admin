"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import StyledLink from "@/components/ui-library/foundation/Link";
import ComponentRef from "./ComponentRef";
import { TYPE_TOKENS } from "./typeTokens";

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
      <div className="space-y-8">
        <div>
          <SubsectionTitle>Link Variants</SubsectionTitle>
          <div className="mt-4 space-y-6">
            <div>
              <StyledLink href="/dashboard/labs/components">
                Default Link
              </StyledLink>
              <ComponentRef token={TYPE_TOKENS.link.default} />
            </div>
            <div>
              <StyledLink href="/dashboard/labs/components" variant="muted">
                Muted Link
              </StyledLink>
              <ComponentRef token={TYPE_TOKENS.link.muted} />
            </div>
            <div>
              <StyledLink
                href="/dashboard/labs/components"
                variant="destructive"
              >
                Destructive Link
              </StyledLink>
              <ComponentRef token={TYPE_TOKENS.link.destructive} />
            </div>
          </div>
        </div>

        <div>
          <SubsectionTitle>Link Sizes</SubsectionTitle>
          <div className="mt-4 space-y-6">
            <div>
              <StyledLink href="/dashboard/labs/components" size="default">
                Default Link
              </StyledLink>
              <ComponentRef token={TYPE_TOKENS.link.default} />
            </div>
            <div>
              <StyledLink href="/dashboard/labs/components" size="small">
                Small Link
              </StyledLink>
              <ComponentRef token={TYPE_TOKENS.link.sizeSmall} />
            </div>
            <div>
              <StyledLink href="/dashboard/labs/components" size="large">
                Large Link
              </StyledLink>
              <ComponentRef token={TYPE_TOKENS.link.sizeLarge} />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
