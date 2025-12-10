// src/pages/Prescriptions.jsx
import React, { useMemo, useState } from "react";
import { FiPlus, FiDownload, FiPrinter } from "react-icons/fi";

/* Simple Avatar helper (reused style across app) */
function Avatar({ name, size = 40 }) {
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

/* Small modal */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
    }}>
      <div style={{ width: 680, background: "white", borderRadius: 10, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* utility to print prescription text */
function printPrescription(p) {
  const win = window.open("", "_blank");
  const html = `
    <html>
      <head><title>Prescription - ${p.patient}</title>
        <style>
          body { font-family: Arial, sans-serif; padding:20px; color:#222 }
          h2 { margin-bottom:8px }
          .meta { color:#555; margin-bottom:14px }
          .med { margin-bottom:8px }
        </style>
      </head>
      <body>
        <h2>Prescription</h2>
        <div class="meta"><strong>Patient:</strong> ${p.patient} &nbsp; | &nbsp; <strong>Doctor:</strong> ${p.doctor} &nbsp; | &nbsp; <strong>Date:</strong> ${new Date(p.date).toLocaleString()}</div>
        <div>
          ${p.medicines.map(m=> `<div class="med"><strong>${m.name}</strong> — ${m.dosage} — ${m.notes || ""}</div>`).join("")}
        </div>
      </body>
    </html>
  `;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(()=>win.print(), 250);
}

/* main page */
export default function Prescriptions() {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([
    {
      patient: "Amit Sharma",
      doctor: "Dr. Smith",
      date: new Date().toISOString(),
      status: "Printed",
      medicines: [
        { name: "Paracetamol", dosage: "500 mg — 1 tab x 8 hourly", notes: "After food" },
        { name: "Pantoprazole", dosage: "40 mg — 1 tab daily", notes: "" }
      ],
      notes: "Take rest"
    },
    {
      patient: "Sneha Kapoor",
      doctor: "Dr. Meera Iyer",
      date: new Date().toISOString(),
      status: "Draft",
      medicines: [
        { name: "Amoxicillin", dosage: "500 mg — 1 tab x 8 hourly", notes: "7 days" }
      ],
      notes: ""
    }
  ]);

  // new prescription form state
  const [form, setForm] = useState({
    patient: "", doctor: "Dr. Smith", date: new Date().toISOString().slice(0,16), notes: "", medicines: [{ name: "", dosage: "", notes: "" }]
  });

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return prescriptions.filter(p => {
      if (filterStatus !== "All" && p.status !== filterStatus) return false;
      if (!q) return true;
      return p.patient.toLowerCase().includes(q)
        || p.doctor.toLowerCase().includes(q)
        || p.medicines.some(m => m.name.toLowerCase().includes(q));
    });
  }, [prescriptions, query, filterStatus]);

  const kp = {
    total: prescriptions.length,
    today: prescriptions.filter(p => new Date(p.date).toDateString() === new Date().toDateString()).length,
    drafts: prescriptions.filter(p => p.status === "Draft").length,
    printed: prescriptions.filter(p => p.status === "Printed").length
  };

  function addMedicineRow() {
    setForm(prev => ({ ...prev, medicines: [...prev.medicines, { name: "", dosage: "", notes: "" }] }));
  }
  function updateMedicine(i, field, value) {
    setForm(prev => {
      const m = [...prev.medicines];
      m[i] = { ...m[i], [field]: value };
      return { ...prev, medicines: m };
    });
  }
  function removeMedicine(i) {
    setForm(prev => ({ ...prev, medicines: prev.medicines.filter((_, idx) => idx !== i) }));
  }

  function createPrescription(e) {
    e.preventDefault();
    const created = {
      patient: form.patient || "Unknown",
      doctor: form.doctor || "Dr. Smith",
      date: new Date(form.date).toISOString(),
      medicines: form.medicines.filter(m => m.name.trim()),
      notes: form.notes,
      status: "Draft"
    };
    setPrescriptions(prev => [created, ...prev]);
    setModalOpen(false);
    setForm({ patient: "", doctor: "Dr. Smith", date: new Date().toISOString().slice(0,16), notes: "", medicines: [{ name: "", dosage: "", notes: "" }] });
  }

  function exportCSV(list) {
    const rows = [
      ["Patient", "Doctor", "Date", "Status", "Medicines", "Notes"],
      ...list.map(p => [p.patient, p.doctor, new Date(p.date).toLocaleString(), p.status, p.medicines.map(m=>m.name + " (" + m.dosage + ")").join(" | "), p.notes || ""])
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `prescriptions_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function markPrinted(idx) {
    setPrescriptions(prev => prev.map((p, i) => i === idx ? { ...p, status: "Printed" } : p));
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Prescriptions</h1>
          <div style={{color:'#6b7280'}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <button className="btn-primary" onClick={() => setModalOpen(true)}><FiPlus style={{verticalAlign:'middle', marginRight:8}}/>Create</button>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patient / doctor / medicine..." style={{padding:8, borderRadius:8, border:'1px solid #d1d5db', width:320}} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}}>
            <option>All</option>
            <option>Draft</option>
            <option>Printed</option>
          </select>
          <button className="btn-ghost" onClick={() => exportCSV(filtered)}><FiDownload style={{verticalAlign:'middle', marginRight:6}}/>Export</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row" style={{marginBottom:18}}>
        <div className="kpi">
          <div className="kpi-icon" style={{background:"#4f46e5"}}>📄</div>
          <div className="kpi-body"><div className="kpi-title">Total</div><div className="kpi-value">{kp.total}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#06b6d4"}}>📅</div>
          <div className="kpi-body"><div className="kpi-title">Today</div><div className="kpi-value">{kp.today}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#f59e0b"}}>✏️</div>
          <div className="kpi-body"><div className="kpi-title">Drafts</div><div className="kpi-value">{kp.drafts}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#10b981"}}>🖨️</div>
          <div className="kpi-body"><div className="kpi-title">Printed</div><div className="kpi-value">{kp.printed}</div></div>
        </div>
      </div>

      {/* list */}
      <div className="card-2">
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Medicines</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{width:200}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={idx}>
                <td style={{display:'flex', gap:10, alignItems:'center'}}>
                  <Avatar name={p.patient} />
                  <div>
                    <div style={{fontWeight:700}}>{p.patient}</div>
                    <div style={{fontSize:12, color:'#6b7280'}}>{p.notes}</div>
                  </div>
                </td>

                <td>{p.doctor}</td>

                <td style={{maxWidth:360}}>
                  <ul style={{margin:0,paddingLeft:16}}>
                    {p.medicines.map((m,i)=> <li key={i} style={{marginBottom:6}}><strong>{m.name}</strong> — <span style={{color:'#374151'}}>{m.dosage}</span></li>)}
                  </ul>
                </td>

                <td>{new Date(p.date).toLocaleString()}</td>

                <td><span className={`badge ${p.status==="Printed" ? "green" : "yellow"}`}>{p.status}</span></td>

                <td>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn-sm" onClick={() => { printPrescription(p); }}><FiPrinter style={{verticalAlign:'middle', marginRight:6}}/>Print</button>
                    <button className="btn-ghost" onClick={() => { markPrinted(idx); }}>Mark Printed</button>
                    <button className="btn-ghost" onClick={() => {
                      // simple edit: move to modal for editing
                      setModalOpen(true);
                      // prefill form for edit (simple approach: load selected)
                      setForm({
                        patient: p.patient,
                        doctor: p.doctor,
                        date: new Date(p.date).toISOString().slice(0,16),
                        notes: p.notes || "",
                        medicines: p.medicines.length ? p.medicines.map(m=>({...m})) : [{ name:"", dosage:"", notes:"" }]
                      });
                    }}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:'center', padding:24, color:'#6b7280'}}>No prescriptions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setForm({ patient: "", doctor: "Dr. Smith", date: new Date().toISOString().slice(0,16), notes: "", medicines:[{ name:"", dosage:"", notes:"" }] }); }} title="Create / Edit Prescription">
        <form onSubmit={createPrescription}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <input required placeholder="Patient name" value={form.patient} onChange={e=>setForm({...form, patient:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
            <input placeholder="Doctor" value={form.doctor} onChange={e=>setForm({...form, doctor:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
            <input type="datetime-local" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
            <input placeholder="Notes (optional)" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
          </div>

          <div style={{marginTop:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
              <strong>Medicines</strong>
              <button type="button" className="btn-ghost" onClick={addMedicineRow}>+ Add medicine</button>
            </div>

            {form.medicines.map((m, i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 1fr 120px', gap:8, marginBottom:8, alignItems:'center'}}>
                <input placeholder="Name" value={m.name} onChange={e=>updateMedicine(i, "name", e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}} />
                <input placeholder="Dosage / Instruction" value={m.dosage} onChange={e=>updateMedicine(i, "dosage", e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}} />
                <div style={{display:'flex', gap:6}}>
                  <input placeholder="Notes" value={m.notes} onChange={e=>updateMedicine(i, "notes", e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db', flex:1}} />
                  <button type="button" className="btn-ghost" onClick={()=>removeMedicine(i)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
