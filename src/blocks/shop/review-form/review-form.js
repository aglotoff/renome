/**
 * @file Implementation of the review form block
 * @author Andrey Glotov
 */

// ------------------------- BEGIN UTILITY FUNCTIONS --------------------------

/**
 * Given the input element, get a classname containing the invalid modifier
 * @param {JQuery} $element The input element
 */
function getInvalidClassName($element) {
    if ($element.hasClass('input')) {
        return 'input_invalid';
    } else if ($element.hasClass('text-area')) {
        return 'text-area_invalid';
    }
}

// -------------------------- END UTILITY FUNCTIONS ---------------------------

const $form = $('.review-form');
if ($form.length !== 0) {
    $form.validate({
        errorClass: 'error form__error',
    
        errorPlacement: function($error, $element) {
            $element.closest('.form__field').append($error);
        },
    
        highlight(element) {
            $(element).addClass(getInvalidClassName($(element)));
        },
    
        unhighlight(element) {
            $(element).removeClass(getInvalidClassName($(element)));
        },
    });
}
