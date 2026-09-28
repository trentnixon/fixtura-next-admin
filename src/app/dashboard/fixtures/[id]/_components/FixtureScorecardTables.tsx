"use client";

import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import type {
  FallOfWicketsBlock,
  ScorecardTableBlock,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureScorecardDisplay";
import {
  inningsLabelFromKey,
  isPlayHqBattingShape,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureScorecardDisplay";
import type { BattingPlayer, BowlingPlayer } from "@/types/fixtureDetail";
import type { TeamScorecardData } from "@/types/fixtureDetail";
import { cn } from "@/lib/utils";

/** Flush tables inside the scorecard card (no nested rounded borders). */
function ScorecardTableShell({
  children,
  className,
  withTopBorder = true,
}: {
  children: ReactNode;
  className?: string;
  withTopBorder?: boolean;
}) {
  return (
    <div
      className={cn(
        "[&>div]:rounded-none [&>div]:border-0 [&>div]:border-slate-200",
        withTopBorder && "[&>div]:border-t",
        className,
      )}
    >
      {children}
    </div>
  );
}

const scorecardHeadBase =
  "px-4 text-xs font-semibold text-slate-600 sm:px-5";
const scorecardCellBase = "px-4 sm:px-5";

function statColumnsFromBattingHeaders(headers: string[]): string[] {
  if (!isPlayHqBattingShape(headers)) return headers.slice(1);
  return headers.filter(
    (h) => !/^(batters|how out)$/i.test(h.trim()),
  );
}

function BattingScorecardTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  const playHq = isPlayHqBattingShape(headers);
  const statHeaders = playHq ? statColumnsFromBattingHeaders(headers) : headers.slice(1);
  const howOutIndex = playHq
    ? headers.findIndex((h) => /^how out$/i.test(h.trim()))
    : -1;
  const statStartIndex = playHq && howOutIndex >= 0 ? howOutIndex + 1 : 1;

  return (
    <ScorecardTableShell withTopBorder={false}>
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead
              className={cn(scorecardHeadBase, "h-9 font-semibold text-slate-700")}
            >
              {playHq ? "Batters" : headers[0] ?? "Player"}
            </TableHead>
            {statHeaders.map((header, i) => (
              <TableHead
                key={`${header}-${i}`}
                className={cn(
                  scorecardHeadBase,
                  "h-9 w-12 text-right font-semibold text-slate-700 whitespace-nowrap",
                )}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIdx) => {
            const name = row[0] ?? "—";
            const dismissal =
              playHq && howOutIndex >= 0 ? row[howOutIndex]?.trim() : "";
            const stats = row.slice(statStartIndex);

            return (
              <TableRow
                key={rowIdx}
                className="border-slate-100 hover:bg-slate-50/50"
              >
                <TableCell className={cn(scorecardCellBase, "py-2.5 align-top")}>
                  <div className="text-sm font-medium text-slate-900">{name}</div>
                  {playHq && dismissal ? (
                    <div className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {dismissal}
                    </div>
                  ) : null}
                </TableCell>
                {statHeaders.map((_, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className={cn(
                      scorecardCellBase,
                      "py-2.5 text-right text-sm tabular-nums text-slate-800",
                    )}
                  >
                    {stats[colIdx] ?? "—"}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScorecardTableShell>
  );
}

function CompactStatsTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div>
      <p
        className={cn(
          scorecardCellBase,
          "border-b border-t border-slate-200 bg-slate-50/80 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600",
        )}
      >
        {title}
      </p>
      <ScorecardTableShell withTopBorder={false}>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent">
              {headers.map((header, i) => (
                <TableHead
                  key={`${header}-${i}`}
                  className={cn(
                    scorecardHeadBase,
                    "h-8",
                    i === 0 ? "" : "text-right whitespace-nowrap",
                  )}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIdx) => (
              <TableRow key={rowIdx} className="border-slate-100">
                {headers.map((_, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className={cn(
                      scorecardCellBase,
                      "py-2 text-sm",
                      colIdx === 0
                        ? "font-medium text-slate-900"
                        : "text-right tabular-nums text-slate-800",
                    )}
                  >
                    {row[colIdx] ?? "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScorecardTableShell>
    </div>
  );
}

function FallOfWicketsSection({ fow }: { fow: FallOfWicketsBlock }) {
  return (
    <div>
      <p
        className={cn(
          scorecardCellBase,
          "border-b border-t border-slate-200 bg-slate-50/80 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600",
        )}
      >
        Fall of wickets
      </p>
      {fow.kind === "chips" ? (
        <div className={cn(scorecardCellBase, "flex flex-wrap gap-2 py-3")}>
          {fow.items.map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs tabular-nums text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ScorecardTableShell withTopBorder={false}>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                {fow.headers.map((header, i) => (
                  <TableHead
                    key={`${header}-${i}`}
                    className={cn(
                      scorecardHeadBase,
                      "h-8",
                      i === 0 ? "" : "text-right",
                    )}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fow.rows.map((row, rowIdx) => (
                <TableRow key={rowIdx} className="border-slate-100">
                  {fow.headers.map((_, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className={cn(
                        scorecardCellBase,
                        "py-2 text-sm",
                        colIdx === 0
                          ? "font-medium text-slate-900"
                          : "text-right tabular-nums text-slate-800",
                      )}
                    >
                      {row[colIdx] ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScorecardTableShell>
      )}
    </div>
  );
}

function InningsScorecardBlockContent({ block }: { block: ScorecardTableBlock }) {
  const bowlingLabel =
    block.bowlingTitle &&
    block.bowlingTitle !== block.title &&
    block.bowlingTitle.length > 0
      ? block.bowlingTitle
      : "Bowling";

  return (
    <div className="space-y-0">
      <p
        className={cn(
          scorecardCellBase,
          "border-b border-slate-200 py-2.5 text-sm font-medium text-slate-900",
        )}
      >
        {block.title}
      </p>
      {block.batting ? (
        <BattingScorecardTable
          headers={block.batting.headers}
          rows={block.batting.rows}
        />
      ) : null}
      {block.fallOfWickets ? (
        <FallOfWicketsSection fow={block.fallOfWickets} />
      ) : null}
      {block.bowling ? (
        <CompactStatsTable
          title={bowlingLabel}
          headers={block.bowling.headers}
          rows={block.bowling.rows}
        />
      ) : null}
      {block.fielders ? (
        <CompactStatsTable
          title="Fielding"
          headers={block.fielders.headers}
          rows={block.fielders.rows}
        />
      ) : null}
    </div>
  );
}

export function InningsScorecardBlocks({
  blocks,
}: {
  blocks: ScorecardTableBlock[];
}) {
  if (blocks.length === 0) return null;

  if (blocks.length === 1) {
    return <InningsScorecardBlockContent block={blocks[0]} />;
  }

  const defaultTab = blocks[0].key;

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div
        className={cn(
          scorecardCellBase,
          "border-b border-slate-200 bg-slate-50/60 py-3",
        )}
      >
        <TabsList variant="primary" className={sectionTabListClass}>
          {blocks.map((block) => (
            <TabsTrigger
              key={block.key}
              value={block.key}
              variant="section"
              className={sectionTabTriggerClass}
            >
              {inningsLabelFromKey(block.key)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {blocks.map((block) => (
        <TabsContent key={block.key} value={block.key} className="mt-0">
          <InningsScorecardBlockContent block={block} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function LegacyTeamScorecardTables({
  teamName,
  teamData,
}: {
  teamName: string;
  teamData: TeamScorecardData;
}) {
  return (
    <div className="overflow-hidden border-t border-slate-200">
      <p
        className={cn(
          scorecardCellBase,
          "border-b border-slate-200 bg-slate-50/80 py-2.5 text-sm font-medium text-slate-900",
        )}
      >
        {teamName}
      </p>

      {teamData.batting && teamData.batting.length > 0 ? (
        <ScorecardTableShell withTopBorder={false}>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className={cn(scorecardHeadBase, "font-semibold")}>
                  Batter
                </TableHead>
                <TableHead className={cn(scorecardHeadBase, "text-right")}>
                  R
                </TableHead>
                <TableHead className={cn(scorecardHeadBase, "text-right")}>
                  B
                </TableHead>
                <TableHead className={cn(scorecardHeadBase, "text-right")}>
                  4s
                </TableHead>
                <TableHead className={cn(scorecardHeadBase, "text-right")}>
                  6s
                </TableHead>
                <TableHead className={cn(scorecardHeadBase, "text-right")}>
                  SR
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamData.batting.map((player: BattingPlayer, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className={cn(scorecardCellBase, "align-top py-2.5")}>
                    <div className="text-sm font-medium text-slate-900">
                      {player.name || player.player}
                    </div>
                    {player.dismissal ? (
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {player.dismissal}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell
                    className={cn(scorecardCellBase, "text-right tabular-nums")}
                  >
                    {player.runs || player.R || "—"}
                  </TableCell>
                  <TableCell
                    className={cn(scorecardCellBase, "text-right tabular-nums")}
                  >
                    {player.balls || player.B || "—"}
                  </TableCell>
                  <TableCell
                    className={cn(scorecardCellBase, "text-right tabular-nums")}
                  >
                    {player.fours || player["4s"] || "—"}
                  </TableCell>
                  <TableCell
                    className={cn(scorecardCellBase, "text-right tabular-nums")}
                  >
                    {player.sixes || player["6s"] || "—"}
                  </TableCell>
                  <TableCell
                    className={cn(scorecardCellBase, "text-right tabular-nums")}
                  >
                    {player.strikeRate || player.SR || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScorecardTableShell>
      ) : null}

      {teamData.bowling && teamData.bowling.length > 0 ? (
        <CompactStatsTable
          title="Bowling"
          headers={["Bowler", "O", "M", "R", "W", "Econ"]}
          rows={teamData.bowling.map((player: BowlingPlayer) => [
            player.name || player.player || "—",
            String(player.overs || player.O || "—"),
            String(player.maidens || player.M || "—"),
            String(player.runs || player.R || "—"),
            String(player.wickets || player.W || "—"),
            String(player.economy || player.Econ || "—"),
          ])}
        />
      ) : null}
    </div>
  );
}
