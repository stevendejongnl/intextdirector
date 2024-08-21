import { JSDOM } from 'jsdom'
import { setEnvironment, setFakeData } from './testing.js'

const fixtureHtml = `<!DOCTYPE html>
  <body>
    <div id="app"></div>
  </body>
</html>`

const setDOM = () => {
  const dom = new JSDOM(fixtureHtml, { url: 'http://localhost' })
  global.window = dom.window as unknown as Window & typeof globalThis
  global.document = window.document
  global.HTMLElement = window.HTMLElement

  // @ts-expect-error mock MutationObserver
  global.MutationObserver = class {
    constructor(callback: any) {
      // @ts-expect-error _callback doesn't exist on MutationObserver
      this._callback = callback
    }
    disconnect() {}
    observe(element: any, initObject: any) {
      // @ts-expect-error _element don't exist on MutationObserver
      this._element = element
      // @ts-expect-error _initObject don't exist on MutationObserver
      this._initObject = initObject
    }
  }

  global.JSCompiler_renameProperty = (prop: string) => prop

  global.ResizeObserver = class {
    constructor(callback: any) {
      // @ts-expect-error _callback doesn't exist on ResizeObserver
      this._callback = callback
    }
    disconnect() {}
    observe(element: any) {
      // @ts-expect-error _element doesn't exist on ResizeObserver
      this._element = element
    }
    unobserve(element: any) {
      // @ts-expect-error _element doesn't exist on ResizeObserver
      this._element = element
    }
  }

  // @ts-expect-error mock CSS
  global.CSS = {
    supports: () => true
  }

  Object.keys(window).forEach((key: string) => {
    if (!(key in global)) {
      global[key] = window[key]
    }
  })
}

export const fixture = (html: string = fixtureHtml) => {
  document.body.innerHTML = html
}

export const clearCookies = () => {
  document.cookie.split(';').forEach((cookie) => {
    const [name] = cookie.split('=')
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  })
}

// Important, set the DOM before anything else
setDOM()

export const mochaHooks: Mocha.RootHookObject = {
  beforeAll(done: Mocha.Done) {
    setEnvironment('test')
    setFakeData({}, true)
    clearCookies()

    done()
  },
  beforeEach(done: Mocha.Done) {
    fixture()
    setEnvironment('test')
    setFakeData({}, true)
    clearCookies()

    done()
  },
  afterEach(done: Mocha.Done) {
    done()
  },
  afterAll(done: Mocha.Done) {
    done()
  }
}