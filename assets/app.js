const menu = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Stäng meny' : 'Öppna meny');
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  links?.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Öppna meny');
}));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !links?.classList.contains('open')) return;
  links.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Öppna meny');
  menu?.focus();
});

const inquiryForm = document.querySelector('[data-inquiry-form]');
if (inquiryForm) {
  const schedule = inquiryForm.querySelector('[data-schedule]');
  const date = inquiryForm.querySelector('[name="preferred_date"]');
  const timeWindow = inquiryForm.querySelector('[name="time_window"]');
  const customerType = inquiryForm.querySelector('[name="customer_type"]');
  const companyField = inquiryForm.querySelector('[data-company-field]');
  const company = inquiryForm.querySelector('[name="company"]');
  const submitLabel = inquiryForm.querySelector('[data-submit-label]');
  const attachments = inquiryForm.querySelector('[name="attachments[]"]');
  const isDemo = inquiryForm.hasAttribute('data-demo-form');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pad = value => String(value).padStart(2, '0');
  date.min = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

  function updateInquiry() {
    const wantsTime = inquiryForm.querySelector('[name="request_type"]:checked')?.value === 'time';
    schedule.hidden = !wantsTime;
    date.disabled = !wantsTime;
    date.required = wantsTime;
    timeWindow.disabled = !wantsTime;
    timeWindow.required = wantsTime;
    submitLabel.textContent = isDemo
      ? (wantsTime ? 'Testa tidsförfrågan' : 'Testa offertförfrågan')
      : (wantsTime ? 'Skicka tidsförfrågan' : 'Skicka offertförfrågan');
    const isOrganization = customerType.value !== 'private';
    companyField.hidden = !isOrganization;
    company.disabled = !isOrganization;
  }
  inquiryForm.querySelectorAll('[name="request_type"]').forEach(radio => radio.addEventListener('change', updateInquiry));
  customerType.addEventListener('change', updateInquiry);
  updateInquiry();

  function validateFiles() {
    const files = [...(attachments.files || [])];
    let message = '';
    if (files.length > 5) message = 'Välj högst 5 filer.';
    else if (files.some(file => file.size > 8 * 1024 * 1024)) message = 'Varje fil får vara högst 8 MB.';
    attachments.setCustomValidity(message);
    return !message;
  }
  attachments.addEventListener('change', () => { validateFiles(); attachments.reportValidity(); });
  inquiryForm.addEventListener('submit', event => {
    if (!validateFiles()) { event.preventDefault(); attachments.reportValidity(); return; }
    if (!isDemo) return;
    event.preventDefault();
    const result = inquiryForm.querySelector('[data-demo-result]');
    result.hidden = false;
    result.textContent = 'Formuläret är ifyllt i designläget. Inga uppgifter har skickats eller sparats.';
    result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}
