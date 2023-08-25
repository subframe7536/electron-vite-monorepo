import { render } from 'solid-js/web'

// the routes.tsx is directly copyed from @generouted/solid-router/lazy, it works
import { Routes } from './routes'

// directly use it will cause ReferenceError: Cannot access 'default' before initialization
// import { Routes } from '@generouted/solid-router/lazy'
import 'uno.css'

render(Routes, document.getElementById('app')!)
