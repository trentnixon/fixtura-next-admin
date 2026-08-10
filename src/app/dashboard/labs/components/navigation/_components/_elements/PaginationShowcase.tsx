"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { NAVIGATION_TOKENS } from "./navigationTokens";

const TOTAL_PAGES = 10;

/**
 * Pagination showcase — brand variants, basic, compact, and info patterns
 */
export default function PaginationShowcase() {
  const [primaryPage, setPrimaryPage] = useState(1);
  const [secondaryPage, setSecondaryPage] = useState(1);
  const [accentPage, setAccentPage] = useState(1);
  const [basicPage, setBasicPage] = useState(1);
  const [compactPage, setCompactPage] = useState(1);
  const [infoPage, setInfoPage] = useState(1);

  return (
    <SectionContainer
      title="Pagination"
      description="Page navigation controls for paginated content"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand Variants</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              primary · secondary · accent
            </span>
          </div>
          <div className="space-y-4">
            <Pagination
              variant="primary"
              currentPage={primaryPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setPrimaryPage}
            >
              <div className="flex items-center gap-2">
                <PaginationPrevious />
                <PaginationPages />
                <PaginationNext />
              </div>
            </Pagination>

            <Pagination
              variant="secondary"
              currentPage={secondaryPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setSecondaryPage}
            >
              <div className="flex items-center gap-2">
                <PaginationPrevious />
                <PaginationPages />
                <PaginationNext />
              </div>
            </Pagination>

            <Pagination
              variant="accent"
              currentPage={accentPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setAccentPage}
            >
              <div className="flex items-center gap-2">
                <PaginationPrevious />
                <PaginationPages />
                <PaginationNext />
              </div>
            </Pagination>
          </div>
          <ComponentRef token={NAVIGATION_TOKENS.pagination.variants} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              Previous · Pages · Next
            </span>
          </div>
          <Pagination
            currentPage={basicPage}
            totalPages={TOTAL_PAGES}
            onPageChange={setBasicPage}
          >
            <div className="flex items-center gap-2">
              <PaginationPrevious />
              <PaginationPages />
              <PaginationNext />
            </div>
          </Pagination>
          <ComponentRef token={NAVIGATION_TOKENS.pagination.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Compact</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              icon-only · PaginationInfo
            </span>
          </div>
          <Pagination
            variant="primary"
            currentPage={compactPage}
            totalPages={TOTAL_PAGES}
            onPageChange={setCompactPage}
          >
            <div className="flex items-center gap-2">
              <PaginationPrevious showLabel={false} />
              <PaginationInfo />
              <PaginationNext showLabel={false} />
            </div>
          </Pagination>
          <ComponentRef token={NAVIGATION_TOKENS.pagination.compact} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Result Info</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              count label · prev/next
            </span>
          </div>
          <div className="flex items-center justify-between max-w-md">
            <div className="text-sm text-muted-foreground">
              Showing 1-10 of 100 results
            </div>
            <Pagination
              variant="secondary"
              currentPage={infoPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setInfoPage}
            >
              <div className="flex items-center gap-2">
                <PaginationPrevious />
                <span className="text-sm font-medium">
                  Page {infoPage} of {TOTAL_PAGES}
                </span>
                <PaginationNext />
              </div>
            </Pagination>
          </div>
          <ComponentRef token={NAVIGATION_TOKENS.pagination.withInfo} />
        </div>
      </div>
    </SectionContainer>
  );
}
