/**
 * @file Implementation of specials carousel block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const GUTTER_WIDTH        = 25;
const MIN_OPACITY         = 0.5;
const MIN_SCALE           = 0.8;
const TRANSITION_DURATION = 250;

class SpecialsCarousel {
    constructor($elem) {
        this.$elem     = $elem;
        this.isSliding = false;

        $('.specials-carousel__arrow_dir_prev', $elem)
            .click(this.prevSlide.bind(this));
        $('.specials-carousel__arrow_dir_next', $elem)
            .click(this.nextSlide.bind(this));

        this.updateStyles();
    }

    updateStyles() {
        const $slides = this.$elem
            .find('.specials-carousel__slide')
            .not('.specials-carousel__slide_ghost');

        const steps    = $slides.length - 1;
        const dOffset  = GUTTER_WIDTH / steps;
        const dOpacity = (1 - MIN_OPACITY) / steps;
        const dScale   = (1 - MIN_SCALE) / steps;

        $slides.css({
            left      : (i) => ((i * dOffset) + '%'),
            opacity   : (i) => (1 - (i * dOpacity)),
            transform : (i) => `scale(${1 - (i * dScale)})`,
            zIndex    : (i) => ($slides.length - i),
        });
    }

    prevSlide() {
        if (this.isSliding) {
            return;
        }
        this.isSliding = true;

        const $slides = $('.specials-carousel__slide', this.$elem);
        if ($slides.length < 2) {
            return;
        }

        const $first = $slides.first();
        const $last  = $slides.last();

        const $ghost = $last.clone();
        $ghost.addClass('specials-carousel__slide_ghost');
        
        $last
            .addClass('specials-carousel__slide_hidden')
            .addClass('specials-carousel__slide_active');
        $first.removeClass('specials-carousel__slide_active');
        
        $ghost.insertAfter($last);
        $last.insertBefore($first);

        this.updateStyles();

        // The following code must be delayed in order to allow for smooth 
        // animation of the repositioned slides
        setTimeout(() => {
            $ghost.addClass('specials-carousel__slide_hidden');
            $last.removeClass('specials-carousel__slide_hidden');
            
            // After animation completes, remove the "ghost" slide and
            // enable new click events
            setTimeout(() => {
                $ghost.remove();
                this.isSliding = false;
            }, TRANSITION_DURATION - 50);
        }, 50);
    }

    nextSlide() {
        if (this.isSliding) {
            return;
        }
        this.isSliding = true;

        const $slides = $('.specials-carousel__slide', this.$elem);
        if ($slides.length < 2) {
            return;
        }

        const $first  = $slides.first();
        const $second = $slides.eq(1);
        const $last   = $slides.last();
        
        $first.removeClass('specials-carousel__slide_active');
        $second.addClass('specials-carousel__slide_active');
        
        const $ghost = $first.clone();
        $ghost.addClass('specials-carousel__slide_ghost');
        $first.addClass('specials-carousel__slide_hidden');
        
        $ghost.insertBefore($first);
        $first.insertAfter($last);

        this.updateStyles();
        
        // The following code must be delayed in order to allow for smooth 
        // animation of the repositioned slides
        setTimeout(() => {
            $ghost.addClass('specials-carousel__slide_hidden');
            $first.removeClass('specials-carousel__slide_hidden');

            // After animation completes, remove the "ghost" slide and
            // enable new click events
            setTimeout(() => {
                $ghost.remove();
                this.isSliding = false;
            }, TRANSITION_DURATION - 50);
        }, 50);
    }
}
// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the specials carousel module.
 * @return true
 */
export const initModule = function() {
    $('.specials-carousel').each(function() {
        new SpecialsCarousel($(this));
    });
};
// ---------------------------- END PUBLIC METHODS ----------------------------