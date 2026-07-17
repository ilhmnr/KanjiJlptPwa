import React from 'react';
import { NavLink } from 'react-router-dom';

const ITEMS = [
  { to: '/', label: 'Beranda', icon: '🏠', end: true },
  { to: '/search', label: 'Cari', icon: '🔍' },
  { to: '/favorites', label: 'Favorit', icon: '⭐' },
  { to: '/stats', label: 'Statistik', icon: '📊' }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
