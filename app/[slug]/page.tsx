'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, type Tenant, type Service, type Resource, type CustomField } from '../lib/supabase';
import { CalendarIcon, ClockIcon, UserIcon, PlusIcon, CheckIcon, LayoutIcon } from '../components/icons';

type FieldValues = Record<string, string>;

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();

  const [tenant,       setTenant]       = useState<Tenant | null>(null);
  const [services,     setServices]     = useState<Service[]>([]);
  const [resources,    setResources]    = useState<Resource[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [notFound,     setNotFound]     = useState(false);

  // Form state
  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [phone,       setPhone]       = useState('');
  const [date,        setDate]        = useState('');
  const [time,        setTime]        = useState('');
  const [serviceId,   setServiceId]   = useState('');
  const [resourceId,  setResourceId]  = useState('');
  const [notes,       setNotes]       = useState('');
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState('');

  useEffect(() => {
    async function load() {
      const { data: t } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (!t) { setNotFound(true); setLoading(false); return; }
      setTenant(t);

      const [{ data: svcs }, { data: rsrc }, { data: cf }] = await Promise.all([
        supabase.from('tenant_services').select('*').eq('tenant_id', t.id).eq('active', true).order('sort_order'),
        supabase.from('tenant_resources').select('*').eq('tenant_id', t.id).eq('active', true).order('sort_order'),
        supabase.from('custom_fields').select('*').eq('tenant_id', t.id).eq('entity', 'reservation').eq('active', true).order('sort_order'),
      ]);

      setServices(svcs ?? []);
      setResources(rsrc ?? []);
      setCustomFields(cf ?? []);
      if (svcs?.[0]) setServiceId(svcs[0].id);
      setLoading(false);
    }
    load();
  }, [slug]);

  const config = (tenant?.config ?? {}) as Record<string, unknown>;
  const requirePhone = config.require_phone === true;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tenant) return;
    setSubmitting(true);
    setError('');

    const selectedService = services.find(s => s.id === serviceId);
    let endTime: string | undefined;
    if (selectedService && time) {
      const [h, m] = time.split(':').map(Number);
      const total  = h * 60 + m + selectedService.duration_minutes;
      endTime = `${String(Math.floor(total / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
    }

    const { error: err } = await supabase.from('reservations').insert({
      tenant_id:   tenant.id,
      guest_name:  name.trim(),
      guest_email: email.trim() || null,
      guest_phone: phone.trim() || null,
      date,
      start_time:  time,
      end_time:    endTime ?? null,
      service_id:  serviceId  || null,
      resource_id: resourceId || null,
      notes:       notes.trim() || null,
      status:      'confirmed',
      metadata:    fieldValues,
    });

    if (err) { setError('Error al guardar la reserva. Intentá de nuevo.'); setSubmitting(false); return; }

    setSuccess(true);
    setName(''); setEmail(''); setPhone(''); setDate(''); setTime('');
    setNotes(''); setFieldValues({});
    setServiceId(services[0]?.id ?? '');
    setResourceId('');
    setTimeout(() => setSuccess(false), 4000);
    setSubmitting(false);
  }

  if (loading) return <div className="page user-wrap"><div className="form-card skeleton" style={{ height: 480 }} /></div>;

  if (notFound) return (
    <div className="page user-wrap">
      <div className="form-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <p style={{ color: 'var(--text-2)', marginBottom: 16 }}>Negocio no encontrado</p>
        <Link href="/" className="tc-btn primary" style={{ display: 'inline-flex' }}>Volver al inicio</Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Nav */}
      <nav className="nav">
        <Link href="/" className="nav-brand">{tenant?.name ?? 'RESERVAS'}</Link>
        <Link href={`/${slug}/dashboard`} className="nav-tab">
          <LayoutIcon size={14} />
          Dashboard
        </Link>
      </nav>

      <div className="user-wrap page">
        <div className="form-card anim-scale-in">
          <div className="form-header">
            <h1 className="form-title">Nueva Reserva</h1>
            <p className="form-subtitle">{tenant?.name} — Complete sus datos</p>
          </div>

          <form className="form-body" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="field">
              <label className="field-label" htmlFor="f-name"><UserIcon size={12} />Nombre</label>
              <input id="f-name" className="field-input" type="text" placeholder="Nombre completo"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>

            {/* Email */}
            <div className="field">
              <label className="field-label" htmlFor="f-email">Email</label>
              <input id="f-email" className="field-input" type="email" placeholder="correo@ejemplo.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {/* Teléfono */}
            <div className="field">
              <label className="field-label" htmlFor="f-phone">Teléfono{requirePhone ? '' : ' (opcional)'}</label>
              <input id="f-phone" className="field-input" type="tel" placeholder="+595 9XX XXX XXX"
                value={phone} onChange={e => setPhone(e.target.value)} required={requirePhone} />
            </div>

            {/* Fecha */}
            <div className="field">
              <label className="field-label" htmlFor="f-date"><CalendarIcon size={12} />Fecha</label>
              <input id="f-date" className="field-input" type="date"
                value={date} onChange={e => setDate(e.target.value)} required />
            </div>

            {/* Hora */}
            <div className="field">
              <label className="field-label" htmlFor="f-time"><ClockIcon size={12} />Hora</label>
              <input id="f-time" className="field-input" type="time"
                value={time} onChange={e => setTime(e.target.value)} required />
            </div>

            {/* Servicio */}
            {services.length > 0 && (
              <div className="field">
                <label className="field-label" htmlFor="f-service">Servicio</label>
                <select id="f-service" className="field-input"
                  value={serviceId} onChange={e => setServiceId(e.target.value)}>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}{s.duration_minutes ? ` — ${s.duration_minutes}min` : ''}{s.price ? ` · ${Number(s.price).toLocaleString()} ${tenant?.currency ?? ''}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Recurso */}
            {resources.length > 0 && (
              <div className="field">
                <label className="field-label" htmlFor="f-resource">Preferencia</label>
                <select id="f-resource" className="field-input"
                  value={resourceId} onChange={e => setResourceId(e.target.value)}>
                  <option value="">Sin preferencia</option>
                  {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            )}

            {/* Custom fields dinámicos */}
            {customFields.map(cf => (
              <div key={cf.id} className="field">
                <label className="field-label" htmlFor={`cf-${cf.id}`}>
                  {cf.label}{cf.required ? '' : ' (opcional)'}
                </label>
                {cf.type === 'select' ? (
                  <select id={`cf-${cf.id}`} className="field-input" required={cf.required}
                    value={fieldValues[cf.name] ?? ''}
                    onChange={e => setFieldValues(v => ({ ...v, [cf.name]: e.target.value }))}>
                    <option value="">Seleccionar...</option>
                    {(cf.options as string[] ?? []).map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : cf.type === 'textarea' ? (
                  <textarea id={`cf-${cf.id}`} className="field-input" required={cf.required}
                    rows={3} placeholder={cf.label}
                    value={fieldValues[cf.name] ?? ''}
                    onChange={e => setFieldValues(v => ({ ...v, [cf.name]: e.target.value }))}
                    style={{ resize: 'vertical' }} />
                ) : cf.type === 'boolean' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input id={`cf-${cf.id}`} type="checkbox"
                      checked={fieldValues[cf.name] === 'true'}
                      onChange={e => setFieldValues(v => ({ ...v, [cf.name]: String(e.target.checked) }))}
                      style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                    <label htmlFor={`cf-${cf.id}`} style={{ fontSize: 13, color: 'var(--text-2)' }}>{cf.label}</label>
                  </div>
                ) : (
                  <input id={`cf-${cf.id}`} className="field-input"
                    type={cf.type === 'date' ? 'date' : cf.type === 'number' ? 'number' : 'text'}
                    required={cf.required} placeholder={cf.label}
                    value={fieldValues[cf.name] ?? ''}
                    onChange={e => setFieldValues(v => ({ ...v, [cf.name]: e.target.value }))} />
                )}
              </div>
            ))}

            {/* Notas */}
            <div className="field">
              <label className="field-label" htmlFor="f-notes">Notas (opcional)</label>
              <textarea id="f-notes" className="field-input" rows={2}
                placeholder="Algún detalle adicional..."
                value={notes} onChange={e => setNotes(e.target.value)}
                style={{ resize: 'vertical' }} />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: 'var(--red)', background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,.2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                {error}
              </p>
            )}

            <button type="submit" className="submit-btn" disabled={submitting}>
              <PlusIcon size={16} />
              {submitting ? 'Guardando...' : 'Confirmar reserva'}
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
    </>
  );
}
