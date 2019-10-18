/**
 * @file Implementation of the video block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'video';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    PLACEHOLDER: `.${BLOCK}__placeholder`,
};

// Element class names
const CLASSES = {
    CONTAINER: `${BLOCK}__container`,
    FRAME: `${BLOCK}__frame`,
};

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * Iframe-based video block with lazy-loading functionality.
 */
class Video {

    /**
     * Initialize the video block
     * 
     * @param {JQuery} $root The block's root element
     */
    constructor($root) {
        const $placeholder = $(SELECTORS.PLACEHOLDER, $root);

        this.elements = { $placeholder };
        this.config = $root.data();

        $placeholder.click(this.load.bind(this));
    }

    // ------------------------ BEGIN PRIVATE METHODS -------------------------

    /**
     * Replace the placeholder image with a frame containing the video.
     */
    load() {
        const { $placeholder } = this.elements;
        const { url, format } = this.config;

        const $container = $('<div></div>')
            .addClass(CLASSES.CONTAINER)
            .addClass(CLASSES.CONTAINER + '_format_' + format);

        const $frame = $('<iframe></iframe>', {
            src: url,
            frameborder: '0',
            allowfullscreen: true,
        }).addClass(CLASSES.FRAME);

        $container
            .append($frame)
            .replaceAll($placeholder);
    }

    // ------------------------- END PRIVATE METHODS --------------------------
}

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all video blocks on the page
$(SELECTORS.BLOCK).each(function() {
    new Video($(this));
});

export default Video;
