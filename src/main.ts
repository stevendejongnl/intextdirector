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

function updateTimeoutCounter(milliseconds: number): void {
  const timeoutElement = document.querySelector('.timeout')
  const seconds = Math.ceil(milliseconds / 1000)
  timeoutElement.textContent = `Checking internal access: ${seconds} seconds`
}

async function checkInternalAccess(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    return false
  }
}

async function startTimeoutCounter(options: RedirectOptions): Promise<void> {
  const timeoutElement = document.querySelector('.timeout')
  const startTime = Date.now()

  try {
    const isInternalAccessible = await checkInternalAccess(options.internalURL)
    const elapsedTime = Date.now() - startTime
    const remainingTime = options.timeout - elapsedTime

    if (isInternalAccessible) {
      if (options.debug) {
        console.log(`Internal access is okay, redirecting to ${options.internalURL}`)
        timeoutElement.remove()
      }

      if (remainingTime > 0) {
        setTimeout(() => {
          window.location.href = options.internalURL
        }, remainingTime)
      } else {
        window.location.href = options.internalURL
      }
    } else {
      if (options.debug) {
        console.log(`Internal access is not okay, redirecting to ${options.externalURL}`)
        timeoutElement.remove()
      }

      if (remainingTime > 0) {
        setTimeout(() => {
          window.location.href = options.externalURL
        }, remainingTime)
      } else {
        window.location.href = options.externalURL
      }
    }
  } catch (error) {
    console.error(`Error caught: ${error.message}`)
    timeoutElement.remove()
    window.location.href = options.externalURL
  }
}

function initRedirect(): void {
  const urlParams = new URLSearchParams(window.location.search)
  const internalURL = urlParams.get('intern')
  const externalURL = urlParams.get('extern')
  const debug = urlParams.get('debug') === 'true' || false
  const timeout = parseInt(urlParams.get('timeout') || '15000', 10)

  if (debug) {
    showDebugMode()
  }

  if (!internalURL || !externalURL) {
    showError('Internal and external URLs are required.')
    return;
  }

  updateTimeoutCounter(timeout)
  startTimeoutCounter({ internalURL, externalURL, debug, timeout })
}

window.onload = initRedirect
