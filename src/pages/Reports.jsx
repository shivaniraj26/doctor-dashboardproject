// src/pages/Reports.jsx
import React, { useMemo, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/* small Avatar helper */
function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(n => n[0] || "").slice(0, 2).join("").toUpperCase();
  const colors = ["#4f46e5","#06b6d4","#ef4444","#10b981","#f97316","#8b5cf6"];
  const bg = colors[name.length % colors.length];
  const style = {
    width: size, height: size, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700,
    background: bg, fontSize: Math.round(size / 2.6)
  };
  return <div style={style}>{initials}</div>;
}

/* small CSV export helper */
function exportCSV(filename, rows) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* sample generator for chart data (you will replace with real API data later) */
function genSeries(days, base=50, variance=20) {
  const data = [];
  for (let i=0;i<days;i++){
    const v = Math.max(0, Math.round(base + (Math.sin(i/3)*variance) + (Math.random()*variance/2 - variance/4)));
    data.push(v);
  }
  return data;
}

export default function Reports(){
  const [rangeDays, setRangeDays] = useState(30);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // sample datasets (replace these with API responses)
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d.toLocaleDateString());
    }
    return arr;
  }, [rangeDays]);

  const patientSeries = useMemo(()=> genSeries(rangeDays, 120, 40), [rangeDays]);
  const appointmentSeries = useMemo(()=> genSeries(rangeDays, 40, 18), [rangeDays]);
  const revenueSeries = useMemo(()=> genSeries(rangeDays, 3000, 1200).map(n => n*10), [rangeDays]);

  // KPIs derived from sample data
  const KPI = useMemo(()=>({
    totalPatients: patientSeries.reduce((s,v)=>s+v,0),
    appointments: appointmentSeries.reduce((s,v)=>s+v,0),
    revenue: revenueSeries.reduce((s,v)=>s+v,0),
    growth: ((appointmentSeries[appointmentSeries.length-1] - appointmentSeries[0]) / Math.max(1, appointmentSeries[0]) * 100).toFixed(1)
  }), [patientSeries, appointmentSeries, revenueSeries]);

  // chart configs
  const lineData = {
    labels: dates,
    datasets: [
      {
        label: "Patients",
        data: patientSeries,
        borderColor: "rgba(79,70,229,1)",
        backgroundColor: "rgba(79,70,229,0.08)",
        tension: 0.3,
        pointRadius: 0
      },
      {
        label: "Appointments",
        data: appointmentSeries,
        borderColor: "rgba(6,182,212,1)",
        backgroundColor: "rgba(6,182,212,0.06)",
        tension: 0.3,
        pointRadius: 0
      }
    ]
  };

  const barData = {
    labels: dates,
    datasets: [
      {
        label: "Revenue",
        data: revenueSeries,
        backgroundColor: "rgba(16,185,129,0.9)"
      }
    ]
  };

  const lineOpts = { plugins:{ legend:{ position: "top" } }, maintainAspectRatio:false, scales:{ x:{ ticks:{maxTicksLimit:8} } } };
  const barOpts = { plugins:{ legend:{ display:false } }, maintainAspectRatio:false, scales:{ x:{ ticks:{maxTicksLimit:8} }, y:{}} };

  // Top doctors (sample)
  const topDoctors = [
    { name: "Dr. Smith", visits: 124, rating: 4.8 },
    { name: "Dr. Meera", visits: 98, rating: 4.6 },
    { name: "Dr. Kumar", visits: 82, rating: 4.5 }
  ];

  // Recent activity (sample)
  const recent = [
    { title: "Appointment booked — Priya", meta: "2 hours ago" },
    { title: "New patient registered — Rahul", meta: "6 hours ago" },
    { title: "Invoice paid — Amit", meta: "1 day ago" }
  ];

  // table-like export rows (sample)
  const exportRows = [
    ["Date","Patients","Appointments","Revenue"],
    ...dates.map((d,i) => [d, patientSeries[i], appointmentSeries[i], revenueSeries[i]])
  ];

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Reports</h1>
          <div style={{color:'#6b7280'}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <div style={{display:'flex', gap:8}}>
            <button className="btn-ghost" onClick={()=>{ setRangeDays(1); setFromDate(""); setToDate(""); }}>Today</button>
            <button className="btn-ghost" onClick={()=>{ setRangeDays(7); setFromDate(""); setToDate(""); }}>7d</button>
            <button className="btn-ghost" onClick={()=>{ setRangeDays(30); setFromDate(""); setToDate(""); }}>30d</button>
          </div>

          <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid #d1d5db'}} />
          <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid #d1d5db'}} />
          <button className="btn-ghost" onClick={()=>exportCSV(`reports_${new Date().toISOString().slice(0,10)}.csv`, exportRows)}>Export CSV</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row" style={{marginBottom:18}}>
        <div className="kpi">
          <div className="kpi-icon" style={{background:"#4f46e5"}}>👥</div>
          <div className="kpi-body"><div className="kpi-title">Total patients</div><div className="kpi-value">{KPI.totalPatients}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#06b6d4"}}>📅</div>
          <div className="kpi-body"><div className="kpi-title">Appointments</div><div className="kpi-value">{KPI.appointments}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#10b981"}}>💰</div>
          <div className="kpi-body"><div className="kpi-title">Revenue</div><div className="kpi-value">₹ {KPI.revenue.toLocaleString()}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#f59e0b"}}>📈</div>
          <div className="kpi-body"><div className="kpi-title">Growth</div><div className="kpi-value">{KPI.growth}%</div></div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: '2fr 1fr', gap:18}}>
        <div style={{display:'grid', gap:18}}>
          <div className="card-2" style={{height:300}}>
            <h3 style={{marginTop:0}}>Patients & Appointments</h3>
            <div style={{height:220}}>
              <Line data={lineData} options={lineOpts} />
            </div>
          </div>

          <div className="card-2" style={{height:280}}>
            <h3 style={{marginTop:0}}>Revenue</h3>
            <div style={{height:200}}>
              <Bar data={barData} options={barOpts} />
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:10, color:'#6b7280'}}>
              <div>Avg/day: <strong>₹ {Math.round(KPI.revenue / Math.max(1, rangeDays)).toLocaleString()}</strong></div>
              <div>Max: <strong>₹ {Math.max(...revenueSeries).toLocaleString()}</strong></div>
            </div>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:18}}>
          <div className="card-2">
            <h4 style={{marginTop:0}}>Top Doctors</h4>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              {topDoctors.map((d,i) => (
                <div key={i} style={{display:'flex', alignItems:'center', gap:12, justifyContent:'space-between'}}>
                  <div style={{display:'flex', gap:10, alignItems:'center'}}>
                    <Avatar name={d.name} />
                    <div>
                      <div style={{fontWeight:700}}>{d.name}</div>
                      <div style={{fontSize:12, color:'#6b7280'}}>Visits: {d.visits}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}><div style={{fontWeight:700}}>{d.rating}</div><div style={{fontSize:12,color:'#6b7280'}}>rating</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-2">
            <h4 style={{marginTop:0}}>Recent Activity</h4>
            <ul style={{listStyle:'none', paddingLeft:0, margin:0, display:'flex', flexDirection:'column', gap:10}}>
              {recent.map((r,i) => (
                <li key={i} style={{display:'flex', gap:10, alignItems:'center'}}>
                  <div style={{width:8, height:40, background:'#eef2ff', borderRadius:6}} />
                  <div>
                    <div style={{fontWeight:600}}>{r.title}</div>
                    <div style={{fontSize:12, color:'#6b7280'}}>{r.meta}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-2">
            <h4 style={{marginTop:0}}>Quick Actions</h4>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              <button className="btn-primary" onClick={()=>exportCSV('reports_summary.csv', exportRows)}>Export report CSV</button>
              <button className="btn-ghost" onClick={()=>alert('Scheduling a PDF export... (demo)')}>Export PDF (demo)</button>
              <button className="btn-ghost" onClick={()=>alert('Emailing report to admin@clinic.com (demo)')}>Email admin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
