"use client";

import { useRenderDistribution } from "@/hooks/renders/useRenderDistribution";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Video, Image as ImageIcon, FileText } from "lucide-react";
import { formatNumber } from "@/utils/chart-formatters";

export function RenderResourceLeaders() {
    const { data, isLoading, isError, error } = useRenderDistribution();

    if (isLoading) return <LoadingState message="Fetching leaderboards..." />;
    if (isError) return <ErrorState error={error} title="Distribution Error" />;
    if (!data) return null;

    const totalAssets = data.assetDistribution.video + data.assetDistribution.image + data.assetDistribution.content;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Leaderboard */}
            <div className="lg:col-span-2">
                <SectionContainer
                    title="Account Leaderboard"
                    description="Top 10 accounts by render volume (Heavy Hitters)"
                >
                    <div className="rounded-md border bg-white overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[60px] text-center">Rank</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Sport</TableHead>
                                    <TableHead className="text-right">Volume</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.topAccounts.map((account, index) => (
                                    <TableRow key={account.accountId} className="group cursor-default hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="text-center font-bold text-slate-400 group-hover:text-amber-500">
                                            {index === 0 ? <Trophy className="h-4 w-4 mx-auto text-amber-500" /> : index + 1}
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-700">
                                            {account.accountName || "Unknown Account"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize bg-slate-50">
                                                {account.accountType?.toLowerCase() || "N/A"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500">
                                            {account.accountSport || "General"}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-medium text-slate-700">
                                            {formatNumber(account.renderCount)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </SectionContainer>
            </div>

            {/* Global Asset Mix */}
            <div className="lg:col-span-1">
                <SectionContainer
                    title="Global Asset Mix"
                    description="Total production across all renders"
                >
                    <div className="space-y-4">
                        {/* Video */}
                        <AssetStatItem
                            label="Videos"
                            value={data.assetDistribution.video}
                            total={totalAssets}
                            icon={<Video className="h-5 w-5 text-red-500" />}
                            colorClass="bg-red-500"
                        />
                        {/* Image */}
                        <AssetStatItem
                            label="Images"
                            value={data.assetDistribution.image}
                            total={totalAssets}
                            icon={<ImageIcon className="h-5 w-5 text-blue-500" />}
                            colorClass="bg-blue-500"
                        />
                        {/* Content/AI */}
                        <AssetStatItem
                            label="AI Articles & Content"
                            value={data.assetDistribution.content}
                            total={totalAssets}
                            icon={<FileText className="h-5 w-5 text-emerald-500" />}
                            colorClass="bg-emerald-500"
                        />

                        <div className="pt-6 mt-6 border-t border-slate-100">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Cumulative</p>
                                    <p className="text-2xl font-black text-slate-800 tracking-tight">{formatNumber(totalAssets)}</p>
                                </div>
                                <Users className="h-8 w-8 text-slate-200" />
                            </div>
                        </div>
                    </div>
                </SectionContainer>
            </div>
        </div>
    );
}

function AssetStatItem({ label, value, total, icon, colorClass }: {
    label: string;
    value: number;
    total: number;
    icon: React.ReactNode;
    colorClass: string;
}) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
        <div className="group">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all shadow-sm group-hover:shadow">
                        {icon}
                    </div>
                    <span className="text-sm font-bold text-slate-600 tracking-tight">{label}</span>
                </div>
                <div className="text-right">
                    <span className="text-sm font-black text-slate-800 block">{formatNumber(value)}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{percentage.toFixed(1)}% Mix</span>
                </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
