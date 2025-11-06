"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Cards Showcase
 *
 * Displays Card component examples
 */
export default function CardsShowcase() {
  return (
    <SectionContainer
      title="Base Card Component"
      description="Standard card component from shadcn/ui with header, content, footer"
    >
      <div className="space-y-6">
        <ElementContainer title="Basic Card">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Card content area for main content.</p>
            </CardContent>
          </Card>
          <div className="mt-6">
            <CodeExample
              code={`import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content area for main content.</p>
  </CardContent>
</Card>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Card with Footer">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
              <CardDescription>
                Action buttons go in the footer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Main content here.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>
          <div className="mt-6">
            <CodeExample
              code={`import { CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card with Footer</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Main content here.</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline" size="sm">Cancel</Button>
    <Button size="sm">Save</Button>
  </CardFooter>
</Card>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Card Variants">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Bordered Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Card with thicker border</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50">
              <CardHeader>
                <CardTitle>Background Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Card with background color</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<Card className="border-2">
  <CardHeader>
    <CardTitle>Bordered Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card with thicker border</p>
  </CardContent>
</Card>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Interactive Card">
          <Card className="max-w-md cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interactive Card</CardTitle>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Hover to see shadow effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Cards can be made interactive with hover effects.
              </p>
            </CardContent>
          </Card>
          <div className="mt-6">
            <CodeExample
              code={`<Card className="cursor-pointer hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>Interactive Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Cards can be made interactive with hover effects.</p>
  </CardContent>
</Card>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

