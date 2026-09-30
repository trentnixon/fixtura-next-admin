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
import { AudioPlayer } from "@/components/ui/audio-player";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import {
  useAudioOptions,
  useCreateAudioOption,
  useDeleteAudioOption,
  useUpdateAudioOption,
} from "@/hooks/audio-options/useAudioOptions";
import {
  AudioOption,
  COMPONENT_NAMES,
  COMPOSITION_IDS,
  ComponentName,
  CompositionID,
} from "@/types/audio-option";

const NONE = "none";

function isCompositionId(value: string): value is CompositionID {
  return COMPOSITION_IDS.some((id) => id === value);
}

function isComponentName(value: string): value is ComponentName {
  return COMPONENT_NAMES.some((name) => name === value);
}

export function AudioCatalogue() {
  const { data, isLoading, isError, error, refetch } = useAudioOptions({
    page: 1,
    pageSize: 100,
    sort: "Name:asc",
  });
  const createOption = useCreateAudioOption();
  const updateOption = useUpdateAudioOption();
  const deleteOption = useDeleteAudioOption();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<AudioOption | undefined>();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [compositionId, setCompositionId] = useState<string>(NONE);
  const [componentName, setComponentName] = useState<string>(NONE);
  const [deleteTarget, setDeleteTarget] = useState<AudioOption | undefined>();

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setUrl("");
    setCompositionId(NONE);
    setComponentName(NONE);
    setSheetOpen(true);
  };

  const openEdit = (row: AudioOption) => {
    setEditing(row);
    setName(row.Name);
    setUrl(row.URL ?? "");
    setCompositionId(row.CompositionID ?? NONE);
    setComponentName(row.ComponentName ?? NONE);
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }

    const payload = {
      Name: trimmedName,
      URL: url.trim() || null,
      CompositionID: isCompositionId(compositionId) ? compositionId : null,
      ComponentName: isComponentName(componentName) ? componentName : null,
    };

    try {
      if (editing) {
        await updateOption.mutateAsync({ id: editing.id, data: { data: payload } });
        toast.success("Audio option updated");
      } else {
        await createOption.mutateAsync({
          data: {
            Name: payload.Name,
            URL: payload.URL || undefined,
            CompositionID: payload.CompositionID || undefined,
            ComponentName: payload.ComponentName || undefined,
          },
        });
        toast.success("Audio option created");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOption.mutateAsync(deleteTarget.id);
      toast.success("Audio option deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading audio options..." />;
  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Failed to load audio options"
        onRetry={() => refetch()}
      />
    );
  }

  const rows = data?.data ?? [];
  const saving = createOption.isPending || updateOption.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} audio option{rows.length === 1 ? "" : "s"}
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add audio
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Composition</TableHead>
              <TableHead>Component</TableHead>
              <TableHead>Audio</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No audio options yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.Name || "Untitled"}
                    <div className="text-xs text-muted-foreground">#{row.id}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.CompositionID || "-"}</TableCell>
                  <TableCell className="font-mono text-xs">{row.ComponentName || "-"}</TableCell>
                  <TableCell>
                    {row.URL ? (
                      <AudioPlayer url={row.URL} id={row.id} />
                    ) : (
                      <span className="text-xs text-muted-foreground">No URL</span>
                    )}
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
            <SheetTitle>{editing ? "Edit audio option" : "Add audio option"}</SheetTitle>
            <SheetDescription>
              Name, source URL, and the composition this track belongs to.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-name">Name</Label>
              <Input id="audio-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio-url">URL</Label>
              <Input
                id="audio-url"
                value={url}
                placeholder="https://"
                onChange={(event) => setUrl(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Composition ID</Label>
              <Select value={compositionId} onValueChange={setCompositionId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>None</SelectItem>
                  {COMPOSITION_IDS.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Component name</Label>
              <Select value={componentName} onValueChange={setComponentName}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>None</SelectItem>
                  {COMPONENT_NAMES.map((component) => (
                    <SelectItem key={component} value={component}>
                      {component}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <DialogTitle>Delete audio option</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.Name}? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteOption.isPending}
            >
              {deleteOption.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
