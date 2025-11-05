"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Home, Files, Settings } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Tabs Showcase
 *
 * Displays Tab component examples
 */
export default function TabsShowcase() {
  return (
    <SectionContainer
      title="Tabs"
      description="Tab navigation component for organizing content"
    >
      <div className="space-y-6">
        <ElementContainer title="Brand Color Variants">
          <div className="space-y-4">
            <Tabs defaultValue="primary-tab1" className="w-full">
              <TabsList variant="primary">
                <TabsTrigger value="primary-tab1">Primary</TabsTrigger>
                <TabsTrigger value="primary-tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="primary-tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="primary-tab1">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Primary variant uses brandPrimary color for the container.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Tabs defaultValue="secondary-tab1" className="w-full">
              <TabsList variant="secondary">
                <TabsTrigger value="secondary-tab1">Secondary</TabsTrigger>
                <TabsTrigger value="secondary-tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="secondary-tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="secondary-tab1">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Secondary variant uses brandSecondary color for the
                    container.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <Tabs defaultValue="accent-tab1" className="w-full">
              <TabsList variant="accent">
                <TabsTrigger value="accent-tab1">Accent</TabsTrigger>
                <TabsTrigger value="accent-tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="accent-tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="accent-tab1">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Accent variant uses brandAccent color for the container.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="tab1" className="w-full">
  <TabsList variant="primary">
    <TabsTrigger value="tab1">Primary</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <div className="p-4 border rounded-md">
      <p>Tab content</p>
    </div>
  </TabsContent>
</Tabs>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Basic Tabs">
          <Tabs defaultValue="account" className="w-auto">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <SectionContainer title="Account">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Make changes to your account here.
                  </p>
                </div>
              </SectionContainer>
            </TabsContent>
            <TabsContent value="password">
              <SectionContainer title="Password">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Change your password here.
                  </p>
                </div>
              </SectionContainer>
            </TabsContent>
            <TabsContent value="settings">
              <SectionContainer title="Settings">
                <div className="p-4 border rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Update your settings here.
                  </p>
                </div>
              </SectionContainer>
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <CodeExample
              code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="account" className="w-full">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <div className="p-4 border rounded-md">
      <p>Make changes to your account here.</p>
    </div>
  </TabsContent>
  <TabsContent value="password">
    <div className="p-4 border rounded-md">
      <p>Change your password here.</p>
    </div>
  </TabsContent>
</Tabs>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Tabs with Icons">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant="primary">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <Files className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">
                  Overview content
                </p>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">
                  Analytics content
                </p>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground">
                  Settings content
                </p>
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <CodeExample
              code={`import { Home, Files, Settings } from "lucide-react";

<Tabs defaultValue="overview" className="w-full">
  <TabsList variant="primary">
    <TabsTrigger value="overview" className="flex items-center gap-2">
      <Home className="h-4 w-4" />
      Overview
    </TabsTrigger>
    <TabsTrigger value="analytics" className="flex items-center gap-2">
      <Files className="h-4 w-4" />
      Analytics
    </TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <div className="p-4 border rounded-md">
      <p>Overview content</p>
    </div>
  </TabsContent>
</Tabs>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Tabs Variants">
          <div className="space-y-4">
            <Tabs defaultValue="default" className="w-full">
              <TabsList className="bg-muted">
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="outlined">Outlined</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="underline" className="w-full">
              <TabsList className="bg-transparent border-b h-auto p-0 rounded-none">
                <TabsTrigger
                  value="underline"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Underline
                </TabsTrigger>
                <TabsTrigger
                  value="style"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Style
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Tabs defaultValue="underline" className="w-full">
  <TabsList className="bg-transparent border-b h-auto p-0">
    <TabsTrigger value="underline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
      Underline
    </TabsTrigger>
  </TabsList>
</Tabs>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
