import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-title">Doctor Dashboard</div>

      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/patients">Patients</NavLink>
      <NavLink to="/appointments">Appointments</NavLink>
      <NavLink to="/doctors">Doctors</NavLink>
      <NavLink to="/schedules">Schedules</NavLink>
      <NavLink to="/prescriptions">Prescriptions</NavLink>
      <NavLink to="/billing">Billing</NavLink>
      <NavLink to="/reports">Reports</NavLink>
      <NavLink to="/settings">Settings</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </div>
  );
}
