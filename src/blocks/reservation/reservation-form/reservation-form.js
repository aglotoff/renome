/**
 * Resrvation Form Block
 */
(function($) {
    /* global Pikaday, moment */

    const OpeningHours = [
        {start: 10, end: 21}, // Sun
        {start: 9,  end: 22}, // Mon
        {start: 9,  end: 22}, // Tue
        {start: 9,  end: 22}, // Wed
        {start: 9,  end: 22}, // Thu
        {start: 9,  end: 22}, // Fri
        {start: 10, end: 21}, // Sat
    ];

    let today = moment();
    today.add(30 - (today.minutes() % 30), 'minutes');
    if (today.hours() >= OpeningHours[today.day()].end) {
        today = moment({
            year: today.year(),
            month: today.month(),
            date: today.date() + 1,
        });
    }

    $('.reservation-form').each(function() {
        const $form = $(this);

        const updateDate = (thisMoment) => {
            const hours = OpeningHours[thisMoment.day()];

            const m = moment.max(
                moment(today),
                moment(thisMoment).hours(hours.start)
            );

            const timeArray = [];

            while (m.hour() < hours.end) {
                timeArray.push(m.format('h:mm A'));
                m.add(30, 'minutes');
            }

            const $time = $('.reservation-form__time', $form);
            const currentValue = $time.val();

            $time
                .empty()
                .append(timeArray.map((time) => {
                    return $('<option></option>')
                        .val(time)
                        .text(time)
                        .prop('selected', time == currentValue);
                }))
                .trigger('change');
        };

        new Pikaday({
            field: $('.reservation-form__date', $(this))[0],

            defaultDate: today.toDate(),
            setDefaultDate: true,

            minDate: today.toDate(),
            maxDate: moment(today).add(1, 'years').toDate(),

            format: 'DD/MM/YYYY',
            theme: 'date-picker',

            onSelect() {
                updateDate(this.getMoment());
            },
        });

        $('.reservation-form__time', $form)
            .select2({
                theme: 'renome',
                width: 'style',
                minimumResultsForSearch: Infinity,
            })
            .data('select2')
            .$container
            .addClass('reservation-form__input');

        $('.reservation-form__people', $form)
            .select2({
                theme: 'renome',
                width: 'style',
                minimumResultsForSearch: Infinity,
            })
            .data('select2')
            .$container
            .addClass('reservation-form__input');

        updateDate(today);
    });
})($);
