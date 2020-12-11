import focusTrap from 'focus-trap';
import jQuery from 'jquery';
import Pikaday from 'pikaday';
import Popper from 'popper.js';
import Shuffle from 'shufflejs';
import svg4everybody from 'svg4everybody';

// Import jQuery plugins
import 'jquery-validation';
import 'magnific-popup';
import 'slick-carousel';

// Expose libraries to the global Window object
window.$ = window.jQuery = jQuery;
window.focusTrap = focusTrap;
window.Pikaday = Pikaday;
window.Popper = Popper;
window.Shuffle = Shuffle;

// Manually initialize libraries
svg4everybody();

// Add custom method to validate date inputs
jQuery.validator.addMethod('validDate', function(value, element) {
    if (this.optional(element) && (value === '')) {
        return true;
    }

    const match = /(\d{2})\/(\d{2})\/(\d{4})/u.exec(value);
    if (match == null) {
        return false;
    }

    const day = +match[1];
    const month = +match[2];
    const year = +match[3];

    // Check the ranges of month and year
    if ((year < 1970) || (year > 3000) || (month < 1) || (month > 12)) {
        return false;
    }

    const monthLengths = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if ((year % 400 == 0) || ((year % 100 != 0) && (year % 4 == 0))) {
        monthLengths[1] = 29;
    }

    return (day > 0) && (day <= monthLengths[month - 1]);
}, 'Please enter a valid date in the format DD/MM/YYYY');
