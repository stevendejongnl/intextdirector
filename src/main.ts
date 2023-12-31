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

async function checkInternalAccess(url: string, timeout: number): Promise<boolean> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal })
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    clearTimeout(timeoutId)
    return false
  }
}

async function startTimeoutCounter(options: RedirectOptions): Promise<void> {
  const timeoutElement = document.querySelector('.timeout')

  try {
    const isInternalAccessible = await checkInternalAccess(options.internalURL, options.timeout)

    if (isInternalAccessible) {
      timeoutElement.remove()
      window.location.href = options.internalURL
    } else {
      throw new Error('Internal access check failed')
    }
  } catch (error) {
    console.error(`Error caught: ${error.message}`)
    timeoutElement.remove()
    window.location.href = options.internalURL
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
    return
  }

  updateTimeoutCounter(timeout)
  startTimeoutCounter({ internalURL, externalURL, debug, timeout })
}

window.onload = initRedirect
