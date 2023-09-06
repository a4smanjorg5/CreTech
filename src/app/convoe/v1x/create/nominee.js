'use client'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useRef } from 'react'
import base32 from 'base32'
import QRCode from 'qrcode'

export default function Nominee({ id }) {
  const qr = useRef(), h = id + '/' + base32.sha1(id).toUpperCase()

  useEffect(() => {
    const qrc = qr.current
    QRCode.toCanvas(qrc, h, { width: qrc.parentElement.offsetWidth })
    qrc.style.width = '100%'
    qrc.style.height = ''
  })

  useEffect(() => {
    const forkEl = document.querySelectorAll('.github-fork-ribbon')[1],
    prevClass = !forkEl.classList.contains('print:hidden') && forkEl.className
    forkEl.classList.add('print:hidden')
    return () => {
      if (prevClass)
        document.querySelectorAll('.github-fork-ribbon')[1].className = prevClass
    }
  }, [])

  return (
    <div>
      <div className="flex items-end flex-col h-16 text-2xl p-2">
        <span className="print:hidden">{/^\(([0-9A-Z]+)\)/.exec(id)[1]}</span>
      </div>
      <div className="w-full aspect-square">
        <canvas ref={qr} />
      </div>
    </div>
  )
}
