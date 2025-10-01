(function () {
  const form = document.getElementById('feedbackForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const charCount = document.getElementById('charCount');
  const list = document.getElementById('submissionList');
  const themeToggle = document.getElementById('themeToggle');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Theme toggle
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') document.documentElement.classList.add('dark');

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Validation
  const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

  function validate() {
    let valid = true;

    if (!nameInput.value.trim()) {
      nameError.textContent = 'Name is required.';
      valid = false;
    } else { nameError.textContent = ''; }

    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email is required.';
      valid = false;
    } else if (!emailPattern.test(emailInput.value)) {
      emailError.textContent = 'Enter a valid email.';
      valid = false;
    } else { emailError.textContent = ''; }

    if (!messageInput.value.trim()) {
      messageError.textContent = 'Message is required.';
      valid = false;
    } else { messageError.textContent = ''; }

    submitBtn.disabled = !valid;
    return valid;
  }

  form.addEventListener('input', () => {
    charCount.textContent = `(${messageInput.value.length}/200)`;
    validate();
  });

  function load() {
    try { return JSON.parse(localStorage.getItem('submissions')) || []; }
    catch { return []; }
  }

  function save(items) {
    localStorage.setItem('submissions', JSON.stringify(items));
  }

  function render() {
    const items = load();
    list.innerHTML = '';
    if (items.length === 0) {
      list.innerHTML = '<li class="muted">No submissions yet.</li>';
      return;
    }
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.name}</strong> &lt;${item.email}&gt;<br>
        <span class="muted">${new Date(item.time).toLocaleString()}</span><br>
        ${item.message}`;
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    const items = load();
    items.unshift({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      time: Date.now()
    });
    save(items);
    form.reset();
    submitBtn.disabled = true;
    charCount.textContent = '(0/200)';
    render();
  });

  // Initial
  charCount.textContent = '(0/200)';
  render();
})();
