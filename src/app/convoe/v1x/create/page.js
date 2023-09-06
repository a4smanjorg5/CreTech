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
import Image from 'next/image'
import Link from 'next/link'
import Nominee from './nominee'
import SecondaryButton from '@/components/secondary-button'
import SnowflakeId from '@/convoe/snowflake'

export default function Create() {
  const { current: self } = useRef({}),
  imgRef = useRef(),
  [columns, setColumns] = useState(3),
  [nominee, setNominee] = useState([]),
  [section, setSect] = useState(1),
  [header, setHeader] = useState(0),
  [fore, setFore] = useState(),
  [back, setBack] = useState(),
  [printQR, setPrintQR] = useState(false)

  useEffect(() => {
    if (printQR)
      setTimeout(() => window.print(), 400)
  }, [printQR])

  const addImage = ({ target }) => {
    const files = [...target.files]
    if (files.length) {
      target.value = ""
      setNominee([...nominee, ...files.map(file => ({
        id: SnowflakeId.generate().toString(32),
        imgUrl: URL.createObjectURL(file),
      }))])
    }
  }

  const generateQR = () => {
    if (printQR)
      setPrintQR(-printQR)
    else setPrintQR(1)
  }

  const reset = () => {
    nominee.forEach(n => URL.revokeObjectURL(n.imgUrl))
    setNominee([])
  }

  const pages = []
  if (nominee.length)
  for (let i = 0; i < section; i++) {
    let pageId = SnowflakeId.generate().toString(32)
    pages.push(<>
      {i > 0 && <div className="py-2">
        <div className="print:border-t border-gray-500 border-dashed"></div>
      </div>}
      <div className="w-full break-inside-avoid">
        <div style={{ height: header + 'rem' }} className="w-full pb-2">
          {printQR ? (back && <Image src={back} className="h-full object-cover object-center" alt="" />)
          : (fore && <Image src={fore} className="h-full object-cover object-center" alt="" />)}
        </div>
        <div key={'p'+i}
          dir={printQR ? 'rtl' : void(0)}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          className="grid w-full gap-4 screen:border border-black border-dashed dark:border-white"
        >
          {nominee.map(({ id, imgUrl }, i) => (printQR ?
          <Nominee key={id} id={`(${(i+1).toString(16)})${pageId}`.toUpperCase()} /> :
          <span key={id}
            style={{ backgroundImage: `url(${imgUrl})` }}
            className="bg-contain bg-top bg-no-repeat break-inside-avoid"
          >
            <div className="h-16 text-2xl p-2" align="center">
              <span className="print:hidden">{(i+1).toString(16)}</span>
            </div>
            <div className="w-full aspect-square screen:border border-black border-dashed"></div>
          </span>))}
        </div>
      </div>
    </>)
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-8 sm:p-24 print:p-0 print:m-4">
      <div className="print:hidden">
        <Link href="." className="underline">Scan</Link>
      </div>
      {!printQR && <>
        <div className="flex gap-4 print:hidden">
          <input type="file" accept="image/*" onChange={addImage} ref={imgRef} className="hidden" multiple />
          <SecondaryButton handleClick={() => imgRef.current.click()}>Add Image</SecondaryButton>
          <SecondaryButton handleClick={reset}>Clear</SecondaryButton>
        </div>
        <div className="grid auto-cols-max gap-2 print:hidden">
          <div className="col-span-3"></div>

          <label htmlFor="txtCOL">Columns</label>
          <span>:</span>
          <div>
            <input type="number" value={columns} id="txtCOL" onChange={e => setColumns(Math.max(e.target.value, 2))} className="w-10" />
          </div>

          {(nominee.length || '') && <>
            <label htmlFor="txtPAGE">Page</label>
            <span>:</span>
            <div>
              <input type="number" value={section} id="txtPAGE" onChange={e => setSect(Math.max(e.target.value, 1))} className="w-10" />
            </div>

            <label htmlFor="foreHEADER">Fore Header</label>
            <span>:</span>
            <div>
              <input type="file" onChange={({ target: { files: [file] } }) => {
                if (fore) URL.revokeObjectURL(fore)
                setFore(file && URL.createObjectURL(file))
              }} id="foreHEADER" accept="image/*" />
            </div>

            <label htmlFor="backHEADER">Back Header</label>
            <span>:</span>
            <div>
              <input type="file" onChange={({ target: { files: [file] } }) => {
                if (back) URL.revokeObjectURL(back)
                setBack(file && URL.createObjectURL(file))
              }} id="backHEADER" accept="image/*" />
            </div>

            <label htmlFor="txtHEIGHT">Header Height</label>
            <span>:</span>
            <div>
              <input type="number" value={header} id="txtHEIGHT" onChange={e => setHeader(Math.max(e.target.value, 0))} className="w-10" />
            </div>
          </>}
        </div>
      </>}
      {(nominee.length || '') && <>
        <div className="flex gap-4 print:hidden">
          {!printQR && <SecondaryButton handleClick={() => window.print()}>Print</SecondaryButton>}
          <SecondaryButton handleClick={generateQR}>Generate QR</SecondaryButton>
        </div>
        <div className="w-full screen:border border-dashed border-black dark:border-white">
          {pages}
        </div>
      </>}
    </main>
  )
}
