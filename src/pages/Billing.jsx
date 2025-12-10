// src/pages/Billing.jsx
import React, { useMemo, useState } from "react";

/* Small Avatar (reusable) */
function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(n => n[0] || "").slice(0, 2).join("").toUpperCase();
  const colors = ["#4f46e5","#06b6d4","#ef4444","#10b981","#f97316","#8b5cf6"];
  const bg = colors[name.length % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, display: "flex",
      alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700,
      background: bg, fontSize: Math.round(size / 2.6)
    }}>{initials}</div>
  );
}

/* Modal */
function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset:0, background:"rgba(0,0,0,0.35)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000
    }}>
      <div style={{ width:760, background:"white", borderRadius:10, padding:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <h3 style={{margin:0}}>{title}</h3>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* helper: print invoice HTML */
function printInvoice(inv){
  const html = `
    <html><head><title>Invoice ${inv.invoiceNo}</title>
      <style>
        body{font-family:Arial, sans-serif;color:#222;padding:24px}
        h2{margin-bottom:6px}
        table{width:100%;border-collapse:collapse;margin-top:12px}
        th,td{padding:8px;border-bottom:1px solid #eee;text-align:left}
        .total{font-weight:700;text-align:right;margin-top:12px}
      </style>
    </head>
    <body>
      <h2>Invoice ${inv.invoiceNo}</h2>
      <div><strong>Patient:</strong> ${inv.patient} &nbsp; | &nbsp; <strong>Date:</strong> ${new Date(inv.date).toLocaleString()}</div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
        <tbody>
          ${inv.items.map((it, i)=>`<tr><td>${i+1}</td><td>${it.desc}</td><td>${it.qty}</td><td>${it.price.toFixed(2)}</td><td>${(it.qty*it.price).toFixed(2)}</td></tr>`).join("")}
        </tbody>
      </table>
      <div class="total">Total: ${inv.items.reduce((s,i)=>s+i.qty*i.price,0).toFixed(2)}</div>
    </body></html>
  `;
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  setTimeout(()=>w.print(), 300);
}

/* Single Sparkline helper (declare only once) */
function Sparkline({ values }) {
  if (!values || values.length === 0) return null;
  const w = 120, h = 36;
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map((v,i) => {
    const x = (i/(values.length-1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const lastY = h - ((values[values.length-1] - min)/range)*h;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
      <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={lastY} r="3.5" fill="#4f46e5" />
    </svg>
  );
}

export default function Billing(){
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [modalOpen, setModalOpen] = useState(false);

  const [invoices, setInvoices] = useState([
    { invoiceNo:'INV-1001', patient:'Amit Sharma', date: new Date().toISOString(), status:'Paid', items:[{desc:'Consultation', qty:1, price:300}], note:'' },
    { invoiceNo:'INV-1002', patient:'Sneha Kapoor', date: new Date().toISOString(), status:'Due', items:[{desc:'Blood test', qty:1, price:450},{desc:'X-Ray', qty:1, price:350}], note:'' },
    { invoiceNo:'INV-1003', patient:'Ravi Patel', date: new Date().toISOString(), status:'Paid', items:[{desc:'Follow up', qty:1, price:200}], note:'' },
  ]);

  const [form, setForm] = useState({
    patient:'', date:new Date().toISOString().slice(0,16), items:[{desc:'Consultation', qty:1, price:300}]
  });

  const totals = useMemo(()=> {
    const revenue = invoices.reduce((s,inv)=> s + inv.items.reduce((ss,it)=> ss + it.qty*it.price,0), 0);
    const outstanding = invoices.filter(i=>i.status!=='Paid').reduce((s,inv)=> s + inv.items.reduce((ss,it)=> ss + it.qty*it.price,0), 0);
    return { revenue, outstanding, count: invoices.length, paid: invoices.filter(i=>i.status==='Paid').length };
  }, [invoices]);

  const revenueHistory = useMemo(()=> [1200, 1800, 1300, 2200, 1700, 2400, Math.round(totals.revenue/100) * 100], [totals.revenue]);

  /* filtering / paging */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return invoices.filter(inv => {
      if (filter !== 'All' && inv.status !== filter) return false;
      if (!q) return true;
      return inv.patient.toLowerCase().includes(q) || inv.invoiceNo.toLowerCase().includes(q);
    });
  }, [invoices, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page-1)*perPage, page*perPage);

  function addItemRow(){
    setForm(prev => ({ ...prev, items:[...prev.items, {desc:'', qty:1, price:0}] }));
  }
  function updateItem(i, field, value){
    setForm(prev => {
      const items = prev.items.map((it,idx) => idx===i ? {...it, [field]: field==='qty' || field==='price' ? Number(value) : value } : it);
      return {...prev, items};
    });
  }
  function removeItem(i){
    setForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));
  }
  function createInvoice(e){
    e.preventDefault();
    const newInv = {
      invoiceNo: `INV-${1000 + invoices.length + 1}`,
      patient: form.patient || 'Unknown',
      date: new Date(form.date).toISOString(),
      items: form.items.filter(it => it.desc.trim()),
      status: 'Due',
      note: ''
    };
    setInvoices(prev => [newInv, ...prev]);
    setModalOpen(false);
    setForm({ patient:'', date:new Date().toISOString().slice(0,16), items:[{desc:'Consultation', qty:1, price:300}] });
    setPage(1);
  }

  function exportCSV(list){
    const rows = [
      ['Invoice','Patient','Date','Status','Total'],
      ...list.map(inv => {
        const tot = inv.items.reduce((s,it)=> s + it.qty*it.price, 0);
        return [inv.invoiceNo, inv.patient, new Date(inv.date).toLocaleString(), inv.status, tot.toFixed(2)];
      })
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `invoices_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  function markPaid(idx){
    setInvoices(prev => prev.map((inv,i) => i===idx ? {...inv, status:'Paid'} : inv));
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Billing</h1>
          <div style={{color:'#6b7280'}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <button className="btn-primary" onClick={()=>setModalOpen(true)}>New Invoice</button>
          <input value={query} onChange={e=>{ setQuery(e.target.value); setPage(1); }} placeholder="Search invoice or patient..." style={{padding:8, borderRadius:8, border:'1px solid #d1d5db', width:320}} />
          <select value={filter} onChange={e=>{ setFilter(e.target.value); setPage(1); }} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}}>
            <option>All</option>
            <option>Paid</option>
            <option>Due</option>
          </select>
          <button className="btn-ghost" onClick={()=>exportCSV(filtered)}>Export CSV</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row" style={{marginBottom:20}}>
        <div className="kpi">
          <div className="kpi-icon" style={{background:'#10b981'}}>₹</div>
          <div className="kpi-body">
            <div className="kpi-title">Revenue</div>
            <div className="kpi-value">₹ {totals.revenue.toFixed(2)}</div>
          </div>
          <div style={{marginLeft:10}}><Sparkline values={revenueHistory} /></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:'#f59e0b'}}>⚠️</div>
          <div className="kpi-body">
            <div className="kpi-title">Outstanding</div>
            <div className="kpi-value">₹ {totals.outstanding.toFixed(2)}</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:'#4f46e5'}}>📄</div>
          <div className="kpi-body">
            <div className="kpi-title">Invoices</div>
            <div className="kpi-value">{totals.count}</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:'#06b6d4'}}>✅</div>
          <div className="kpi-body">
            <div className="kpi-title">Paid</div>
            <div className="kpi-value">{totals.paid}</div>
          </div>
        </div>
      </div>

      {/* Invoices table */}
      <div className="card-2">
        <table className="table" style={{width:'100%'}}>
          <thead>
            <tr><th>Invoice</th><th>Patient</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th style={{width:200}}>Actions</th></tr>
          </thead>
          <tbody>
            {pageItems.map((inv, idx) => {
              const iidx = (page-1)*perPage + idx;
              const tot = inv.items.reduce((s,it)=> s + it.qty*it.price, 0);
              return (
                <tr key={inv.invoiceNo}>
                  <td style={{fontWeight:700}}>{inv.invoiceNo}</td>
                  <td style={{display:'flex', gap:10, alignItems:'center'}}><Avatar name={inv.patient} />{inv.patient}</td>
                  <td>{new Date(inv.date).toLocaleString()}</td>
                  <td>{inv.items.length}</td>
                  <td>₹ {tot.toFixed(2)}</td>
                  <td><span className={`badge ${inv.status==='Paid' ? 'green' : 'red'}`}>{inv.status}</span></td>
                  <td>
                    <div style={{display:'flex', gap:8}}>
                      <button className="btn-sm" onClick={() => printInvoice(inv)}>Print</button>
                      {inv.status !== 'Paid' && <button className="btn-primary" onClick={() => markPaid(iidx)}>Mark Paid</button>}
                      <button className="btn-ghost" onClick={() => { navigator.clipboard?.writeText(inv.invoiceNo); alert('Invoice copied'); }}>Copy</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && <tr><td colSpan={7} style={{textAlign:'center', padding:24, color:'#6b7280'}}>No invoices</td></tr>}
          </tbody>
        </table>

        {/* pagination */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
          <div style={{color:'#6b7280'}}>Showing {Math.min((page-1)*perPage+1, filtered.length)}–{Math.min(page*perPage, filtered.length)} of {filtered.length}</div>
          <div style={{display:'flex', gap:8}}>
            <button className="btn-ghost" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
            <div style={{display:'flex', gap:6}}>
              {Array.from({length: totalPages}).map((_,i) => <button key={i} className={`btn-page ${page===i+1 ? 'active-page' : ''}`} onClick={()=>setPage(i+1)}>{i+1}</button>)}
            </div>
            <button className="btn-ghost" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next</button>
          </div>
        </div>
      </div>

      {/* Create invoice modal */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Create Invoice">
        <form onSubmit={createInvoice}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <input placeholder="Patient name" value={form.patient} onChange={e=>setForm({...form, patient:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
            <input type="datetime-local" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
          </div>

          <div style={{marginTop:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
              <strong>Line items</strong>
              <button type="button" className="btn-ghost" onClick={addItemRow}>+ Add item</button>
            </div>

            {form.items.map((it, i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 80px 120px 80px', gap:8, marginBottom:8, alignItems:'center'}}>
                <input placeholder="Description" value={it.desc} onChange={e=>updateItem(i,'desc', e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}} />
                <input type="number" min="1" value={it.qty} onChange={e=>updateItem(i,'qty', e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}} />
                <input type="number" step="0.01" min="0" value={it.price} onChange={e=>updateItem(i,'price', e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}} />
                <div style={{display:'flex', gap:6}}>
                  <div style={{padding:8, borderRadius:8, background:'#fbfdff', border:'1px solid #eef2f7', display:'flex', alignItems:'center', justifyContent:'center'}}>₹ {(it.qty*it.price).toFixed(2)}</div>
                  <button type="button" className="btn-ghost" onClick={()=>removeItem(i)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
            <div style={{textAlign:'right', marginRight:20}}>
              <div style={{color:'#6b7280'}}>Sub total</div>
              <div style={{fontWeight:700}}>₹ {form.items.reduce((s,it)=> s + it.qty*it.price, 0).toFixed(2)}</div>
            </div>

            <div>
              <button type="button" className="btn-ghost" onClick={()=>setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create</button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
