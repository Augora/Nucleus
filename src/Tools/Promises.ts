import { Page } from 'puppeteer'
type PromiseFunction<T> = () => Promise<T>

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function retryOperation<T>(
  operation: PromiseFunction<T>,
  delay: number,
  retries: number
) {
  return new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason) => {
        if (retries > 0) {
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay * 2, retries - 1))
            .then(resolve)
            .catch(reject)
        }
        return reject(reason)
      })
  })
}

export async function retryGoto(page: Page, url: string, selector: string): Promise<Page> {
  const delay = 1500
  const retries = 10
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await page.goto(url)
      await page.waitForSelector(selector)
      return
    } catch (error) {
      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`)
        await new Promise(res => setTimeout(res, delay))
      } else {
        console.log(`Failed to navigate to ${url} after ${retries} attempts.`)
        throw error
      }
    }
  }
}