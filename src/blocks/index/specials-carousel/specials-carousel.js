/**
 * Specials Slider
 */
(function($) {
    const GUTTER_WIDTH = 25;
    const MIN_OPACITY = 0.5;
    const MIN_SCALE = 0.8;
    const TRANSITION_DURATION = 250;

    $('.specials-carousel').each(function() {
        const $carousel = $(this);

        let isSliding = false;
        
        function updateStyles() {
            const $slides = $('.specials-carousel__slide', $carousel)
                .not('.specials-carousel__slide_ghost');

            const steps = $slides.length - 1;
            const dOffset = GUTTER_WIDTH / steps;
            const dOpacity = (1 - MIN_OPACITY) / steps;
            const dScale = (1 - MIN_SCALE) / steps;

            $slides.css({
                left: (i) => ((i * dOffset) + '%'),
                opacity: (i) => (1 - (i * dOpacity)),
                transform: (i) => `scale(${1 - (i * dScale)})`,
                zIndex: (i) => ($slides.length - i),
            });
        }

        updateStyles();

        $('.specials-carousel__arrow_dir_prev', $carousel).click(function() {
            if (isSliding) {
                return;
            }

            isSliding = true;

            const $slides = $('.specials-carousel__slide', $carousel);
            const $first = $slides.first();
            const $last = $slides.last();

            const $ghost = $last.clone();
            $ghost.addClass('specials-carousel__slide_ghost');
            
            $last
                .addClass('specials-carousel__slide_hidden')
                .addClass('specials-carousel__slide_active');
            $first.removeClass('specials-carousel__slide_active');
            
            $ghost.insertAfter($last);
            $last.insertBefore($first);

            updateStyles();

            // The following code must be executed on the next tick to allow
            // smooth animation of repositioned slides.
            setTimeout(function() {
                $ghost.addClass('specials-carousel__slide_hidden');
                $last.removeClass('specials-carousel__slide_hidden');
                
                // After animation completes, remove the "ghost" slide and
                // enable new click events.
                setTimeout(function() {
                    $ghost.remove();
                    isSliding = false;
                }, TRANSITION_DURATION - 50);
            }, 50);
        });

        $('.specials-carousel__arrow_dir_next', $carousel).click(function() {
            if (isSliding) {
                return;
            }

            isSliding = true;

            const $slides = $('.specials-carousel__slide', $carousel);
            const $first = $slides.first();
            const $second = $slides.eq(1);
            const $last = $slides.last();
            
            $first.removeClass('specials-carousel__slide_active');
            $second.addClass('specials-carousel__slide_active');
            
            const $ghost = $first.clone();
            $ghost.addClass('specials-carousel__slide_ghost');
            $first.addClass('specials-carousel__slide_hidden');
            
            $ghost.insertBefore($first);
            $first.insertAfter($last);

            updateStyles();
            
            // The following code must be executed on the next tick to allow
            // smooth animation of repositioned slides.
            setTimeout(function() {
                $ghost.addClass('specials-carousel__slide_hidden');
                $first.removeClass('specials-carousel__slide_hidden');

                // After animation completes, remove the "ghost" slide and
                // enable new click events.
                setTimeout(function() {
                    $ghost.remove();
                    isSliding = false;
                }, TRANSITION_DURATION - 50);
            }, 50);
        });
    });
})($);
