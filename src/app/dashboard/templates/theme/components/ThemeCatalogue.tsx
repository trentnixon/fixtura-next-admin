"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  useBrandThemes,
  useCreateBrandTheme,
  useDeleteBrandTheme,
  useUpdateBrandTheme,
} from "@/hooks/brand-theme/useBrandTheme";
import { BrandColours, BrandTheme } from "@/types/brand-theme";

const colourFields = [
  ["primary", "Primary"],
  ["secondary", "Secondary"],
  ["dark", "Dark"],
  ["white", "White"],
] as const;

const emptyColours: BrandColours = {
  primary: "",
  secondary: "",
  dark: "",
  white: "",
};

function swatch(value: string) {
  const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : "transparent";
  return (
    <span
      className="inline-block h-4 w-4 rounded border"
      style={{ backgroundColor: hex }}
      aria-hidden
    />
  );
}

export function ThemeCatalogue() {
  const { data, isLoading, isError, error, refetch } = useBrandThemes();
  const createTheme = useCreateBrandTheme();
  const updateTheme = useUpdateBrandTheme();
  const deleteTheme = useDeleteBrandTheme();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<BrandTheme | undefined>();
  const [name, setName] = useState("");
  const [colours, setColours] = useState<BrandColours>(emptyColours);
  const [isPublic, setIsPublic] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<BrandTheme | undefined>();

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setColours(emptyColours);
    setIsPublic(false);
    setCreatedBy("");
    setSheetOpen(true);
  };

  const openEdit = (row: BrandTheme) => {
    setEditing(row);
    setName(row.name);
    setColours(row.theme);
    setIsPublic(row.isPublic);
    setCreatedBy(row.createdBy === null ? "" : String(row.createdBy));
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    const theme: BrandColours = {
      primary: colours.primary.trim(),
      secondary: colours.secondary.trim(),
      dark: colours.dark.trim(),
      white: colours.white.trim(),
    };
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    if (!theme.primary || !theme.secondary || !theme.dark || !theme.white) {
      toast.error("Primary, secondary, dark, and white are required");
      return;
    }
    const trimmedCreatedBy = createdBy.trim();
    let parsedCreatedBy: number | null = null;
    if (trimmedCreatedBy) {
      parsedCreatedBy = Number(trimmedCreatedBy);
      if (!Number.isInteger(parsedCreatedBy) || parsedCreatedBy <= 0) {
        toast.error("Created by must be a user id");
        return;
      }
    }
    const input = { name: trimmedName, theme, isPublic, createdBy: parsedCreatedBy };
    try {
      if (editing) {
        await updateTheme.mutateAsync({ id: editing.id, input });
        toast.success("Theme updated");
      } else {
        await createTheme.mutateAsync(input);
        toast.success("Theme created");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTheme.mutateAsync(deleteTarget.id);
      toast.success("Theme deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading themes..." />;
  if (isError) {
    return <ErrorState error={error} title="Failed to load themes" onRetry={() => refetch()} />;
  }

  const rows = data?.data ?? [];
  const saving = createTheme.isPending || updateTheme.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} theme{rows.length === 1 ? "" : "s"}. These are brand colours. A palette row is only a token.
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add theme
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Colours</TableHead>
              <TableHead>Public</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  No themes yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.name || "Untitled"}
                    <div className="text-xs text-muted-foreground">#{row.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      {colourFields.map(([key]) => (
                        <span key={key} className="inline-flex items-center gap-1">
                          {swatch(row.theme[key])}
                          {row.theme[key] || "-"}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{row.isPublic ? "Public" : "Private"}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
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
            <SheetTitle>{editing ? "Edit theme" : "Add theme"}</SheetTitle>
            <SheetDescription>
              Brand colours stored on Theme. This is not the template palette token.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-name">Name</Label>
              <Input id="theme-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            {colourFields.map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`theme-${key}`}>{label}</Label>
                <div className="flex items-center gap-2">
                  {swatch(colours[key])}
                  <Input
                    id={`theme-${key}`}
                    value={colours[key]}
                    onChange={(event) =>
                      setColours((current) => ({ ...current, [key]: event.target.value }))
                    }
                  />
                </div>
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
              />
              Public
            </label>
            <div className="space-y-2">
              <Label htmlFor="theme-created-by">Created by</Label>
              <Input
                id="theme-created-by"
                value={createdBy}
                onChange={(event) => setCreatedBy(event.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete theme</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this theme will lose these colours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteTheme.isPending}>
              {deleteTheme.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
