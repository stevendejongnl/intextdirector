type RedirectOptions = {
  internalURL: string;
  externalURL: string;
  debug: boolean;
  timeout: number;
};

function showError(message: string): void {
  const errorMessage = document.createElement('div');
  errorMessage.textContent = message;
  document.body.appendChild(errorMessage);
}

function checkInternalRedirect(options: RedirectOptions): void {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout);

  fetch(options.internalURL, {
    method: 'HEAD',
    signal: controller.signal
  })
    .then(response => {
      clearTimeout(timeoutId);
      if (response.ok) {
        if (options.debug) {
          console.log(`Response for internal is okay, redirect should go to ${options.internalURL}`)
          return
        }

        window.location.href = options.internalURL;
      } else {
        if (options.debug) {
          console.log(`Response for internal is not okay, redirect should go to ${options.externalURL}`)
          return
        }

        window.location.href = options.externalURL;
      }
    })
    .catch(() => {
      clearTimeout(timeoutId);

      if (options.debug) {
        console.log(`Error catched, redirect should go to ${options.externalURL}`)
        return
      }

      window.location.href = options.externalURL;
    });
}

function initRedirect(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const internalURL = urlParams.get('intern');
  const externalURL = urlParams.get('extern');
  const debug = (urlParams.get('debug') === 'true' || false);
  const timeout = parseInt(process.env.timeout || '15000', 10);

  if (!internalURL || !externalURL) {
      showError('Internal and external URLs are required.');
      return;
  }

  checkInternalRedirect({ internalURL, externalURL, debug, timeout });
}

window.onload = initRedirect;
