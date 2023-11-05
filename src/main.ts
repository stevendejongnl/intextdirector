type RedirectOptions = {
  internalURL: string;
  externalURL: string;
};

function showError(message: string): void {
  const errorMessage = document.createElement('div');
  errorMessage.textContent = message;
  document.body.appendChild(errorMessage);
}

function checkInternalRedirect(options: RedirectOptions): void {
  const timeout = 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  fetch(options.internalURL, {
      method: 'HEAD',
      signal: controller.signal
  })
      .then(response => {
          clearTimeout(timeoutId);
          if (response.ok) {
              window.location.href = options.internalURL;
          } else {
              window.location.href = options.externalURL;
          }
      })
      .catch(() => {
          clearTimeout(timeoutId);
          window.location.href = options.externalURL;
      });
}

function initRedirect(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const internalURL = urlParams.get('intern');
  const externalURL = urlParams.get('extern');

  if (!internalURL || !externalURL) {
      showError('Internal and external URLs are required.');
      return;
  }

  checkInternalRedirect({ internalURL, externalURL });
}

window.onload = initRedirect;
