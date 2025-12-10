import React, { useState, useEffect } from "react";

/* small helper for toggle switch */
function Toggle({ checked, onChange, label }) {
  return (
    <label style={{display: "flex", alignItems: "center", gap: 10}}>
      <div style={{fontSize:14}}>{label}</div>
      <div className={`switch ${checked ? "switch-on" : ""}`} onClick={() => onChange(!checked)} role="button" tabIndex={0} />
    </label>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState({
    clinicName: "Amrutam Clinic",
    address: "123 Main St, City",
    phone: "+91 98765 43210",
    email: "clinic@example.com",
    timezone: "Asia/Kolkata",
    logoUrl: ""
  });

  const [hours, setHours] = useState([
    { day: "Mon", from: "09:00", to: "17:00", open: true },
    { day: "Tue", from: "09:00", to: "17:00", open: true },
    { day: "Wed", from: "09:00", to: "17:00", open: true },
    { day: "Thu", from: "09:00", to: "17:00", open: true },
    { day: "Fri", from: "09:00", to: "17:00", open: true },
    { day: "Sat", from: "10:00", to: "14:00", open: true },
    { day: "Sun", from: "00:00", to: "00:00", open: false },
  ]);

  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    autosave: true
  });

  const [security, setSecurity] = useState({ currentPwd: "", newPwd: "", confirmPwd: "" });
  const [toast, setToast] = useState("");

  /* demo: apply dark mode toggle to document */
  useEffect(() => {
    if (prefs.darkMode) document.documentElement.classList.add("dark-mode");
    else document.documentElement.classList.remove("dark-mode");
  }, [prefs.darkMode]);

  function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile(prev => ({ ...prev, logoUrl: url }));
  }

  function updateHour(i, key, value) {
    setHours(prev => prev.map((h, idx) => idx === i ? { ...h, [key]: value } : h));
  }

  function saveSettings() {
    // client-side demo only — replace with API call
    console.log("Saved profile:", profile, hours, prefs, security);
    setToast("Settings saved");
    setTimeout(() => setToast(""), 2500);
  }

  function resetSettings() {
    // reset to defaults (example)
    setProfile({
      clinicName: "Amrutam Clinic",
      address: "123 Main St, City",
      phone: "+91 98765 43210",
      email: "clinic@example.com",
      timezone: "Asia/Kolkata",
      logoUrl: ""
    });
    setPrefs({ emailNotifications: true, smsNotifications: false, darkMode: false, autosave: true });
    setToast("Settings reset");
    setTimeout(() => setToast(""), 2200);
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18}}>
        <div>
          <h1 style={{fontSize:28}}>Settings</h1>
          <div style={{color:"#6b7280"}}>Today • {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <button className="btn-ghost" onClick={resetSettings}>Reset</button>
          <button className="btn-primary" onClick={saveSettings}>Save Settings</button>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:18}}>
        {/* left column: forms */}
        <div style={{display:"grid", gap:14}}>
          <div className="card-2">
            <h3 style={{marginTop:0}}>Clinic profile</h3>
            <div style={{display:"flex", gap:18, alignItems:"center"}}>
              <div style={{width:96}}>
                <div className="logo-box">
                  {profile.logoUrl ? (
                    <img src={profile.logoUrl} alt="logo" style={{width:96, height:96, objectFit:"cover", borderRadius:8}} />
                  ) : (
                    <div style={{width:96, height:96, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:8, background:"#eef2ff", color:"#4f46e5", fontWeight:700}}>Logo</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{marginTop:8}} />
              </div>

              <div style={{flex:1, display:"grid", gap:8}}>
                <input className="input" value={profile.clinicName} onChange={e=>setProfile({...profile, clinicName: e.target.value})} placeholder="Clinic name" />
                <input className="input" value={profile.address} onChange={e=>setProfile({...profile, address: e.target.value})} placeholder="Address" />
                <div style={{display:"flex", gap:8}}>
                  <input className="input" value={profile.phone} onChange={e=>setProfile({...profile, phone: e.target.value})} placeholder="Phone" />
                  <input className="input" value={profile.email} onChange={e=>setProfile({...profile, email: e.target.value})} placeholder="Email" />
                </div>
                <input className="input" value={profile.timezone} onChange={e=>setProfile({...profile, timezone: e.target.value})} placeholder="Timezone" />
              </div>
            </div>
          </div>

          <div className="card-2">
            <h3 style={{marginTop:0}}>Working hours</h3>
            <div style={{display:"grid", gap:8}}>
              {hours.map((h, i) => (
                <div key={h.day} style={{display:"flex", gap:10, alignItems:"center"}}>
                  <div style={{width:54, fontWeight:700}}>{h.day}</div>
                  <input type="time" className="input-small" value={h.from} onChange={e=>updateHour(i, "from", e.target.value)} disabled={!h.open} />
                  <span style={{color:"#6b7280"}}>—</span>
                  <input type="time" className="input-small" value={h.to} onChange={e=>updateHour(i, "to", e.target.value)} disabled={!h.open} />
                  <div style={{flex:1}} />
                  <label style={{display:"flex", alignItems:"center", gap:8}}>
                    <input type="checkbox" checked={h.open} onChange={e=>updateHour(i, "open", e.target.checked)} /> Open
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="card-2">
            <h3 style={{marginTop:0}}>Preferences</h3>
            <div style={{display:"grid", gap:12}}>
              <Toggle label="Email notifications" checked={prefs.emailNotifications} onChange={v=>setPrefs(p=>({...p, emailNotifications:v}))} />
              <Toggle label="SMS notifications" checked={prefs.smsNotifications} onChange={v=>setPrefs(p=>({...p, smsNotifications:v}))} />
              <Toggle label="Autosave drafts" checked={prefs.autosave} onChange={v=>setPrefs(p=>({...p, autosave:v}))} />
              <Toggle label="Dark mode" checked={prefs.darkMode} onChange={v=>setPrefs(p=>({...p, darkMode:v}))} />
            </div>
          </div>

          <div className="card-2">
            <h3 style={{marginTop:0}}>Account & Security</h3>
            <div style={{display:"grid", gap:10}}>
              <input className="input" type="password" placeholder="Current password" value={security.currentPwd} onChange={e=>setSecurity(s=>({...s, currentPwd:e.target.value}))} />
              <input className="input" type="password" placeholder="New password" value={security.newPwd} onChange={e=>setSecurity(s=>({...s, newPwd:e.target.value}))} />
              <input className="input" type="password" placeholder="Confirm new password" value={security.confirmPwd} onChange={e=>setSecurity(s=>({...s, confirmPwd:e.target.value}))} />
              <div style={{display:"flex", gap:8, justifyContent:"flex-end"}}>
                <button className="btn-ghost" onClick={()=>{ setSecurity({ currentPwd: "", newPwd: "", confirmPwd: "" }); }}>Clear</button>
                <button className="btn-primary" onClick={()=>alert("Password change not implemented in demo")}>Change Password</button>
              </div>
            </div>
          </div>
        </div>

        {/* right column: profile card & quick actions */}
        <div style={{display:"grid", gap:12}}>
          <div className="card-2">
            <div style={{display:"flex", gap:12, alignItems:"center"}}>
              <div style={{width:72}}>
                {profile.logoUrl ? <img src={profile.logoUrl} alt="logo" style={{width:72,height:72,objectFit:"cover",borderRadius:8}} /> : <div style={{width:72,height:72,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8}}>Logo</div>}
              </div>
              <div>
                <div style={{fontWeight:800, fontSize:16}}>{profile.clinicName}</div>
                <div style={{color:"#6b7280"}}>{profile.address}</div>
                <div style={{marginTop:8, display:"flex", gap:8}}>
                  <div className="badge green">Active</div>
                  <div className="badge yellow">Pro</div>
                </div>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <button className="btn-primary" style={{width:"100%"}} onClick={()=>alert("Opening billing settings (demo)")}>Billing Settings</button>
            </div>
          </div>

          <div className="card-2">
            <h4 style={{marginTop:0}}>Quick Actions</h4>
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              <button className="btn-ghost" onClick={()=>alert("Exporting config (demo)")}>Export configuration</button>
              <button className="btn-ghost" onClick={()=>alert("Sending test notification (demo)")}>Send test notification</button>
              <button className="btn-ghost" onClick={()=>alert("Clearing cache (demo)")}>Clear local cache</button>
            </div>
          </div>

          <div className="card-2">
            <h4 style={{marginTop:0}}>Danger Zone</h4>
            <div style={{color:"#6b7280", marginBottom:10}}>Actions here are irreversible (demo only).</div>
            <div style={{display:"flex", gap:8}}>
              <button className="btn-ghost" onClick={()=>alert("This will deactivate clinic (demo)")}>Deactivate Clinic</button>
              <button className="btn-ghost" onClick={()=>alert("This will delete data (demo)")}>Delete Data</button>
            </div>
          </div>
        </div>
      </div>

      {/* toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
