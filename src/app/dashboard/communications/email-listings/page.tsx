"use client";

import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClubEmails from "@/app/dashboard/accounts/club/components/clubEmails";
import AssociationEmails from "@/app/dashboard/accounts/association/components/associationEmails";

export default function EmailListingsPage() {
    return (
        <CreatePage>
            <CreatePageTitle
                title="Email Listings"
                byLine="Global view of all club and association contact emails"
            />

            <Tabs defaultValue="clubs" className="mt-6">
                <TabsList variant="secondary" className="mb-4">
                    <TabsTrigger value="clubs">Club Contacts</TabsTrigger>
                    <TabsTrigger value="associations">Association Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="clubs">
                    <ClubEmails initialFilter="all" />
                </TabsContent>

                <TabsContent value="associations">
                    <AssociationEmails initialFilter="all" />
                </TabsContent>
            </Tabs>
        </CreatePage>
    );
}
