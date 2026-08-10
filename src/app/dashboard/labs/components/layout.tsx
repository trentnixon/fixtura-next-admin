import UILibraryLayout from "./_components/Navigation";

export default function UILibraryLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UILibraryLayout>{children}</UILibraryLayout>;
}

