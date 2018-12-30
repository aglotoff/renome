/**
 * @file Implementation of the payment block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the payment module.
 * @return true if the block is present; false otherwise
 */
export const initModule = function() {
    const $payment = $('.payment');
    if ($payment.length === 0) {
        return false;
    }

    const $radios = $payment.find('.payment__radio');
    const $desc   = $payment.find('.payment__desc');
    $radios.change(function onRadioChange() {
        $desc.slideUp();

        $(this)
            .closest('.payment__method')
            .find('.payment__desc')
            .slideDown();
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
