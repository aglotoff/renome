/**
 * @file Implementation of the checkout payments block
 * @author Andrey Glotov
 */

const $payments = $('.payments');
if ($payments.length !== 0) {
    const $radios = $('.payments__radio', $payments);
    const $desc   = $('.payments__desc', $payments);
    $radios.change(function handleRadioChange() {
        $desc.slideUp();

        $(this)
            .closest('.payments__method')
            .find('.payments__desc')
            .slideDown();
    });
}
