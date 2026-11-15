import React from "react";
import {
  FileText,
  ShieldCheck,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import "../styles/StatCard.css";

const iconMap = {
  total: FileText,
  active: ShieldCheck,
  expiring: Clock,
  expired: AlertTriangle
};

function StatCard({
  title,
  value = 0,
  type = "total",
  change,
  subtitle = "Compared to last month"
}) {
  const Icon = iconMap[type] || FileText;
  const isPositive = change >= 0;

  return (
    <div className={`ll-stat-card ll-stat-${type}`}>
      <div className="ll-stat-top">
        <div className="ll-stat-icon">
          <Icon size={22} />
        </div>

        {change !== undefined && (
          <span className={`ll-stat-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="ll-stat-content">
        <p className="ll-stat-title">{title}</p>
        <h2>{value}</h2>
        <p className="ll-stat-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

export default StatCard;