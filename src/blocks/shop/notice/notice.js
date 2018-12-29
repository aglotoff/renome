/**
 * @file Implementation of the shop notice block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
let $notice;
// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN UTILITY FUNCTIONS -------------------------
// TODO: add code here
// --------------------------- END UTILITY FUNCTIONS --------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------
const showNotice = function() {
    $notice.addClass('notice_visible');
    $('html, body').animate({
        scrollTop: $notice.offset().top - 100
    }, 400);
};
// ------------------------------ END DOM METHODS -----------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onError = function(event, message) {
    $notice
        .html('')
        .append($('<div></div>')
            .addClass('notice__msg')
            .text(message));

    showNotice();
};

const onSuccess = function(event, {message, link, linkText}) {
    $notice
        .html('')
        .append($('<div></div>')
            .addClass('notice__msg')
            .text(message));
    
    if (link) {
        $notice
            .append($('<a></a>')
                .addClass('notice__link')
                .attr('href', link)
                .text(linkText));
    }

    showNotice();
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the shop notice module.
 * @return true if the block is present, false otherwise
 */
export const initModule = function() {
    $notice = $('.notice');
    if ($notice.length === 0) {
        return false;
    }

    $('.page').on({
        error   : onError,
        success : onSuccess,
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
