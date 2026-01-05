"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
    url: string;
    id: string | number;
    className?: string;
}

/**
 * AudioPlayer Component
 *
 * Features:
 * - Play/Pause with auto-pause for other instances
 * - Basic progress visualization
 * - Compact design for tables
 */
export function AudioPlayer({ url, id, className }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Global event listener to stop all other audio players
    useEffect(() => {
        const handleStopAll = (e: Event) => {
            const customEvent = e as CustomEvent<{ id: string | number }>;
            if (customEvent.detail?.id !== id && audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        };

        window.addEventListener("audio-player-stop-others", handleStopAll);
        return () => window.removeEventListener("audio-player-stop-others", handleStopAll);
    }, [id]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Notify other players to stop
            window.dispatchEvent(
                new CustomEvent("audio-player-stop-others", { detail: { id } })
            );
            audioRef.current.play();
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            if (total) {
                setProgress((current / total) * 100);
            }
        }
    };

    return (
        <div className={cn("flex items-center gap-3 bg-slate-50 border rounded-full px-3 py-1.5 w-full max-w-[240px]", className)}>
            <audio
                ref={audioRef}
                src={url}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                    setIsPlaying(false);
                    setProgress(0);
                }}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onTimeUpdate={handleTimeUpdate}
                className="hidden"
                preload="metadata"
            />

            <button
                onClick={togglePlay}
                disabled={!url}
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all shrink-0",
                    isPlaying
                        ? "bg-brandPrimary-600 text-white shadow-sm ring-2 ring-brandPrimary-100"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-brandPrimary-300 hover:text-brandPrimary-600 shadow-sm"
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="h-4 w-4 fill-current text-white" />
                ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                )}
            </button>

            <div className="flex-1 flex flex-col justify-center gap-1.5 overflow-hidden">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden relative group">
                    <div
                        className="absolute top-0 left-0 h-full bg-brandPrimary-500 transition-all duration-300 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                        {audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                        {audioRef.current?.duration ? formatTime(audioRef.current.duration) : "0:00"}
                    </span>
                </div>
            </div>
        </div>
    );
}

function formatTime(seconds: number) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
