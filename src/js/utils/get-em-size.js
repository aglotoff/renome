/**
 * Get size of ems in pixels
 * 
 * @param {JQuery} $elem The element whose em size is to be computed
 * @return {number} The size of ems in pixels
 */
export default function getEmSize( $elem ) {
    return +$elem.css('font-size').match(/\d*\.?\d*/)[0];
}
