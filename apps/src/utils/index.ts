import { rgbaToDataURL } from 'thumbhash'

import { normalizePCM } from '@maple-music/utils'

export function generateURL(obj: ArrayBufferLike | File | Blob) {
  const url = URL.createObjectURL(obj instanceof File ? obj : obj instanceof Blob ? obj : new Blob([obj]))
  return {
    url,
    dispose: () => URL.revokeObjectURL(url),
  }
}

export async function blurImage(buffer: Uint8Array, format: string) {
  const { dispose, url } = generateURL(new Blob([buffer], { type: format }))
  const image = new Image()
  image.src = url
  await new Promise(resolve => image.onload = resolve)
  const canvas = new OffscreenCanvas(
    Math.min(image.width, 360),
    Math.min(image.height, 360),
  )
  const context = canvas.getContext('2d')!
  const scale = 100 / Math.max(image.width, image.height)
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  const bitmap = await createImageBitmap(image)
  dispose()
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  return rgbaToDataURL(pixels.width, pixels.height, pixels.data)
}

export async function generateWave(buffer: ArrayBuffer): Promise<number[]> {
  if (buffer.byteLength === 0) {
    return []
  }
  const ctx = new OfflineAudioContext({
    length: 5,
    numberOfChannels: 1,
    sampleRate: 44100,
  })
  const audioBuffer = await ctx.decodeAudioData(buffer)
  return normalizePCM(audioBuffer.getChannelData(0), 1000, -1)
}
