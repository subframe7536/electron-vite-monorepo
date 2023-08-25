import { Worker } from 'node:worker_threads'
import { join } from 'node:path'
import Database from 'better-sqlite3'

const db = new Database(':memory:')

db.exec(
  'DROP TABLE IF EXISTS employees; '
    + 'CREATE TABLE IF NOT EXISTS employees (name TEXT, salary INTEGER)',
)

db.prepare('INSERT INTO employees VALUES (:n, :s)').run({
  n: 'James',
  s: 50000,
})

const r = db.prepare('SELECT * from employees').all()
console.log(r)
// [ { name: 'James', salary: 50000 } ]

db.close()

const worker = new Worker(join(__dirname, './worker.js'))
worker.postMessage({})
