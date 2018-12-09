import focusTrap from 'focus-trap';
import jQuery from 'jquery';
import moment from 'moment';
import Pikaday from 'pikaday';
import Shuffle from 'shufflejs';
import svg4everybody from 'svg4everybody';

// Import jQuery plugins
import 'jquery-validation';
import 'magnific-popup';
import 'select2';
import 'slick-carousel';

// Expose libraries to global Window object
window.$ = window.jQuery = jQuery;
window.focusTrap = focusTrap;
window.moment    = moment;
window.Pikaday   = Pikaday;
window.Shuffle   = Shuffle;

// Manually initialize third-party libraries
svg4everybody();
