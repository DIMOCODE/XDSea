export const isXdc = (hash) => {
    if((hash)?.substring(0, 3) === 'xdc')
        return true;
    else return false;
}
export const toXdc = (hash) => 'xdc'+(hash)?.substring(2)
export const fromXdc = (hash) => '0x'+(hash)?.substring(3)