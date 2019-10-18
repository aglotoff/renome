/**
 * @file Implementation of the reservation form block
 * @author Andrey Glotov
 */

import moment from 'moment';
import Pikaday from 'pikaday';

import Select from '../../common/select/select';

// ------------------------------ BEGIN CONSTANTS -----------------------------

// Block name
const BLOCK = 'reservation';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    DATE: `.${BLOCK}__input[name="date"]`,
    TIME: `.${BLOCK}__input[name="time"]`,
    PARTY: `.${BLOCK}__input[name="party"]`,
};

// Element class names
const CLASSES = {
    ERROR: 'error reservation__error',
    INPUT_INVALID: 'input_invalid',
};

// ------------------------------- END CONSTANTS ------------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * Implementation of the reservation form
 */
class Reservation {

    /**
     * Initialize a reservation form
     * 
     * @param {JQuery} $root The root of the block
     */
    constructor($root) {
        const $date = $(SELECTORS.DATE, $root);
        const $time = $(SELECTORS.TIME, $root);
        const $party = $(SELECTORS.PARTY, $root);

        this.elements = {
            $root,
            $date,
            $time,
            $party,
        };

        // Create custom select menus
        this.timeSelect = new Select($time);
        this.partySelect = new Select($party);

        const startDate = this.getStartDate();

        // Create the date picker
        this.datePicker = new Pikaday({
            field: $date.get(0),

            defaultDate: startDate.toDate(),
            setDefaultDate: true,
    
            // Reservations can be made up to 6 months in advance
            minDate: startDate.toDate(),
            maxDate: moment(startDate).add(6, 'months').toDate(),
    
            format: 'DD/MM/YYYY',
            theme: 'date-picker',
    
            onSelect: this.updateTimeOptions.bind(this),
        });

        // Generate initial time options
        this.updateTimeOptions();

        // Form validation
        $root.validate({
            rules: {
                date: {
                    required: true,
                    validDate: true,
                }
            },
            
            // Element class names
            errorClass: CLASSES.ERROR,
    
            highlight(element) {
                // Element class names
                $(element).addClass(CLASSES.INPUT_INVALID);
            },

            unhighlight(element) {
                // Element class names
                $(element).removeClass(CLASSES.INPUT_INVALID);
            },
        });

        $root.submit(this.handleSubmit.bind(this));
    }

    // ------------------------ BEGIN PRIVATE METHODS -------------------------

    /**
     * Update options in the reservation time menu based on the currently
     * selected date.
     */
    updateTimeOptions() {
        const { $time } = this.elements;

        const $options = this.getAvailableTime().reduce(($options, time) => {
            return $options.add($('<option></option>')
                .val(time)
                .text(time)
                .prop('selected', time === $time.val()));
        }, $());

        $time.empty().append($options);

        this.timeSelect.update();
    }

    /**
     * Return the first date that could be selected for reservation
     */
    getStartDate() {
        const currentMoment = moment();

        // The latest allowed reservation time is 11.30 PM. After that moment,
        // only the next day could be selected
        if ((currentMoment.hour() === 23) && (currentMoment.minutes() >= 30)) {
            currentMoment.add(1, 'days');
        }

        return moment({
            year: currentMoment.year(),
            month: currentMoment.month(),
            date: currentMoment.date(),
        });
    }

    /**
     * Get the list of available reservation times based on the selected date
     */
    getAvailableTime() {
        const time = [];

        // If today is selected, make sure the resulting array contains only
        // times after the current moment
        const startMoment = moment.max(this.datePicker.getMoment(), moment());

        // Start from the nearest half hour
        if ((startMoment.minutes() % 30) !== 0) {
            startMoment.add(30 - (startMoment.minutes() % 30), 'minutes');
        }

        for (
            const m = moment(startMoment);
            m.day() === startMoment.day();
            m.add(30, 'minutes')
        ) {
            time.push(m.format('h:mm A'));
        }

        return time;
    }

    // ------------------------- END PRIVATE METHODS --------------------------

    // ------------------------- BEGIN EVENT HANDLERS -------------------------

    /**
     * Handle the submit event
     */
    handleSubmit() {
        // TODO: send the form data to the server or to some third-party service
        // e.g. OpenTable

        return false;
    }

    // -------------------------- END EVENT HANDLERS --------------------------
}

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all reservation blocks on the page
$(SELECTORS.BLOCK).each(function() {
    new Reservation($(this));
});

export default Reservation;
