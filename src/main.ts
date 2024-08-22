import { getEnvironment, setEnvironment } from './helpers/testing.js'

export const loadingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#FF156D" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop><stop offset=".3" stop-color="#FF156D" stop-opacity=".9" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop><stop offset=".6" stop-color="#FF156D" stop-opacity=".6" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop><stop offset=".8" stop-color="#FF156D" stop-opacity=".3" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop><stop offset="1" stop-color="#FF156D" stop-opacity="0" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#FF156D" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke: #ff6dff;"></circle></svg>`

export function renderLoading(app: Element): void {
  app.innerHTML = loadingSvg
}

export function debugMode(): boolean {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.has('debug')
}

export function getUrl(url_type: string): string {
  let urlParams = new URLSearchParams(window.location.search)
  let url = null

  if (getEnvironment() === 'test') {
    urlParams = new URLSearchParams({
      'internal': 'http://fake-internal.url',
      'external': 'http://fake-external.url',
    })
  }

  if (url_type === 'internal') {
    url = urlParams.get('intern') || urlParams.get('internal')
  }
  if (url_type === 'external') {
    url = urlParams.get('extern') || urlParams.get('external')
  }

  if (url === null) {
    throw new Error(`${url_type} URL not provided`)
  }

  return url
}

type CookieValue = 'internal' | 'external' | undefined

export function setCookie(value: CookieValue): void {
  document.cookie = `access-type=${value}; max-age=3600`
}

export function getCookie(): CookieValue {
  let cookieValue: CookieValue

  document.cookie.split(';').forEach((cookie) => {
    const [name, value] = cookie.split('=')
    if (name.trim() === 'access-type') {
      cookieValue = value.trim() as CookieValue
    }
  })

  return cookieValue
}

interface UrlTypeResponse {
  url: string
  message: string | null
}

export function checkUrlType(type: string = 'external'): UrlTypeResponse {
  let url: string

  try {
    url = getUrl(type)
  } catch (error) {
    return {
      url: null,
      message: error.message
    }
  }

  return {
    url,
    message: null
  }
}

interface InternalAccessResponse {
  accessable: boolean
  message: string | null
}

export async function checkInternalAccess(): Promise<InternalAccessResponse> {
  const internalURL = getUrl('internal')
  const accessType = getCookie()

  if (accessType === 'internal') {
    return {
      accessable: true,
      message: null
    }
  }

  try {
    const respondTimeout: number = (5 * 1000)
    const response = await fetch(internalURL, {
      'mode':'no-cors',
      signal: AbortSignal.timeout(respondTimeout)
    })
    if (response.status !== 200) {
      const message = 'Internal access failed, probably due to CORS policy'
      console.info(message)
      return {
        accessable: true,
        message: message
      }
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      const message = 'Internal access timed out'
      console.info(message)
      return {
        accessable: false,
        message: message
      }
    }

    if (error instanceof TypeError && error.name === 'TypeError') {
      const message = 'Internal access failed: TypeError'
      console.info(message)
      return {
        accessable: false,
        message: message
      }
    }

    console.error('Internal access failed', error.message)
    return {
      accessable: false,
      message: error.message
    }
  }

  return {
    accessable: true,
    message: null
  }
}

export function renderInformation(
  app: Element,
  accessType: CookieValue = getCookie(),
  redirectingUrl: string = getUrl('external'),
  message: string | null = null
): void {
  const existingContent: Element = document.querySelector('section#content')
  let newContent: Element = document.createElement('section')

  if (!existingContent) {
    newContent = document.createElement('section')
    newContent.id = 'content'
  }

  if (message) {
    (existingContent || newContent).innerHTML = `
      <p>${message}</p>
    `
  }

  if (!message) {
    (existingContent || newContent).innerHTML = `
      <p>Access type: ${accessType}</p>
      <p>URL: ${redirectingUrl}</p>
    `
  }

  if (newContent) {
    app.appendChild(newContent)
  }
}

export function redirectTo(url: string): void {
  const debug = debugMode()
  if (debug) {
    console.log('Debug mode enabled')
    console.log(`Redirecting to ${url}`)
    return
  }

  window.location.href = url
}

export async function initializeApp(): Promise<void> {
  const app = document.querySelector('#app')

  setEnvironment('production')
  renderLoading(app)

  const internalUrl = checkUrlType('internal')
  if (internalUrl.message) {
    renderInformation(app, 'internal', internalUrl.url, internalUrl.message)
    return
  }
  const externalUrl = checkUrlType('external')
  if (externalUrl.message) {
    renderInformation(app, 'external', externalUrl.url, externalUrl.message)
    return
  }

  const typeFromCookie = getCookie()
  if (typeFromCookie === 'internal') {
    renderInformation(app, typeFromCookie, internalUrl.url)
    redirectTo(internalUrl.url)
    return
  }
  if (typeFromCookie === 'external') {
    renderInformation(app, typeFromCookie, externalUrl.url)
    redirectTo(externalUrl.url)
    return
  }

  renderInformation(app, 'internal', internalUrl.url, 'Checking internal access...')
  const accessResponse = await checkInternalAccess()
  if (accessResponse.accessable) {
    setCookie('internal')
    renderInformation(app, 'internal', internalUrl.url)
    redirectTo(internalUrl.url)
    return
  }

  setCookie('external')
  renderInformation(app, 'external', externalUrl.url)
  redirectTo(externalUrl.url)
}


initializeApp()
