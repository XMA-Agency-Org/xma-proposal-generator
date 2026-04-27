import {
  Clock,
  Banknote,
  AlertTriangle,
  Wrench,
  MousePointerClick,
  Users,
  TrendingUp,
  Zap,
  Gauge,
  UserCheck,
  DollarSign,
  Eye,
  Compass,
  Plug,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  time_loss: Clock,
  money_bleed: Banknote,
  inefficiency: AlertTriangle,
  manual_ops: Wrench,
  low_conversion: MousePointerClick,
  lead_leakage: Users,
  growth: TrendingUp,
  automation: Zap,
  speed: Gauge,
  personalization: UserCheck,
  revenue: DollarSign,
  visibility: Eye,
  strategy: Compass,
  integration: Plug,
  analytics: BarChart3,
};

export function getIcon(key: string | undefined | null): LucideIcon {
  return iconMap[key ?? ""] ?? Compass;
}
