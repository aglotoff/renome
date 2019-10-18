/**
 * @file Implementation of the menu block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'menu';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    PRODUCT_LINK: '.menu-product__link',
};

// Element class names
const CLASSES = {
    LIGHTBOX: 'lightbox',
};

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * Product menu with product image gallery
 */
class Menu {

    /**
     * Initialize the menu block
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        $root.magnificPopup({
            delegate: SELECTORS.PRODUCT_LINK,
            mainClass: CLASSES.LIGHTBOX,
            type: 'image',
    
            closeMarkup: `
                <button aria-label="Close" type="button" class="mfp-close">
                    &#215;
                </button>
            `,
    
            callbacks: {
                beforeOpen() {
                    // Add role and label attributes for accessibility purposes
                    this.wrap.attr({
                        'role': 'dialog',
                        'aria-label': 'View image',
                    });
                },
            },
        });
    }

}

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all menu blocks on the page
$(SELECTORS.BLOCK).each(function() {
    new Menu($(this));
});

export default Menu;
