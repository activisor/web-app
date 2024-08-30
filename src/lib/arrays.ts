/**
 * shuffle an array using the Fisher-Yates (aka Knuth) Shuffle algorithm
 */
export function shuffleArray<Type>(array: Type[]): Type[] {
    // Iterate over the array starting from the last element
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index within the range from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap the current element with the element at the random index
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
