/**
 * @file Implementation of the gallery block
 * @author Andrey Glotov
 */

class Gallery {
    
    /**
     * Initialize a gallery block
     * 
     * @param {JQuery} $root The block's root
     */
    constructor($root) {
        $root.magnificPopup({
            delegate: '.gallery__thumb-link',
            mainClass: 'lightbox',
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
                    // For web accessibility
                    this.wrap.attr({
                        'role': 'dialog',
                        'aria-label': 'Gallery',
                    });
                },
            },
        });
    }

    // ------------------------- BEGIN PUBLIC METHODS -------------------------

    /**
     * Initialize all gallery blocks on the page.
     */
    static initAll() {
        $('.gallery').each(function() {
            new Gallery($(this));
        });
    }

    // -------------------------- END PUBLIC METHODS --------------------------
}

export default Gallery;
