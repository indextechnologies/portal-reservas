'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, type Tenant, type ReservationWithJoins } from '../../lib/supabase';
import {
  CalendarIcon, ClockIcon, UserIcon, TrashIcon,
  XCircleIcon, FilterIcon, ListIcon, CalGridIcon, XIcon,
} from '../../components/icons';

const TODAY = new Date().toISOString().slice(0, 10);

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada',
  cancelled: 'Cancelada', completed: 'Completada', no_show: 'No asistió',
};

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${day} ${months[+m - 1]} ${y}`;
}

export default function DashboardPage() {
  const { slug } = useParams<{ slug: string }>();

  const [tenant,       setTenant]       = useState<Tenant | null>(null);
  const [reservations, setReservations] = useState<ReservationWithJoins[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [subView,      setSubView]      = useState<'list' | 'calendar'>('list');
  const [dateFilter,   setDateFilter]   = useState('');

  const load = useCallback(async () => {
    const { data: t } = await supabase
      .from('tenants').select('*').eq('slug', slug).single();
    if (!t) { setLoading(false); return; }
    setTenant(t);

    const { data: res } = await supabase
      .from('reservations')
      .select(`*, tenant_services(name, color, duration_minutes), tenant_resources(name, type), clients(name, email, phone)`)
      .eq('tenant_id', t.id)
      .order('date').order('start_time');

    setReservations((res as unknown as ReservationWithJoins[]) ?? []);
    setLoading(false);
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return dateFilter ? reservations.filter(r => r.date === dateFilter) : reservations;
  }, [reservations, dateFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, ReservationWithJoins[]>();
    for (const r of filtered) {
      const list = map.get(r.date) ?? [];
      list.push(r);
      map.set(r.date, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const todayCount  = reservations.filter(r => r.date === TODAY && r.status === 'confirmed').length;
  const activeCount = reservations.filter(r => r.status === 'confirmed').length;
  const cancelCount = reservations.filter(r => r.status === 'cancelled').length;

  async function handleCancel(id: string) {
    await supabase.from('reservations').update({
      status: 'cancelled', cancelled_at: new Date().toISOString(), cancelled_by: 'business',
    }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  }

  async function handleDelete(id: string) {
    await supabase.from('reservations').delete().eq('id', id);
    setReservations(prev => prev.filter(r => r.id !== id));
  }

  const guestOrClient = (r: ReservationWithJoins) =>
    r.clients?.name ?? r.guest_name ?? '—';

  if (loading) return (
    <div className="page biz-wrap">
      <div className="skeleton" style={{ height: 40, width: 200, borderRadius: 8, marginBottom: 32 }} />
      <div className="metrics-row">
        {[1,2,3,4].map(i => <div key={i} className="metric-card skeleton" style={{ height: 80 }} />)}
      </div>
    </div>
  );

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-brand">{tenant?.name ?? 'RESERVAS'}</Link>
        <Link href={`/${slug}`} className="nav-tab">
          <UserIcon size={14} />
          Reservar
        </Link>
      </nav>

      <div className="biz-wrap page">
        {/* Header */}
        <div className="biz-header anim-slide-up">
          <h1 className="biz-title">Dashboard</h1>
          <p className="biz-subtitle">{tenant?.name} — {tenant?.industry}</p>
        </div>

        {/* Metrics */}
        <div className="metrics-row anim-slide-up" style={{ animationDelay: '.05s' }}>
          <div className="metric-card">
            <p className="metric-label">Total</p>
            <p className="metric-value">{reservations.length}</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Hoy</p>
            <p className="metric-value accent">{todayCount}</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Confirmadas</p>
            <p className="metric-value green">{activeCount}</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Canceladas</p>
            <p className="metric-value" style={{ color: 'var(--red)' }}>{cancelCount}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar anim-slide-up" style={{ animationDelay: '.1s' }}>
          <div className="view-toggle">
            <button className={`view-btn${subView === 'list' ? ' active' : ''}`} onClick={() => setSubView('list')}>
              <ListIcon size={13} />Lista
            </button>
            <button className={`view-btn${subView === 'calendar' ? ' active' : ''}`} onClick={() => setSubView('calendar')}>
              <CalGridIcon size={13} />Calendario
            </button>
          </div>
          <div className="filter-wrap">
            <span className="filter-label"><FilterIcon size={11} />Filtrar por fecha</span>
            <input type="date" className="filter-input" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            {dateFilter && (
              <button className="clear-filter" onClick={() => setDateFilter('')}><XIcon size={14} /></button>
            )}
          </div>
        </div>

        {/* Content */}
        <div key={subView} className="anim-slide-up">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <CalendarIcon size={40} className="empty-state-icon" />
              <p className="empty-state-text">
                {dateFilter ? 'Sin reservas para esta fecha' : 'No hay reservas aún'}
              </p>
            </div>
          ) : subView === 'list' ? (
            <div className="res-list">
              {filtered.map(r => (
                <div key={r.id} className={`res-card${r.status === 'cancelled' ? ' cancelled' : ''}`}>
                  <span className="res-id">#{r.id.slice(-6)}</span>
                  <div className="res-info">
                    <span className="res-name">{guestOrClient(r)}</span>
                    <div className="res-datetime">
                      <span className="res-date"><CalendarIcon size={11} />{formatDate(r.date)}</span>
                      <span className="res-time"><ClockIcon size={11} />{r.start_time.slice(0,5)}</span>
                    </div>
                    {r.tenant_services && (
                      <span className="res-service"
                        style={r.tenant_services.color ? { borderColor: r.tenant_services.color + '44', color: r.tenant_services.color } : {}}>
                        {r.tenant_services.name}
                      </span>
                    )}
                    {r.tenant_resources && <span className="res-service">{r.tenant_resources.name}</span>}
                    <span className={`status-badge ${r.status === 'confirmed' ? 'active' : r.status}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <div className="res-actions">
                    {(r.status === 'confirmed' || r.status === 'pending') && (
                      <button className="action-btn warn" title="Cancelar" onClick={() => handleCancel(r.id)}>
                        <XCircleIcon size={14} />
                      </button>
                    )}
                    <button className="action-btn danger" title="Eliminar" onClick={() => handleDelete(r.id)}>
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cal-wrap">
              {grouped.map(([date, slots]) => (
                <div key={date} className="cal-day">
                  <div className="cal-day-header">
                    <span className="cal-day-date">{formatDate(date)}</span>
                    {date === TODAY && <span className="cal-day-today">Hoy</span>}
                    <span className="cal-day-count">{slots.length} reserva{slots.length !== 1 ? 's' : ''}</span>
                    <div className="cal-day-line" />
                  </div>
                  {slots.map(r => (
                    <div key={r.id} className={`cal-slot${r.status === 'cancelled' ? ' cancelled' : ''}`}>
                      <span className="cal-time">{r.start_time.slice(0,5)}</span>
                      <span className="cal-name">{guestOrClient(r)}</span>
                      {r.tenant_services && (
                        <span className="cal-service"
                          style={r.tenant_services.color ? { color: r.tenant_services.color } : {}}>
                          {r.tenant_services.name}
                        </span>
                      )}
                      <span className={`status-badge ${r.status === 'confirmed' ? 'active' : r.status}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <div className="res-actions">
                        {(r.status === 'confirmed' || r.status === 'pending') && (
                          <button className="action-btn warn" title="Cancelar" onClick={() => handleCancel(r.id)}>
                            <XCircleIcon size={13} />
                          </button>
                        )}
                        <button className="action-btn danger" title="Eliminar" onClick={() => handleDelete(r.id)}>
                          <TrashIcon size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
