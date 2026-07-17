import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import { registerSW } from 'virtual:pwa-register';

// Daftarkan Service Worker (dibuat otomatis oleh vite-plugin-pwa saat build)
// supaya aplikasi bisa dipakai offline setelah pertama kali dibuka & di-cache.
registerSW({ immediate: true });

// HashRouter dipakai supaya routing tetap berfungsi walau aplikasi
// dibuka offline sebagai PWA yang di-install (tanpa perlu konfigurasi
// rewrite rule server untuk setiap path).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
