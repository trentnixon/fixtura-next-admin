"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";
import CodeExample from "./CodeExample";

/**
 * Pagination Showcase
 *
 * Displays Pagination component examples
 */
export default function PaginationShowcase() {
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage4, setCurrentPage4] = useState(1);
  const [currentPage5, setCurrentPage5] = useState(1);
  const totalPages = 10;

  return (
    <SectionContainer
      title="Pagination"
      description="Page navigation controls for paginated content"
    >
      <div className="space-y-6">
        <ElementContainer title="Brand Color Variants">
          <div className="space-y-4">
            <Pagination
              variant="primary"
              currentPage={currentPage1}
              totalPages={totalPages}
              onPageChange={setCurrentPage1}
            >
              <div className="flex items-center gap-2">
                <PaginationPrevious />
                <PaginationPages />
                <PaginationNext />
              </div>
            </Pagination>

            <Pagination
              variant="secondary"
              currentPage={currentPage2}
              totalPages={totalPages}
              onPageChange={setCurrentPage2}
            >
              <div className="flex items-center gap-2">
                <PaginationPrevious />
                <PaginationPages />
                <PaginationNext />
              </div>
            </Pagination>

            <Pagination
              variant="accent"
              currentPage={currentPage3}
              totalPages={totalPages}
              onPageChange={setCurrentPage3}
            >
              <div className="flex items-center gap-2">
                <PaginationPrevious />
                <PaginationPages />
                <PaginationNext />
              </div>
            </Pagination>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Pagination, PaginationPrevious, PaginationNext, PaginationPages } from "@/components/ui/pagination";

const [currentPage, setCurrentPage] = useState(1);
const totalPages = 10;

<Pagination variant="primary" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
  <div className="flex items-center gap-2">
    <PaginationPrevious />
    <PaginationPages />
    <PaginationNext />
  </div>
</Pagination>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Basic Pagination">
          <Pagination
            currentPage={currentPage4}
            totalPages={totalPages}
            onPageChange={setCurrentPage4}
          >
            <div className="flex items-center gap-2">
              <PaginationPrevious />
              <PaginationPages />
              <PaginationNext />
            </div>
          </Pagination>
          <div className="mt-6">
            <CodeExample
              code={`import { Pagination, PaginationPrevious, PaginationNext, PaginationPages } from "@/components/ui/pagination";

const [currentPage, setCurrentPage] = useState(1);
const totalPages = 10;

<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
  <div className="flex items-center gap-2">
    <PaginationPrevious />
    <PaginationPages />
    <PaginationNext />
  </div>
</Pagination>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Compact Pagination">
          <Pagination
            variant="primary"
            currentPage={currentPage5}
            totalPages={totalPages}
            onPageChange={setCurrentPage5}
          >
            <div className="flex items-center gap-2">
              <PaginationPrevious showLabel={false} />
              <PaginationInfo />
              <PaginationNext showLabel={false} />
            </div>
          </Pagination>
          <div className="mt-6">
            <CodeExample
              code={`import { Pagination, PaginationPrevious, PaginationNext, PaginationInfo } from "@/components/ui/pagination";

const [currentPage, setCurrentPage] = useState(1);
const totalPages = 10;

<Pagination variant="primary" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
  <div className="flex items-center gap-2">
    <PaginationPrevious showLabel={false} />
    <PaginationInfo />
    <PaginationNext showLabel={false} />
  </div>
</Pagination>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Pagination with Info">
          <div className="flex items-center justify-between max-w-md">
            <div className="text-sm text-muted-foreground">
              Showing 1-10 of 100 results
            </div>
            <Pagination
              variant="secondary"
              currentPage={currentPage5}
              totalPages={totalPages}
              onPageChange={setCurrentPage5}
            >
              <div className="flex items-center gap-2">
                <PaginationPrevious />
                <span className="text-sm font-medium">
                  Page {currentPage5} of {totalPages}
                </span>
                <PaginationNext />
              </div>
            </Pagination>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Pagination, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

const [currentPage, setCurrentPage] = useState(1);
const totalPages = 10;

<div className="flex items-center justify-between">
  <div className="text-sm text-muted-foreground">
    Showing 1-10 of 100 results
  </div>
  <Pagination variant="secondary" currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}>
    <div className="flex items-center gap-2">
      <PaginationPrevious />
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <PaginationNext />
    </div>
  </Pagination>
</div>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
