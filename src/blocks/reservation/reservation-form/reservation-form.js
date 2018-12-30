/**
 * @file Implementation of the reservation form block
 * @author Andrey Glotov
 */

/* global Pikaday, moment */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const openingHours = [
    {start: 10, end: 21}, // Sun
    {start: 9,  end: 22}, // Mon
    {start: 9,  end: 22}, // Tue
    {start: 9,  end: 22}, // Wed
    {start: 9,  end: 22}, // Thu
    {start: 9,  end: 22}, // Fri
    {start: 10, end: 21}, // Sat
];
// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN UTILITY FUNCTIONS -------------------------
const getStartMoment = function() {
    const currentMoment = moment();

    // Reservation must be done at least 30 minutes ahead 
    currentMoment.add(30, 'minutes');

    // Round up to nearest half hour
    if ((currentMoment.minutes() % 30) !== 0) {
        currentMoment.add(30 - (currentMoment.minutes() % 30), 'minutes');
    }

    // If it's too late, allow reservation from only the next day
    if (currentMoment.hours() >= openingHours[currentMoment.day()].end) {
        return moment({
            year  : currentMoment.year(),
            month : currentMoment.month(),
            date  : currentMoment.date() + 1,
        });
    }

    return currentMoment;
};

const getAvailableTimes = function(startMoment) {
    const hours = openingHours[startMoment.day()];

    const m = moment.max(
        moment(startMoment),
        moment(startMoment).hours(hours.start)
    );

    const timeArray = [];

    while (m.hour() < hours.end) {
        timeArray.push(m.format('h:mm A'));
        m.add(30, 'minutes');
    }

    return timeArray;
};
// --------------------------- END UTILITY FUNCTIONS --------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------
const updateTimeSelect = function($time, startMoment) {
    const timeArray    = getAvailableTimes(startMoment);
    const selectedTime = $time.val();

    const $options  = timeArray.map(function(time) {
        return $('<option></option>')
            .val(time)
            .text(time)
            .prop('selected', time == selectedTime);
    });

    $time
        .empty()
        .append($options)
        .trigger('change');
};

const initSelect = function($select) {
    // TODO: get rid of select2 and use some *normal* dropdown plugin
    $select.select2({
        theme                   : 'theme--default',
        width                   : 'style',
        minimumResultsForSearch : Infinity,
    });

    const data = $select.data('select2');
    data.$container.addClass('reservation-form__input');
    data.$selection.attr('aria-labelledby', $select.attr('aria-labelledby'));
};
// ------------------------------ END DOM METHODS -----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the reservation form module.
 * @return true
 */
export const initModule = function() {
    const startMoment = getStartMoment();

    $('.reservation-form').each(function() {
        const $form   = $(this);
        const $date   = $form.find('.reservation-form__date');
        const $time   = $form.find('.reservation-form__time');
        const $people = $form.find('.reservation-form__people');
    
        new Pikaday({
            field          : $date.get(0),
    
            defaultDate    : startMoment.toDate(),
            setDefaultDate : true,
    
            // Reservations can be made up to 6 months in advance
            minDate        : startMoment.toDate(),
            maxDate        : moment(startMoment).add(6, 'months').toDate(),
    
            format         : 'DD/MM/YYYY',
            theme          : 'date-picker',
    
            onSelect       : function onSelectDate() {
                updateTimeSelect($time, this.getMoment());
            },
        });

        initSelect($time);
        initSelect($people);

        updateTimeSelect($time, startMoment);

        $form.validate({
            rules: {
                date: {
                    required  : true,
                    validDate : true,
                }
            },
            
            errorClass  : 'error reservation-form__error',

            highlight   : function(element) {
                $(element).addClass('input_invalid');
            },
            unhighlight : function(element) {
                $(element).removeClass('input_invalid');
            },
        });
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------