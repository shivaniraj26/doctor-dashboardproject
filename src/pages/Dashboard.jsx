import React from 'react'
import StatCard from '../components/StatCard'
import SmallChart from '../components/SmallChart'
import RecentActivity from '../components/RecentActivity'
import AppointmentsTable from '../components/AppointmentsTable'
import { FiUsers, FiCalendar, FiCreditCard, FiEye } from 'react-icons/fi'

export default function Dashboard(){
  const chartLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const chartData = [32,45,28,60,49,72,68]

  const recent = [
    { title: 'New patient registered: Priya', meta: '2 hours ago', color: '#60a5fa' },
    { title: 'Invoice paid: Rahul', meta: '4 hours ago', color: '#34d399' },
    { title: 'Appointment canceled: Mr. Sharma', meta: '1 day ago', color: '#f97316' },
  ]

  const appts = [
    { patient:'Amit', time:'10:00 AM', type:'Consult', doctor:'Dr. Smith', status:'Pending' },
    { patient:'Sneha', time:'10:30 AM', type:'Follow-up', doctor:'Dr. Kumar', status:'Done' },
    { patient:'Ravi', time:'11:00 AM', type:'Consult', doctor:'Dr. Smith', status:'Pending' },
  ]

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <div>
          <h1 style={{fontSize:28}}>Dashboard</h1>
          <div style={{color:'#6b7280'}}>Today • {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="kpi-row">
        <StatCard icon={<FiUsers />} iconBg="#4f46e5" title="Patients" value="1,240" />
        <StatCard icon={<FiCalendar />} iconBg="#06b6d4" title="Appointments" value="32" />
        <StatCard icon={<FiEye />} iconBg="#ef4444" title="Views" value="8.1k" />
        <StatCard icon={<FiCreditCard />} iconBg="#10b981" title="Earnings" value="$4,320" />
      </div>

      <div className="grid-2">
        <div>
          <div className="card-2" style={{marginBottom:18}}>
            <SmallChart labels={chartLabels} data={chartData} />
          </div>

          <AppointmentsTable rows={appts} />
        </div>

        <div>
          <RecentActivity items={recent} />
        </div>
      </div>
    </div>
  )
}
