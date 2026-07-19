import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="page empty-state">
      <p style={{ fontSize: 40 }}>迷</p>
      <p>Halaman tidak ditemukan.</p>
      <button className="btn btn-primary mt-16" onClick={() => navigate('/')}>Kembali ke Beranda</button>
    </div>
  );
}
