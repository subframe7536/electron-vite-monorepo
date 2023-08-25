import { Card } from '@test-mono/ui'

export function Catch(props: { error: Error; reset: () => void }) {
  return (<div>
    Couldn't load
    {' '}
    <button onClick={props.reset}>reset</button>
    <pre>{props.error.toString()}</pre>
  </div>)
}

export const Pending = () => <div>Loading...</div>

export default function Home() {
  return (
    <div>
      <Card />
      <h1 class='text-slate-500 underline underline-dashed'>
        Home - Basic
      </h1>
    </div>
  )
}
