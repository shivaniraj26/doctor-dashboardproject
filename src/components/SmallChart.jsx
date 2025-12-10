import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip)

export default function SmallChart({ labels, data }) {
  const cfg = {
    labels,
    datasets: [{
      label: 'Visits',
      data,
      fill: true,
      tension: 0.35,
      backgroundColor: 'rgba(99,102,241,0.12)',
      borderColor: 'rgba(99,102,241,1)',
      pointRadius: 0,
    }]
  }

  const opts = {
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect:false } },
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: { grid: { color: '#eef2f7' }, ticks: { color: '#6b7280' } }
    }
  }

  return <div className="small-chart card-2"><Line data={cfg} options={opts} /></div>
}
