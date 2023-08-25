import { generateTypesafeIPC } from 'typesafe-electron-ipc'
import { ipc } from '@test-mono/ipc'

export const { main } = generateTypesafeIPC(ipc, 'main')
