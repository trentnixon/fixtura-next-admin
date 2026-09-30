"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  useCreateTemplateAnimation,
  useDeleteTemplateAnimation,
  useSetTemplateAnimationPublished,
  useTemplateAnimations,
  useUpdateTemplateAnimation,
} from "@/hooks/template-animation/useTemplateAnimation";
import { TemplateAnimation } from "@/types/template-animation";
import {
  jsonToEditorValue,
  parseRequiredJson,
} from "@/lib/services/template-animation/templateAnimationRecord";

interface FormState {
  presetId: string;
  name: string;
  description: string;
  defaultConfiguration: string;
  configurationSchema: string;
  operatorVisible: boolean;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: string;
  catalogueVersion: string;
}

const emptyForm = (): FormState => ({
  presetId: "",
  name: "",
  description: "",
  defaultConfiguration: "",
  configurationSchema: "",
  operatorVisible: false,
  isActive: true,
  isDefault: false,
  sortOrder: "",
  catalogueVersion: "",
});

function fromRow(row: TemplateAnimation): FormState {
  return {
    presetId: row.presetId,
    name: row.name,
    description: row.description,
    defaultConfiguration: jsonToEditorValue(row.defaultConfiguration),
    configurationSchema: jsonToEditorValue(row.configurationSchema),
    operatorVisible: row.operatorVisible,
    isActive: row.isActive,
    isDefault: row.isDefault,
    sortOrder: row.sortOrder === null ? "" : String(row.sortOrder),
    catalogueVersion: row.catalogueVersion,
  };
}

export function AnimationCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateAnimations();
  const createPreset = useCreateTemplateAnimation();
  const updatePreset = useUpdateTemplateAnimation();
  const setPublished = useSetTemplateAnimationPublished();
  const deletePreset = useDeleteTemplateAnimation();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateAnimation | undefined>();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<TemplateAnimation | undefined>();

  const openCreate = () => {
    setEditing(undefined);
    setForm(emptyForm());
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateAnimation) => {
    setEditing(row);
    setForm(fromRow(row));
    setSheetOpen(true);
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    try {
      const sortOrder = form.sortOrder.trim();
      const input = {
        presetId: form.presetId.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        defaultConfiguration: parseRequiredJson(
          "Default configuration",
          form.defaultConfiguration,
        ),
        configurationSchema: parseRequiredJson(
          "Configuration schema",
          form.configurationSchema,
        ),
        operatorVisible: form.operatorVisible,
        isActive: form.isActive,
        isDefault: form.isDefault,
        sortOrder: sortOrder === "" ? null : Number(sortOrder),
        catalogueVersion: form.catalogueVersion.trim(),
      };
      if (!input.presetId || !input.name || !input.catalogueVersion) {
        toast.error("Preset id, name, and catalogue version are required");
        return;
      }
      if (input.sortOrder !== null && Number.isNaN(input.sortOrder)) {
        toast.error("Sort order must be a number");
        return;
      }
      if (editing) {
        await updatePreset.mutateAsync({ id: editing.id, input });
        toast.success("Animation updated");
      } else {
        await createPreset.mutateAsync(input);
        toast.success("Animation created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateAnimation) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Animation unpublished" : "Animation published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePreset.mutateAsync(deleteTarget.id);
      toast.success("Animation deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading animation presets..." />;
  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Failed to load animation presets"
        onRetry={() => refetch()}
      />
    );
  }

  const rows = data?.data ?? [];
  const saving = createPreset.isPending || updatePreset.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} preset{rows.length === 1 ? "" : "s"}. A later catalogue sync can overwrite configuration, visibility, and the default flag.
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add preset
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Preset</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No animation presets yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.name || "Untitled"}
                    <div className="text-xs text-muted-foreground">#{row.id}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.presetId}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {[
                      row.isDefault ? "Default" : null,
                      row.isActive ? "Active" : "Inactive",
                      row.operatorVisible ? "Visible" : "Hidden",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {row.publishedAt ? "Published" : "Draft"}
                    </Badge>
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
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit preset" : "Add preset"}</SheetTitle>
            <SheetDescription>
              Only one preset can be the default. It must stay published, active, and operator visible, or new accounts cannot be created.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-id">Preset id</Label>
              <Input
                id="preset-id"
                value={form.presetId}
                onChange={(event) => setField("presetId", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-name">Name</Label>
              <Input
                id="preset-name"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-version">Catalogue version</Label>
              <Input
                id="preset-version"
                value={form.catalogueVersion}
                onChange={(event) => setField("catalogueVersion", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-sort">Sort order</Label>
              <Input
                id="preset-sort"
                value={form.sortOrder}
                onChange={(event) => setField("sortOrder", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-description">Description</Label>
              <Textarea
                id="preset-description"
                rows={3}
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-config">Default configuration</Label>
              <Textarea
                id="preset-config"
                rows={6}
                className="font-mono text-xs"
                value={form.defaultConfiguration}
                onChange={(event) => setField("defaultConfiguration", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-schema">Configuration schema</Label>
              <Textarea
                id="preset-schema"
                rows={6}
                className="font-mono text-xs"
                value={form.configurationSchema}
                onChange={(event) => setField("configurationSchema", event.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.operatorVisible}
                onChange={(event) => setField("operatorVisible", event.target.checked)}
              />
              Operator visible
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setField("isActive", event.target.checked)}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) => setField("isDefault", event.target.checked)}
              />
              Default
            </label>
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

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete animation preset</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? If this is the default preset, new accounts cannot be created until another published default exists.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePreset.isPending}
            >
              {deletePreset.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
