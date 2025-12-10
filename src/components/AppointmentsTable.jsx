import React from 'react'

export default function AppointmentsTable({ rows }) {
  return (
    <div className="card-2">
      <h3 style={{marginBottom:12}}>Upcoming Appointments</h3>
      <table className="table">
        <thead>
          <tr><th>Patient</th><th>Time</th><th>Type</th><th>Doctor</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}>
              <td>{r.patient}</td>
              <td>{r.time}</td>
              <td>{r.type}</td>
              <td>{r.doctor}</td>
              <td><span className={`badge ${r.status==='Done' ? 'green' : r.status==='Pending' ? 'yellow' : 'red'}`}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
