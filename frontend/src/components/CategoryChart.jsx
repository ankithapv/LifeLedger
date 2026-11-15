import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { PieChart as ChartIcon } from "lucide-react";
import "../styles/CategoryChart.css";

const COLORS = [
  "#7659E8",
  "#36A1E8",
  "#20B889",
  "#F1A642",
  "#E66A82",
  "#8B91A8"
];

function CategoryChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name: item.name || item.category || "Other",
    value: Number(item.value ?? item.count ?? 0)
  })).filter((item) => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="ll-category-card">
      <div className="ll-category-header">
        <div>
          <span className="ll-category-eyebrow">DOCUMENT INSIGHTS</span>
          <h3>Category Overview</h3>
          <p>Understand how your documents are organized.</p>
        </div>

        <div className="ll-category-header-icon">
          <ChartIcon size={20} />
        </div>
      </div>

      {total === 0 ? (
        <div className="ll-category-empty">
          <ChartIcon size={34} />
          <h4>No category data yet</h4>
          <p>Upload documents to see your category breakdown.</p>
        </div>
      ) : (
        <>
          <div className="ll-category-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="85%"
                  paddingAngle={4}
                  cornerRadius={5}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [`${value} documents`, name]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #eceaf5",
                    fontSize: "12px"
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="ll-category-center">
              <strong>{total}</strong>
              <span>Documents</span>
            </div>
          </div>

          <div className="ll-category-breakdown">
            {chartData.map((item, index) => (
              <div className="ll-category-breakdown-item" key={item.name}>
                <span
                  className="ll-category-dot"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                <span className="ll-category-name">{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default CategoryChart;