const INTERNAL_CHECK_URL = 'https://localhost:8080/api/health'

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

async function checkInternalAccess(timeout: number): Promise<boolean> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(INTERNAL_CHECK_URL, { method: 'GET', signal: controller.signal })
    clearTimeout(timeoutId)
    const data = await response.json()
    return data.status === 'ok'
  } catch (error) {
    clearTimeout(timeoutId)
    return false
  }
}

async function startTimeoutCounter(options: RedirectOptions): Promise<void> {
  const timeoutElement = document.querySelector('.timeout')

  try {
    const isInternalAccessible = await checkInternalAccess(options.timeout)

    if (isInternalAccessible) {
      timeoutElement.remove()
      window.location.href = options.internalURL
    } else {
      throw new Error('Internal access check failed')
    }
  } catch (error) {
    console.error(`Error caught: ${error.message}`)
    timeoutElement.remove()
    window.location.href = options.externalURL
  }
}

function redirectingInfo(internalURL: string, externalURL: string): void {
  const heading = document.querySelector('h1')
  heading.innerHTML = `Redirecting to <a href="${internalURL}">${internalURL}</a> in case of success, otherwise to <a href="${externalURL}">${externalURL}</a>`
}

function initRedirect(): void {
  const urlParams = new URLSearchParams(window.location.search)
  const internalURL = urlParams.get('intern')
  const externalURL = urlParams.get('extern')
  const debug = urlParams.get('debug') === 'true' || false
  const timeout = parseInt(urlParams.get('timeout') || '5000', 10)

  redirectingInfo(internalURL, externalURL)

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
