import QRScan from './qrscan'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const metadata = {
  title: 'Election Scanner',
  description: 'Scan to count election',
}

export default function Convoe() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-8 sm:p-24">
      <QRScan />
    </main>
  )
}
