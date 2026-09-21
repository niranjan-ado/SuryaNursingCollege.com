/* Admission enquiry.
   The old form posted to /submit-inquiry, an address that never existed, so
   every enquiry was lost. This version has no server to fail: it writes the
   enquiry as a WhatsApp message to the admissions number and opens WhatsApp
   with the text ready to send. A phone call is offered alongside it.

   Any link or button with [data-inquiry] opens the dialog. Those links point
   at /contact#enquire, so without JavaScript they still lead somewhere useful.
   data-program="anm|gnm|bsc" preselects a course. */
const WHATSAPP_NUMBER = '919264197981';
const PROGRAMS = {
  anm: 'ANM (Auxiliary Nurse & Midwife)',
  gnm: 'GNM (General Nursing Midwifery)',
  bsc: 'B.Sc Nursing (Basic)',
  unsure: 'Not sure yet',
};

export function initInquiry() {
  const dialog = document.getElementById('inquiry');
  const forms = document.querySelectorAll('form[data-inquiry-form]');
  if (!dialog && !forms.length) return;

  if (dialog) {
    let opener = null;

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-inquiry]');
      if (!trigger) return;
      event.preventDefault();
      opener = trigger;
      const form = dialog.querySelector('form');
      reset(form);
      const program = trigger.dataset.program;
      if (program && form.elements.program) form.elements.program.value = program;
      dialog.showModal();
      form.querySelector('input')?.focus();
    });

    // Close on backdrop click (a click that lands on the <dialog> itself).
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => opener?.focus());
    for (const btn of dialog.querySelectorAll('[data-close]')) {
      btn.addEventListener('click', () => dialog.close());
    }
  }

  for (const form of forms) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const f = form.elements;
      const error = form.querySelector('.form-error');
      const name = f.student.value.trim();
      const phone = f.phone.value.replace(/[\s-]/g, '');
      const program = f.program.value;

      let problem = '';
      if (!name) problem = 'Enter the student’s name.';
      else if (!/^(\+?91)?[6-9]\d{9}$/.test(phone)) problem = 'Enter a 10-digit mobile number.';
      else if (!program) problem = 'Choose a course, or “Not sure yet”.';

      if (problem) {
        error.textContent = problem;
        error.hidden = false;
        (!name ? f.student : problem.includes('mobile') ? f.phone : f.program).focus();
        return;
      }
      error.hidden = true;

      const lines = [
        'Hello, I would like to know about admission at Surya Nursing Educational College.',
        `Name: ${name}`,
        `Mobile: ${phone}`,
        `Course: ${PROGRAMS[program] || program}`,
      ];
      const note = f.message?.value.trim();
      if (note) lines.push(`Question: ${note}`);

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(url, '_blank', 'noopener');

      (window.dataLayer = window.dataLayer || []).push({ event: 'inquiry_whatsapp', program });

      form.querySelector('[data-step="form"]').hidden = true;
      const done = form.querySelector('[data-step="done"]');
      done.hidden = false;
      done.querySelector('a[data-retry]').href = url;
      done.querySelector('[tabindex="-1"]')?.focus();
    });
  }
}

function reset(form) {
  if (!form) return;
  form.querySelector('[data-step="form"]').hidden = false;
  form.querySelector('[data-step="done"]').hidden = true;
  form.querySelector('.form-error').hidden = true;
}
