/**
 * This file is part of the cretech repo.
 *
 * (c) a4smanjorg5
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

let Snowflake = {
  /* c8 ignore start */
  /**
   * The generators epoch timestamp in milliseconds.
   *
   * Defaults to now.
   *
   * @type {number}
   */
  /* c8 ignore end */

  EPOCH: new Date().valueOf(),

  /* c8 ignore start */
  /**
   * The id of the shard running this generator.
   *
   * Defaults to "1".
   *
   * @type {number}
   */
  /* c8 ignore end */

  SHARD_ID: 1,

  /* c8 ignore start */
  /**
   * The sequence of the current running generator.
   *
   * Defaults to "1".
   *
   * @type {number}
   */
  /* c8 ignore end */

  SEQUENCE: 1,

  /* c8 ignore start */
  /**
   * Generates a single snowflake.
   * @returns {bigint}
   */
  /* c8 ignore end */

  generate: (obj) => {
    obj = Object.assign({
      shard_id: Snowflake.SHARD_ID,
    }, obj || {});

    const { shard_id } = obj, timestamp = new Date().valueOf();

    // tslint:disable:no-bitwise
    let result = (BigInt(timestamp) - BigInt(Snowflake.EPOCH)) << BigInt(22);
    result = result | (BigInt(shard_id % 1024) << BigInt(12));
    result = result | BigInt(Snowflake.SEQUENCE++ % 4096);
    // tslint:enable:no-bitwise
    return result;
  },
};

export default Snowflake;
