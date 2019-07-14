/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
export function avatarFormat(text) {
    return `${text}`.substring(0, 1);
}
export function dateFormat(date) {
    return new Date(date).toLocaleDateString();
}