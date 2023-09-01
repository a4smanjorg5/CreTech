import Link from 'next/link'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link href="buzzonk" className="block underline">Online Multiplayer Buzzer</Link>
      <Link href="convoe" className="block underline">Online Votes Counter</Link>
    </main>
  )
}
