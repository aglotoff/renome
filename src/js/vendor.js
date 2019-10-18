import focusTrap from 'focus-trap';
import jQuery from 'jquery';
import L from 'leaflet';
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
window.L = L;
window.Popper = Popper;
window.Shuffle = Shuffle;

// Manually initialize libraries
svg4everybody();
