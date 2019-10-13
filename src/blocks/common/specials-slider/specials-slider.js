/**
 * @file Implementation of the specials slider block
 * @author Andrey Glotov
 */

import { forceReflow } from '../../../js/util/index';

// ----------------------------- BEGIN CONSTANTS ------------------------------

// Keep these in sync with css!
// TODO: read these values using the computed styles
const GUTTER_WIDTH = 25;
const MIN_OPACITY = 0.5;
const MIN_SCALE = 0.8;
const TRANSITION_DURATION = 150;

const Selectors = {
    ROOT: '.specials-slider',
    SLIDES: '.specials-slider__slide',
    SLIDE_INNER: '.specials-slider__slide-inner',
    PREV_ARROW: '.specials-slider__arrow_dir_prev',
    NEXT_ARROW: '.specials-slider__arrow_dir_next',
};

const ClassNames = {
    SLIDE_MOVING: 'specials-slider__slide_moving',
    SLIDE_ACTIVE: 'specials-slider__slide_active',
};

// ------------------------------- END CONSTANT -------------------------------

/**
 * Specials Slider
 */
class SpecialsSlider {

    /**
     * Create a slider
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        const $slides = $(Selectors.SLIDES, $root);
        const $prevArrow = $(Selectors.PREV_ARROW, $root);
        const $nextArrow = $(Selectors.NEXT_ARROW, $root);

        this._elements = { $root, $slides, $prevArrow, $nextArrow };

        this._state = {
            isTransitioning: false,
            activeIndex: 0,
        };

        this._config = {
            dOffset: GUTTER_WIDTH / ($slides.length - 1),
            dOpacity: (1 - MIN_OPACITY) / ($slides.length - 1),
            dScale: (1 - MIN_SCALE) / ($slides.length - 1),
        };

        $prevArrow.click(this.prevSlide.bind(this));
        $nextArrow.click(this.nextSlide.bind(this));

        this._updateStyles();
    }

    // -------------------------- BEGIN PRIVATE METHODS -----------------------

    /**
     * Apply CSS styles to the given slide
     * 
     * @param {JQuery} $slide The slide to apply styles to
     * @param {number} order Current stacking order of this slide
     */
    _applySlideStyles($slide, order) {
        const {dOffset, dOpacity, dScale} = this._config;
        
        $slide.css({
            transform: `translateX(${order * dOffset}%)`,
            zIndex: this._elements.$slides.length - order,
        }).find(Selectors.SLIDE_INNER).css({
            opacity: (1 - (order * dOpacity)),
            transform: `scale(${1 - (order * dScale)})`,
        });
    }

    /**
     * Update CSS styles of all slides
     */
    _updateStyles() { 
        const total = this._elements.$slides.length;
    
        this._elements.$slides.each((i, slide) => {
            const $slide = $(slide);

            if (!$slide.hasClass(ClassNames.SLIDE_MOVING)) {
                const order = (i - this._state.activeIndex + total) % total;
                this._applySlideStyles($slide, order);
            }
        });
    }

    // --------------------------- END PRIVATE METHODS ------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Transition to the previous slide
     */
    prevSlide() {
        if (this._state.isTransitioning) {
            return;
        }
        this._state.isTransitioning = true;

        let activeIndex = this._state.activeIndex;
        const $slides = this._elements.$slides;

        const $prevSlide = $slides.eq(activeIndex);

        activeIndex--;
        if (activeIndex < 0) {
            activeIndex = $slides.length - 1;
        }
        this._state.activeIndex = activeIndex;

        const $movingSlide = $slides.eq(activeIndex);
        
        $movingSlide.addClass(ClassNames.SLIDE_MOVING);
        $movingSlide.css('zIndex', '-=1');

        setTimeout(() => {
            this._updateStyles();

            setTimeout(() => {
                forceReflow($movingSlide);

                $prevSlide.removeClass(ClassNames.SLIDE_ACTIVE);
                $movingSlide.addClass(ClassNames.SLIDE_ACTIVE);
                $movingSlide.removeClass(ClassNames.SLIDE_MOVING);

                this._applySlideStyles($movingSlide, 0);

                this._state.isTransitioning = false;
            }, TRANSITION_DURATION);
        }, TRANSITION_DURATION);
    }

    /**
     * Transition to the next slide
     */
    nextSlide() {
        if (this._state.isTransitioning) {
            return;
        }
        this._state.isTransitioning = true;

        let activeIndex = this._state.activeIndex;
        const $slides = this._elements.$slides;
        const $movingSlide = $slides.eq(activeIndex);
        
        $movingSlide.addClass(ClassNames.SLIDE_MOVING);
        $movingSlide.css('zIndex', '+=1');
        $movingSlide.removeClass(ClassNames.SLIDE_ACTIVE);

        activeIndex++;
        if (activeIndex >= $slides.length) {
            activeIndex = 0;
        }
        this._state.activeIndex = activeIndex;

        const $nextSlide = $slides.eq(activeIndex);
        $nextSlide.addClass(ClassNames.SLIDE_ACTIVE);
        
        setTimeout(() => {
            this._updateStyles();
            
            setTimeout(() => {
                $movingSlide.removeClass(ClassNames.SLIDE_MOVING);
                
                this._applySlideStyles($movingSlide, $slides.length - 1);

                this._state.isTransitioning = false;
            }, TRANSITION_DURATION);
        }, TRANSITION_DURATION);
    }

    /**
     * Initialize all specials slider blocks on the page
     */
    static initAll() {
        $(Selectors.ROOT).init(function() {
            new SpecialsSlider($(this));
        });
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

export default SpecialsSlider;
