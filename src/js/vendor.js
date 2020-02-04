import focusTrap from 'focus-trap';
import jQuery from 'jquery';
import Popper from 'popper.js';
import svg4everybody from 'svg4everybody';

// Import jQuery plugins
import 'jquery-validation';
import 'magnific-popup';
import 'slick-carousel';

// Expose libraries to the global Window object
window.$ = window.jQuery = jQuery;
window.focusTrap = focusTrap;
window.Popper = Popper;

// Manually initialize libraries
svg4everybody();
