import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const metadata = {
  title: 'Votes Counter',
  description: 'Count the election',
}

export default function Convoe() {
  redirect(headers().get('x-invoke-path') + '/v1x')
}
