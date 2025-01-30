"use client";

import { createContext, useContext, ReactNode } from "react";

interface GlobalContextType {
  Domain: {
    strapi: string;
    contentHub: string;
    admin: string;
  };
  strapiLocation: {
    render: string;
    account: string;
    scheduler: string;
    download: string;
    competition: string;
    grade: string;
    team: string;
  };
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // ENV locations
  const Domain = {
    strapi:
      process.env.NODE_ENV === "development"
        ? "http://localhost:1337"
        : "https://fixtura-backend.herokuapp.com",
    contentHub:
      process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "https://contentv2.fixtura.com.au",
    admin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://admin.fixtura.com.au",
  };

  const strapiLocation = {
    render: `${Domain.strapi}/admin/content-manager/collection-types/api::render.render/`,
    competition: `${Domain.strapi}/admin/content-manager/collection-types/api::competition.competition/`,
    account: `${Domain.strapi}/admin/content-manager/collection-types/api::account.account/`,
    scheduler: `${Domain.strapi}/admin/content-manager/collection-types/api::scheduler.scheduler/`,
    download: `${Domain.strapi}/admin/content-manager/collection-types/api::download.download/`,
    grade: `${Domain.strapi}/admin/content-manager/collection-types/api::grade.grade/`,
    team: `${Domain.strapi}/admin/content-manager/collection-types/api::team.team/`,
  };

  const value: GlobalContextType = {
    Domain,
    strapiLocation,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export { GlobalProvider, useGlobalContext };
