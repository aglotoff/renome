/**
 * @file Implementation of the reservation form block
 * @author Andrey Glotov
 */

/* global Pikaday, moment */

import Select from '../../common/select/select';

// ------------------------------ BEGIN CONSTANTS -----------------------------

const BLOCK = 'reservation';

const Selectors = {
    ROOT: `.${BLOCK}`,
    DATE: `.${BLOCK}__input[name="date"]`,
    TIME: `.${BLOCK}__input[name="time"]`,
    PARTY: `.${BLOCK}__input[name="party"]`,
};

const Classes = {
    ERROR: 'error reservation__error',
    INPUT_INVALID: 'input_invalid',
};

// ------------------------------- END CONSTANTS ------------------------------

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
        const $date = $(Selectors.DATE, $root);
        const $time = $(Selectors.TIME, $root);
        const $party = $(Selectors.PARTY, $root);

        this._elements = {
            $root,
            $date,
            $time,
            $party,
        };

        // Create custom select menus
        this._timeSelect = new Select($time);
        this._partySelect = new Select($party);

        const startDate = this._getStartDate();

        // Create the date picker
        this._datePicker = new Pikaday({
            field: $date.get(0),

            defaultDate: startDate.toDate(),
            setDefaultDate: true,
    
            // Reservations can be made up to 6 months in advance
            minDate: startDate.toDate(),
            maxDate: moment(startDate).add(6, 'months').toDate(),
    
            format: 'DD/MM/YYYY',
            theme: 'date-picker',
    
            onSelect: this._updateTimeOptions.bind(this),
        });

        // Generate initial time options
        this._updateTimeOptions();

        // Form validation
        $root.validate({
            rules: {
                date: {
                    required: true,
                    validDate: true,
                }
            },
            
            errorClass: Classes.ERROR,
    
            highlight(element) {
                $(element).addClass(Classes.INPUT_INVALID);
            },

            unhighlight(element) {
                $(element).removeClass(Classes.INPUT_INVALID);
            },
        });

        $root.submit(this._handleSubmit.bind(this));
    }

    // ------------------------ BEGIN PRIVATE METHODS -------------------------

    /**
     * Update options in the reservation time menu based on the currently
     * selected date.
     */
    _updateTimeOptions() {
        const { $time } = this._elements;

        const $options = this._getAvailableTime().reduce(($options, time) => {
            return $options.add($('<option></option>')
                .val(time)
                .text(time)
                .prop('selected', time === $time.val()));
        }, $());

        $time.empty().append($options);

        this._timeSelect.update();
    }

    /**
     * Return the first date that could be selected for reservation
     */
    _getStartDate() {
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
    _getAvailableTime() {
        const time = [];

        // If today is selected, make sure the resulting array contains only
        // times after the current moment
        const startMoment = moment.max(this._datePicker.getMoment(), moment());

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
    _handleSubmit() {
        // TODO: send the form data to the server or to some third-party service
        // e.g. OpenTable

        return false;
    }

    // -------------------------- END EVENT HANDLERS --------------------------

    // ------------------------- BEGIN PUBLIC METHODS -------------------------

    /**
     * Initialize all reservation blocks on the page
     */
    static initAll() {
        $(Selectors.ROOT).each(function() {
            new Reservation($(this));
        });
    }

    // -------------------------- END PUBLIC METHODS --------------------------
}

Reservation.initAll();

export default Reservation;
