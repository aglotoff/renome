/**
 * @file Implementation of the menu block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize a menu block.
 * @param {JQuery} $menu The root element
 * @return true
 */
function initBlock($menu) {
    $menu.magnificPopup({
        delegate: '.menu-product__link',
        mainClass: 'lightbox',
        type: 'image',

        closeMarkup: `
            <button aria-label="Close" type="button" class="mfp-close">
                &#215;
            </button>
        `,

        callbacks: {
            beforeOpen() {
                // for web accessibility purposes
                this.wrap.attr({
                    'role': 'dialog',
                    'aria-label': 'View image',
                });
            },
        },
    });

    return true;
}

/**
 * Initialize all menu blocks on the page.
 * @return true
 */
function initAll() {
    $('.menu').each(function() {
        initBlock($(this));
    });
    
    return true;
}

// ---------------------------- END PUBLIC METHODS ----------------------------

export default {
    initBlock,
    initAll,
};
