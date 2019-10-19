/**
 * @file Implementation of the specials slider block
 * @author Andrey Glotov
 */

import { forceReflow } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES -------------------------- 

// Block name
const BLOCK = 'specials-slider';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    SLIDES: `.${BLOCK}__slide`,
    SLIDE_INNER: `.${BLOCK}__slide-inner`,
    PREV_ARROW: `.${BLOCK}__arrow_dir_prev`,
    NEXT_ARROW: `.${BLOCK}__arrow_dir_next`,
};

// Element class names
const CLASSES = {
    SLIDE_MOVING: `${BLOCK}__slide_moving`,
    SLIDE_ACTIVE: `${BLOCK}__slide_active`,
};

// Keep these in sync with css!
// TODO: read these values using the computed styles
const GUTTER_WIDTH = 25;
const MIN_OPACITY = 0.5;
const MIN_SCALE = 0.8;
const TRANSITION_DURATION = 150;

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * Carousel card slider for special products
 */
class SpecialsSlider {

    /**
     * Create a slider
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        const $slides = $(SELECTORS.SLIDES, $root);
        const $prevArrow = $(SELECTORS.PREV_ARROW, $root);
        const $nextArrow = $(SELECTORS.NEXT_ARROW, $root);

        this.elements = { $root, $slides, $prevArrow, $nextArrow };

        this.state = {
            isTransitioning: false,
            activeIndex: 0,
        };

        this.config = {
            dOffset: GUTTER_WIDTH / ($slides.length - 1),
            dOpacity: (1 - MIN_OPACITY) / ($slides.length - 1),
            dScale: (1 - MIN_SCALE) / ($slides.length - 1),
        };

        $prevArrow.click(this.prevSlide.bind(this));
        $nextArrow.click(this.nextSlide.bind(this));

        this.updateStyles();
    }

    // -------------------------- BEGIN PRIVATE METHODS -----------------------

    /**
     * Apply CSS styles to the given slide
     * 
     * @param {JQuery} $slide The slide to apply styles to
     * @param {number} order Current stacking order of this slide
     */
    applySlideStyles($slide, order) {
        const {dOffset, dOpacity, dScale} = this.config;
        
        $slide.css({
            transform: `translateX(${order * dOffset}%)`,
            zIndex: this.elements.$slides.length - order,
        }).find(SELECTORS.SLIDE_INNER).css({
            opacity: (1 - (order * dOpacity)),
            transform: `scale(${1 - (order * dScale)})`,
        });
    }

    /**
     * Update CSS styles of all slides
     */
    updateStyles() { 
        const total = this.elements.$slides.length;
    
        this.elements.$slides.each((i, slide) => {
            const $slide = $(slide);

            if (!$slide.hasClass(CLASSES.SLIDE_MOVING)) {
                const order = (i - this.state.activeIndex + total) % total;
                this.applySlideStyles($slide, order);
            }
        });
    }

    // --------------------------- END PRIVATE METHODS ------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Transition to the previous slide
     */
    prevSlide() {
        if (this.state.isTransitioning) {
            return;
        }
        this.state.isTransitioning = true;

        let activeIndex = this.state.activeIndex;
        const $slides = this.elements.$slides;

        const $prevSlide = $slides.eq(activeIndex);

        activeIndex--;
        if (activeIndex < 0) {
            activeIndex = $slides.length - 1;
        }
        this.state.activeIndex = activeIndex;

        const $movingSlide = $slides.eq(activeIndex);
        
        $movingSlide.addClass(CLASSES.SLIDE_MOVING);
        $movingSlide.css('zIndex', '-=1');

        setTimeout(() => {
            this.updateStyles();

            setTimeout(() => {
                forceReflow($movingSlide);

                $prevSlide.removeClass(CLASSES.SLIDE_ACTIVE);
                $movingSlide.addClass(CLASSES.SLIDE_ACTIVE);
                $movingSlide.removeClass(CLASSES.SLIDE_MOVING);

                this.applySlideStyles($movingSlide, 0);

                this.state.isTransitioning = false;
            }, TRANSITION_DURATION);
        }, TRANSITION_DURATION);
    }

    /**
     * Transition to the next slide
     */
    nextSlide() {
        if (this.state.isTransitioning) {
            return;
        }
        this.state.isTransitioning = true;

        let activeIndex = this.state.activeIndex;
        const $slides = this.elements.$slides;
        const $movingSlide = $slides.eq(activeIndex);
        
        $movingSlide.addClass(CLASSES.SLIDE_MOVING);
        $movingSlide.css('zIndex', '+=1');
        $movingSlide.removeClass(CLASSES.SLIDE_ACTIVE);

        activeIndex++;
        if (activeIndex >= $slides.length) {
            activeIndex = 0;
        }
        this.state.activeIndex = activeIndex;

        const $nextSlide = $slides.eq(activeIndex);
        $nextSlide.addClass(CLASSES.SLIDE_ACTIVE);
        
        setTimeout(() => {
            this.updateStyles();
            
            setTimeout(() => {
                $movingSlide.removeClass(CLASSES.SLIDE_MOVING);
                
                this.applySlideStyles($movingSlide, $slides.length - 1);

                this.state.isTransitioning = false;
            }, TRANSITION_DURATION);
        }, TRANSITION_DURATION);
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

// --------------------------- END CLASS DEFINITION --------------------------- 

$(SELECTORS.BLOCK).each(function() {
    new SpecialsSlider($(this));
});

export default SpecialsSlider;
