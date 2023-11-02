/**
 * handle reading and persisting objects to local storage
 * adapted from: https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage
 */

const PREFIX = 'act.';
export const SCHEDULE_DATA = PREFIX + 'schedule.data';

export function readItem(key: string): any {
  try {
    const serializeditem = localStorage.getItem(key);
    if (serializeditem === null) {
      return undefined;
    }

    return JSON.parse(serializeditem);
  } catch (error) {
    return undefined;
  }
}

export function saveItem(key: string, item: any): void {
  try {
    const serializeditem: string = JSON.stringify(item);
    localStorage.setItem(key, serializeditem);
  } catch (error) {
    console.log(error);
  }
}

/**
 * based on https://github.com/Modernizr/Modernizr/blob/c56fb8b09515f629806ca44742932902ac145302/modernizr.js#L696-731
 */
 export function hasStorage(): boolean {
  const uid: string = (new Date).toISOString();
  try {
		localStorage.setItem(uid, uid);
    localStorage.getItem(uid);
		localStorage.removeItem(uid);
		return true;
	} catch (exception) {
		return false;
	}
}