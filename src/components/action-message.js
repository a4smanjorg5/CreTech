import React from 'react';
import { Transition } from '@headlessui/react';

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default function ActionMessage({ on, className, children }) {
    return (
        <div>
            <Transition show={!!on} leave="transition ease-in duration-1000" leaveFrom="opacity-100" leaveTo="opacity-0" className={className}>
                {children}
            </Transition>
        </div>
    );
}
