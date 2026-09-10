export const projectTypes = [
  'Casă / clădire civilă',
  'Spațiu industrial',
  'Renovare / reabilitare',
] as const;
export const stages = [
  'La nivel de idee',
  'Am un teren',
  'Am proiectul',
  'Am început lucrările',
] as const;
export const timings = [
  'Cât mai curând',
  'În 3–6 luni',
  'În 6–12 luni',
  'Încă planific',
] as const;
export const budgets = [
  'Sub 100.000 €',
  '100.000–250.000 €',
  '250.000–500.000 €',
  'Peste 500.000 €',
  'De stabilit',
] as const;

export type Enquiry = {
  projectType: string;
  locality: string;
  stage: string;
  timing: string;
  area: string;
  budget: string;
  details: string;
  name: string;
  contactMethod: 'phone' | 'email';
  phone: string;
  email: string;
  website: string;
};
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;
export const emptyEnquiry: Enquiry = {
  projectType: '',
  locality: '',
  stage: '',
  timing: '',
  area: '',
  budget: '',
  details: '',
  name: '',
  contactMethod: 'phone',
  phone: '',
  email: '',
  website: '',
};

export function validateEnquiry(data: Enquiry, step: 1 | 2 = 2): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!projectTypes.some((type) => type === data.projectType))
    errors.projectType = 'Alege tipul proiectului.';
  if (data.locality.trim().length < 2 || data.locality.length > 120)
    errors.locality = 'Scrie localitatea în care vrei să construiești.';
  if (
    data.area &&
    (!/^\d{1,7}([.,]\d{1,2})?$/.test(data.area) ||
      Number(data.area.replace(',', '.')) <= 0)
  )
    errors.area = 'Introdu o suprafață mai mare decât 0, în m².';
  if (data.details.length > 1500)
    errors.details = 'Păstrează descrierea în limita a 1.500 de caractere.';
  if (step === 2) {
    if (data.name.trim().length < 2 || data.name.length > 100)
      errors.name = 'Spune-ne cum te numești.';
    if (data.contactMethod === 'phone') {
      const digits = data.phone.replace(/\D/g, '');
      if (
        !/^[+\d\s().-]+$/.test(data.phone) ||
        digits.length < 7 ||
        digits.length > 15
      )
        errors.phone =
          'Introdu un număr de telefon valid, cu prefix dacă este din afara României.';
    } else if (data.contactMethod === 'email') {
      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
        data.email.length > 254
      )
        errors.email = 'Introdu o adresă de email validă.';
    } else errors.contactMethod = 'Alege cum preferi să discutăm.';
  }
  return errors;
}

export function enquiryMessage(data: Enquiry) {
  return [
    'Bună ziua,',
    '',
    'Aș dori să discutăm despre următorul proiect:',
    '',
    `Tip: ${data.projectType}`,
    `Localitate: ${data.locality.trim()}`,
    `Etapă: ${data.stage || 'De stabilit'}`,
    `Începere: ${data.timing || 'De stabilit'}`,
    ...(data.area ? [`Suprafață estimată: ${data.area} m²`] : []),
    ...(data.budget ? [`Buget orientativ: ${data.budget}`] : []),
    ...(data.details.trim()
      ? ['', 'Despre proiect:', data.details.trim()]
      : []),
    '',
    `Nume: ${data.name.trim()}`,
    data.contactMethod === 'phone'
      ? `Telefon: ${data.phone.trim()}`
      : `Email: ${data.email.trim()}`,
    `Prefer să discutăm prin ${data.contactMethod === 'phone' ? 'telefon' : 'email'}.`,
  ].join('\n');
}
