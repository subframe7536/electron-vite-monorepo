import { loadIPC } from 'typesafe-electron-ipc/renderer'
import type { IPC } from '@test-mono/ipc'

const { renderer } = loadIPC<IPC>()

export const { check, msg, restore, toggle } = renderer
