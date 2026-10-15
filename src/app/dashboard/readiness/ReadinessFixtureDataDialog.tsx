"use client";

import type { ReactNode } from "react";
import { getTeamsDisplay } from "@/app/dashboard/fixtures/_components/_utils/fixtureUtils";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FixtureSummary } from "@/types/fixtureInsights";
import type { SingleFixtureDetailResponse } from "@/types/fixtureDetail";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLabel(value: unknown): value is { text?: unknown; mapsQuery?: unknown } {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => key === "text" || key === "mapsQuery");
}

function isScalar(value: unknown): boolean {
  return (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function fieldLabel(key: string): string {
  if (key === "gameID") return "Game ID";
  if (key === "urlToScoreCard") return "Scorecard URL";
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function textOf(value: unknown): string | null {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (isLabel(value)) return textOf(value.text);
  return null;
}

function isLongText(value: unknown): boolean {
  const text = textOf(value);
  return text != null && (text.length > 80 || text.includes("\n"));
}

function EmptyValue() {
  return <span className="text-muted-foreground">—</span>;
}

function ScalarValue({ value }: { value: unknown }) {
  const text = textOf(value);
  if (text == null) return <EmptyValue />;
  if (/^https?:\/\//i.test(text)) {
    return (
      <a
        href={text}
        target="_blank"
        rel="noreferrer"
        className="break-all underline"
      >
        {text}
      </a>
    );
  }
  return <span className="whitespace-pre-wrap break-words">{text}</span>;
}

function FieldGrid({ entries }: { entries: [string, unknown][] }) {
  if (entries.length === 0) return <EmptyValue />;
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key} className={isLongText(value) ? "col-span-full" : undefined}>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {fieldLabel(key)}
          </dt>
          <dd className="mt-0.5 text-sm text-slate-900">
            <ScalarValue value={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200">
      <h3 className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900">
        {title}
      </h3>
      <div className="space-y-4 p-3">{children}</div>
    </section>
  );
}

function Subhead({ title }: { title: string }) {
  return <h4 className="text-xs font-medium text-slate-700">{title}</h4>;
}

function MatrixTable({
  headers,
  rows,
}: {
  headers: string[] | null;
  rows: unknown[];
}) {
  const matrix = rows.filter((row): row is unknown[] => Array.isArray(row));
  if (matrix.length === 0) return <EmptyValue />;
  const width = Math.max(headers?.length ?? 0, ...matrix.map((row) => row.length));
  const head =
    headers != null && headers.length > 0
      ? Array.from({ length: width }, (_, index) => headers[index] ?? "")
      : null;
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="w-full min-w-max border-collapse text-left text-xs">
        {head ? (
          <thead className="bg-slate-50">
            <tr>
              {head.map((cell, index) => (
                <th key={index} className="whitespace-nowrap px-2 py-1.5 font-medium text-slate-600">
                  {cell || "—"}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-slate-200">
              {Array.from({ length: width }, (_, index) => (
                <td key={index} className="whitespace-nowrap px-2 py-1.5 text-slate-900">
                  <ScalarValue value={row[index] ?? null} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const COLUMN_ORDER = [
  "name",
  "player",
  "dismissal",
  "runs",
  "R",
  "balls",
  "B",
  "fours",
  "4s",
  "sixes",
  "6s",
  "strikeRate",
  "SR",
  "overs",
  "O",
  "maidens",
  "M",
  "wickets",
  "W",
  "economy",
  "Econ",
];

function orderedKeys(keys: string[]): string[] {
  const preferred = COLUMN_ORDER.filter((key) => keys.includes(key));
  const rest = keys.filter((key) => !preferred.includes(key)).sort();
  return [...preferred, ...rest];
}

function flatRecords(value: unknown[]): Record<string, unknown>[] | null {
  if (!value.every(isRecord)) return null;
  const nested = value.some((row) =>
    Object.values(row).some(
      (cell) => cell != null && typeof cell === "object" && !isLabel(cell),
    ),
  );
  if (nested) return null;
  return value;
}

function RecordTable({ rows }: { rows: Record<string, unknown>[] }) {
  const keys = orderedKeys([...new Set(rows.flatMap((row) => Object.keys(row)))]);
  if (keys.length === 0) return <EmptyValue />;
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="w-full min-w-max border-collapse text-left text-xs">
        <thead className="bg-slate-50">
          <tr>
            {keys.map((key) => (
              <th key={key} className="whitespace-nowrap px-2 py-1.5 font-medium text-slate-600">
                {fieldLabel(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-slate-200">
              {keys.map((key) => (
                <td key={key} className="px-2 py-1.5 align-top text-slate-900">
                  <ScalarValue value={row[key] ?? null} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function stringHeaders(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) return null;
  return value;
}

function isInningsShape(value: Record<string, unknown>): boolean {
  return (
    "battingRows" in value ||
    "bowlingRows" in value ||
    "batting" in value ||
    "bowling" in value
  );
}

function ArrayView({ value }: { value: unknown[] }) {
  if (value.length === 0) return <EmptyValue />;
  if (value.every((item) => Array.isArray(item))) {
    return <MatrixTable headers={null} rows={value} />;
  }
  if (value.every(isScalar)) {
    const long = value.some((item) => isLongText(item));
    if (long) {
      return (
        <ul className="space-y-2">
          {value.map((item, index) => (
            <li key={index} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
              <ScalarValue value={item} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <ul className="flex flex-wrap gap-1.5">
        {value.map((item, index) => (
          <li key={index} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-800">
            <ScalarValue value={item} />
          </li>
        ))}
      </ul>
    );
  }
  const rows = flatRecords(value);
  if (rows) return <RecordTable rows={rows} />;
  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="rounded-md border border-slate-200 p-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {index + 1}
          </p>
          <NodeView value={item} />
        </div>
      ))}
    </div>
  );
}

function InningsView({ value }: { value: Record<string, unknown> }) {
  const consumed = new Set<string>();
  const blocks: ReactNode[] = [];

  function takeMatrix(rowsKey: string, headersKey: string, nameKey: string, title: string) {
    if (!(rowsKey in value) && !(headersKey in value) && !(nameKey in value)) return;
    consumed.add(rowsKey);
    consumed.add(headersKey);
    consumed.add(nameKey);
    const rows = value[rowsKey];
    const name = textOf(value[nameKey]);
    blocks.push(
      <div key={rowsKey} className="space-y-2">
        <Subhead title={name ? `${title} · ${name}` : title} />
        {Array.isArray(rows) ? (
          <MatrixTable headers={stringHeaders(value[headersKey])} rows={rows} />
        ) : (
          <NodeView value={rows} />
        )}
      </div>,
    );
  }

  function takePlayers(key: string, title: string) {
    if (!(key in value)) return;
    consumed.add(key);
    const rows = value[key];
    blocks.push(
      <div key={key} className="space-y-2">
        <Subhead title={title} />
        {Array.isArray(rows) ? <ArrayView value={rows} /> : <NodeView value={rows} />}
      </div>,
    );
  }

  takeMatrix("battingRows", "Battingheaders", "BattinginningsName", "Batting");
  takeMatrix("bowlingRows", "Bowlingheaders", "BowlinginningsName", "Bowling");
  takePlayers("batting", "Batting");
  takePlayers("bowling", "Bowling");

  if (isRecord(value.fieldersData)) {
    consumed.add("fieldersData");
    const fielders = value.fieldersData;
    blocks.push(
      <div key="fielders" className="space-y-2">
        <Subhead title="Fielders" />
        {Array.isArray(fielders.fieldersData) ? (
          <MatrixTable headers={stringHeaders(fielders.headers)} rows={fielders.fieldersData} />
        ) : (
          <RecordView value={fielders} />
        )}
      </div>,
    );
  }

  if ("FOW" in value) {
    consumed.add("FOW");
    blocks.push(
      <div key="fow" className="space-y-2">
        <Subhead title="Fall of wickets" />
        <NodeView value={value.FOW} />
      </div>,
    );
  }

  const rest = Object.fromEntries(
    Object.entries(value).filter(([key]) => !consumed.has(key)),
  );

  return (
    <div className="space-y-4">
      {Object.keys(rest).length > 0 ? <RecordView value={rest} /> : null}
      {blocks}
    </div>
  );
}

function entriesOf(value: object): [string, unknown][] {
  return Object.entries(value).map(([key, child]) => [key, child]);
}

function RecordView({ value }: { value: object }) {
  const entries = entriesOf(value);
  const record = Object.fromEntries(entries);
  if (isInningsShape(record)) return <InningsView value={record} />;
  const scalars: [string, unknown][] = [];
  const nested: [string, unknown][] = [];
  for (const entry of entries) {
    if (isScalar(entry[1]) || isLabel(entry[1])) scalars.push(entry);
    else nested.push(entry);
  }
  return (
    <div className="space-y-4">
      {scalars.length > 0 ? <FieldGrid entries={scalars} /> : null}
      {nested.map(([key, child]) => (
        <div key={key} className="space-y-2">
          <Subhead title={fieldLabel(key)} />
          <NodeView value={child} />
        </div>
      ))}
    </div>
  );
}

function NodeView({ value }: { value: unknown }) {
  if (isScalar(value) || isLabel(value)) return <ScalarValue value={value} />;
  if (Array.isArray(value)) return <ArrayView value={value} />;
  if (isRecord(value)) return <RecordView value={value} />;
  return <EmptyValue />;
}

function venueEntries(
  ground: SingleFixtureDetailResponse["fixture"]["venue"]["ground"],
): [string, unknown][] {
  if (typeof ground === "string" || ground == null) return [["Ground", ground]];
  return [
    ["Ground", ground.text ?? null],
    ["Maps", ground.mapsQuery ?? null],
  ];
}

function TeamCard({
  title,
  team,
}: {
  title: string;
  team: SingleFixtureDetailResponse["fixture"]["teams"]["home"];
}) {
  const scores: [string, unknown][] = [
    ["Total", team.scores.total],
    ["Overs", team.scores.overs],
    ["1st innings", team.scores.firstInnings],
  ];
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <Subhead title={title} />
      <p className="mt-1 text-sm font-medium text-slate-900">
        {team.name?.trim() ? team.name : "—"}
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {scores.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-0.5 text-sm text-slate-900">
              <ScalarValue value={value} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function summaryEntries(fixture: FixtureSummary): [string, unknown][] {
  return [
    ["Competition", fixture.competition?.name ?? null],
    ["Grade", fixture.grade?.name ?? null],
    ["Association", fixture.association?.name ?? null],
    ["Status", toFixtureDisplayText(fixture.status, "")],
    ["Type", toFixtureDisplayText(fixture.type, "")],
    ["Round", toFixtureDisplayText(fixture.round, "")],
    ["Date", fixture.date],
    ["Home", toFixtureDisplayText(fixture.teams.home, "")],
    ["Away", toFixtureDisplayText(fixture.teams.away, "")],
    ["Fixture ID", fixture.id],
  ];
}

function DetailBody({
  fixture,
  detail,
}: {
  fixture: FixtureSummary;
  detail: SingleFixtureDetailResponse;
}) {
  const data = detail.fixture;
  return (
    <div className="space-y-3">
      <Panel title="Fixture">
        <FieldGrid
          entries={[
            ["Competition", fixture.competition?.name ?? null],
            ["Grade", detail.grade?.gradeName ?? fixture.grade?.name ?? null],
            [
              "Association",
              detail.grade?.association?.name ?? fixture.association?.name ?? null,
            ],
            ["Status", data.status],
            ["Type", data.type],
            ["Round", data.round],
            ["Game ID", data.gameID],
            ["Finished", data.isFinished],
            ["Fixture ID", data.id],
          ]}
        />
      </Panel>
      <Panel title="Dates">
        <RecordView value={data.dates} />
      </Panel>
      <Panel title="Venue">
        <FieldGrid entries={venueEntries(data.venue.ground)} />
      </Panel>
      <Panel title="Teams">
        <div className="grid gap-3 sm:grid-cols-2">
          <TeamCard title="Home" team={data.teams.home} />
          <TeamCard title="Away" team={data.teams.away} />
        </div>
      </Panel>
      <Panel title="Match">
        <RecordView value={data.matchDetails} />
      </Panel>
      {data.teamRoster ? (
        <Panel title="Roster">
          <RecordView value={data.teamRoster} />
        </Panel>
      ) : null}
      <Panel title="Content">
        <RecordView value={data.content} />
      </Panel>
      {detail.grade ? (
        <Panel title="Grade">
          <RecordView value={detail.grade} />
        </Panel>
      ) : null}
      <Panel title="Teams on fixture">
        <ArrayView value={detail.teamsData} />
      </Panel>
      <Panel title="Clubs">
        <ArrayView value={detail.club} />
      </Panel>
      <Panel title="Downloads">
        <ArrayView value={detail.downloads} />
      </Panel>
      <Panel title="Renders">
        <RecordView value={detail.renderStatus} />
      </Panel>
      <Panel title="Context">
        <RecordView value={detail.context} />
      </Panel>
      <Panel title="Meta">
        <RecordView value={detail.meta} />
      </Panel>
    </div>
  );
}

export function ReadinessFixtureDataDialog({
  fixture,
  detail,
  open,
  onOpenChange,
}: {
  fixture: FixtureSummary | null;
  detail: SingleFixtureDetailResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const description = fixture
    ? [fixture.competition?.name, fixture.grade?.name, `Fixture ${fixture.id}`]
        .filter((part) => part != null && part !== "")
        .join(" · ")
    : "Fixture detail";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-slate-200 px-6 py-4 pr-12">
          <DialogTitle>{fixture ? getTeamsDisplay(fixture) : "Fixture"}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {fixture && detail ? (
            <DetailBody fixture={fixture} detail={detail} />
          ) : fixture ? (
            <div className="space-y-3">
              <Panel title="Fixture">
                <FieldGrid entries={summaryEntries(fixture)} />
              </Panel>
              <p className="text-sm text-muted-foreground">Fixture detail is still loading.</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FixtureDataButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="secondary" size="sm" onClick={onClick}>
      Data
    </Button>
  );
}
