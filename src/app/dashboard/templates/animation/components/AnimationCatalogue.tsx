"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
import {
  CatalogueToolbar,
  FilterChip,
  matchesPublishFilter,
  PublishFilter,
} from "../../components/CatalogueToolbar";
import { StyleCatalogueCard, StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";

function Flag({ children, strong }: { children: string; strong?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px]",
        strong ? "border-slate-900 text-slate-900" : "border-slate-200 text-slate-600",
      )}
    >
      {children}
    </span>
  );
}

function FlagSwitch({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

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
  const [status, setStatus] = useState<PublishFilter>("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [defaultOnly, setDefaultOnly] = useState(false);
  const [visibleOnly, setVisibleOnly] = useState(false);

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
  const visible = rows.filter((row) => {
    if (!matchesPublishFilter(row.publishedAt, status)) return false;
    if (activeOnly && !row.isActive) return false;
    if (defaultOnly && !row.isDefault) return false;
    if (visibleOnly && !row.operatorVisible) return false;
    return true;
  });
  const saving = createPreset.isPending || updatePreset.isPending;

  return (
    <>
      <CatalogueToolbar addLabel="Add preset" onAdd={openCreate} status={status} onStatusChange={setStatus}>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={activeOnly} onClick={() => setActiveOnly((current) => !current)}>
            Active
          </FilterChip>
          <FilterChip active={defaultOnly} onClick={() => setDefaultOnly((current) => !current)}>
            Default
          </FilterChip>
          <FilterChip active={visibleOnly} onClick={() => setVisibleOnly((current) => !current)}>
            Operator visible
          </FilterChip>
        </div>
      </CatalogueToolbar>

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No animation presets yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No animation presets match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => {
            const published = Boolean(row.publishedAt);
            const publishing = setPublished.isPending && setPublished.variables?.id === row.id;
            const sortLabel = row.sortOrder === null ? "No sort" : `Sort ${row.sortOrder}`;
            return (
              <StyleCatalogueCard
                key={row.id}
                name={row.name}
                id={row.id}
                typeLabel={row.presetId || "No preset id"}
                typeClassName="font-mono text-xs"
                detail={row.description}
                note={`${row.catalogueVersion ? `Version ${row.catalogueVersion}` : "No version"} · ${sortLabel}`}
                published={published}
                locked={false}
                publishDisabled={publishing}
                onEdit={() => openEdit(row)}
                onTogglePublished={() => togglePublished(row)}
                onDelete={() => setDeleteTarget(row)}
                badges={
                  <>
                    {row.isDefault ? <Flag strong>Default</Flag> : null}
                    <Flag>{row.isActive ? "Active" : "Inactive"}</Flag>
                    <Flag>{row.operatorVisible ? "Visible" : "Hidden"}</Flag>
                  </>
                }
              />
            );
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit preset" : "Add preset"}</SheetTitle>
            <SheetDescription>
              A catalogue sync can overwrite configuration, visibility, and the default flag. The default preset has to stay published, active, and operator visible, or new accounts cannot be created.
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
            <FlagSwitch
              id="preset-visible"
              label="Operator visible"
              checked={form.operatorVisible}
              onCheckedChange={(checked) => setField("operatorVisible", checked)}
            />
            <FlagSwitch
              id="preset-active"
              label="Active"
              checked={form.isActive}
              onCheckedChange={(checked) => setField("isActive", checked)}
            />
            <FlagSwitch
              id="preset-default"
              label="Default"
              checked={form.isDefault}
              onCheckedChange={(checked) => setField("isDefault", checked)}
            />
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
                rows={10}
                className="font-mono text-xs"
                value={form.defaultConfiguration}
                onChange={(event) => setField("defaultConfiguration", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preset-schema">Configuration schema</Label>
              <Textarea
                id="preset-schema"
                rows={10}
                className="font-mono text-xs"
                value={form.configurationSchema}
                onChange={(event) => setField("configurationSchema", event.target.value)}
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
