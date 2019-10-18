import moment from 'moment';

// Reservation page blocks
import '../blocks/reservation/reservation/reservation';

// Add custom method to validate date inputs
jQuery.validator.addMethod('validDate', function(value, element) {
    return this.optional(element) || moment(value, 'DD/MM/YYYY').isValid();
}, 'Please enter a valid date in the format DD/MM/YYYY');
