import focusTrap     from 'focus-trap';
import jQuery        from 'jquery';
import moment        from 'moment';
import Pikaday       from 'pikaday';
import Shuffle       from 'shufflejs';
import svg4everybody from 'svg4everybody';

// Import jQuery plugins
import 'jquery-validation';
import 'magnific-popup';
import 'select2';
import 'slick-carousel';
import '@babel/polyfill';

// Expose libraries to the global Window object
window.$ = window.jQuery = jQuery;

window.focusTrap = focusTrap;
window.moment    = moment;
window.Pikaday   = Pikaday;
window.Shuffle   = Shuffle;

// Manually initialize libraries
svg4everybody();

jQuery.validator.addMethod('validDate', function(value, element) {
    return this.optional(element) || moment(value,'DD/MM/YYYY').isValid();
}, 'Please enter a valid date in the format DD/MM/YYYY');
