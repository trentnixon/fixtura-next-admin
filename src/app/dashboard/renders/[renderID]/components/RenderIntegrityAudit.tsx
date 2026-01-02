"use client";

import { useParams } from "next/navigation";
import { useRenderLineage } from "@/hooks/renders/useRenderLineage";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Search,
    Fingerprint,
    Database,
    Info
} from "lucide-react";
import { formatNumber } from "@/utils/chart-formatters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RenderIntegrityAudit() {
    const { renderID } = useParams();
    const { data, isLoading, isError, error, refetch } = useRenderLineage(renderID as string, true);

    if (isLoading) return <LoadingState message="Performing deep DNA audit..." />;
    if (isError) return <ErrorState error={error} title="Audit Failed" onRetry={() => refetch()} />;
    if (!data || !data.integrityCheck) {
        return (
            <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                    <Search className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No integrity data available for this render.</p>
                </CardContent>
            </Card>
        );
    }

    const { integrityCheck } = data;
    const { summary, warnings, errors, fixtureAnalysis } = integrityCheck;

    return (
        <div className="space-y-6">
            {/* Audit Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Fingerprint className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Render DNA Audit</h3>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                            Last Checked: {new Date(integrityCheck.timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {errors.length > 0 && (
                        <Badge variant="destructive" className="px-3 py-1">
                            <XCircle className="h-3 w-3 mr-1" /> {errors.length} Critical Issues
                        </Badge>
                    )}
                    {warnings.length > 0 && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 px-3 py-1">
                            <AlertTriangle className="h-3 w-3 mr-1" /> {warnings.length} Warnings
                        </Badge>
                    )}
                    {errors.length === 0 && warnings.length === 0 && (
                        <Badge variant="default" className="bg-emerald-500 px-3 py-1">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Integrity Verified
                        </Badge>
                    )}
                </div>
            </div>

            {/* Critical Errors */}
            {errors.length > 0 && (
                <div className="space-y-2">
                    {errors.map((err, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 shadow-sm">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight">Critical Integrity Error</p>
                                <p className="text-sm font-medium">{err}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="space-y-2">
                    {warnings.map((warn, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 shadow-sm">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight">Audit Warning</p>
                                <p className="text-sm font-medium">{warn}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AuditStatCard label="Grades" value={summary.totalGrades} color="blue" />
                <AuditStatCard label="Fixtures" value={summary.totalFixtures} color="indigo" />
                <AuditStatCard label="Assets" value={summary.totalDownloads + summary.totalAiArticles} color="emerald" />
                <AuditStatCard label="Missing" value={summary.missingFixtureCount} color={summary.missingFixtureCount > 0 ? "red" : "slate"} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Missing Fixtures Analysis */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Search className="h-4 w-4 text-slate-400" />
                            Fixture Coverage Analysis
                        </CardTitle>
                        <CardDescription>Identifying gaps between expected and actual data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {fixtureAnalysis.missingFixtures.length === 0 ? (
                            <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                                <p className="text-sm font-medium text-slate-600">All expected fixtures are present.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {fixtureAnalysis.missingFixtures.map((missing, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                        <Info className="h-4 w-4 text-red-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-red-900">{missing.gradeName}</p>
                                            <p className="text-xs text-red-700">{missing.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* System DNA Notes */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Database className="h-4 w-4 text-slate-400" />
                            System Troubleshooting Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 italic text-slate-600 text-sm">
                            &quot;This deep audit performs a full relational expansion of the render object to detect discrepancies between the scheduler configuration and the generated output.
                            Common causes for missing fixtures include game cancellations, data delays from sports providers, or team filtering rules.&quot;
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <div>Videos: {integrityCheck.assetAnalysis.downloadsByCategory.VIDEO || 0}</div>
                            <div>Images: {integrityCheck.assetAnalysis.downloadsByCategory.IMAGE || 0}</div>
                            <div>Articles: {summary.totalAiArticles}</div>
                            <div>Grade ID Mapping: {summary.totalGrades} items</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function AuditStatCard({ label, value, color }: { label: string; value: number; color: string }) {
    const colorMap: Record<string, string> = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        red: "text-red-600 bg-red-50 border-red-100",
        slate: "text-slate-600 bg-slate-50 border-slate-100",
    };

    return (
        <div className={`p-4 rounded-xl border ${colorMap[color] || colorMap.slate} transition-all`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</p>
            <p className="text-2xl font-black">{formatNumber(value)}</p>
        </div>
    );
}
