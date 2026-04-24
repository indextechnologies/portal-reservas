'use client';
import { UserIcon, LayoutIcon } from './icons';
import type { View } from '../page';

interface Props {
  view: View;
  onViewChange: (v: View) => void;
}

export default function Navigation({ view, onViewChange }: Props) {
  return (
    <nav className="nav">
      <span className="nav-brand">RESERVAS</span>
      <div className="nav-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={view === 'user'}
          className={`nav-tab${view === 'user' ? ' active' : ''}`}
          onClick={() => onViewChange('user')}
        >
          <UserIcon size={14} />
          Reservar
        </button>
        <button
          role="tab"
          aria-selected={view === 'business'}
          className={`nav-tab${view === 'business' ? ' active' : ''}`}
          onClick={() => onViewChange('business')}
        >
          <LayoutIcon size={14} />
          Dashboard
        </button>
      </div>
    </nav>
  );
}
