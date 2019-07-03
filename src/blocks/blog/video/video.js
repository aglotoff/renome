/**
 * @file Implementation of the video block
 * @author Andrey Glotov
 */

// ------------------------------ BEGIN CONSTANTS -----------------------------

const BLOCK = 'video';

const ClassNames = {
    CONTAINER: `${BLOCK}__container`,
    CONTAINER_FORMAT: `${BLOCK}__container_format_`,
    FRAME: `${BLOCK}__frame`,
};

const Selectors = {
    ROOT: `.${BLOCK}`,
    PLACEHOLDER: `.${BLOCK}__placeholder`,
    PLAY_BTN: `.${BLOCK}__play-btn`,
};

// ------------------------------- END CONSTANTS ------------------------------

/**
 * Implementation of video block with lazy loading functionality
 */
class Video {

    /**
     * Initialize a video block
     * 
     * @param {JQuery} $root The block's root element
     */
    constructor($root) {
        const $placeholder = $(Selectors.PLACEHOLDER, $root);
        const $playBtn = $(Selectors.PLAY_BTN, $placeholder);

        this._elements = { $root, $placeholder };

        $playBtn.click(this._loadVideo.bind(this));
    }

    // ------------------------ BEGIN PRIVATE METHODS -------------------------

    /**
     * Replace the placeholder image with a frame containing the video.
     */
    _loadVideo() {
        const { $root, $placeholder } = this._elements;
        const { url, format } = $root.data();

        const $container = $('<div></div>')
            .addClass(ClassNames.CONTAINER)
            .addClass(ClassNames.CONTAINER_FORMAT + format);

        const $frame = $('<iframe></iframe>', {
            src: url,
            frameborder: '0',
            allowfullscreen: true,
        }).addClass(ClassNames.FRAME);

        $container.append($frame).replaceAll($placeholder);
    }

    // ------------------------- END PRIVATE METHODS --------------------------

    // ------------------------- BEGIN PUBLIC METHODS -------------------------

    /**
     * Initialize all video blocks on the page.
     */
    static initAll() {
        $(Selectors.ROOT).each(function() {
            new Video($(this));
        });
    }

    // -------------------------- END PUBLIC METHODS --------------------------
}

export default Video;
