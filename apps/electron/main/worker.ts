import { parentPort } from 'node:worker_threads'

if (!parentPort) {
  throw new Error('Must be run in a worker thread')
}

parentPort.on('message', () => {
  console.log('worker test')
})
