"use client";

import { useState, useMemo } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Copy,
  Check,
  Filter,
  X,
  // Common icons - importing a comprehensive set
  // Actions
  Save,
  Edit,
  Trash,
  Download,
  Upload,
  Plus,
  Minus,
  X as XIcon,
  CheckCircle,
  Info,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  // Navigation
  Home,
  Menu,
  Settings,
  User,
  Users,
  Bell,
  Search as SearchIcon,
  // UI Elements
  Heart,
  Star,
  Bookmark,
  Share,
  MoreVertical,
  MoreHorizontal,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Shield,
  // Media
  Image,
  Video,
  Music,
  File,
  Folder,
  // Communication
  Mail,
  MessageSquare,
  Phone,
  Send,
  // Status
  CheckCircle2,
  XCircle,
  AlertCircle as AlertCircleIcon,
  Clock,
  Calendar,
  // Content
  Type,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  // Layout
  Layout,
  Grid,
  Columns,
  Sidebar,
  PanelLeft,
  PanelRight,
  // Business
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart,
  // Development
  Code as CodeIcon,
  GitBranch,
  Zap,
  Cpu,
  Database,
  Server,
  // Others
  Palette,
  Sparkles,
  Layers,
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  MapPin,
  Globe,
  Wifi,
  Battery,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  // Arrows & Navigation
  Navigation,
  Compass,
  Map,
  Route,
  // Tools
  Wrench,
  Hammer,
  Scissors,
  FileText,
  FileCheck,
  FileX,
  FolderOpen,
  FolderPlus,
  // Communication
  MessageCircle,
  PhoneCall,
  Video as VideoCall,
  Mail as MailIcon,
  // Status & Feedback
  Loader,
  RefreshCw,
  RotateCw,
  Flame,
  Snowflake,
  Droplet,
  Cloud,
  Sun,
  Moon,
  // Shapes
  Circle,
  Square,
  Triangle,
  Hexagon,
  // Business & Finance
  Wallet,
  Receipt,
  Banknote,
  Coins,
  // Social
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  // System
  HardDrive,
  Monitor,
  Printer,
  Mouse,
  Keyboard,
  Headphones,
  // Time
  Timer,
  History,
  // Weather
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  // Actions
  Power,
  PowerOff,
  PlayCircle,
  PauseCircle,
  StopCircle,
  // Misc
  Coffee,
  Cookie,
  Cake,
  Gift,
  Trophy,
  Award,
  Target,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  // Transport
  Car,
  Bike,
  Plane,
  Train,
  Ship,
  // Food
  Utensils,
  UtensilsCrossed,
  Apple,
  // Health
  Activity,
  Heart as HeartIcon,
  Stethoscope,
  Pill,
  // Shopping
  ShoppingBag,
  Store,
  Tag,
  Tags,
  // Files
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  // Education
  Book,
  BookOpen,
  GraduationCap,
  School,
  // Tech
  Smartphone,
  Tablet,
  Laptop,
  Router,
  // Sports
  Gamepad2,
  // Music
  Music as MusicIcon,
  Music2,
  Music3,
  Music4,
  // Communication
  AtSign,
  Hash,
  Percent,
  // UI Controls
  ToggleLeft,
  ToggleRight,
  Radio,
  // Layout
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  // Formatting
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Comprehensive icon list with categories
 */
const iconCategories = {
  Actions: [
    { name: "Save", icon: Save },
    { name: "Edit", icon: Edit },
    { name: "Trash", icon: Trash },
    { name: "Download", icon: Download },
    { name: "Upload", icon: Upload },
    { name: "Plus", icon: Plus },
    { name: "Minus", icon: Minus },
    { name: "X", icon: XIcon },
    { name: "CheckCircle", icon: CheckCircle },
    { name: "Info", icon: Info },
    { name: "AlertTriangle", icon: AlertTriangle },
    { name: "Power", icon: Power },
    { name: "PowerOff", icon: PowerOff },
  ],
  Navigation: [
    { name: "ChevronRight", icon: ChevronRight },
    { name: "ChevronLeft", icon: ChevronLeft },
    { name: "ChevronUp", icon: ChevronUp },
    { name: "ChevronDown", icon: ChevronDown },
    { name: "ArrowRight", icon: ArrowRight },
    { name: "ArrowLeft", icon: ArrowLeft },
    { name: "ArrowUp", icon: ArrowUp },
    { name: "ArrowDown", icon: ArrowDown },
    { name: "Home", icon: Home },
    { name: "Menu", icon: Menu },
    { name: "Navigation", icon: Navigation },
    { name: "Compass", icon: Compass },
    { name: "Map", icon: Map },
    { name: "Route", icon: Route },
  ],
  UI: [
    { name: "Heart", icon: Heart },
    { name: "Star", icon: Star },
    { name: "Bookmark", icon: Bookmark },
    { name: "Share", icon: Share },
    { name: "MoreVertical", icon: MoreVertical },
    { name: "MoreHorizontal", icon: MoreHorizontal },
    { name: "Eye", icon: Eye },
    { name: "EyeOff", icon: EyeOff },
    { name: "Lock", icon: Lock },
    { name: "Unlock", icon: Unlock },
    { name: "Key", icon: Key },
    { name: "Shield", icon: Shield },
    { name: "Filter", icon: Filter },
    { name: "Search", icon: SearchIcon },
  ],
  Media: [
    { name: "Image", icon: Image },
    { name: "Video", icon: Video },
    { name: "Music", icon: Music },
    { name: "Music2", icon: Music2 },
    { name: "Music3", icon: Music3 },
    { name: "Music4", icon: Music4 },
    { name: "Camera", icon: Camera },
    { name: "Mic", icon: Mic },
    { name: "Volume2", icon: Volume2 },
    { name: "VolumeX", icon: VolumeX },
    { name: "Play", icon: Play },
    { name: "Pause", icon: Pause },
    { name: "PlayCircle", icon: PlayCircle },
    { name: "PauseCircle", icon: PauseCircle },
    { name: "StopCircle", icon: StopCircle },
    { name: "SkipForward", icon: SkipForward },
    { name: "SkipBack", icon: SkipBack },
  ],
  Communication: [
    { name: "Mail", icon: Mail },
    { name: "MessageSquare", icon: MessageSquare },
    { name: "MessageCircle", icon: MessageCircle },
    { name: "Phone", icon: Phone },
    { name: "PhoneCall", icon: PhoneCall },
    { name: "VideoCall", icon: VideoCall },
    { name: "Send", icon: Send },
    { name: "AtSign", icon: AtSign },
    { name: "MailIcon", icon: MailIcon },
  ],
  Status: [
    { name: "CheckCircle2", icon: CheckCircle2 },
    { name: "XCircle", icon: XCircle },
    { name: "AlertCircle", icon: AlertCircleIcon },
    { name: "Clock", icon: Clock },
    { name: "Timer", icon: Timer },
    { name: "History", icon: History },
    { name: "Calendar", icon: Calendar },
    { name: "Loader", icon: Loader },
    { name: "RefreshCw", icon: RefreshCw },
    { name: "RotateCw", icon: RotateCw },
  ],
  Content: [
    { name: "Type", icon: Type },
    { name: "Bold", icon: Bold },
    { name: "Italic", icon: Italic },
    { name: "Underline", icon: Underline },
    { name: "Link", icon: LinkIcon },
    { name: "List", icon: List },
    { name: "Code", icon: CodeIcon },
    { name: "FileText", icon: FileText },
    { name: "FileCheck", icon: FileCheck },
    { name: "FileX", icon: FileX },
  ],
  Layout: [
    { name: "Layout", icon: Layout },
    { name: "Grid", icon: Grid },
    { name: "Columns", icon: Columns },
    { name: "Sidebar", icon: Sidebar },
    { name: "PanelLeft", icon: PanelLeft },
    { name: "PanelRight", icon: PanelRight },
    { name: "AlignLeft", icon: AlignLeft },
    { name: "AlignCenter", icon: AlignCenter },
    { name: "AlignRight", icon: AlignRight },
    { name: "AlignJustify", icon: AlignJustify },
  ],
  Business: [
    { name: "DollarSign", icon: DollarSign },
    { name: "TrendingUp", icon: TrendingUp },
    { name: "TrendingDown", icon: TrendingDown },
    { name: "BarChart", icon: BarChart },
    { name: "PieChart", icon: PieChart },
    { name: "LineChart", icon: LineChart },
    { name: "CreditCard", icon: CreditCard },
    { name: "Wallet", icon: Wallet },
    { name: "Receipt", icon: Receipt },
    { name: "Banknote", icon: Banknote },
    { name: "Coins", icon: Coins },
  ],
  Files: [
    { name: "File", icon: File },
    { name: "Folder", icon: Folder },
    { name: "FolderOpen", icon: FolderOpen },
    { name: "FolderPlus", icon: FolderPlus },
    { name: "FileImage", icon: FileImage },
    { name: "FileVideo", icon: FileVideo },
    { name: "FileAudio", icon: FileAudio },
    { name: "FileCode", icon: FileCode },
    { name: "FileSpreadsheet", icon: FileSpreadsheet },
    { name: "FileArchive", icon: FileArchive },
  ],
  System: [
    { name: "Settings", icon: Settings },
    { name: "User", icon: User },
    { name: "Users", icon: Users },
    { name: "Bell", icon: Bell },
    { name: "HardDrive", icon: HardDrive },
    { name: "Monitor", icon: Monitor },
    { name: "Printer", icon: Printer },
    { name: "Mouse", icon: Mouse },
    { name: "Keyboard", icon: Keyboard },
    { name: "Headphones", icon: Headphones },
    { name: "Wifi", icon: Wifi },
    { name: "Battery", icon: Battery },
    { name: "Router", icon: Router },
  ],
  Development: [
    { name: "GitBranch", icon: GitBranch },
    { name: "Zap", icon: Zap },
    { name: "Cpu", icon: Cpu },
    { name: "Database", icon: Database },
    { name: "Server", icon: Server },
  ],
  Misc: [
    { name: "Palette", icon: Palette },
    { name: "Sparkles", icon: Sparkles },
    { name: "Layers", icon: Layers },
    { name: "Package", icon: Package },
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "ShoppingBag", icon: ShoppingBag },
    { name: "Store", icon: Store },
    { name: "Tag", icon: Tag },
    { name: "Tags", icon: Tags },
    { name: "MapPin", icon: MapPin },
    { name: "Globe", icon: Globe },
    { name: "Coffee", icon: Coffee },
    { name: "Cookie", icon: Cookie },
    { name: "Cake", icon: Cake },
    { name: "Gift", icon: Gift },
    { name: "Trophy", icon: Trophy },
    { name: "Award", icon: Award },
    { name: "Target", icon: Target },
    { name: "Flag", icon: Flag },
    { name: "ThumbsUp", icon: ThumbsUp },
    { name: "ThumbsDown", icon: ThumbsDown },
    { name: "Smile", icon: Smile },
    { name: "Frown", icon: Frown },
    { name: "Meh", icon: Meh },
    { name: "Car", icon: Car },
    { name: "Bike", icon: Bike },
    { name: "Plane", icon: Plane },
    { name: "Train", icon: Train },
    { name: "Ship", icon: Ship },
    { name: "Truck", icon: Truck },
    { name: "Utensils", icon: Utensils },
    { name: "UtensilsCrossed", icon: UtensilsCrossed },
    { name: "Apple", icon: Apple },
    { name: "Activity", icon: Activity },
    { name: "HeartIcon", icon: HeartIcon },
    { name: "Stethoscope", icon: Stethoscope },
    { name: "Pill", icon: Pill },
    { name: "Wrench", icon: Wrench },
    { name: "Hammer", icon: Hammer },
    { name: "Scissors", icon: Scissors },
    { name: "Circle", icon: Circle },
    { name: "Square", icon: Square },
    { name: "Triangle", icon: Triangle },
    { name: "Hexagon", icon: Hexagon },
    { name: "Flame", icon: Flame },
    { name: "Snowflake", icon: Snowflake },
    { name: "Droplet", icon: Droplet },
    { name: "Cloud", icon: Cloud },
    { name: "Sun", icon: Sun },
    { name: "Moon", icon: Moon },
    { name: "CloudRain", icon: CloudRain },
    { name: "CloudSnow", icon: CloudSnow },
    { name: "CloudLightning", icon: CloudLightning },
    { name: "CloudDrizzle", icon: CloudDrizzle },
    { name: "Wind", icon: Wind },
  ],
  Social: [
    { name: "Facebook", icon: Facebook },
    { name: "Twitter", icon: Twitter },
    { name: "Instagram", icon: Instagram },
    { name: "Linkedin", icon: Linkedin },
    { name: "Youtube", icon: Youtube },
    { name: "Github", icon: Github },
  ],
  Education: [
    { name: "Book", icon: Book },
    { name: "BookOpen", icon: BookOpen },
    { name: "GraduationCap", icon: GraduationCap },
    { name: "School", icon: School },
  ],
  Tech: [
    { name: "Smartphone", icon: Smartphone },
    { name: "Tablet", icon: Tablet },
    { name: "Laptop", icon: Laptop },
    { name: "Router", icon: Router },
  ],
  Sports: [{ name: "Gamepad2", icon: Gamepad2 }],
  Music: [
    { name: "Music", icon: MusicIcon },
    { name: "Music2", icon: Music2 },
    { name: "Music3", icon: Music3 },
    { name: "Music4", icon: Music4 },
  ],
  UI_Controls: [
    { name: "Hash", icon: Hash },
    { name: "Percent", icon: Percent },
    { name: "ToggleLeft", icon: ToggleLeft },
    { name: "ToggleRight", icon: ToggleRight },
    { name: "Radio", icon: Radio },
  ],
  Alignment: [
    { name: "AlignVerticalJustifyStart", icon: AlignVerticalJustifyStart },
    { name: "AlignVerticalJustifyEnd", icon: AlignVerticalJustifyEnd },
    { name: "AlignHorizontalJustifyStart", icon: AlignHorizontalJustifyStart },
    { name: "AlignHorizontalJustifyEnd", icon: AlignHorizontalJustifyEnd },
  ],
};

/**
 * Color palette options
 */
const colorOptions = [
  { name: "Default", class: "text-slate-700", value: "text-slate-700" },
  { name: "Slate", class: "text-slate-600", value: "text-slate-600" },
  { name: "Primary", class: "text-primary", value: "text-primary" },
  { name: "Success", class: "text-success-600", value: "text-success-600" },
  { name: "Error", class: "text-error-600", value: "text-error-600" },
  { name: "Warning", class: "text-warning-600", value: "text-warning-600" },
  { name: "Info", class: "text-info-600", value: "text-info-600" },
  {
    name: "Muted",
    class: "text-muted-foreground",
    value: "text-muted-foreground",
  },
];

/**
 * Size options
 */
const sizeOptions = [
  { name: "XS", class: "h-3 w-3", value: "h-3 w-3" },
  { name: "SM", class: "h-4 w-4", value: "h-4 w-4" },
  { name: "MD", class: "h-5 w-5", value: "h-5 w-5" },
  { name: "LG", class: "h-6 w-6", value: "h-6 w-6" },
  { name: "XL", class: "h-8 w-8", value: "h-8 w-8" },
  { name: "2XL", class: "h-12 w-12", value: "h-12 w-12" },
];

/**
 * Icon Showcase Component
 */
function IconCard({
  icon: Icon,
  name,
  selectedColor,
  selectedSize,
  onCopy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  selectedColor: string;
  selectedSize: string;
  onCopy: (code: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `<${name} className="${selectedSize} ${selectedColor}" />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    onCopy(codeSnippet);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group border rounded-lg p-4 hover:shadow-md transition-all bg-card">
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 bg-slate-50 rounded-md">
          <Icon className={cn(selectedSize, selectedColor)} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium mb-1">{name}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Icon System Showcase Component
 *
 * Comprehensive icon browser with search, filtering, and color customization
 */
export default function IconSystemShowcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[3].value);

  // Flatten all icons
  const allIcons = useMemo(() => {
    return Object.entries(iconCategories).flatMap(([category, icons]) =>
      icons.map((icon) => ({ ...icon, category }))
    );
  }, []);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    return allIcons.filter((icon) => {
      const matchesSearch =
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === null || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allIcons, searchQuery, selectedCategory]);

  const handleCopy = () => {
    // Copy handled in IconCard component
  };

  return (
    <>
      {/* Controls Section */}
      <SectionContainer
        title="Icon Browser"
        description="Search and browse all available icons with color and size customization"
      >
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search icons by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All ({allIcons.length})
            </Button>
            {Object.keys(iconCategories).map((category) => {
              const count =
                iconCategories[category as keyof typeof iconCategories].length;
              return (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({count})
                </Button>
              );
            })}
          </div>

          {/* Color and Size Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Color Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm border transition-all",
                      selectedColor === color.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-slate-100 border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border",
                          color.class === "text-slate-700" && "bg-slate-700",
                          color.class === "text-slate-600" && "bg-slate-600",
                          color.class === "text-primary" && "bg-primary",
                          color.class === "text-success-600" &&
                            "bg-success-600",
                          color.class === "text-error-600" && "bg-error-600",
                          color.class === "text-warning-600" &&
                            "bg-warning-600",
                          color.class === "text-info-600" && "bg-info-600",
                          color.class === "text-muted-foreground" &&
                            "bg-muted-foreground"
                        )}
                      />
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm border transition-all",
                      selectedSize === size.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-slate-100 border-slate-200"
                    )}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredIcons.length} of {allIcons.length} icons
          </div>
        </div>
      </SectionContainer>

      {/* Icons Grid */}
      <SectionContainer
        title={`${selectedCategory || "All"} Icons`}
        description={
          searchQuery
            ? `Search results for "${searchQuery}"`
            : "Click 'Copy' on any icon to get the code snippet"
        }
      >
        {filteredIcons.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No icons found matching your search
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredIcons.map(({ icon: Icon, name }) => (
              <IconCard
                key={name}
                icon={Icon}
                name={name}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}
      </SectionContainer>

      {/* Usage Examples */}
      <SectionContainer
        title="Usage Examples"
        description="Example code snippets for common icon use cases"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Basic Usage</h4>
            <Code className="block p-3 bg-slate-50 rounded-md">
              {`import { CheckCircle } from "lucide-react";

<CheckCircle className="h-6 w-6 text-success-600" />`}
            </Code>
          </div>

          <div>
            <h4 className="font-semibold mb-2">With Conditional Styling</h4>
            <Code className="block p-3 bg-slate-50 rounded-md">
              {`import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

<AlertCircle className={cn(
  "h-5 w-5",
  isError ? "text-error-600" : "text-warning-600"
)} />`}
            </Code>
          </div>

          <div>
            <h4 className="font-semibold mb-2">In Buttons</h4>
            <Code className="block p-3 bg-slate-50 rounded-md">
              {`import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button>
  <Download className="mr-2 h-4 w-4" />
  Download
</Button>`}
            </Code>
          </div>
        </div>
      </SectionContainer>

      {/* Color Palette Reference */}
      <SectionContainer
        title="Color Classes Reference"
        description="Available color classes for icons"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colorOptions.map((color) => {
            const Icon = CheckCircle;
            return (
              <div
                key={color.value}
                className="flex items-center gap-3 p-3 border rounded-md"
              >
                <Icon className={cn("h-5 w-5", color.value)} />
                <div>
                  <p className="text-sm font-medium">{color.name}</p>
                  <Code className="text-xs">{color.value}</Code>
                </div>
              </div>
            );
          })}
        </div>
      </SectionContainer>
    </>
  );
}
