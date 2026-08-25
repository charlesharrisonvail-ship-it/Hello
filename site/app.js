// Mark the current nav item so tests (and screen readers) can identify the page.
for (const link of document.querySelectorAll('nav a')) {
  if (new URL(link.href).pathname === location.pathname) {
    link.setAttribute('aria-current', 'page');
  }
}

const form = document.querySelector('#greet-form');
if (form) {
  const nameInput = form.querySelector('#name');
  const error = document.querySelector('#name-error');
  const greeting = document.querySelector('#greeting');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();

    if (name.length < 2) {
      error.textContent = 'Please enter at least 2 characters.';
      nameInput.setAttribute('aria-invalid', 'true');
      greeting.hidden = true;
      return;
    }

    error.textContent = '';
    nameInput.removeAttribute('aria-invalid');
    greeting.textContent = `Hello, ${name}!`;
    greeting.hidden = false;
  });
}

const counter = document.querySelector('#counter');
if (counter) {
  const output = counter.querySelector('output');
  counter.addEventListener('click', (event) => {
    const step = event.target.dataset.step;
    if (!step) return;
    output.value = String(Number(output.value) + Number(step));
  });
}
