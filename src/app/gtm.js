'use client'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react'

export default function WMlink() {
  useEffect(() => {
    const script = document.createElement('script')
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NTJZQX9B');`
    document.head.insertBefore(script, document.head.childNodes[0])
  }, [])

  return <a className="github-fork-ribbon left-top fixed print:hidden" href="https://subs--givent.repl.co" data-ribbon="Donate" target="developer" title="Donate">subs</a>
}
