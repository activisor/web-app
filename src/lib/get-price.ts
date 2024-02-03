import { publicRuntimeConfig } from './app-constants';

/**
 * get price in cents, applying discount if isReferral is true
 * @param isReferral
 * @param discount
 * @returns price in cents
 */
function getPrice(isReferral: boolean, discount: number) {
    const coef = isReferral? (100 - discount) / 100 : 1;
    return publicRuntimeConfig.BASE_PRICE_CENTS * coef;
}

export { getPrice };