'use client';
import { useState, useRef } from 'react';
import type { Reservation } from '../page';
import { CalendarIcon, ClockIcon, UserIcon, PlusIcon, CheckIcon } from './icons';

const SERVICES = ['General', 'Premium', 'Express', 'VIP'];

interface Props {
  onSubmit: (r: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => void;
}

export default function UserView({ onSubmit }: Props) {
  const [name, setName]       = useState('');
  const [date, setDate]       = useState('');
  const [time, setTime]       = useState('');
  const [service, setService] = useState('General');
  const [success, setSuccess] = useState(false);
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !time) return;

    onSubmit({ name: name.trim(), date, time, service });

    setName(''); setDate(''); setTime(''); setService('General');
    setSuccess(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSuccess(false), 3500);
  };

  return (
    <div className="user-wrap page">
      <div className="form-card anim-scale-in">
        <div className="form-header">
          <h1 className="form-title">Nueva Reserva</h1>
          <p className="form-subtitle">Complete los datos para confirmar su reserva</p>
        </div>

        <form className="form-body" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="field">
            <label className="field-label" htmlFor="res-name">
              <UserIcon size={12} />
              Nombre
            </label>
            <input
              id="res-name"
              className="field-input"
              type="text"
              placeholder="Tu nombre completo"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          {/* Fecha */}
          <div className="field">
            <label className="field-label" htmlFor="res-date">
              <CalendarIcon size={12} />
              Fecha
            </label>
            <input
              id="res-date"
              className="field-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          {/* Hora */}
          <div className="field">
            <label className="field-label" htmlFor="res-time">
              <ClockIcon size={12} />
              Hora
            </label>
            <input
              id="res-time"
              className="field-input"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            />
          </div>

          {/* Servicio */}
          <div className="field">
            <label className="field-label" htmlFor="res-service">
              Servicio
            </label>
            <select
              id="res-service"
              className="field-input"
              value={service}
              onChange={e => setService(e.target.value)}
            >
              {SERVICES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn">
            <PlusIcon size={16} />
            Confirmar reserva
          </button>
        </form>

        {success && (
          <div className="success-banner anim-slide-up">
            <CheckIcon size={16} />
            Reserva confirmada correctamente
          </div>
        )}
      </div>
    </div>
  );
}
