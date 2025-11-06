"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  CheckCircle2,
  Circle,
  Clock,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Zap,
  Bell,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CodeExample from "./_elements/CodeExample";

/**
 * Lists Showcase
 *
 * Displays list component examples with creative patterns
 */
export default function ListsShowcase() {
  const [checkedItems, setCheckedItems] = useState<string[]>([
    "task-1",
    "task-3",
  ]);
  const [expandedItems, setExpandedItems] = useState<string[]>(["feature-1"]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <SectionContainer
        title="Lists"
        description="Creative list patterns for displaying structured data"
      >
        <div className="space-y-6">
          {/* Basic Lists */}
          <ElementContainer title="Basic Lists">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Unordered List</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Ordered List</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>First step</li>
                  <li>Second step</li>
                  <li>Third step</li>
                </ol>
              </div>
            </div>
            <div className="mt-6">
              <CodeExample
                code={`<ul className="list-disc list-inside space-y-2">
  <li>First item</li>
  <li>Second item</li>
</ul>

<ol className="list-decimal list-inside space-y-2">
  <li>First step</li>
  <li>Second step</li>
</ol>`}
              />
            </div>
          </ElementContainer>

          {/* List with Main Item and Byline */}
          <ElementContainer title="List with Main Item and Byline">
            <ul className="space-y-3">
              <li className="flex flex-col gap-1">
                <span className="font-medium text-sm">Project Alpha</span>
                <span className="text-xs text-muted-foreground">
                  Active development project with 5 team members
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-medium text-sm">Project Beta</span>
                <span className="text-xs text-muted-foreground">
                  In review phase, scheduled for launch next month
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-medium text-sm">Project Gamma</span>
                <span className="text-xs text-muted-foreground">
                  On hold pending client approval
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <CodeExample
                code={`<ul className="space-y-3">
  <li className="flex flex-col gap-1">
    <span className="font-medium text-sm">Main Item</span>
    <span className="text-xs text-muted-foreground">Supporting byline or description text</span>
  </li>
  <li className="flex flex-col gap-1">
    <span className="font-medium text-sm">Another Item</span>
    <span className="text-xs text-muted-foreground">Additional context or description</span>
  </li>
</ul>`}
              />
            </div>
          </ElementContainer>

          {/* Interactive Checklist */}
          <ElementContainer title="Interactive Checklist">
            <ul className="space-y-2">
              {[
                {
                  id: "task-1",
                  label: "Complete UI component library",
                  completed: true,
                },
                {
                  id: "task-2",
                  label: "Write documentation",
                  completed: false,
                },
                {
                  id: "task-3",
                  label: "Add accessibility features",
                  completed: true,
                },
                {
                  id: "task-4",
                  label: "Create video walkthrough",
                  completed: false,
                },
              ].map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => toggleCheck(task.id)}
                >
                  {checkedItems.includes(task.id) ? (
                    <CheckCircle2 className="h-5 w-5 text-brandPrimary-600 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span
                    className={`flex-1 text-sm ${
                      checkedItems.includes(task.id)
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {task.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CodeExample
                code={`const [checkedItems, setCheckedItems] = useState([]);

const toggleCheck = (id) => {
  setCheckedItems((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
};

<ul className="space-y-2">
  {tasks.map((task) => (
    <li
      key={task.id}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
      onClick={() => toggleCheck(task.id)}
    >
      {checkedItems.includes(task.id) ? (
        <CheckCircle2 className="h-5 w-5 text-brandPrimary-600" />
      ) : (
        <Circle className="h-5 w-5 text-muted-foreground" />
      )}
      <span className={checkedItems.includes(task.id) ? "line-through" : ""}>
        {task.label}
      </span>
    </li>
  ))}
</ul>`}
              />
            </div>
          </ElementContainer>

          {/* Avatar List */}
          <ElementContainer title="Avatar List">
            <ul className="space-y-2">
              {[
                {
                  name: "John Doe",
                  email: "john@example.com",
                  role: "Admin",
                  initials: "JD",
                },
                {
                  name: "Jane Smith",
                  email: "jane@example.com",
                  role: "Editor",
                  initials: "JS",
                },
                {
                  name: "Bob Johnson",
                  email: "bob@example.com",
                  role: "User",
                  initials: "BJ",
                },
              ].map((user, index) => (
                <li
                  key={index}
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
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CodeExample
                code={`import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

<ul className="space-y-2">
  {users.map((user) => (
    <li className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
      <Avatar>
        <AvatarFallback>{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{user.name}</span>
          <Badge variant="secondary">{user.role}</Badge>
        </div>
        <span className="text-sm text-muted-foreground">{user.email}</span>
      </div>
      <ChevronRight className="h-4 w-4" />
    </li>
  ))}
</ul>`}
              />
            </div>
          </ElementContainer>

          {/* Action List */}
          <ElementContainer title="Action List">
            <ul className="space-y-2">
              {[
                {
                  id: "action-1",
                  icon: Edit,
                  label: "Edit Profile",
                  description: "Update your personal information",
                },
                {
                  id: "action-2",
                  icon: Bell,
                  label: "Notifications",
                  description: "Manage notification preferences",
                },
                {
                  id: "action-3",
                  icon: Zap,
                  label: "Quick Actions",
                  description: "Access frequently used features",
                },
              ].map((item) => {
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
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
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
            <div className="mt-6">
              <CodeExample
                code={`import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

<ul className="space-y-2">
  {items.map((item) => (
    <li className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <item.icon className="h-4 w-4" />
        </div>
        <div>
          <div className="font-medium">{item.label}</div>
          <div className="text-sm text-muted-foreground">{item.description}</div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  ))}
</ul>`}
              />
            </div>
          </ElementContainer>

          {/* Timeline List */}
          <ElementContainer title="Timeline List">
            <ul className="space-y-4 relative">
              {[
                {
                  icon: FileText,
                  label: "Document created",
                  time: "2 hours ago",
                  color: "text-blue-500",
                },
                {
                  icon: MessageSquare,
                  label: "Comment added",
                  time: "5 hours ago",
                  color: "text-green-500",
                },
                {
                  icon: Zap,
                  label: "Task completed",
                  time: "1 day ago",
                  color: "text-orange-500",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-2 rounded-full bg-muted ${item.color}`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      {index < 2 && (
                        <div className="w-0.5 h-full bg-slate-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <CodeExample
                code={`<ul className="space-y-4 relative">
  {events.map((event, index) => (
    <li key={index} className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="p-2 rounded-full bg-muted text-blue-500">
          <event.icon className="h-4 w-4" />
        </div>
        {index < events.length - 1 && (
          <div className="w-0.5 h-full bg-slate-200 mt-2" />
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium">{event.label}</div>
        <div className="text-sm text-muted-foreground">{event.time}</div>
      </div>
    </li>
  ))}
</ul>`}
              />
            </div>
          </ElementContainer>

          {/* Rich Description List */}
          <ElementContainer title="Rich Description List">
            <dl className="space-y-4">
              {[
                { term: "Status", value: "Active", badge: "success" },
                { term: "Last Updated", value: "2 hours ago", icon: Clock },
                { term: "Notifications", value: "Enabled", badge: "info" },
                { term: "Profile", value: "Complete", badge: "success" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                      {Icon && (
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      )}
                      {item.term}:
                    </dt>
                    <dd className="flex-1 flex items-center gap-2">
                      {item.badge ? (
                        <Badge
                          className={
                            item.badge === "success"
                              ? "bg-success-500 text-white border-0"
                              : "bg-brandPrimary-600 text-white border-0"
                          }
                        >
                          {item.value}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {item.value}
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <div className="mt-6">
              <CodeExample
                code={`<dl className="space-y-4">
  {items.map((item) => (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
      <dt className="font-semibold w-32 flex items-center gap-2">
        {item.icon && <item.icon className="h-4 w-4" />}
        {item.term}:
      </dt>
      <dd className="flex-1">
        {item.badge ? (
          <Badge>{item.value}</Badge>
        ) : (
          <span className="text-sm text-muted-foreground">{item.value}</span>
        )}
      </dd>
    </div>
  ))}
</dl>`}
              />
            </div>
          </ElementContainer>

          {/* Notification List */}
          <ElementContainer title="Notification List">
            <ul className="space-y-2">
              {[
                {
                  id: "notif-1",
                  icon: Info,
                  label: "New feature available",
                  time: "5 min ago",
                  unread: true,
                },
                {
                  id: "notif-2",
                  icon: Bell,
                  label: "Profile updated",
                  time: "1 hour ago",
                  unread: false,
                },
                {
                  id: "notif-3",
                  icon: Zap,
                  label: "System maintenance",
                  time: "2 hours ago",
                  unread: true,
                },
              ].map((notif) => {
                const Icon = notif.icon;
                return (
                  <li
                    key={notif.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      notif.unread
                        ? "border-brandPrimary-200 bg-brandPrimary-50/50"
                        : "border-slate-200 hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        notif.unread
                          ? "bg-brandPrimary-100 text-brandPrimary-700"
                          : "bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm ${
                            notif.unread ? "font-semibold" : ""
                          }`}
                        >
                          {notif.label}
                        </span>
                        {notif.unread && (
                          <span className="h-2 w-2 rounded-full bg-brandPrimary-600 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notif.time}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6">
              <CodeExample
                code={`<ul className="space-y-2">
  {notifications.map((notif) => (
    <li className={\`flex items-start gap-3 p-3 rounded-lg border \${
      notif.unread ? "border-brandPrimary-200 bg-brandPrimary-50/50" : "border-slate-200"
    }\`}>
      <div className={\`p-2 rounded-lg \${
        notif.unread ? "bg-brandPrimary-100" : "bg-muted"
      }\`}>
        <notif.icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={notif.unread ? "font-semibold" : ""}>{notif.label}</span>
          {notif.unread && (
            <span className="h-2 w-2 rounded-full bg-brandPrimary-600" />
          )}
        </div>
        <span className="text-xs text-muted-foreground">{notif.time}</span>
      </div>
    </li>
  ))}
</ul>`}
              />
            </div>
          </ElementContainer>

          {/* Expandable List */}
          <ElementContainer title="Expandable List">
            <ul className="space-y-2">
              {[
                {
                  id: "feature-1",
                  title: "User Management",
                  description: "Manage users, roles, and permissions",
                  items: ["Add users", "Edit roles", "Set permissions"],
                },
                {
                  id: "feature-2",
                  title: "Analytics",
                  description: "View reports and insights",
                  items: ["Dashboard", "Reports", "Export data"],
                },
              ].map((feature) => (
                <li
                  key={feature.id}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(feature.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{feature.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        expandedItems.includes(feature.id) ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {expandedItems.includes(feature.id) && (
                    <div className="px-4 pb-4 border-t border-slate-200">
                      <ul className="mt-3 space-y-2">
                        {feature.items.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CodeExample
                code={`const [expandedItems, setExpandedItems] = useState([]);

const toggleExpand = (id) => {
  setExpandedItems((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
};

<ul className="space-y-2">
  {features.map((feature) => (
    <li className="border rounded-lg overflow-hidden">
      <button
        onClick={() => toggleExpand(feature.id)}
        className="w-full flex items-center justify-between p-4"
      >
        <div>
          <div className="font-medium">{feature.title}</div>
          <div className="text-sm text-muted-foreground">{feature.description}</div>
        </div>
        <ChevronRight className={\`transition-transform \${
          expandedItems.includes(feature.id) ? "rotate-90" : ""
        }\`} />
      </button>
      {expandedItems.includes(feature.id) && (
        <div className="px-4 pb-4 border-t">
          <ul className="mt-3 space-y-2">
            {feature.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  ))}
</ul>`}
              />
            </div>
          </ElementContainer>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Usage Guidelines"
        description="Best practices for using list components"
      >
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              List Patterns
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use basic lists for simple, non-interactive content</li>
              <li>Add icons and avatars for visual context and recognition</li>
              <li>
                Use checklists for task management and completion tracking
              </li>
              <li>Timeline lists work well for activity feeds and history</li>
              <li>Action lists provide quick access to common operations</li>
              <li>Expandable lists help organize hierarchical information</li>
              <li>
                Notification lists should clearly indicate read/unread states
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Accessibility
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use semantic HTML (ul, ol, li, dl, dt, dd)</li>
              <li>Add keyboard navigation for interactive lists</li>
              <li>Include ARIA labels for screen readers</li>
              <li>Ensure sufficient color contrast for text and icons</li>
              <li>Provide focus indicators for clickable items</li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
