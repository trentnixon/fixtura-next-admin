"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";

/**
 * Single Color Strip Component
 * Displays a compact color strip for additional palettes
 */
function ColorStrip({
  name,
  icon: Icon,
  iconColor,
  shades,
}: {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  shades: string[];
}) {
  return (
    <div>
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        {name}
      </h4>
      <div className="grid grid-cols-11 gap-1">
        {shades.map((shade, index) => {
          const shadeNum = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][index];
          const borderColor = shadeNum <= 400 ? "border-slate-300" : "border-transparent";
          return (
            <div
              key={shade}
              className={`h-8 ${shade} rounded border ${borderColor}`}
              title={shade.replace("bg-", "")}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Additional Palettes Showcase
 *
 * Displays Tailwind CSS color palettes
 */
export default function AdditionalPalettesShowcase() {
  return (
    <SectionContainer
      title="Additional Color Palettes"
      description="Full color scales available from Tailwind CSS (50-950 ranges)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ColorStrip
          name="Blue"
          icon={Info}
          iconColor="text-blue-600"
          shades={[
            "bg-blue-50",
            "bg-blue-100",
            "bg-blue-200",
            "bg-blue-300",
            "bg-blue-400",
            "bg-blue-500",
            "bg-blue-600",
            "bg-blue-700",
            "bg-blue-800",
            "bg-blue-900",
            "bg-blue-950",
          ]}
        />

        <ColorStrip
          name="Green"
          icon={CheckCircle}
          iconColor="text-green-600"
          shades={[
            "bg-green-50",
            "bg-green-100",
            "bg-green-200",
            "bg-green-300",
            "bg-green-400",
            "bg-green-500",
            "bg-green-600",
            "bg-green-700",
            "bg-green-800",
            "bg-green-900",
            "bg-green-950",
          ]}
        />

        <ColorStrip
          name="Red"
          icon={AlertCircle}
          iconColor="text-red-600"
          shades={[
            "bg-red-50",
            "bg-red-100",
            "bg-red-200",
            "bg-red-300",
            "bg-red-400",
            "bg-red-500",
            "bg-red-600",
            "bg-red-700",
            "bg-red-800",
            "bg-red-900",
            "bg-red-950",
          ]}
        />

        <ColorStrip
          name="Yellow"
          icon={AlertTriangle}
          iconColor="text-yellow-600"
          shades={[
            "bg-yellow-50",
            "bg-yellow-100",
            "bg-yellow-200",
            "bg-yellow-300",
            "bg-yellow-400",
            "bg-yellow-500",
            "bg-yellow-600",
            "bg-yellow-700",
            "bg-yellow-800",
            "bg-yellow-900",
            "bg-yellow-950",
          ]}
        />

        <ColorStrip
          name="Purple"
          icon={Sparkles}
          iconColor="text-purple-600"
          shades={[
            "bg-purple-50",
            "bg-purple-100",
            "bg-purple-200",
            "bg-purple-300",
            "bg-purple-400",
            "bg-purple-500",
            "bg-purple-600",
            "bg-purple-700",
            "bg-purple-800",
            "bg-purple-900",
            "bg-purple-950",
          ]}
        />

        <ColorStrip
          name="Orange"
          icon={Zap}
          iconColor="text-orange-600"
          shades={[
            "bg-orange-50",
            "bg-orange-100",
            "bg-orange-200",
            "bg-orange-300",
            "bg-orange-400",
            "bg-orange-500",
            "bg-orange-600",
            "bg-orange-700",
            "bg-orange-800",
            "bg-orange-900",
            "bg-orange-950",
          ]}
        />

        <ColorStrip
          name="Gray"
          icon={Shield}
          iconColor="text-gray-600"
          shades={[
            "bg-gray-50",
            "bg-gray-100",
            "bg-gray-200",
            "bg-gray-300",
            "bg-gray-400",
            "bg-gray-500",
            "bg-gray-600",
            "bg-gray-700",
            "bg-gray-800",
            "bg-gray-900",
            "bg-gray-950",
          ]}
        />

        <ColorStrip
          name="Indigo"
          icon={Sparkles}
          iconColor="text-indigo-600"
          shades={[
            "bg-indigo-50",
            "bg-indigo-100",
            "bg-indigo-200",
            "bg-indigo-300",
            "bg-indigo-400",
            "bg-indigo-500",
            "bg-indigo-600",
            "bg-indigo-700",
            "bg-indigo-800",
            "bg-indigo-900",
            "bg-indigo-950",
          ]}
        />

        <ColorStrip
          name="Pink"
          icon={Zap}
          iconColor="text-pink-600"
          shades={[
            "bg-pink-50",
            "bg-pink-100",
            "bg-pink-200",
            "bg-pink-300",
            "bg-pink-400",
            "bg-pink-500",
            "bg-pink-600",
            "bg-pink-700",
            "bg-pink-800",
            "bg-pink-900",
            "bg-pink-950",
          ]}
        />
      </div>
    </SectionContainer>
  );
}

