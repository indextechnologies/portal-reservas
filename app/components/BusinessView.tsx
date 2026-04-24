'use client';
import { useState, useMemo } from 'react';
import type { Reservation } from '../page';
import {
  CalendarIcon, ClockIcon, UserIcon,
  TrashIcon, XCircleIcon, FilterIcon,
  ListIcon, CalGridIcon, XIcon,
} from './icons';

const TODAY = new Date().toISOString().slice(0, 10);

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${day} ${months[+m - 1]} ${y}`;
}

interface Props {
  reservations: Reservation[];
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BusinessView({ reservations, onCancel, onDelete }: Props) {
  const [dateFilter, setDateFilter] = useState('');
  const [subView, setSubView]       = useState<'list' | 'calendar'>('list');

  const todayCount  = reservations.filter(r => r.date === TODAY && r.status === 'active').length;
  const activeCount = reservations.filter(r => r.status === 'active').length;
  const cancelCount = reservations.filter(r => r.status === 'cancelled').length;

  const filtered = useMemo(() => {
    const base = dateFilter ? reservations.filter(r => r.date === dateFilter) : reservations;
    return [...base].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [reservations, dateFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of filtered) {
      const list = map.get(r.date) ?? [];
      list.push(r);
      map.set(r.date, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="biz-wrap page">
      <div className="biz-header anim-slide-up">
        <h1 className="biz-title">Dashboard</h1>
        <p className="biz-subtitle">Gestiona y visualiza todas las reservas</p>
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
          <p className="metric-label">Activas</p>
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
          <button
            className={`view-btn${subView === 'list' ? ' active' : ''}`}
            onClick={() => setSubView('list')}
          >
            <ListIcon size={13} />
            Lista
          </button>
          <button
            className={`view-btn${subView === 'calendar' ? ' active' : ''}`}
            onClick={() => setSubView('calendar')}
          >
            <CalGridIcon size={13} />
            Calendario
          </button>
        </div>

        <div className="filter-wrap">
          <span className="filter-label">
            <FilterIcon size={11} />
            Filtrar por fecha
          </span>
          <input
            type="date"
            className="filter-input"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button className="clear-filter" onClick={() => setDateFilter('')} title="Limpiar filtro">
              <XIcon size={14} />
            </button>
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
          <ListView reservations={filtered} onCancel={onCancel} onDelete={onDelete} />
        ) : (
          <CalendarView grouped={grouped} onCancel={onCancel} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
}

/* ── List sub-view ── */
function ListView({
  reservations, onCancel, onDelete,
}: { reservations: Reservation[]; onCancel: (id: string) => void; onDelete: (id: string) => void; }) {
  return (
    <div className="res-list">
      {reservations.map(r => (
        <div key={r.id} className={`res-card${r.status === 'cancelled' ? ' cancelled' : ''}`}>
          <span className="res-id">#{r.id}</span>

          <div className="res-info">
            <span className="res-name">{r.name}</span>

            <div className="res-datetime">
              <span className="res-date">
                <CalendarIcon size={11} />
                {formatDate(r.date)}
              </span>
              <span className="res-time">
                <ClockIcon size={11} />
                {r.time}
              </span>
            </div>

            <span className="res-service">{r.service}</span>
            <span className={`status-badge ${r.status}`}>
              {r.status === 'active' ? 'Activa' : 'Cancelada'}
            </span>
          </div>

          <div className="res-actions">
            {r.status === 'active' && (
              <button
                className="action-btn warn"
                title="Cancelar reserva"
                onClick={() => onCancel(r.id)}
              >
                <XCircleIcon size={14} />
              </button>
            )}
            <button
              className="action-btn danger"
              title="Eliminar reserva"
              onClick={() => onDelete(r.id)}
            >
              <TrashIcon size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Calendar sub-view ── */
function CalendarView({
  grouped, onCancel, onDelete,
}: { grouped: [string, Reservation[]][]; onCancel: (id: string) => void; onDelete: (id: string) => void; }) {
  return (
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
              <span className="cal-time">{r.time}</span>
              <span className="cal-name">{r.name}</span>
              <span className="cal-service">{r.service}</span>
              <span className={`status-badge ${r.status}`}>
                {r.status === 'active' ? 'Activa' : 'Cancelada'}
              </span>
              <div className="res-actions">
                {r.status === 'active' && (
                  <button className="action-btn warn" title="Cancelar" onClick={() => onCancel(r.id)}>
                    <XCircleIcon size={13} />
                  </button>
                )}
                <button className="action-btn danger" title="Eliminar" onClick={() => onDelete(r.id)}>
                  <TrashIcon size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
