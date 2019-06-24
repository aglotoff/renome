/**
 * @file Implementation of the menu block
 * @author Andrey Glotov
 */

class Menu {
    /**
     * Crate a menu block
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        $root.magnificPopup({
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
    }

    // ------------------------- BEGIN PUBLIC METHODS -------------------------

    /**
     * Initialize all menu blocks on the page.
     */
    static initAll() {
        $('.menu').each(function() {
            new Menu($(this));
        });
        
        return true;
    }

    // -------------------------- END PUBLIC METHODS --------------------------
}

export default Menu;
