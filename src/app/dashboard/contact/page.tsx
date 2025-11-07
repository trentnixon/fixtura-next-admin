"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

/**
 * Contact Forms Page
 *
 * View and manage contact form submissions from the CMS.
 */
export default function ContactPage() {
  return (
    <>
      <CreatePageTitle
        title="Contact Forms"
        byLine="CMS Contact Form Submissions"
        byLineBottom="View and manage contact form submissions from the CMS"
      />

      <PageContainer padding="xs" spacing="lg">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-md">
                <Mail className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  Contact form submissions dashboard will be available here
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Contact form submissions dashboard coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
