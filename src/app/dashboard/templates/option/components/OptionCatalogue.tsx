"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import {
  useDeleteTemplateOption,
  useSetTemplateOptionPublished,
  useTemplateOptions,
  useUpdateTemplateOption,
} from "@/hooks/template-option/useTemplateOption";
import {
  LEGACY_USE_BACKGROUNDS,
  TEMPLATE_OPTION_LINK_KEYS,
  TEMPLATE_OPTION_LINK_LABELS,
  TemplateOption,
  TemplateOptionLinkKey,
  USE_BACKGROUNDS,
  UseBackground,
} from "@/types/template-option";

function isUseBackground(value: string): value is UseBackground {
  return USE_BACKGROUNDS.some((option) => option === value);
}

function isLegacyBackground(value: string): boolean {
  return LEGACY_USE_BACKGROUNDS.some((option) => option === value);
}

function linkLabel(row: TemplateOption, key: TemplateOptionLinkKey): string {
  const link = row.links[key];
  if (!link.id) return "";
  return link.name ? `${link.name} #${link.id}` : `#${link.id}`;
}

export function OptionCatalogue() {
  const [accountFilter, setAccountFilter] = useState("");
  const [appliedAccountId, setAppliedAccountId] = useState<number | undefined>();
  const { data, isLoading, isError, error, refetch } = useTemplateOptions(appliedAccountId);
  const updateOption = useUpdateTemplateOption();
  const setPublished = useSetTemplateOptionPublished();
  const deleteOption = useDeleteTemplateOption();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateOption | undefined>();
  const [useBackground, setUseBackground] = useState<string>("Animated");
  const [linkIds, setLinkIds] = useState<Record<TemplateOptionLinkKey, string>>(
    () =>
      TEMPLATE_OPTION_LINK_KEYS.reduce(
        (ids, key) => {
          ids[key] = "";
          return ids;
        },
        {} as Record<TemplateOptionLinkKey, string>,
      ),
  );
  const [deleteTarget, setDeleteTarget] = useState<TemplateOption | undefined>();

  const applyFilter = () => {
    const trimmed = accountFilter.trim();
    if (!trimmed) {
      setAppliedAccountId(undefined);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      toast.error("Account id must be a number");
      return;
    }
    setAppliedAccountId(parsed);
  };

  const openEdit = (row: TemplateOption) => {
    setEditing(row);
    setUseBackground(row.useBackground || "Animated");
    setLinkIds(
      TEMPLATE_OPTION_LINK_KEYS.reduce(
        (ids, key) => {
          ids[key] = row.links[key].id === null ? "" : String(row.links[key].id);
          return ids;
        },
        {} as Record<TemplateOptionLinkKey, string>,
      ),
    );
    setSheetOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    if (!isUseBackground(useBackground) && !isLegacyBackground(useBackground)) {
      toast.error("Choose a background mode");
      return;
    }
    const links = {} as Record<TemplateOptionLinkKey, number | null>;
    for (const key of TEMPLATE_OPTION_LINK_KEYS) {
      const trimmed = linkIds[key].trim();
      if (!trimmed) {
        links[key] = null;
        continue;
      }
      const parsed = Number(trimmed);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        toast.error(`${TEMPLATE_OPTION_LINK_LABELS[key]} must be a catalogue id`);
        return;
      }
      links[key] = parsed;
    }
    if (useBackground === "Luminance" && links.template_luminance === null) {
      toast.error("Luminance needs a plate id");
      return;
    }
    try {
      await updateOption.mutateAsync({
        id: editing.id,
        input: {
          useBackground: useBackground as UseBackground,
          links,
        },
      });
      toast.success("Style option updated");
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateOption) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Style option unpublished" : "Style option published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOption.mutateAsync(deleteTarget.id);
      toast.success("Style option deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading style options..." />;
  if (isError) {
    return (
      <ErrorState error={error} title="Failed to load style options" onRetry={() => refetch()} />
    );
  }

  const rows = data?.data ?? [];
  const total = data?.total ?? rows.length;
  const backgroundChoices = isLegacyBackground(useBackground)
    ? [useBackground, ...USE_BACKGROUNDS]
    : [...USE_BACKGROUNDS];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} of {total} style option{total === 1 ? "" : "s"}. Each account has one. This screen points that row at existing catalogue ids.
        </p>
        <form
          className="flex items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            applyFilter();
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="option-account">Account id</Label>
            <Input
              id="option-account"
              value={accountFilter}
              onChange={(event) => setAccountFilter(event.target.value)}
              className="w-32"
            />
          </div>
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Account</TableHead>
              <TableHead>Background</TableHead>
              <TableHead>Links</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No style options yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.accountName || (row.accountId ? `Account ${row.accountId}` : "No account")}
                    <div className="text-xs text-muted-foreground">
                      option #{row.id}
                      {row.accountId ? ` · account #${row.accountId}` : ""}
                    </div>
                  </TableCell>
                  <TableCell>{row.useBackground || "-"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {[linkLabel(row, "template_category"), linkLabel(row, "template_mode"), linkLabel(row, "template_animation")]
                      .filter(Boolean)
                      .join(" · ") || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.publishedAt ? "Published" : "Draft"}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => togglePublished(row)}>
                      {row.publishedAt ? "Unpublish" : "Publish"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit style option</SheetTitle>
            <SheetDescription>
              {editing?.accountName || (editing?.accountId ? `Account ${editing.accountId}` : "No account")}. Empty a link to clear it. Luminance needs a plate id. Particle, pattern, and noise stay linked, and they are not background modes.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Background</Label>
              <Select value={useBackground} onValueChange={setUseBackground}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backgroundChoices.map((option) => (
                    <SelectItem key={option} value={option}>
                      {isLegacyBackground(option) ? `${option} (legacy)` : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {TEMPLATE_OPTION_LINK_KEYS.map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`option-${key}`}>{TEMPLATE_OPTION_LINK_LABELS[key]}</Label>
                <Input
                  id={`option-${key}`}
                  value={linkIds[key]}
                  onChange={(event) =>
                    setLinkIds((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
                {editing && editing.links[key].name && linkIds[key] === String(editing.links[key].id ?? "") ? (
                  <p className="text-xs text-muted-foreground">{editing.links[key].name}</p>
                ) : null}
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={updateOption.isPending}>
                {updateOption.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete style option</DialogTitle>
            <DialogDescription>
              Delete option #{deleteTarget?.id}? That account will have no style row until one is created with the account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteOption.isPending}>
              {deleteOption.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
