/**
 * @file Implementation of the Page block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const STICKY_HEADER_OFFSET  = 100;  // Scroll offset to make the header "sticky"
const VISIBLE_HEADER_OFFSET = 500;  // Scroll offset to show the "sticky" header

const HeaderStates = {NORMAL: 0, STICKY: 1, VISIBLE: 2};

const $header = $('.header');

const isHeaderTransparent = $header.hasClass('header_transparent');
let headerState = HeaderStates.NORMAL;
// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN DOM METHODS -----------------------------
/**
 * Add or remove header classes basd on the current scroll offset to create an
 * animated sticky header effect.
 */
const updateHeaderStyles = function() {
    const offset = $(window).scrollTop();
    const newState = offset < STICKY_HEADER_OFFSET
        ? HeaderStates.NORMAL
        : (offset < VISIBLE_HEADER_OFFSET
            ? HeaderStates.STICKY
            : HeaderStates.VISIBLE);

    if (newState !== headerState) {
        if (newState === HeaderStates.NORMAL) {
            $header
                .removeClass('page__header_scroll')
                .removeClass('page__header_hidden')
                .toggleClass('header_transparent', isHeaderTransparent);
        } else {
            $header
                .addClass('page__header_scroll')
                .toggleClass(
                    'page__header_hidden',
                    newState === HeaderStates.STICKY
                )
                .removeClass('header_transparent');
        }

        headerState = newState;
    }
};
// ----------------------------- END DOM METHODS ------------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const handleScroll = function() {
    updateHeaderStyles();
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
export const initModule = function() {
    $(window).on('scroll', handleScroll);
    updateHeaderStyles();
};
// ---------------------------- END PUBLIC METHODS ----------------------------
