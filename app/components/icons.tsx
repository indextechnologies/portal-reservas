type IconProps = { size?: number; className?: string };

const base = (d: string | React.ReactNode, extra = '') =>
  ({ size = 16, className = '' }: IconProps) => (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {d}
    </svg>
  );

export const CalendarIcon = base(
  <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></>
);

export const ClockIcon = base(
  <><circle cx="12" cy="12" r="9" /><polyline points="12,6 12,12 16,14" /></>
);

export const UserIcon = base(
  <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>
);

export const LayoutIcon = base(
  <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>
);

export const PlusIcon = base(
  <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>
);

export const TrashIcon = base(
  <><polyline points="3,6 5,6 21,6" /><path d="M19,6l-1,14H6L5,6" /><path d="M10,11v6M14,11v6" /><path d="M9,6V4h6v2" /></>
);

export const XCircleIcon = base(
  <><circle cx="12" cy="12" r="9" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
);

export const CheckIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

export const FilterIcon = base(
  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
);

export const ListIcon = base(
  <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="3" cy="18" r="1" fill="currentColor" stroke="none" /></>
);

export const CalGridIcon = base(
  <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>
);

export const XIcon = base(
  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
);
