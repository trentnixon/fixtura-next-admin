import type { ReactNode } from "react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

interface RendersWorkspaceShellProps {
  title: string;
  byLine: string;
  byLineBottom?: string;
  headerActions?: ReactNode;
  children: ReactNode;
}

export function RendersWorkspaceShell({
  title,
  byLine,
  byLineBottom,
  headerActions,
  children,
}: RendersWorkspaceShellProps) {
  return (
    <>
      <CreatePageTitle title={title} byLine={byLine} byLineBottom={byLineBottom}>
        {headerActions}
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        {children}
      </PageContainer>
    </>
  );
}
