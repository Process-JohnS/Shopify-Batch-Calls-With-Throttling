
/**
 *  Milliseconds to wait before sending another
 *  request to monitor the current call limit status.
 */
export const THROTTLE_DELAY_MS = 3000;


/**
 *  Creates a buffer on the number of requests sent in
 *  a single burst to avoid hitting the call limit if
 *  requests queue unexpectedly.
 */
export const CALL_BUFFER = 5;

