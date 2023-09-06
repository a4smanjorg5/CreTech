import base32 from 'base32'
import jsQR from 'jsqr-es6'

/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const votes = {};

const grayscaleWeights = {
  red: 77,
  green: 150,
  blue:29,
  useIntegerApproximation: !0,
};

self.addEventListener('message', ({ data: imgData }) => {
  var result = jsQR(imgData.data, imgData.width, imgData.height, {
    grayscaleWeights,
    inversionAttempts: 'dontInvert',
  });
  if (!result || typeof result.data != 'string') return;
  result = /^(\([1-9A-F][0-9A-F]*\)[0-9A-Z]+)\/([0-9A-Z]+)$/.exec(result.data.toUpperCase());
  if (result && result.length > 2 &&
  base32.sha1(result[1]).toUpperCase() == result[2]) {
    const count = {};
    result = /^\(([0-9A-F]+)\)([0-9A-Z]+)$/.exec(result[1]);
    // if (votes[result[2]]) return;
    votes[result[2]] = result[1];
    const list = Object.keys(votes);
    list.forEach(id => {
      const n = votes[id];
      if (count[n])
        count[n]++;
      else count[n] = 1n;
    });
    self.postMessage({
      last: result[1],
      data: Object.keys(count).map(n => ({
        id: n,
        count: '' + count[n],
      })).sort((a, b) => {
        if (a.count < b.count) return 1;
        if (a.count > b.count) return -1;
        return 0;
      }),
      total: '' + list.length,
    });
  }
})
