import React from 'react'

export default function RecentActivity({ items }) {
  return (
    <div className="card-2">
      <h3 style={{marginBottom:10}}>Recent Activity</h3>
      <ul className="recent-list">
        {items.map((it, idx) => (
          <li className="recent-item" key={idx}>
            <div style={{width:44, height:44, borderRadius:8, background: it.color}} />
            <div>
              <div style={{fontWeight:600}}>{it.title}</div>
              <div className="meta">{it.meta}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
