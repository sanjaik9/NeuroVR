import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="main-content" style={{ textAlign: 'center', padding: '5rem 1.5rem', maxWidth: '600px' }}>
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '2px solid var(--border-color)',
          padding: '3rem 2rem'
        }}
      >
        <AlertCircle size={56} style={{ color: 'var(--warning)', margin: '0 auto 1.5rem auto' }} />
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
          We could not find the page you are looking for. Don't worry, you are in a safe space!
        </p>
        <Link
          to="/"
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.8rem 1.5rem',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          <Home size={18} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
