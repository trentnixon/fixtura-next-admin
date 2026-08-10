"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubsectionTitle } from "@/components/type/titles";
import { ChevronRight, Edit, MoreVertical, Trash2 } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { LIST_TOKENS } from "./listTokens";
import { sampleActionItems, sampleUsers } from "./listSampleData";

/**
 * Media list showcase — avatar and action list patterns
 */
export default function MediaListsShowcase() {
  return (
    <SectionContainer
      title="Media & Action Lists"
      description="Lists with avatars, icons, and dropdown actions"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Avatar List</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Avatar · Badge · ChevronRight</span>
          </div>
          <ul className="space-y-2">
            {sampleUsers.map((user) => (
              <li
                key={user.email}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brandPrimary-300 hover:bg-brandPrimary-50/50 transition-colors"
              >
                <Avatar>
                  <AvatarFallback className="bg-brandPrimary-100 text-brandPrimary-700">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{user.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </li>
            ))}
          </ul>
          <ComponentRef token={LIST_TOKENS.avatar} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Action List</SubsectionTitle>
            <span className="text-xs text-muted-foreground">icon · DropdownMenu</span>
          </div>
          <ul className="space-y-2">
            {sampleActionItems.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-brandPrimary-300 hover:bg-brandPrimary-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brandPrimary-100 text-brandPrimary-700 group-hover:bg-brandPrimary-200">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              );
            })}
          </ul>
          <ComponentRef token={LIST_TOKENS.action} />
        </div>
      </div>
    </SectionContainer>
  );
}
