import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard'
import Patients from '../pages/Patients'
import Appointments from '../pages/Appointments'
import Doctors from '../pages/Doctors'
import Schedules from '../pages/Schedules'
import Prescriptions from '../pages/Prescriptions'
import Billing from '../pages/Billing'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import Profile from '../pages/Profile'


export default function AppRoutes(){
return (
<Routes>
<Route path="/" element={<DashboardLayout />}>
<Route index element={<Dashboard />} />
<Route path="patients" element={<Patients />} />
<Route path="appointments" element={<Appointments />} />
<Route path="doctors" element={<Doctors />} />
<Route path="schedules" element={<Schedules />} />
<Route path="prescriptions" element={<Prescriptions />} />
<Route path="billing" element={<Billing />} />
<Route path="reports" element={<Reports />} />
<Route path="settings" element={<Settings />} />
<Route path="profile" element={<Profile />} />
</Route>
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
)
}