type RedirectOptions = {
  internalURL: string;
  externalURL: string;
  debug: boolean;
  timeout?: number;
};

function showDebugMode(): void {
  const debugElement = document.querySelector('.debug')

  debugElement.textContent = 'Debug mode active'
}

function showError(message: string): void {
  const errorElement = document.querySelector('.error')

  errorElement.textContent = message
}

function updateTimeoutCounter(milliseconds) {
  const timeoutElement = document.querySelector('.timeout')
  const seconds = Math.ceil(milliseconds / 1000)
  timeoutElement.textContent = `Checking internal access: ${seconds} seconds`
}

function startTimeoutCounter(options: RedirectOptions) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout)

  const timeoutElement = document.querySelector('.timeout')
  const startTime = Date.now()
  const interval = setInterval(() => {
    const elapsedTime = Date.now() - startTime
    const remainingTime = options.timeout - elapsedTime
    if (remainingTime <= 0) {
      clearInterval(interval)
      timeoutElement.remove()
    } else {
      updateTimeoutCounter(remainingTime)
    }
  }, 1000)

  fetch(options.internalURL, {
    method: 'HEAD',
    signal: controller.signal
  })
    .then(response => {
      clearTimeout(timeoutId)
      clearInterval(interval)

      if (response.ok) {
        if (options.debug) {
          console.log(`Response for internal is okay, redirect should go to ${options.internalURL}`)

          timeoutElement.remove()
          return
        }

        window.location.href = options.internalURL
      } else {
        if (options.debug) {
          console.log(`Response for internal is not okay, redirect should go to ${options.externalURL}`)

          timeoutElement.remove()
          return
        }

        window.location.href = options.externalURL
      }
    })
    .catch(() => {
      clearTimeout(timeoutId)
      clearInterval(interval)

      if (options.debug) {
        console.log(`Error caught, redirect should go to ${options.externalURL}`)

        timeoutElement.remove()
        return
      }

      window.location.href = options.externalURL
    })
}

function initRedirect() {
  const urlParams = new URLSearchParams(window.location.search)
  const internalURL = urlParams.get('intern')
  const externalURL = urlParams.get('extern')
  const debug = urlParams.get('debug') === 'true' || false
  const timeout = parseInt(urlParams.get('timeout') || '15000')

  if (debug) {
    showDebugMode()
  }

  if (!internalURL || !externalURL) {
    showError('Internal and external URLs are required.')
    return
  }

  updateTimeoutCounter(timeout)
  startTimeoutCounter({ internalURL, externalURL, debug, timeout })
}

window.onload = initRedirect
