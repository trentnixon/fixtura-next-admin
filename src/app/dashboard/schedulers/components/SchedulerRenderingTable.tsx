"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatabaseIcon, EyeIcon, PlayCircle, Clock } from "lucide-react";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";

export function SchedulerRenderingTable() {
  const { data } = useSchedulerRollup();
  const { strapiLocation } = useGlobalContext();

  const renderingItems = data?.ListOfSchedulersRenderingWithIDS || [];
  const queuedItems = data?.ListOfSchedulersQueuedWithIDS || [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Rendering Table */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <PlayCircle className="h-4 w-4 text-blue-500 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Renders</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 border-b border-slate-200">
                <TableHead className="text-left font-semibold text-slate-900">Name</TableHead>
                <TableHead className="text-center font-semibold text-slate-900 w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderingItems.map((scheduler) => (
                <TableRow key={scheduler.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                  <TableCell className="text-left font-medium py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{scheduler.Name}</span>
                      <span className="text-[9px] text-slate-400 font-normal">ID: {scheduler.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`${strapiLocation.scheduler}${scheduler.id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                          <DatabaseIcon className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/schedulers/${scheduler.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                          <EyeIcon className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {renderingItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-10 text-slate-400 italic text-sm">
                    No active renders
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Queued Table */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Clock className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">System Queue</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 border-b border-slate-200">
                <TableHead className="text-left font-semibold text-slate-900">Name</TableHead>
                <TableHead className="text-center font-semibold text-slate-900 w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queuedItems.map((scheduler) => (
                <TableRow key={scheduler.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                  <TableCell className="text-left font-medium py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{scheduler.Name}</span>
                      <span className="text-[9px] text-slate-400 font-normal">ID: {scheduler.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`${strapiLocation.scheduler}${scheduler.id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                          <DatabaseIcon className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/schedulers/${scheduler.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                          <EyeIcon className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {queuedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-10 text-slate-400 italic text-sm">
                    Queue is empty
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
