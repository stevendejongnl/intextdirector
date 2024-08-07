import { getEnvironment } from './helpers/testing.js'

export const loadingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#FF156D" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop><stop offset=".3" stop-color="#FF156D" stop-opacity=".9" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop><stop offset=".6" stop-color="#FF156D" stop-opacity=".6" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop><stop offset=".8" stop-color="#FF156D" stop-opacity=".3" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop><stop offset="1" stop-color="#FF156D" stop-opacity="0" data-darkreader-inline-stopcolor="" style="--darkreader-inline-stopcolor: #6d006d;"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#FF156D" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke: #ff6dff;"></circle></svg>`

export function renderLoading(): void {
  const app = document.querySelector('#app')
  app.innerHTML = loadingSvg
}

export function getUrl(url_type: string): string {
  const urlParams = new URLSearchParams(window.location.search)
  let url = null

  if (getEnvironment() === 'test' && url_type === 'internal') {
    url = 'http://fake-internal.url'
  }
  if (getEnvironment() === 'test' && url_type === 'external') {
    url = 'http://fake-external.url'
  }

  if (getEnvironment() !== 'test' && url_type === 'internal') {
    url = urlParams.get('intern') || urlParams.get('internal')
  }
  if (getEnvironment() !== 'test' && url_type === 'external') {
    url = urlParams.get('extern') || urlParams.get('external')
  }

  if (url === null) {
    throw new Error(`${url_type} URL not provided`)
  }

  return url
}

export function initializeApp(): void {
  renderLoading()
}

initializeApp()