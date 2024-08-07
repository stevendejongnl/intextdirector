import { assert } from 'chai'
import { getUrl, loadingSvg, renderLoading } from './main.js'


describe('main', () => {
  it('should render a loading svg', () => {
    renderLoading()

    const app = document.querySelector('#app')
    assert.equal(app?.innerHTML, loadingSvg)
  })


  it('should get internal url from arguments', () => {
    const internal_url = getUrl('internal')
    assert.equal(internal_url, 'http://fake-internal.url')
  })

  it('should get external url from arguments', () => {
    const internal_url = getUrl('external')
    assert.equal(internal_url, 'http://fake-external.url')
  })
})