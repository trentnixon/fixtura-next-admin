"use client";

import { usePathname } from "next/navigation";
import {
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  Breadcrumb,
} from "@/components/ui/breadcrumb";

const CustomBreadcrumbs = () => {
  // Get the pathname (App Router's equivalent of `router.asPath`)
  const pathname = usePathname();

  // Generate breadcrumb paths
  const pathArray = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathArray.map((path, index) => {
    const href = `/${pathArray.slice(0, index + 1).join("/")}`;
    return (
      <BreadcrumbItem key={index}>
        <BreadcrumbLink href={href}>{path}</BreadcrumbLink>
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumbs;
