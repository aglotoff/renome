/**
 * @file Implementation of the gallery block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'gallery';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    THUMB_LINK: `.${BLOCK}__thumb-link`,
};

// Element class names
const CLASSES = {
    LIGHTBOX: 'lightbox',
};

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * Lighbox image gallery
 */
class Gallery {
    
    /**
     * Initialize a gallery block
     * 
     * @param {JQuery} $root The block's root
     */
    constructor($root) {
        $root.magnificPopup({
            delegate: SELECTORS.THUMB_LINK,
            mainClass: CLASSES.LIGHTBOX,

            type: 'image',

            gallery: {
                enabled: true,
                tCounter: '',
            },

            closeMarkup: `
                <button aria-label="Close" type="button" class="mfp-close">
                    &#215;
                </button>
            `,
            arrowMarkup: `
                <button 
                    aria-label="%title%"
                    type="button"
                    class="mfp-arrow mfp-arrow-%dir%"
                >
                </button>
            `,

            callbacks: {
                beforeOpen() {
                    // Add role and label attributes for accessibility purposes
                    this.wrap.attr({
                        'role': 'dialog',
                        'aria-label': 'Gallery',
                    });
                },
            },
        });
    }

}

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all gallery blocks on the page.
$(SELECTORS.BLOCK).each(function() {
    new Gallery($(this));
});

export default Gallery;
