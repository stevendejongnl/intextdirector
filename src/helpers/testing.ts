let environment: 'test' | 'production' = 'test'
let fake_data: string = JSON.stringify({})

export const setEnvironment = (env: 'test' | 'production' = 'production') => {
  if (environment === 'production' && env === 'test') {
    console.info('Test Environment')
  }
  environment = env
}

export const getEnvironment = () => {
  return environment
}

export const setFakeData = (data: any = {}, clear: boolean = false) => {
  if (clear) {
    fake_data = JSON.stringify(data)
    return
  }
  const existing_fake_data = JSON.parse(fake_data)
  fake_data = JSON.stringify({ ...existing_fake_data, ...data })
}

export const getFakeData = (key?: string) => {
  const parsed_data = JSON.parse(fake_data)

  if (key) {
    return parsed_data[key]
  }
  return parsed_data
}
