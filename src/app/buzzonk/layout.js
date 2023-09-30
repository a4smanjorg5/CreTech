import NoSleep from './no-sleep'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const metadata = {
  title: 'Host The Buzz',
  description: 'The host of buzzer',
}

export default function HostLayout({ children }) {
  return <NoSleep>{children}</NoSleep>
}
