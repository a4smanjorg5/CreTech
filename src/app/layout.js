import './globals.css'
import 'github-fork-ribbon-css/gh-fork-ribbon.css'
import { Inter } from 'next/font/google'
import WMlink from './gtm'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    template: '%s – CreTech',
    default: 'Welcome to CreTech',
  },
  description: 'All creative tech',
}

const GTM_ID = 'GTM-NTJZQX9B'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NTJZQX9B"
height="0" width="0" className="hidden" /></noscript>
        <WMlink />
        {children}
        <a className="github-fork-ribbon right-bottom fixed" href="https://github.com/a4smanjorg5/cretech#readme" data-ribbon="Fork me on GitHub" target="developer" title="Fork me on GitHub">&nbsp;</a>
      </body>
    </html>
  )
}
