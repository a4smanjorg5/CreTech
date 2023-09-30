'use client'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from "react"
import Nosleep from 'nosleep.js'

export default function NoSleep({ children }) {
  useEffect(() => {
    const noSleep = new Nosleep()
    document.addEventListener('click', function enableNoSleep() {
      document.removeEventListener('click', enableNoSleep)
      noSleep.enable()
    })
  }, [])
  return children
}
