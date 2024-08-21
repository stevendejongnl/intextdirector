import { assert } from 'chai'
import { getCookie, getUrl, loadingSvg, renderLoading, setCookie } from './main.js'


describe('main', () => {
  it('should render a loading svg', () => {
    const app = document.querySelector('#app')
    renderLoading(app)

    assert.equal(app?.innerHTML, loadingSvg)
  })

  it('should get internal url from arguments', () => {
    const internal_url = getUrl('internal')
    assert.equal(internal_url, 'http://fake-internal.url')
  })

  it('should get external url from arguments', () => {
    window.location.assign('http://fake-url.com?external=http://fake-external.url')
    window.location.search = '?external=http://fake-external.url'

    const internal_url = getUrl('external')
    assert.equal(internal_url, 'http://fake-external.url')
  })

  it('should be possible to set a internal cookie', () => {
    setCookie('internal')

    assert.equal(getCookie(), 'internal')
  })

  it('should be possible to set a external cookie', () => {
    setCookie('external')

    assert.equal(getCookie(), 'external')
  })

  it('should be possible to get a value when not setting a cookie', () => {
    assert.equal(getCookie(), 'external')
  })

  it.skip('should throw an error and show why when required internal argument is not provided', () => {
    const error = () => getUrl('internal')

    assert.throws(error, 'internal URL not provided')
  })

  it.skip('should throw an error and show why when required external argument is not provided', () => {
    const error = () => getUrl('external')

    assert.throws(error, 'external URL not provided')
  })
})
