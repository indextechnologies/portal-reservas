'use client';
import { useState } from 'react';
import Navigation from './components/Navigation';
import UserView from './components/UserView';
import BusinessView from './components/BusinessView';

export interface Reservation {
  id: string;
  name: string;
  date: string;
  time: string;
  service: string;
  status: 'active' | 'cancelled';
  createdAt: number;
}

export type View = 'user' | 'business';

const SEED: Reservation[] = [
  { id: '001', name: 'María González', date: '2026-04-24', time: '10:00', service: 'General',  status: 'active',    createdAt: Date.now() - 3_600_000 },
  { id: '002', name: 'Carlos Ruiz',    date: '2026-04-24', time: '14:30', service: 'Premium',  status: 'active',    createdAt: Date.now() - 7_200_000 },
  { id: '003', name: 'Ana Martínez',   date: '2026-04-24', time: '16:00', service: 'Express',  status: 'cancelled', createdAt: Date.now() - 9_000_000 },
  { id: '004', name: 'Juan Pérez',     date: '2026-04-25', time: '09:30', service: 'General',  status: 'active',    createdAt: Date.now() - 86_400_000 },
  { id: '005', name: 'Sofía Herrera',  date: '2026-04-25', time: '11:00', service: 'VIP',      status: 'active',    createdAt: Date.now() - 90_000_000 },
  { id: '006', name: 'Luis Torres',    date: '2026-04-26', time: '15:00', service: 'Premium',  status: 'active',    createdAt: Date.now() - 172_800_000 },
];

export default function Home() {
  const [view, setView]               = useState<View>('user');
  const [reservations, setReservations] = useState<Reservation[]>(SEED);

  const addReservation = (r: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => {
    setReservations(prev => [
      ...prev,
      { ...r, id: String(Date.now()).slice(-6), status: 'active', createdAt: Date.now() },
    ]);
  };

  const cancelReservation = (id: string) =>
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));

  const deleteReservation = (id: string) =>
    setReservations(prev => prev.filter(r => r.id !== id));

  return (
    <>
      <Navigation view={view} onViewChange={setView} />
      {view === 'user' ? (
        <UserView onSubmit={addReservation} />
      ) : (
        <BusinessView
          reservations={reservations}
          onCancel={cancelReservation}
          onDelete={deleteReservation}
        />
      )}
    </>
  );
}
