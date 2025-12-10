import React, { useState } from "react";

/* small reusable Avatar */
function Avatar({ name, src, size = 96 }) {
  const initials = (name || "User").split(" ").map(n => n[0] || "").slice(0,2).join("").toUpperCase();
  const colors = ["#4f46e5","#06b6d4","#ef4444","#10b981","#f97316","#8b5cf6"];
  const bg = colors[(name || "").length % colors.length];
  return src ? (
    <img src={src} alt={name} style={{ width:size, height:size, borderRadius:12, objectFit:"cover" }} />
  ) : (
    <div style={{
      width:size, height:size, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
      background:bg, color:"white", fontWeight:800, fontSize:Math.round(size/2.6)
    }}>{initials}</div>
  );
}

export default function Profile(){
  const [profile, setProfile] = useState({
    name: "Dr. Smith",
    title: "General Physician",
    clinic: "Amrutam Clinic",
    email: "dr.smith@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    bio: "20+ yrs experience. Focus on family medicine and preventive care.",
    avatar: ""
  });

  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");
  const [stats] = useState({
    patients: 1240,
    appointmentsThisMonth: 142,
    rating: 4.8,
    revenueThisMonth: 56000
  });

  // small activity / recent patients (sample)
  const [recent] = useState([
    { title: "Follow-up: Priya", when: "2h ago" },
    { title: "New patient: Rahul", when: "6h ago" },
    { title: "Prescription printed: Amit", when: "1d ago" }
  ]);

  function handleUpload(e){
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile(p => ({ ...p, avatar: url }));
    setToast("Profile picture updated");
    setTimeout(()=>setToast(""), 2000);
  }

  function saveProfile(e){
    e.preventDefault();
    setEditing(false);
    setToast("Profile saved");
    setTimeout(()=>setToast(""), 2000);
    // TODO: call backend API to persist
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Profile</h1>
          <div style={{color:"#6b7280"}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <button className="btn-ghost" onClick={()=>{ setEditing(!editing); }}>{editing ? "Cancel" : "Edit Profile"}</button>
          <button className="btn-primary" onClick={()=>{ setToast("Profile exported (demo)"); setTimeout(()=>setToast(""),2000); }}>Export</button>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"350px 1fr", gap:18}}>
        {/* left column: card */}
        <div className="card-2" style={{display:"flex", flexDirection:"column", gap:12}}>
          <div style={{display:"flex", gap:12, alignItems:"center"}}>
            <Avatar name={profile.name} src={profile.avatar} />
            <div>
              <div style={{fontWeight:800, fontSize:18}}>{profile.name}</div>
              <div style={{color:"#6b7280"}}>{profile.title} • {profile.clinic}</div>
              <div style={{marginTop:8, display:"flex", gap:8}}>
                <span className="badge green">Active</span>
                <span className="badge yellow">Pro</span>
              </div>
            </div>
          </div>

          <div style={{display:"grid", gap:8, marginTop:6}}>
            <div style={{fontSize:13, color:"#6b7280"}}>Contact</div>
            <div style={{display:"flex", flexDirection:"column", gap:4}}>
              <div><strong>Email:</strong> {profile.email}</div>
              <div><strong>Phone:</strong> {profile.phone}</div>
              <div><strong>Location:</strong> {profile.location}</div>
            </div>
          </div>

          <div style={{marginTop:8}}>
            <div style={{fontSize:13, color:"#6b7280", marginBottom:8}}>Profile Photo</div>
            <input type="file" accept="image/*" onChange={handleUpload} />
          </div>

          <div style={{marginTop:12}}>
            <h4 style={{margin:0}}>Quick stats</h4>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:8}}>
              <div style={{background:"#fbfdff", padding:10, borderRadius:8}}>
                <div style={{fontSize:12, color:"#6b7280"}}>Patients</div>
                <div style={{fontWeight:700, fontSize:18}}>{stats.patients}</div>
              </div>
              <div style={{background:"#fff7ed", padding:10, borderRadius:8}}>
                <div style={{fontSize:12, color:"#6b7280"}}>Appointments (M)</div>
                <div style={{fontWeight:700, fontSize:18}}>{stats.appointmentsThisMonth}</div>
              </div>
              <div style={{background:"#eefcf6", padding:10, borderRadius:8}}>
                <div style={{fontSize:12, color:"#6b7280"}}>Rating</div>
                <div style={{fontWeight:700, fontSize:18}}>{stats.rating} ★</div>
              </div>
              <div style={{background:"#f0f9ff", padding:10, borderRadius:8}}>
                <div style={{fontSize:12, color:"#6b7280"}}>Revenue (M)</div>
                <div style={{fontWeight:700, fontSize:18}}>₹ {stats.revenueThisMonth.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style={{marginTop:12}}>
            <h4 style={{margin:0}}>Recent activity</h4>
            <ul style={{listStyle:"none", paddingLeft:0, marginTop:8, display:"flex", flexDirection:"column", gap:8}}>
              {recent.map((r,i)=>(<li key={i} style={{display:"flex", justifyContent:"space-between", gap:8}}>
                <div>{r.title}</div><div style={{color:"#6b7280"}}>{r.when}</div>
              </li>))}
            </ul>
          </div>
        </div>

        {/* right column: main content or edit form */}
        <div style={{display:"grid", gap:12}}>
          <div className="card-2">
            <h3 style={{marginTop:0}}>About</h3>
            {!editing ? (
              <>
                <p style={{color:"#374151"}}>{profile.bio}</p>

                <div style={{display:"flex", gap:12, marginTop:8}}>
                  <button className="btn-ghost" onClick={()=>{ navigator.clipboard?.writeText(profile.email); setToast("Email copied"); setTimeout(()=>setToast(""),1500); }}>Copy Email</button>
                  <button className="btn-ghost" onClick={()=>{ navigator.clipboard?.writeText(profile.phone); setToast("Phone copied"); setTimeout(()=>setToast(""),1500); }}>Copy Phone</button>
                  <button className="btn-primary" onClick={()=>alert("Open profile preview (demo)")}>Preview</button>
                </div>
              </>
            ) : (
              <form onSubmit={saveProfile} style={{display:"grid", gap:10}}>
                <input className="input" value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} />
                <input className="input" value={profile.title} onChange={e=>setProfile({...profile, title:e.target.value})} />
                <input className="input" value={profile.clinic} onChange={e=>setProfile({...profile, clinic:e.target.value})} />
                <textarea className="input" rows={4} value={profile.bio} onChange={e=>setProfile({...profile, bio:e.target.value})} />
                <div style={{display:"flex", gap:8, justifyContent:"flex-end"}}>
                  <button type="button" className="btn-ghost" onClick={()=>setEditing(false)}>Cancel</button>
                  <button className="btn-primary" type="submit">Save</button>
                </div>
              </form>
            )}
          </div>

          <div className="card-2">
            <h3 style={{marginTop:0}}>Availability</h3>
            <div style={{display:"flex", gap:12, alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13, color:"#6b7280"}}>Today</div>
                <div style={{fontWeight:700}}>09:00 AM — 05:00 PM</div>
              </div>
              <div style={{width:160, textAlign:"right"}}>
                <button className="btn-primary" onClick={()=>alert("Open booking settings (demo)")}>Manage slots</button>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <div style={{fontSize:13, color:"#6b7280", marginBottom:6}}>Next appointments</div>
              <ol style={{marginLeft:18}}>
                <li>11:30 — Mr. Rahul</li>
                <li>12:00 — Ms. Priya</li>
                <li>02:00 — Mr. Karan</li>
              </ol>
            </div>
          </div>

          <div className="card-2">
            <h3 style={{marginTop:0}}>Patient feedback</h3>
            <div style={{display:"flex", flexDirection:"column", gap:10}}>
              <div style={{display:"flex", gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>Excellent consult</div>
                  <div style={{color:"#6b7280"}}>“Very clear and caring. Explained medication well.”</div>
                </div>
                <div style={{textAlign:"right", color:"#6b7280"}}>— Priya</div>
              </div>

              <div style={{display:"flex", gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>Good experience</div>
                  <div style={{color:"#6b7280"}}>“Staff was helpful, easy booking.”</div>
                </div>
                <div style={{textAlign:"right", color:"#6b7280"}}>— Amit</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
