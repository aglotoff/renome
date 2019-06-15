/**
 * @file Implementation of the specials slider block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const GUTTER_WIDTH        = 25;
const MIN_OPACITY         = 0.5;
const MIN_SCALE           = 0.8;
const TRANSITION_DURATION = 150;
// --------------------------- END MODULE VARIABLES ---------------------------

const sliderProto = {
    applySlideStyles($slide, order) {
        const {dOffset, dOpacity, dScale} = this._params;

        $slide.css({
            left      : (order * dOffset) + '%',
            opacity   : (1 - (order * dOpacity)),
            transform : `scale(${1 - (order * dScale)})`,
            zIndex    : this._$slides.length - order,
        });
    },

    updateStyles() { 
        const total    = this._$slides.length;
    
        this._$slides.each((i, slide) => {
            const $slide = $(slide);

            if ($slide.hasClass('specials-slider__slide_moving')) {
                return;
            }

            const order = (i - this._activeIndex + total) % total;
            this.applySlideStyles($slide, order);
        });
    },

    prevSlide() {
        if (this._isSliding) {
            return;
        }
        this._isSliding = true;

        let activeIndex    = this._activeIndex;
        const $slides      = this._$slides;

        const $prevSlide = $slides.eq(activeIndex);

        activeIndex--;
        if (activeIndex < 0) {
            activeIndex = $slides.length - 1;
        }
        this._activeIndex = activeIndex;

        const $movingSlide = $slides.eq(activeIndex);
        
        $movingSlide.addClass('specials-slider__slide_moving');
        $movingSlide.css('zIndex', '-=1');
        
        setTimeout(() => {
            this.updateStyles();
            
            setTimeout(() => {
                $prevSlide.removeClass('specials-slider__slide_active');
                $movingSlide.removeClass('specials-slider__slide_moving');
                $movingSlide.addClass('specials-slider__slide_active');
                
                this.applySlideStyles($movingSlide, 0);

                this._isSliding = false;
            }, TRANSITION_DURATION);
        }, TRANSITION_DURATION);
    },

    nextSlide() {
        if (this._isSliding) {
            return;
        }
        this._isSliding = true;

        let activeIndex    = this._activeIndex;
        const $slides      = this._$slides;
        const $movingSlide = $slides.eq(activeIndex);
        
        $movingSlide.addClass('specials-slider__slide_moving');
        $movingSlide.css('zIndex', '+=1');
        $movingSlide.removeClass('specials-slider__slide_active');

        activeIndex++;
        if (activeIndex >= $slides.length) {
            activeIndex = 0;
        }
        this._activeIndex = activeIndex;

        const $nextSlide = $slides.eq(activeIndex);
        $nextSlide.addClass('specials-slider__slide_active');
        
        setTimeout(() => {
            this.updateStyles();
            
            setTimeout(() => {
                $movingSlide.removeClass('specials-slider__slide_moving');
                
                this.applySlideStyles($movingSlide, $slides.length - 1);

                this._isSliding = false;
            }, TRANSITION_DURATION);
        }, TRANSITION_DURATION);
    },
};

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the specials slider module.
 * @return true
 */
export const initModule = function() {
    $('.specials-slider').each(function() {
        const $slider    = $(this);
        const $slides    = $slider.find('.specials-slider__slide');
        const $prevArrow = $slider.find('.specials-slider__arrow_dir_prev');
        const $nextArrow = $slider.find('.specials-slider__arrow_dir_next');

        const slider = Object.create(sliderProto);

        slider._$slides     = $slides;
        slider._isSliding   = false;
        slider._activeIndex = 0;

        const steps    = $slides.length - 1;
        slider._params = {
            dOffset  : GUTTER_WIDTH / steps,
            dOpacity : (1 - MIN_OPACITY) / steps,
            dScale   : (1 - MIN_SCALE) / steps,
        };

        $prevArrow.click(slider.prevSlide.bind(slider));
        $nextArrow.click(slider.nextSlide.bind(slider));

        slider.updateStyles();
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------