"use client";

import {
  Mail,
  Camera,
  Layers,
  CreditCard,
  Users,
  HeartHandshake,
  PenLine,
  TrendingUp,
  Building2,
  Calendar,
  Target,
  Lightbulb,
  Wallet,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Mail,
  Camera,
  Layers,
  CreditCard,
  Users,
  HeartHandshake,
  PenLine,
  TrendingUp,
  Building2,
  Calendar,
  Target,
  Lightbulb,
  Wallet,
};

interface FeatureIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function FeatureIcon({ name, size = 20, className = "" }: FeatureIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
