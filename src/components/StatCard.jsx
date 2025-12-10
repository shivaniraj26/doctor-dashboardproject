import React from 'react'

export default function StatCard({ icon, iconBg='#6366f1', title, value }) {
  return (
    <div className="kpi">
      <div className="kpi-icon" style={{ background: iconBg }}>{icon}</div>
      <div className="kpi-body">
        <div className="kpi-title">{title}</div>
        <div className="kpi-value">{value}</div>
      </div>
    </div>
  )
}
