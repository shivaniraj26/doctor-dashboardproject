import React, { useMemo, useState } from "react";
import { FiPlus, FiDownload, FiUser, FiClock } from "react-icons/fi";

/* Simple Avatar helper */
function Avatar({ name, size = 44 }) {
  const initials = name.split(" ").map(n => n[0] || "").slice(0, 2).join("").toUpperCase();
  const colors = ["#4f46e5","#06b6d4","#ef4444","#10b981","#f97316","#8b5cf6"];
  const bg = colors[name.length % colors.length];
  const style = {
    width: size, height: size, borderRadius: 10, display: "flex",
    alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700,
    background: bg, fontSize: Math.round(size / 2.6)
  };
  return <div style={style}>{initials}</div>;
}

/* Modal */
function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset:0, background: "rgba(0,0,0,0.35)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000
    }}>
      <div style={{ width:560, background:"white", borderRadius:10, padding:18 }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
          <h3 style={{margin:0}}>{title}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Doctors(){
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 7;
  const [modalOpen, setModalOpen] = useState(false);

  const [doctors, setDoctors] = useState([
    { name:"Dr. Rakesh Gupta", phone:"9876501234", specialty:"Cardiology", avail:"Online", rating:4.8, slots:"Mon, Wed, Fri • 10:00-14:00" },
    { name:"Dr. Meera Iyer", phone:"9123409876", specialty:"Pediatrics", avail:"Clinic", rating:4.6, slots:"Tue, Thu • 09:00-13:00" },
    { name:"Dr. Karan Mehta", phone:"9988776655", specialty:"Orthopedics", avail:"Clinic", rating:4.7, slots:"Mon-Fri • 15:00-18:00" },
    { name:"Dr. Anjali Rao", phone:"9012345678", specialty:"Gynecology", avail:"Online", rating:4.9, slots:"Wed, Sat • 11:00-14:00" },
    { name:"Dr. Suresh Patel", phone:"9001122334", specialty:"General", avail:"Clinic", rating:4.4, slots:"Mon-Sat • 09:00-11:00" },
    { name:"Dr. Nikhil Verma", phone:"8899001122", specialty:"Dermatology", avail:"Online", rating:4.5, slots:"Tue, Thu • 13:00-17:00" },
    { name:"Dr. Priya Sharma", phone:"7788990011", specialty:"ENT", avail:"Clinic", rating:4.3, slots:"Fri • 10:00-14:00" },
    { name:"Dr. Vikram Joshi", phone:"6677889900", specialty:"Psychiatry", avail:"Online", rating:4.7, slots:"Mon, Wed • 16:00-19:00" },
  ]);

  // Add doctor form
  const [form, setForm] = useState({ name:"", phone:"", specialty:"General", avail:"Clinic", rating:4.5, slots:"" });

  const specialties = useMemo(() => ["All", ...Array.from(new Set(doctors.map(d => d.specialty)))], [doctors]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return doctors.filter(d => {
      if (specialty !== "All" && d.specialty !== specialty) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.phone.includes(q);
    });
  }, [doctors, query, specialty]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page-1)*perPage, page*perPage);

  function addDoctor(e){
    e.preventDefault();
    if (!form.name.trim()) return;
    setDoctors(prev => [{...form}, ...prev]);
    setForm({ name:"", phone:"", specialty:"General", avail:"Clinic", rating:4.5, slots:"" });
    setModalOpen(false);
    setPage(1);
  }

  function exportCSV(){
    const rows = [
      ["Name","Phone","Specialty","Availability","Rating","Slots"],
      ...filtered.map(d => [d.name, d.phone, d.specialty, d.avail, d.rating, d.slots])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `doctors_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleAvailability(idx){
    setDoctors(prev => prev.map((d,i) => i===idx ? {...d, avail: d.avail === "Clinic" ? "Online" : "Clinic"} : d));
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Doctors</h1>
          <div style={{color:"#6b7280"}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <button className="btn-primary" onClick={()=>setModalOpen(true)}><FiPlus style={{verticalAlign:'middle', marginRight:8}}/> Add Doctor</button>

          <input
            value={query}
            onChange={e=>{ setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name, specialty, phone..."
            style={{ padding:8, width:300, borderRadius:8, border:"1px solid #d1d5db" }}
          />

          <select value={specialty} onChange={e=>{ setSpecialty(e.target.value); setPage(1); }} style={{padding:8, borderRadius:8, border:"1px solid #d1d5db"}}>
            {specialties.map(s => <option key={s}>{s}</option>)}
          </select>

          <button className="btn-ghost" onClick={exportCSV}><FiDownload style={{verticalAlign:'middle', marginRight:6}}/> Export</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row" style={{marginBottom:18}}>
        <div className="kpi">
          <div className="kpi-icon" style={{background:"#4f46e5"}}><FiUser /></div>
          <div className="kpi-body"><div className="kpi-title">Total Doctors</div><div className="kpi-value">{doctors.length}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#06b6d4"}}><FiClock /></div>
          <div className="kpi-body"><div className="kpi-title">Online</div><div className="kpi-value">{doctors.filter(d=>d.avail==="Online").length}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#10b981"}}>⭐</div>
          <div className="kpi-body"><div className="kpi-title">Avg. Rating</div><div className="kpi-value">{(doctors.reduce((s,d)=>s+d.rating,0)/doctors.length).toFixed(1)}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#f59e0b"}}>📅</div>
          <div className="kpi-body"><div className="kpi-title">Active Slots</div><div className="kpi-value">{doctors.reduce((s,d)=>s + (d.slots ? 1 : 0), 0)}</div></div>
        </div>
      </div>

      {/* Doctors table */}
      <div className="card-2">
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Availability</th>
              <th>Slots</th>
              <th>Contact</th>
              <th style={{width:160}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((d, idx) => (
              <tr key={(page-1)*perPage + idx}>
                <td style={{display:"flex", gap:12, alignItems:"center"}}>
                  <Avatar name={d.name} />
                  <div>
                    <div style={{fontWeight:700}}>{d.name}</div>
                    <div style={{fontSize:12, color:"#6b7280"}}>Rating: {d.rating} • {d.specialty}</div>
                  </div>
                </td>

                <td>{d.specialty}</td>
                <td>
                  <span className={`badge ${d.avail === "Online" ? "green" : "yellow"}`}>{d.avail}</span>
                </td>
                <td style={{maxWidth:260}}>{d.slots}</td>
                <td>{d.phone}</td>

                <td>
                  <div style={{display:"flex", gap:8}}>
                    <button className="btn-sm" onClick={()=>toggleAvailability((page-1)*perPage + idx)}>
                      Toggle
                    </button>
                    <button className="btn-ghost" onClick={() => {
                      navigator.clipboard?.writeText(d.phone).catch(()=>{});
                      alert("Phone copied");
                    }}>
                      Call
                    </button>
                    <button className="btn-ghost" onClick={() => {
                      alert(`Open profile for ${d.name} (not implemented).`);
                    }}>
                      Profile
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {pageItems.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:"center", padding:24, color:"#6b7280"}}>No doctors found</td></tr>
            )}
          </tbody>
        </table>

        {/* pagination */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14}}>
          <div style={{color:"#6b7280"}}>Showing {Math.min((page-1)*perPage+1, filtered.length)}–{Math.min(page*perPage, filtered.length)} of {filtered.length}</div>
          <div style={{display:"flex", gap:8}}>
            <button className="btn-ghost" onClick={()=>setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
            <div style={{display:"flex", gap:6}}>
              {Array.from({length: totalPages}).map((_,i) => (
                <button key={i} className={`btn-page ${page===i+1 ? 'active-page' : ''}`} onClick={()=>setPage(i+1)}>{i+1}</button>
              ))}
            </div>
            <button className="btn-ghost" onClick={()=>setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</button>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Add Doctor">
        <form onSubmit={addDoctor}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            <input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}} />
            <input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}} />
            <input placeholder="Specialty" value={form.specialty} onChange={e=>setForm({...form, specialty:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}} />
            <select value={form.avail} onChange={e=>setForm({...form, avail:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}}>
              <option>Clinic</option>
              <option>Online</option>
            </select>
            <input placeholder="Slots (e.g. Mon 10-13)" value={form.slots} onChange={e=>setForm({...form, slots:e.target.value})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}} />
            <input type="number" step="0.1" min="0" max="5" placeholder="Rating" value={form.rating} onChange={e=>setForm({...form, rating:parseFloat(e.target.value)})} style={{padding:10, borderRadius:8, border:"1px solid #d1d5db"}} />
          </div>

          <div style={{display:"flex", justifyContent:"flex-end", gap:8, marginTop:12}}>
            <button type="button" className="btn-ghost" onClick={()=>setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Add Doctor</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
