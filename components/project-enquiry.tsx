'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  LoaderCircle,
  Mail,
  Phone,
} from 'lucide-react';
import {
  budgets,
  emptyEnquiry,
  projectTypes,
  stages,
  timings,
  validateEnquiry,
  type Enquiry,
  type EnquiryErrors,
} from '@/lib/enquiry';

export default function ProjectEnquiry() {
  const [data, setData] = useState<Enquiry>({ ...emptyEnquiry });
  const [step, setStep] = useState<1 | 2>(1),
    [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState(''),
    [expanded, setExpanded] = useState(false);
  const form = useRef<HTMLFormElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    success = useRef<HTMLOutputElement>(null);
  const requestId = useRef<string | null>(null),
    busy = useRef(false),
    didChangeStep = useRef(false);
  useEffect(() => {
    if (didChangeStep.current) heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (status === 'success') success.current?.focus();
  }, [status]);
  function change<K extends keyof Enquiry>(key: K, value: Enquiry[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setStatus('idle');
    setMessage('');
    requestId.current = null;
  }
  function focusError(next: EnquiryErrors) {
    const key = Object.keys(next)[0];
    requestAnimationFrame(() =>
      form.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus(),
    );
  }
  function back() {
    didChangeStep.current = true;
    setStep(1);
    setErrors({});
    setStatus('idle');
    setMessage('');
  }
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const next = validateEnquiry(data, step);
    setErrors(next);
    if (Object.keys(next).length) {
      if (next.area || next.details) setExpanded(true);
      focusError(next);
      return;
    }
    if (step === 1) {
      didChangeStep.current = true;
      setStep(2);
      return;
    }
    busy.current = true;
    setStatus('sending');
    setMessage('');
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, requestId: requestId.current }),
        signal: AbortSignal.timeout(20000),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: EnquiryErrors;
      };
      if (!response.ok || !result.ok) {
        if (result.errors) {
          setErrors(result.errors);
          if (
            result.errors.projectType ||
            result.errors.locality ||
            result.errors.stage ||
            result.errors.timing ||
            result.errors.area ||
            result.errors.budget ||
            result.errors.details
          ) {
            didChangeStep.current = true;
            setStep(1);
            if (
              result.errors.area ||
              result.errors.budget ||
              result.errors.details
            )
              setExpanded(true);
          }
          focusError(result.errors);
        }
        throw new Error(
          result.error ||
            'Cererea nu a putut fi trimisă. Încearcă din nou sau sună-ne.',
        );
      }
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error &&
          error.name !== 'TimeoutError' &&
          error.name !== 'TypeError'
          ? error.message
          : 'Nu am putut confirma trimiterea. Încearcă din nou; datele tale sunt păstrate în formular.',
      );
    } finally {
      busy.current = false;
    }
  }
  const errorText = (key: keyof Enquiry) =>
    errors[key] ? (
      <p className="lead-error" id={`error-${key}`}>
        {errors[key]}
      </p>
    ) : null;
  return (
    <footer className="enquiry-section lead-section" id="contact">
      <div className="section-shell lead-grid">
        <div className="lead-intro">
          <h2>
            Ce construim
            <br />
            <span>împreună?</span>
          </h2>
          <p className="lead-introduction">
            Spune-ne ce ai în plan. Câteva detalii sunt suficiente pentru a
            începe discuția.
          </p>
          <p className="lead-reassurance">
            Nu trebuie să ai toate răspunsurile.
            <br />
            Pornim de la etapa în care ești acum.
          </p>
          <div className="lead-direct">
            <p>Preferi să vorbim direct?</p>
            <a className="lead-phone" href="tel:+40740225554">
              <Phone size={20} aria-hidden="true" />
              0740 225 554
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            <span>Luni – Vineri, 9:00 – 17:00</span>
            <a className="lead-email" href="mailto:office@tomorogaconstruct.ro">
              office@tomorogaconstruct.ro
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="lead-company">
            <Image
              src="/tomoroga-logo.png"
              alt="Tomoroga Construct — Antrepriză generală"
              width={150}
              height={150}
            />
            <p>
              Antrepriză generală
              <br />
              <span>Din 2004.</span>
            </p>
          </div>
        </div>
        <div className="lead-form-column">
          {status === 'success' ? (
            <output className="lead-success" ref={success} tabIndex={-1}>
              <Check size={36} aria-hidden="true" />
              <h3>Cererea ta a fost trimisă.</h3>
              <p>
                Mulțumim, {data.name.trim().split(' ')[0]}. Avem detaliile
                proiectului din {data.locality.trim()} și datele tale de
                contact.
              </p>
              <p className="lead-success-contact">
                Contact preferat:{' '}
                <strong>
                  {data.contactMethod === 'phone' ? data.phone : data.email}
                </strong>
              </p>
              <a href="tel:+40740225554" className="lead-primary">
                Vrei să discutăm acum? <Phone size={18} />
              </a>
              <button
                type="button"
                className="lead-text-button"
                onClick={() => {
                  setData({ ...emptyEnquiry });
                  setErrors({});
                  setExpanded(false);
                  setMessage('');
                  setStatus('idle');
                  didChangeStep.current = true;
                  setStep(1);
                  requestId.current = null;
                }}
              >
                Descrie un alt proiect <ArrowRight size={16} />
              </button>
            </output>
          ) : (
            <form
              className="lead-form"
              ref={form}
              onSubmit={submit}
              noValidate
              aria-busy={status === 'sending'}
            >
              <ol className="lead-progress" aria-label="Pașii formularului">
                <li aria-current={step === 1 ? 'step' : undefined}>
                  <span>{step === 2 ? <Check size={13} /> : 1}</span>
                  {step === 2 ? (
                    <button
                      type="button"
                      onClick={back}
                      disabled={status === 'sending'}
                    >
                      Despre proiect
                    </button>
                  ) : (
                    'Despre proiect'
                  )}
                </li>
                <li aria-current={step === 2 ? 'step' : undefined}>
                  <span>2</span>Datele de contact
                </li>
              </ol>
              <div className="lead-form-heading">
                <h3 ref={heading} tabIndex={-1}>
                  {step === 1
                    ? 'Să începem cu ideea ta.'
                    : 'Cum te putem contacta?'}
                </h3>
                <p>
                  {step === 1
                    ? 'Doar tipul proiectului și localitatea sunt obligatorii.'
                    : 'Lasă-ne numele și o modalitate de contact.'}
                </p>
              </div>
              <div className="lead-honeypot" aria-hidden="true">
                <label htmlFor="lead-website">Website</label>
                <input
                  id="lead-website"
                  name="website"
                  value={data.website}
                  onChange={(e) => change('website', e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>
              {step === 1 ? (
                <div className="lead-step" key="project">
                  <fieldset className="lead-fieldset">
                    <legend>Ce vrei să construiești?</legend>
                    <div className="lead-type-options">
                      {projectTypes.map((type, i) => (
                        <label className="lead-type" key={type}>
                          <input
                            type="radio"
                            name="projectType"
                            value={type}
                            checked={data.projectType === type}
                            onChange={() => change('projectType', type)}
                            required
                            aria-describedby={
                              errors.projectType
                                ? 'error-projectType'
                                : undefined
                            }
                          />
                          <span>
                            <strong>
                              {['Civil', 'Industrial', 'Reabilitare'][i]}
                            </strong>
                            <small>
                              {
                                [
                                  'Casă sau clădire civilă',
                                  'Hală sau spațiu de lucru',
                                  'Renovare sau consolidare',
                                ][i]
                              }
                            </small>
                          </span>
                          <Check size={16} aria-hidden="true" />
                        </label>
                      ))}
                    </div>
                    {errorText('projectType')}
                  </fieldset>
                  <div className="lead-field">
                    <label htmlFor="lead-locality">Unde este proiectul?</label>
                    <input
                      id="lead-locality"
                      name="locality"
                      autoComplete="address-level2"
                      placeholder="Localitate și județ"
                      maxLength={120}
                      value={data.locality}
                      onChange={(e) => change('locality', e.target.value)}
                      aria-invalid={Boolean(errors.locality)}
                      aria-describedby={
                        errors.locality ? 'error-locality' : undefined
                      }
                      required
                    />
                    {errorText('locality')}
                  </div>
                  <div className="lead-field-pair">
                    <div className="lead-field">
                      <label htmlFor="lead-stage">
                        În ce etapă ești? <span>opțional</span>
                      </label>
                      <div className="lead-select">
                        <select
                          id="lead-stage"
                          name="stage"
                          value={data.stage}
                          onChange={(e) => change('stage', e.target.value)}
                        >
                          <option value="">Alege etapa</option>
                          {stages.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                    <div className="lead-field">
                      <label htmlFor="lead-timing">
                        Când vrei să începi? <span>opțional</span>
                      </label>
                      <div className="lead-select">
                        <select
                          id="lead-timing"
                          name="timing"
                          value={data.timing}
                          onChange={(e) => change('timing', e.target.value)}
                        >
                          <option value="">Alege perioada</option>
                          {timings.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <details
                    className="lead-extra"
                    open={expanded}
                    onToggle={(e) => setExpanded(e.currentTarget.open)}
                  >
                    <summary>
                      Descriere, suprafață și buget <span>opțional</span>
                      <ChevronDown size={16} />
                    </summary>{' '}
                    <div className="lead-field">
                      <label htmlFor="lead-details">
                        Ce ar fi util să știm? <span>opțional</span>
                      </label>
                      <textarea
                        id="lead-details"
                        name="details"
                        rows={3}
                        maxLength={1500}
                        placeholder="Ce vrei să construiești, ce există deja sau ce ai nevoie să clarificăm…"
                        value={data.details}
                        onChange={(e) => change('details', e.target.value)}
                        aria-invalid={Boolean(errors.details)}
                        aria-describedby={
                          errors.details ? 'error-details' : undefined
                        }
                      />
                      {errorText('details')}
                    </div>
                    <div className="lead-field-pair">
                      <div className="lead-field">
                        <label htmlFor="lead-area">
                          Suprafață estimată <span>m²</span>
                        </label>
                        <input
                          id="lead-area"
                          name="area"
                          inputMode="decimal"
                          placeholder="Ex. 150"
                          maxLength={10}
                          value={data.area}
                          onChange={(e) => change('area', e.target.value)}
                          aria-invalid={Boolean(errors.area)}
                          aria-describedby={
                            errors.area ? 'error-area' : undefined
                          }
                        />
                        {errorText('area')}
                      </div>
                      <div className="lead-field">
                        <label htmlFor="lead-budget">Buget orientativ</label>
                        <div className="lead-select">
                          <select
                            id="lead-budget"
                            name="budget"
                            value={data.budget}
                            onChange={(e) => change('budget', e.target.value)}
                          >
                            <option value="">Alege un interval</option>
                            {budgets.map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                  </details>
                  <button type="submit" className="lead-primary">
                    Continuă cu datele de contact
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                  <p className="lead-step-note">
                    Următorul pas: numele tău și cum preferi să discutăm.
                  </p>
                </div>
              ) : (
                <div className="lead-step" key="contact">
                  <div className="lead-summary">
                    <div>
                      <span>Proiectul tău</span>
                      <strong>{data.projectType}</strong>
                      <p>
                        {data.locality}
                        {data.stage ? ` · ${data.stage}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={back}
                      disabled={status === 'sending'}
                    >
                      Modifică
                    </button>
                  </div>
                  <fieldset
                    className="lead-contact-fields"
                    disabled={status === 'sending'}
                  >
                    <div className="lead-field">
                      <label htmlFor="lead-name">Numele tău</label>
                      <input
                        id="lead-name"
                        name="name"
                        autoComplete="name"
                        placeholder="Nume și prenume"
                        maxLength={100}
                        value={data.name}
                        onChange={(e) => change('name', e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? 'error-name' : undefined
                        }
                        required
                      />
                      {errorText('name')}
                    </div>
                    <fieldset className="lead-fieldset">
                      <legend>Cum preferi să discutăm?</legend>
                      <div className="lead-contact-options">
                        {(['phone', 'email'] as const).map((method) => (
                          <label key={method}>
                            <input
                              type="radio"
                              name="contactMethod"
                              value={method}
                              checked={data.contactMethod === method}
                              onChange={() => change('contactMethod', method)}
                            />
                            <span>
                              {method === 'phone' ? (
                                <Phone size={16} />
                              ) : (
                                <Mail size={16} />
                              )}{' '}
                              {method === 'phone' ? 'Telefon' : 'Email'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    {data.contactMethod === 'phone' ? (
                      <div className="lead-field">
                        <label htmlFor="lead-phone">Numărul de telefon</label>
                        <input
                          id="lead-phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="07xx xxx xxx"
                          maxLength={30}
                          value={data.phone}
                          onChange={(e) => change('phone', e.target.value)}
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={
                            errors.phone ? 'error-phone' : 'lead-contact-help'
                          }
                          required
                        />
                        {errorText('phone')}
                      </div>
                    ) : (
                      <div className="lead-field">
                        <label htmlFor="lead-email">Adresa de email</label>
                        <input
                          id="lead-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="nume@exemplu.ro"
                          maxLength={254}
                          value={data.email}
                          onChange={(e) => change('email', e.target.value)}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={
                            errors.email ? 'error-email' : 'lead-contact-help'
                          }
                          required
                        />
                        {errorText('email')}
                      </div>
                    )}
                    <p id="lead-contact-help" className="lead-contact-help">
                      Este suficientă o singură modalitate de contact.
                    </p>
                  </fieldset>
                  {status === 'error' && (
                    <div className="lead-send-error" role="alert">
                      <p>{message}</p>
                      <a href="tel:+40740225554">
                        Sună la 0740 225 554 <ArrowUpRight size={15} />
                      </a>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="lead-primary"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <>
                        Se trimite cererea…
                        <LoaderCircle className="lead-spinner" size={18} />
                      </>
                    ) : (
                      <>
                        Trimite cererea
                        <ArrowUpRight size={18} />
                      </>
                    )}
                  </button>
                  <p className="lead-privacy">
                    Datele trimise în acest formular sunt destinate discuției
                    despre proiectul tău. Nu te înscrii la un newsletter.
                  </p>
                  <button
                    type="button"
                    className="lead-text-button"
                    onClick={back}
                    disabled={status === 'sending'}
                  >
                    <ArrowLeft size={16} /> Înapoi la proiect
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      <div className="section-shell company-footnote" id="compania">
        <p>
          Tomoroga Construct · Antrepriză generală din 2004.
          <br />
          <span>Construcții civile, industriale și reabilitări.</span>
        </p>
        <a
          href="https://www.facebook.com/tomorogaconstruct2004/"
          target="_blank"
          rel="noreferrer"
        >
          Pe șantier, zi de zi <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="section-shell page-bottom">
        <span>© {new Date().getFullYear()} Tomoroga Construct</span>
        <a href="#continut">Înapoi sus ↑</a>
      </div>
    </footer>
  );
}
