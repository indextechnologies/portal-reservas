'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, type Tenant } from './lib/supabase';

const INDUSTRY_LABEL: Record<string, string> = {
  barbershop: 'Barbershop',
  restaurant: 'Restaurante',
  clinic:     'Clínica',
  spa:        'Spa',
  gym:        'Gimnasio',
  hotel:      'Hotel',
};

export default function Landing() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('tenants')
      .select('*')
      .eq('active', true)
      .order('created_at')
      .then(({ data }) => { setTenants(data ?? []); setLoading(false); });
  }, []);

  return (
    <div className="landing-wrap">
      <header className="landing-header anim-slide-up">
        <div className="landing-brand">RESERVAS</div>
        <h1 className="landing-title">Plataforma de reservas</h1>
        <p className="landing-subtitle">
          Selecciona un negocio para ver su sistema de reservas
        </p>
      </header>

      {loading ? (
        <div className="loading-row">
          {[1,2,3].map(i => <div key={i} className="tenant-card skeleton" />)}
        </div>
      ) : (
        <div className="tenant-grid anim-slide-up" style={{ animationDelay: '.1s' }}>
          {tenants.map((t, i) => (
            <div key={t.id} className="tenant-card anim-slide-up" style={{ animationDelay: `${.1 + i * .06}s` }}>
              <div className="tenant-card-header">
                <span className="tenant-industry">{INDUSTRY_LABEL[t.industry ?? ''] ?? t.industry}</span>
              </div>
              <h2 className="tenant-name">{t.name}</h2>
              <p className="tenant-slug">/{t.slug}</p>
              <div className="tenant-card-actions">
                <Link href={`/${t.slug}`} className="tc-btn primary">Reservar</Link>
                <Link href={`/${t.slug}/dashboard`} className="tc-btn secondary">Dashboard</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
