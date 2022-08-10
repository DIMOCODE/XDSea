/**
 * Check if a wallet address has an "xdc" prefix
 * 
 * @param {string} address wallet address to check 
 * @returns true if the wallet address has an "xdc" prefix and false if it has a "0x" prefix
 */
export const isXdc = (address) => {
    if((address)?.substring(0, 3) === 'xdc')
        return true;
    else return false;
};

/**
 * Convert an "xdc" prefix wallet address to a "0x" prefix wallet address
 * 
 * @param {string} address wallet address to be converted
 * @returns wallet address with a "Ox" prefix
 */
export const fromXdc = (address) => '0x'+(address)?.substring(3);

/**
 * Check if the browser is Safari
 */
export const isSafari = navigator.vendor.match(/apple/i) &&
    !navigator.userAgent.match(/crios/i) &&
    !navigator.userAgent.match(/fxios/i) &&
    !navigator.userAgent.match(/Opera|OPT\//);

/**
 * Get a truncated string for displaying wallet address
 * 
 * @param {string} address wallet address that is to be truncated
 * @returns wallet address truncated for display
 */
export const truncateAddress = (address) => {
    return address 
        ? address.substring(0, 6) + "..." + address.substring(38)
        : "undefined";
};