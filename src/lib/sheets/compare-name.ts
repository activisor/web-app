import type { Participant } from '../participant';

/**
 * order by half/full share, then alphabetically by first name
 * @param a
 * @param b
 * @returns
 */
function compareName( a: Participant, b: Participant ) {
    if (a.isHalfShare && !b.isHalfShare) {
        return 1;
    } else if (!a.isHalfShare && b.isHalfShare) {
        return -1;
    }

    return a.name.localeCompare(b.name);
  }

  export { compareName };