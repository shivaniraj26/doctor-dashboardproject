import React, { useMemo, useState } from "react";
import { FiUser, FiDownload, FiPlus } from "react-icons/fi";

/* Small Avatar helper */
function Avatar({ name, size = 40 }) {
  const initials = name.split(" ").map(n => n[0] || "").slice(0, 2).join("").toUpperCase();
  const colors = ["#4f46e5","#06b6d4","#ef4444","#10b981","#f97316","#8b5cf6"];
  const bg = colors[name.length % colors.length];
  const style = {
    width: size, height: size, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700,
    background: bg, fontSize: Math.round(size / 2.4)
  };
  return <div style={style}>{initials}</div>;
}

/* Simple modal */
function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset:0, background: "rgba(0,0,0,0.35)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000
    }}>
      <div style={{ width:540, background:"white", borderRadius:10, padding:18 }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
          <h3 style={{margin:0}}>{title}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Patients(){
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [modalOpen, setModalOpen] = useState(false);

  const [patients, setPatients] = useState([
    { name:"Amit Sharma", phone:"9876543210", status:"Active", notes:"Diabetic" },
    { name:"Sneha Kapoor", phone:"9123456780", status:"Active", notes:"Allergy - penicillin" },
    { name:"Ravi Patel", phone:"9988776655", status:"Inactive", notes:"No show previously" },
    { name:"Priya Mehta", phone:"9012345678", status:"Active", notes:"Pregnancy follow-up" },
    { name:"Rahul Singh", phone:"9001122334", status:"Active", notes:"Hypertension" },
    { name:"Karan Joshi", phone:"8899001122", status:"Active", notes:"Routine check" },
    { name:"Divya Rao", phone:"7788990011", status:"Inactive", notes:"Moved city" },
    { name:"Suresh Kumar", phone:"6677889900", status:"Active", notes:"Pre-op" },
    { name:"Anjali S", phone:"5566778899", status:"Active", notes:"Pediatric consult" },
    { name:"Nitin Verma", phone:"4455667788", status:"Active", notes:"Orthopedic" },
  ]);

  // form state for add patient
  const [form, setForm] = useState({ name:"", phone:"", status:"Active", notes:"" });

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return patients.filter(p => {
      if (status !== "All" && p.status !== status) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.phone.includes(q) || (p.notes||"").toLowerCase().includes(q);
    });
  }, [patients, query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page-1)*perPage, page*perPage);

  function addPatient(e){
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setPatients(prev => [{...form}, ...prev]);
    setForm({ name:"", phone:"", status:"Active", notes:"" });
    setModalOpen(false);
    setPage(1);
  }

  function exportCSV(){
    const rows = [
      ["Name","Phone","Status","Notes"],
      ...filtered.map(p => [p.name, p.phone, p.status, p.notes || ""])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `patients_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Patients</h1>
          <div style={{color:"#6b7280"}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <button className="btn-primary" onClick={()=>setModalOpen(true)}>
            <FiPlus style={{verticalAlign:'middle', marginRight:8}}/> New
          </button>

          <div style={{display:"flex", gap:8, alignItems:"center"}}>
            <input
              value={query}
              onChange={e=>{ setQuery(e.target.value); setPage(1); }}
              placeholder="Search patients, phone, notes..."
              style={{ padding:8, width:320, borderRadius:8, border:"1px solid #d1d5db" }}
            />

            <select value={status} onChange={e=>{ setStatus(e.target.value); setPage(1); }} style={{padding:8, borderRadius:8, border:"1px solid #d1d5db"}}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <button className="btn-ghost" onClick={exportCSV}><FiDownload style={{verticalAlign:'middle', marginRight:6}}/> Export</button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row" style={{marginBottom:20}}>
        <div className="kpi">
          <div className="kpi-icon" style={{background:"#4f46e5"}}><FiUser /></div>
          <div className="kpi-body">
            <div className="kpi-title">Total Patients</div>
            <div className="kpi-value">{patients.length}</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#06b6d4"}}>🆕</div>
          <div className="kpi-body">
            <div className="kpi-title">New (last 7d)</div>
            <div className="kpi-value">—</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#10b981"}}>📅</div>
          <div className="kpi-body">
            <div className="kpi-title">Appointments Today</div>
            <div className="kpi-value">12</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#f59e0b"}}>⚕️</div>
          <div className="kpi-body">
            <div className="kpi-title">Active</div>
            <div className="kpi-value">{patients.filter(p=>p.status==="Active").length}</div>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="card-2">
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Phone</th>
              <th>Problem</th>
              <th>Status</th>
              <th style={{width:140}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p, idx) => (
              <tr key={(page-1)*perPage + idx}>
                <td style={{display:"flex", gap:10, alignItems:"center"}}>
                  <Avatar name={p.name} />
                  <div>
                    <div style={{fontWeight:700}}>{p.name}</div>
                    <div style={{fontSize:12, color:"#6b7280"}}>Added recently</div>
                  </div>
                </td>
                <td>{p.phone}</td>
                <td style={{maxWidth:240}}>{p.notes}</td>
                <td><span className={`badge ${p.status==="Active" ? "green" : "red"}`}>{p.status}</span></td>
                <td>
                  <div style={{display:"flex", gap:8}}>
                    <button className="btn-sm" onClick={()=>{ navigator.clipboard?.writeText(p.phone).catch(()=>{}); alert("Phone copied"); }}>Call</button>
                    <button className="btn-ghost" onClick={()=>{
                      setPatients(prev => prev.map(pp => pp===p ? {...pp, status: pp.status==="Active" ? "Inactive" : "Active"} : pp));
                    }}>
                      Toggle
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {pageItems.length===0 && (
              <tr>
                <td colSpan={5} style={{textAlign:"center", padding:24, color:"#6b7280"}}>No patients found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* pagination */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14}}>
          <div style={{color:"#6b7280"}}>Showing {Math.min((page-1)*perPage+1, filtered.length)}–{Math.min(page*perPage, filtered.length)} of {filtered.length}</div>
          <div style={{display:"flex", gap:8}}>
            <button className="btn-ghost" onClick={()=>setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
            <div style={{display:"flex", alignItems:"center", gap:8}}>
              {Array.from({length: totalPages}).map((_,i) => (
                <button key={i} className={`btn-page ${page===i+1 ? 'active-page' : ''}`} onClick={()=>setPage(i+1)}>{i+1}</button>
              ))}
            </div>
            <button className="btn-ghost" onClick={()=>setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</button>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Add New Patient">
        <form onSubmit={addPatient}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            <input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}} />
            <input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}} />
            <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <input placeholder="Problem" value={form.problem} onChange={e=>setForm({...form, notes:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}} />
          </div>

          <div style={{display:"flex", justifyContent:"flex-end", gap:8, marginTop:12}}>
            <button type="button" className="btn-ghost" onClick={()=>setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Add Patient</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
