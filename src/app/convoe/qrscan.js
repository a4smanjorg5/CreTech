'use client'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ActionMessage from '@/components/action-message'
import Button from '@/components/button'
import SecondaryButton from '@/components/secondary-button'

const DEFAULT_CANVAS_SIZE = 400, self = {}

export default function QRScan() {
  const vp = useRef(),
  [available, setAvailable] = useState(!0),
  [canAdd, setAdd] = useState(!0),
  [flash, setFlash] = useState(!0),
  [nominee, setNominee] = useState(['']),
  [preview, setPreview] = useState(),
  [processing, setProcessing] = useState(!0),
  [scanning, setScanning] = useState(false),
  [scanRegion, setScanRegion] = useState({}),
  [votes, setVotes] = useState()

  useEffect(() => {
    var t = 0
    if (flash) t = setTimeout(() => setFlash(false), 2000)
    return () => { if (flash) clearTimeout(t) }
  }, [flash, votes])

  useEffect(() => {
    const video = vp.current
    if (video) {
      if ('srcObject' in video)
        video.srcObject = preview
      else video.src = (preview && URL.createObjectURL(preview)) || ''
    }
    return () => {
      if (video) {
        if (video.src) {
          URL.revokeObjectURL(video.src)
          video.src = null
        } else video.srcObject = null
      }
      preview?.getTracks().forEach(t => t.stop())
    }
  }, [preview])

  useEffect(() => {
    const scanner = new Worker(new URL('./counter', import.meta.url))
    self.worker = scanner
    scanner.addEventListener('message', ({ data }) => {
      setFlash(!0)
      setScanning(false)
      setVotes(data)
    })
    self.canvas = document.createElement('canvas')
    navigator.permissions.query({ name: 'camera' }).then(p => {
      setProcessing(false)
      if (p.state == 'denied') setAvailable(false)
    })
    return () => {
      self.worker?.terminate()
      self.worker = null
    }
  }, [])

  const calculateScanRegion = () => {
    const video = vp.current

    // Default scan region calculation. Note that this can be overwritten in the constructor.
    var smallestDimension = Math.min(video.videoWidth, video.videoHeight)
    var scanRegionSize = Math.round(2 / 3 * smallestDimension)
    self.scanRegion = {
      x: Math.round((video.videoWidth - scanRegionSize) / 2),
      y: Math.round((video.videoHeight - scanRegionSize) / 2),
      w: scanRegionSize,
      h: scanRegionSize,
      downScaledWidth: DEFAULT_CANVAS_SIZE,
      downScaledHeight: DEFAULT_CANVAS_SIZE,
    }

    smallestDimension = Math.min(video.offsetWidth, video.offsetHeight)
    scanRegionSize = Math.round(2 / 3 * smallestDimension)
    setScanRegion({
      left: Math.round((video.offsetWidth - scanRegionSize) / 2),
      top: Math.round((video.offsetHeight - scanRegionSize) / 2),
      width: scanRegionSize,
      height: scanRegionSize,
    })
  }

  const handleChange = (n, i) => {
    var arr = Array.from(nominee)
    arr[i] = n
    arr = arr.filter(n => n)
    arr.push('')
    setNominee(arr)
  }

  const scan = () => {
    const vidp = vp.current
    if (!scanning || vidp.currentTime < .5) return

    const scanRegion = self.scanRegion,
    scanRegionX = scanRegion?.x || 0,
    scanRegionY = scanRegion?.y || 0,
    scanRegionWidth = scanRegion?.w || vidp.videoWidth,
    scanRegionHeight = scanRegion?.h || vidp.videoHeight

    const canvas = self.canvas
    canvas.width = scanRegion?.downScaledWidth || scanRegionWidth
    canvas.height = self.scanRegion?.downScaledHeight || scanRegionHeight

    const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: !0, })
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(
      vidp,
      scanRegionX, scanRegionY, scanRegionWidth, scanRegionHeight,
      0, 0, canvas.width, canvas.height
    )
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    self.worker?.postMessage(imageData, [imageData.data.buffer])
  }

  const stopScan = e => {
    if (e.detail != 2) return
    setScanning(false)
    setPreview(null)
  }

  const submitted = () => {
    const init = { video: { facingMode: 'environment' } }
    if (canAdd) setAdd(false)
    setNominee(nominee.filter(n => n))
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(init).
      then(initScanner).catch(requestCam)
    } else {
      navigator.getUserMedia(init, initScanner, requestCam)
    }
  }

  const initScanner = stream => {
    setProcessing(false)
    setPreview(stream)
  },
  requestCam = stream => {
    setAvailable(false)
    setProcessing(false)
  }

  const pathname = usePathname()

  return (
    <>
      {canAdd && <Link href={pathname + '/create'} className="underline">Create Grid</Link>}
      {available ? (preview ? <div onClick={stopScan} className="relative max-w-full">
        <video autoPlay ref={vp} onTimeUpdate={scan} onPlay={calculateScanRegion} />
        <div className="absolute left-0 top-0 w-full h-full z-10 overflow-hidden">
          <div style={scanRegion} className="absolute scan-region-highlight" />
          {votes && <ActionMessage on={flash} className="absolute left-0 top-0 h-full w-full flex flex-col items-center justify-center">
            <div className="bg-black text-white text-semibold text-3xl flex flex-col items-center justify-center gap-2">
              <div>{nominee[parseInt('0x' + votes.last) - 1] || votes.last}: +1</div>
              <div>Total {votes.total} votes</div>
            </div>
          </ActionMessage>}
        </div>
      </div> : <form onSubmit={e => { e.preventDefault(); setProcessing(!0); submitted() }} className="flex flex-col gap-2 items-center">
        <Button processing={processing}>Start</Button>
        {canAdd && nominee.map((n, i) => <div key={'n'+i}>
          <input type="text" value={n} placeholder={'nominee ' + (i+1).toString(16)} onChange={e => { handleChange(e.target.value, i) }} />
        </div>)}
      </form>) : <div>please enable webcam</div>}
      {preview && <div>
        {scanning ? 'scanning...' : <SecondaryButton handleClick={() => setScanning(!0)}>Scan</SecondaryButton>}
      </div>}
      {votes && <>
        <p>Total: {votes.total} vote(s)</p>
        <ol>
          {votes.data.map(({ id, count }) => <li key={'n'+id}>
            {nominee[parseInt('0x' + id) - 1] || id}: {count}
          </li>)}
        </ol>
      </>}
    </>
  )
}
