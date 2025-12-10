// src/pages/Schedules.jsx
import React, { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

/* Simple Avatar helper reused style */
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

export default function Schedules(){
  // sample doctors (should match your Doctors page)
  const doctors = useMemo(() => [
    "Dr. Smith", "Dr. Kumar", "Dr. Meera Iyer", "Dr. Rakesh Gupta"
  ], []);

  // sample initial events (react-big-calendar event shape)
  const [events, setEvents] = useState([
    {
      title: "Dr. Smith — Consult",
      start: new Date(new Date().setHours(10,0,0,0)),
      end: new Date(new Date().setHours(10,30,0,0)),
      doctor: "Dr. Smith",
      color: "#4f46e5"
    },
    {
      title: "Dr. Kumar — Follow-up",
      start: new Date(new Date().setHours(11,0,0,0)),
      end: new Date(new Date().setHours(11,45,0,0)),
      doctor: "Dr. Kumar",
      color: "#06b6d4"
    }
  ]);

  const [view, setView] = useState("week"); // month | week | day
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  // form for new schedule
  const [form, setForm] = useState({
    doctor: doctors[0],
    title: "",
    date: new Date().toISOString().slice(0,10),
    startTime: "09:00",
    endTime: "09:30",
  });

  const filtered = events.filter(ev => filterDoctor === "All" ? true : ev.doctor === filterDoctor);

  function addEvent(e){
    e.preventDefault();
    const start = new Date(`${form.date}T${form.startTime}`);
    const end = new Date(`${form.date}T${form.endTime}`);
    const title = `${form.doctor} — ${form.title || "Slot"}`;
    const color = ["#4f46e5","#06b6d4","#ef4444","#10b981"][form.doctor.length % 4];
    setEvents(prev => [{ title, start, end, doctor: form.doctor, color }, ...prev]);
    setModalOpen(false);
    setForm({ ...form, title:"" });
  }

  // event styling for calendar
  function eventStyleGetter(event) {
    const backgroundColor = event.color || "#2563eb";
    const style = {
      backgroundColor,
      borderRadius: '6px',
      color: 'white',
      border: 'none',
      paddingLeft:8
    };
    return { style };
  }

  // small KPIs
  const kp = {
    totalSlots: events.length,
    today: events.filter(ev => {
      const d = new Date(); return ev.start.toDateString() === d.toDateString();
    }).length,
    doctorsCount: new Set(events.map(e=>e.doctor)).size
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Schedules</h1>
          <div style={{color:'#6b7280'}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <button className="btn-primary" onClick={()=>setModalOpen(true)}>New Slot</button>

          <select value={filterDoctor} onChange={e=>setFilterDoctor(e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #d1d5db'}}>
            <option>All</option>
            {doctors.map(d => <option key={d}>{d}</option>)}
          </select>

          <div style={{display:'flex', gap:6, alignItems:'center', background:'#fff', padding:'6px 8px', borderRadius:8, border:'1px solid #e6e9ef'}}>
            <button className={`btn-ghost ${view==='month' ? 'active-view' : ''}`} onClick={()=>setView('month')}>Month</button>
            <button className={`btn-ghost ${view==='week' ? 'active-view' : ''}`} onClick={()=>setView('week')}>Week</button>
            <button className={`btn-ghost ${view==='day' ? 'active-view' : ''}`} onClick={()=>setView('day')}>Day</button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row" style={{marginBottom:18}}>
        <div className="kpi">
          <div className="kpi-icon" style={{background:"#4f46e5"}}>📅</div>
          <div className="kpi-body"><div className="kpi-title">Total Slots</div><div className="kpi-value">{kp.totalSlots}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#06b6d4"}}>⏰</div>
          <div className="kpi-body"><div className="kpi-title">Today</div><div className="kpi-value">{kp.today}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#10b981"}}>👩‍⚕️</div>
          <div className="kpi-body"><div className="kpi-title">Doctors</div><div className="kpi-value">{kp.doctorsCount}</div></div>
        </div>

        <div className="kpi">
          <div className="kpi-icon" style={{background:"#f59e0b"}}>🔁</div>
          <div className="kpi-body"><div className="kpi-title">Upcoming Weeks</div><div className="kpi-value">2</div></div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: '3fr 1fr', gap:18}}>
        {/* Calendar */}
        <div className="card-2" style={{height:720, padding:12}}>
          <Calendar
            localizer={localizer}
            events={filtered}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view}
            onView={v=>setView(v)}
            eventPropGetter={eventStyleGetter}
            popup
          />
        </div>

        {/* Right column: upcoming list */}
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="card-2">
            <h4 style={{marginTop:0}}>Upcoming (next 7 days)</h4>
            <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:8}}>
              {events.filter(ev => ev.start >= new Date()).slice(0,8).map((ev,i) => (
                <div key={i} style={{display:'flex', gap:12, alignItems:'center'}}>
                  <div style={{width:8,height:40, background: ev.color, borderRadius:6}} />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700}}>{ev.title}</div>
                    <div style={{fontSize:13, color:'#6b7280'}}>{ev.start.toLocaleString()} — {ev.end.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
              ))}
              {events.length===0 && <div style={{color:'#6b7280'}}>No upcoming schedules</div>}
            </div>
          </div>

          <div className="card-2">
            <h4 style={{marginTop:0}}>Doctors</h4>
            <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:8}}>
              {doctors.map((d, i) => (
                <div key={i} style={{display:'flex', gap:10, alignItems:'center', justifyContent:'space-between'}}>
                  <div style={{display:'flex', gap:10, alignItems:'center'}}>
                    <Avatar name={d} />
                    <div>
                      <div style={{fontWeight:700}}>{d}</div>
                      <div style={{fontSize:12, color:'#6b7280'}}>Available</div>
                    </div>
                  </div>
                  <div style={{fontSize:13, color:'#6b7280'}}>{events.filter(e=>e.doctor===d).length} slots</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Add Schedule Slot">
        <form onSubmit={addEvent}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <select value={form.doctor} onChange={e=>setForm({...form, doctor:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}}>
              {doctors.map(d=> <option key={d}>{d}</option>)}
            </select>

            <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />

            <input type="time" value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />

            <input type="time" value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />

            <input placeholder="Title (optional)" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{padding:10, borderRadius:8, border:'1px solid #d1d5db'}} />
            <div />
          </div>

          <div style={{display:'flex', justifyContent:'flex-end', gap:10, marginTop:12}}>
            <button type="button" className="btn-ghost" onClick={()=>setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" type="submit">Add Slot</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
