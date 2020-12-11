/**
 * @file Implementation of the reservation form block
 * @author Andrey Glotov
 */

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

            defaultDate: startDate,
            setDefaultDate: true,
    
            // Reservations can be made up to 6 months in advance
            minDate: startDate,
            maxDate: new Date(
                startDate.getFullYear(),
                startDate.getMonth() + 6,
                startDate.getDate(),
                startDate.getHours(),
                startDate.getMinutes()
            ),
    
            theme: 'date-picker',

            toString(date) {
                const year = date.getFullYear();

                let month = date.getMonth() + 1;
                if (month < 10) {
                    month = `0${month}`;
                }

                let day = date.getDate();
                if (day < 10) {
                    day = `0${day}`;
                }

                return `${day}/${month}/${year}`;
            },

            parse(dateString) {
                const match = /(\d{2})\/(\d{2})\/(\d{4})/.exec(dateString);
                if (match == null) {
                    return null;
                }

                const day = +match[1];
                const month = +match[2];
                const year = +match[3];

                return new Date(year, month - 1, day);
            },
    
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
        const now = new Date();

        // The latest allowed reservation time is 11.30 PM. After that moment,
        // only the next day could be selected
        if ((now.getHours() === 23) && (now.getMinutes() >= 30)) {
            return new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );
        }

        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
    }

    /**
     * Get the list of available reservation times based on the selected date
     */
    getAvailableTime() {
        const time = [];

        // If today is selected, make sure the resulting array contains only
        // times after the current moment
        const pickerDate = this.datePicker.getDate();
        const currentDate = new Date();

        let startDate = pickerDate.getTime() > currentDate.getTime()
            ? pickerDate
            : currentDate;

        // Start from the nearest half hour
        if ((startDate.getMinutes() % 30) !== 0) {
            startDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate(),
                startDate.getHours(),
                startDate.getMinutes() + 30 - (startDate.getMinutes() % 30)
            );
        }

        let d = startDate;
        do {
            time.push(d.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }));

            d = new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                d.getHours(),
                d.getMinutes() + 30
            );
        } while (d.getDate() === startDate.getDate());

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
