import React, { useState } from "react";

/* sample avatar generator */
function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(s => s[0]).slice(0,2).join("");
  const colors = ["#4f46e5","#06b6d4","#ef4444","#10b981","#f97316"];
  const bg = colors[name.length % colors.length];
  const style = {
    width: size, height: size, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", color: "white",
    fontWeight: 700, background: bg, fontSize: size/2.6
  };
  return <div style={style}>{initials}</div>;
}

/* Modal (simple) */
function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", left:0, right:0, top:0, bottom:0,
      background: "rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center",
      zIndex: 1000
    }}>
      <div style={{ width: 520, background: "white", borderRadius: 10, padding: 18 }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
          <h3 style={{ margin:0 }}>{title}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Appointments() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [rows, setRows] = useState([
    { patient: "Amit Sharma", time: "2025-12-08 10:00", type: "Consult", doctor: "Dr. Smith", status: "Pending", phone: "9876543210" },
    { patient: "Sneha Kapoor", time: "2025-12-08 10:30", type: "Follow-up", doctor: "Dr. Kumar", status: "Done", phone: "9123456780" },
    { patient: "Ravi Patel", time: "2025-12-08 11:00", type: "Consult", doctor: "Dr. Smith", status: "Cancelled", phone: "9988776655" },
  ]);

  /* fields for new appointment modal */
  const [form, setForm] = useState({ patient:"", time:"", type:"Consult", doctor:"Dr. Smith", phone:"" });

  function addAppointment(e) {
    e.preventDefault();
    const newRow = { ...form, status: "Pending" };
    setRows(prev => [newRow, ...prev]);
    setModalOpen(false);
    setForm({ patient:"", time:"", type:"Consult", doctor:"Dr. Smith", phone:"" });
  }

  function changeStatus(idx, next) {
    setRows(prev => prev.map((r,i) => i===idx ? {...r, status: next} : r));
  }

  const filtered = rows.filter(r => {
    const q = filter.toLowerCase();
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return !q || r.patient.toLowerCase().includes(q) || r.doctor.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
  });

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Appointments</h1>
          <div style={{color:'#6b7280'}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <button className="btn-primary" onClick={()=>setModalOpen(true)}>New Appointment</button>
          <input
            placeholder="Search patient, doctor, type..."
            value={filter}
            onChange={e=>setFilter(e.target.value)}
            style={{ padding:"8px 10px", borderRadius:8, border:"1px solid #d1d5db", width:260 }}
          />
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row" style={{marginBottom:20}}>
        <div className="kpi"><div className="kpi-icon" style={{background:"#4f46e5"}}>👥</div>
          <div className="kpi-body"><div className="kpi-title">Total Today</div><div className="kpi-value">{rows.length}</div></div>
        </div>

        <div className="kpi"><div className="kpi-icon" style={{background:"#06b6d4"}}>📅</div>
          <div className="kpi-body"><div className="kpi-title">Pending</div><div className="kpi-value">{rows.filter(r=>r.status==="Pending").length}</div></div>
        </div>

        <div className="kpi"><div className="kpi-icon" style={{background:"#10b981"}}>✅</div>
          <div className="kpi-body"><div className="kpi-title">Completed</div><div className="kpi-value">{rows.filter(r=>r.status==="Done").length}</div></div>
        </div>

        <div className="kpi"><div className="kpi-icon" style={{background:"#f59e0b"}}>⏰</div>
          <div className="kpi-body"><div className="kpi-title">Canceled</div><div className="kpi-value">{rows.filter(r=>r.status==="Cancelled").length}</div></div>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:'flex', gap:12, marginBottom:16, alignItems:'center'}}>
        <label style={{fontSize:13, color:'#6b7280'}}>Status:</label>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}}>
          <option>All</option>
          <option>Pending</option>
          <option>Done</option>
          <option>Cancelled</option>
        </select>
        <div style={{flex:1}} />
      </div>

      {/* Table */}
      <div className="card-2">
        <table className="table" style={{width:'100%'}}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Time</th>
              <th>Type</th>
              <th>Doctor</th>
              <th>Contact</th>
              <th>Status</th>
              <th style={{width:140}}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td style={{display:'flex', gap:10, alignItems:'center'}}>
                  <Avatar name={r.patient} />
                  <div>
                    <div style={{fontWeight:600}}>{r.patient}</div>
                    <div style={{fontSize:12, color:'#6b7280'}}>{r.type}</div>
                  </div>
                </td>

                <td>{new Date(r.time).toLocaleString()}</td>
                <td>{r.type}</td>
                <td>{r.doctor}</td>
                <td>{r.phone}</td>
                <td>
                  <span className={`badge ${r.status==="Done" ? 'green' : r.status==="Pending" ? 'yellow' : 'red'}`}>{r.status}</span>
                </td>

                <td>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn-sm" onClick={()=>changeStatus(i, "Done")}>Mark Done</button>
                    <button className="btn-ghost" onClick={()=>changeStatus(i, "Cancelled")}>Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr><td colSpan={7} style={{textAlign:'center', padding:24, color:'#6b7280'}}>No appointments found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Create New Appointment">
        <form onSubmit={addAppointment}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <input required value={form.patient} onChange={e=>setForm({...form, patient:e.target.value})} placeholder="Patient name" style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
            <input required value={form.time} onChange={e=>setForm({...form, time:e.target.value})} type="datetime-local" style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
            <input required value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone" style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
            <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}}>
              <option>Consult</option>
              <option>Follow-up</option>
              <option>Tele-Consult</option>
            </select>
          </div>

          <div style={{display:'flex', justifyContent:'flex-end', gap:10, marginTop:12}}>
            <button type="button" className="btn-ghost" onClick={()=>setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" type="submit">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
