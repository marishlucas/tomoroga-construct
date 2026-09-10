import {
  emptyEnquiry,
  validateEnquiry,
  enquiryMessage,
  stages,
  timings,
  budgets,
  type Enquiry,
} from './enquiry';

type Delivery = { apiKey?: string; from?: string; fetcher?: typeof fetch };
const headers = { 'Cache-Control': 'no-store' };
const reply = (body: unknown, status: number) =>
  Response.json(body, { status, headers });

export async function handleEnquiry(request: Request, delivery: Delivery) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    return reply(
      {
        error: 'Cererea nu este validă. Reîncarcă pagina și încearcă din nou.',
      },
      403,
    );
  if (!request.headers.get('content-type')?.includes('application/json'))
    return reply({ error: 'Format invalid.' }, 415);
  if (Number(request.headers.get('content-length') || 0) > 12000)
    return reply({ error: 'Mesajul este prea lung.' }, 413);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 12000)
      return reply({ error: 'Mesajul este prea lung.' }, 413);
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value))
      return reply({ error: 'Cerere invalidă.' }, 400);
    body = value as Record<string, unknown>;
  } catch {
    return reply({ error: 'Cerere invalidă.' }, 400);
  }
  const data = { ...emptyEnquiry };
  for (const key of Object.keys(data) as Array<keyof Enquiry>) {
    if (body[key] !== undefined && typeof body[key] !== 'string')
      return reply({ error: 'Verifică datele din formular.' }, 422);
    if (typeof body[key] === 'string')
      Object.assign(data, { [key]: body[key] });
  }
  if (data.website)
    return reply(
      {
        error:
          'Cererea nu a putut fi trimisă. Te rugăm să ne contactezi telefonic.',
      },
      422,
    );
  const errors = validateEnquiry(data);
  if (data.stage && !stages.some((item) => item === data.stage))
    errors.stage = 'Alege o etapă din listă.';
  if (data.timing && !timings.some((item) => item === data.timing))
    errors.timing = 'Alege o perioadă din listă.';
  if (data.budget && !budgets.some((item) => item === data.budget))
    errors.budget = 'Alege un interval din listă.';
  if (Object.keys(errors).length)
    return reply(
      { error: 'Verifică datele evidențiate în formular.', errors },
      422,
    );
  const requestId = body.requestId;
  if (
    typeof requestId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  )
    return reply(
      { error: 'Reîncarcă pagina înainte să trimiți cererea.' },
      400,
    );
  if (!delivery.apiKey || !delivery.from)
    return reply(
      {
        error:
          'Trimiterea formularului este momentan indisponibilă. Poți suna la 0740 225 554. Detaliile tale rămân în formular.',
      },
      503,
    );
  try {
    const response = await (delivery.fetcher ?? fetch)(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${delivery.apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': `enquiry/${requestId}`,
        },
        body: JSON.stringify({
          from: delivery.from,
          to: ['office@tomorogaconstruct.ro'],
          subject: `Solicitare proiect — ${data.projectType}`,
          text: enquiryMessage(data),
          ...(data.contactMethod === 'email'
            ? { reply_to: data.email.trim() }
            : {}),
        }),
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok)
      return reply(
        {
          error:
            'Nu am putut confirma trimiterea. Încearcă din nou sau sună-ne; datele tale rămân în formular.',
        },
        502,
      );
    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== 'object' ||
      !('id' in result) ||
      typeof result.id !== 'string'
    )
      return reply(
        { error: 'Nu am putut confirma trimiterea. Încearcă din nou.' },
        502,
      );
    return reply({ ok: true }, 200);
  } catch {
    return reply(
      {
        error:
          'Conexiunea s-a întrerupt. Încearcă din nou; datele tale rămân în formular.',
      },
      502,
    );
  }
}
