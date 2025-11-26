"use client";

import { ReactNode, useState } from "react";

interface GanttTooltipProps {
    children: ReactNode;
    content: ReactNode;
}

export function GanttTooltip({ children, content }: GanttTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
        });
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    return (
        <>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative"
            >
                {children}
            </div>

            {isVisible && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: "translate(-50%, -100%)",
                    }}
                >
                    <div className="bg-popover text-popover-foreground shadow-lg rounded-lg border p-3 text-sm max-w-xs animate-in fade-in-0 zoom-in-95">
                        {content}
                        {/* Arrow pointing down */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-popover border-r border-b rotate-45"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
