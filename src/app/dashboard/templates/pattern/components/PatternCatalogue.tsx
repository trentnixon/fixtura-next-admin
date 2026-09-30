"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  useCreateTemplatePattern,
  useDeleteTemplatePattern,
  useSetTemplatePatternPublished,
  useTemplatePatterns,
  useUpdateTemplatePattern,
} from "@/hooks/template-pattern/useTemplatePattern";
import {
  PATTERN_ANIMATIONS,
  PATTERN_TYPES,
  PatternAnimation,
  PatternType,
  PROTECTED_TEMPLATE_PATTERN_ID,
  TemplatePattern,
} from "@/types/template-pattern";

function pick<T extends string>(options: readonly T[], value: string, fallback: T): T {
  return options.find((option) => option === value) ?? fallback;
}

function EnumSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(next) => onChange(pick(options, next, value))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function parseOptionalNumber(label: string, value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) throw new Error(`${label} must be a number`);
  return parsed;
}

const numberFields = [
  ["scale", "Scale"],
  ["rotation", "Rotation"],
  ["opacity", "Opacity"],
  ["animationDuration", "Animation duration"],
  ["animationSpeed", "Animation speed"],
] as const;

type NumberField = (typeof numberFields)[number][0];

export function PatternCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplatePatterns();
  const createPattern = useCreateTemplatePattern();
  const updatePattern = useUpdateTemplatePattern();
  const setPublished = useSetTemplatePatternPublished();
  const deletePattern = useDeleteTemplatePattern();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplatePattern | undefined>();
  const [name, setName] = useState("");
  const [patternType, setPatternType] = useState<PatternType>("lines");
  const [animation, setAnimation] = useState<PatternAnimation>("none");
  const [numbers, setNumbers] = useState<Record<NumberField, string>>({
    scale: "",
    rotation: "",
    opacity: "",
    animationDuration: "",
    animationSpeed: "",
  });
  const [deleteTarget, setDeleteTarget] = useState<TemplatePattern | undefined>();

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setPatternType("lines");
    setAnimation("none");
    setNumbers({ scale: "", rotation: "", opacity: "", animationDuration: "", animationSpeed: "" });
    setSheetOpen(true);
  };

  const openEdit = (row: TemplatePattern) => {
    setEditing(row);
    setName(row.name);
    setPatternType(pick(PATTERN_TYPES, row.patternType, "lines"));
    setAnimation(pick(PATTERN_ANIMATIONS, row.animation, "none"));
    setNumbers({
      scale: row.scale === null ? "" : String(row.scale),
      rotation: row.rotation === null ? "" : String(row.rotation),
      opacity: row.opacity === null ? "" : String(row.opacity),
      animationDuration: row.animationDuration === null ? "" : String(row.animationDuration),
      animationSpeed: row.animationSpeed === null ? "" : String(row.animationSpeed),
    });
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    let parsed: Record<NumberField, number | null>;
    try {
      parsed = {
        scale: parseOptionalNumber("Scale", numbers.scale),
        rotation: parseOptionalNumber("Rotation", numbers.rotation),
        opacity: parseOptionalNumber("Opacity", numbers.opacity),
        animationDuration: parseOptionalNumber("Animation duration", numbers.animationDuration),
        animationSpeed: parseOptionalNumber("Animation speed", numbers.animationSpeed),
      };
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid number");
      return;
    }
    const input = { name: trimmedName, patternType, animation, ...parsed };
    try {
      if (editing) {
        await updatePattern.mutateAsync({ id: editing.id, input });
        toast.success("Pattern updated");
      } else {
        await createPattern.mutateAsync(input);
        toast.success("Pattern created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplatePattern) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Pattern unpublished" : "Pattern published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePattern.mutateAsync(deleteTarget.id);
      toast.success("Pattern deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading patterns..." />;
  if (isError) {
    return <ErrorState error={error} title="Failed to load patterns" onRetry={() => refetch()} />;
  }

  const rows = data?.data ?? [];
  const saving = createPattern.isPending || updatePattern.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} pattern{rows.length === 1 ? "" : "s"}. These settings are still projected. Pattern is not a legal background mode.
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add pattern
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Animation</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No patterns yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const locked = row.id === PROTECTED_TEMPLATE_PATTERN_ID;
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.name || "Untitled"}
                      <div className="text-xs text-muted-foreground">#{row.id}</div>
                    </TableCell>
                    <TableCell>{row.patternType || "-"}</TableCell>
                    <TableCell className="text-sm">
                      {row.animation || "-"}
                      <div className="text-xs text-muted-foreground">
                        scale {row.scale ?? "-"} · opacity {row.opacity ?? "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.publishedAt ? "Published" : "Draft"}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={locked && Boolean(row.publishedAt)}
                        onClick={() => togglePublished(row)}
                      >
                        {row.publishedAt ? "Unpublish" : "Publish"}
                      </Button>
                      <Button variant="ghost" size="sm" disabled={locked} onClick={() => setDeleteTarget(row)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit pattern" : "Add pattern"}</SheetTitle>
            <SheetDescription>
              A shared template-style row. Saving it changes every account that still points at this id.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pattern-name">Name</Label>
              <Input id="pattern-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <EnumSelect label="Pattern type" value={patternType} options={PATTERN_TYPES} onChange={setPatternType} />
            <EnumSelect label="Animation" value={animation} options={PATTERN_ANIMATIONS} onChange={setAnimation} />
            {numberFields.map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`pattern-${key}`}>{label}</Label>
                <Input
                  id={`pattern-${key}`}
                  value={numbers[key]}
                  onChange={(event) =>
                    setNumbers((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              </div>
            ))}
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
            <DialogTitle>Delete pattern</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this row will lose it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deletePattern.isPending}>
              {deletePattern.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
