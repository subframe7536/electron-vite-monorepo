import { Outlet } from '@solidjs/router'
import { Modals } from '@generouted/solid-router/lazy'

import { A, useModals, useNavigate } from '@/router'

export function Catch(props: { error: Error; reset: () => void }) {
  return (
    <div>
      Something went wrong:
      {' '}
      {props.error.message}
      Caught at _app error boundary
      <button onClick={props.reset}>reset</button>
    </div>
  )
}

export const Pending = () => <div>Loading from _app...</div>

export default function App() {
  const navigate = useNavigate()
  const modals = useModals()

  const a = () => navigate('/about')
  const b = () => navigate('/posts/:id/:pid?', { params: { id: 'xyz' } })

  return (
    <section class='m-6'>
      <header class='flex gap-6'>
        <A href="/">Home</A>
        <A href="/about">About</A>
        <A href="/posts/:id" params={{ id: 'xyz' }}>
          Post by Id
        </A>
        <button onClick={() => modals.open('/modal', { at: '/posts' })}>Open global modal</button>
      </header>

      <main>
        <Outlet />
      </main>

      <Modals />
    </section>
  )
}
