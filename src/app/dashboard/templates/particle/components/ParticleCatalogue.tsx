"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import {
  useCreateTemplateParticle,
  useDeleteTemplateParticle,
  useSetTemplateParticlePublished,
  useTemplateParticles,
  useUpdateTemplateParticle,
} from "@/hooks/template-particle/useTemplateParticle";
import {
  PARTICLE_ANIMATION_TYPES,
  PARTICLE_DIRECTIONS,
  PARTICLE_TYPES,
  ParticleAnimationType,
  ParticleDirection,
  ParticleType,
  PROTECTED_TEMPLATE_PARTICLE_ID,
  TemplateParticle,
} from "@/types/template-particle";
import {
  CatalogueToolbar,
  matchesPublishFilter,
  PublishFilter,
} from "../../components/CatalogueToolbar";
import { StyleCatalogueCard, StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";
import { SwatchPicker } from "../../components/SwatchPicker";
import { humanizeToken } from "../../components/humanizeToken";
import { ParticleSwatch } from "../../components/swatches/ParticleSwatch";

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
  if (Number.isNaN(parsed)) {
    throw new Error(`${label} must be a number`);
  }
  return parsed;
}

export function ParticleCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateParticles();
  const createParticle = useCreateTemplateParticle();
  const updateParticle = useUpdateTemplateParticle();
  const setPublished = useSetTemplateParticlePublished();
  const deleteParticle = useDeleteTemplateParticle();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateParticle | undefined>();
  const [name, setName] = useState("");
  const [particleType, setParticleType] = useState<ParticleType>("dots");
  const [particleCount, setParticleCount] = useState("");
  const [speed, setSpeed] = useState("");
  const [direction, setDirection] = useState<ParticleDirection>("up");
  const [animationType, setAnimationType] = useState<ParticleAnimationType>("none");
  const [deleteTarget, setDeleteTarget] = useState<TemplateParticle | undefined>();
  const [status, setStatus] = useState<PublishFilter>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setParticleType("dots");
    setParticleCount("");
    setSpeed("");
    setDirection("up");
    setAnimationType("none");
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateParticle) => {
    setEditing(row);
    setName(row.name);
    setParticleType(pick(PARTICLE_TYPES, row.particleType, "dots"));
    setParticleCount(row.particleCount === null ? "" : String(row.particleCount));
    setSpeed(row.speed === null ? "" : String(row.speed));
    setDirection(pick(PARTICLE_DIRECTIONS, row.direction, "up"));
    setAnimationType(pick(PARTICLE_ANIMATION_TYPES, row.animationType, "none"));
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    let count: number | null;
    let parsedSpeed: number | null;
    try {
      count = parseOptionalNumber("Particle count", particleCount);
      parsedSpeed = parseOptionalNumber("Speed", speed);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid number");
      return;
    }
    const input = {
      name: trimmedName,
      particleType,
      particleCount: count,
      speed: parsedSpeed,
      direction,
      animationType,
    };
    try {
      if (editing) {
        await updateParticle.mutateAsync({ id: editing.id, input });
        toast.success("Particle updated");
      } else {
        await createParticle.mutateAsync(input);
        toast.success("Particle created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateParticle) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Particle unpublished" : "Particle published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteParticle.mutateAsync(deleteTarget.id);
      toast.success("Particle deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading particles..." />;
  if (isError) {
    return (
      <ErrorState error={error} title="Failed to load particles" onRetry={() => refetch()} />
    );
  }

  const rows = data?.data ?? [];
  const visible = rows.filter(
    (row) =>
      matchesPublishFilter(row.publishedAt, status) &&
      (typeFilter === "all" || row.particleType === typeFilter)
  );
  const saving = createParticle.isPending || updateParticle.isPending;

  return (
    <>
      <CatalogueToolbar
        addLabel="Add particle"
        onAdd={openCreate}
        status={status}
        onStatusChange={setStatus}
        typeValue={typeFilter}
        onTypeChange={setTypeFilter}
        typeOptions={PARTICLE_TYPES.map((type) => ({ value: type, label: humanizeToken(type) }))}
      />

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No particles yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No particles match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((row) => {
            const locked = row.id === PROTECTED_TEMPLATE_PARTICLE_ID;
            const published = Boolean(row.publishedAt);
            const publishing = setPublished.isPending && setPublished.variables?.id === row.id;
            return (
              <StyleCatalogueCard
                key={row.id}
                name={row.name}
                id={row.id}
                typeLabel={humanizeToken(row.particleType) || "No type"}
                detail={`${humanizeToken(row.direction) || "No direction"} · ${humanizeToken(row.animationType) || "No animation"} · ${row.particleCount ?? "—"} · speed ${row.speed ?? "—"}`}
                published={published}
                locked={locked}
                publishDisabled={(locked && published) || publishing}
                onEdit={() => openEdit(row)}
                onTogglePublished={() => togglePublished(row)}
                onDelete={() => setDeleteTarget(row)}
                preview={<ParticleSwatch type={row.particleType} />}
              />
            );
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit particle" : "Add particle"}</SheetTitle>
            <SheetDescription>
              A shared template-style row. Saving it changes every account that still points at this id.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="particle-name">Name</Label>
              <Input
                id="particle-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="h-28 overflow-hidden rounded-md">
              <ParticleSwatch type={particleType} />
            </div>
            <SwatchPicker
              label="Particle type"
              value={particleType}
              options={PARTICLE_TYPES}
              onChange={setParticleType}
              swatch={(type) => <ParticleSwatch type={type} />}
              optionLabel={humanizeToken}
            />
            <div className="space-y-2">
              <Label htmlFor="particle-count">Particle count</Label>
              <Input
                id="particle-count"
                value={particleCount}
                onChange={(event) => setParticleCount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="particle-speed">Speed</Label>
              <Input id="particle-speed" value={speed} onChange={(event) => setSpeed(event.target.value)} />
            </div>
            <EnumSelect
              label="Direction"
              value={direction}
              options={PARTICLE_DIRECTIONS}
              onChange={setDirection}
            />
            <EnumSelect
              label="Animation type"
              value={animationType}
              options={PARTICLE_ANIMATION_TYPES}
              onChange={setAnimationType}
            />
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
            <DialogTitle>Delete particle</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this row will lose it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteParticle.isPending}
            >
              {deleteParticle.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
