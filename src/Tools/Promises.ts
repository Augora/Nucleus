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
            .then(retryOperation.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject)
        }
        return reject(reason)
      })
  })
}
