self.onmessage = ({ data: { question } }) => {
  self.postMessage({
    answer: 42,
  })
}

const buildWorker = () =>
  new Worker(new URL('./WorkerSample.ts', import.meta.url), { type: 'module' })

export { buildWorker }
