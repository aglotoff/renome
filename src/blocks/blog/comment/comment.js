/**
 * @file Implementation of the comment block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the comment module.
 * @return true
 */
export const initModule = function() {
    const $commentForm = $('#comment-form');
    const $page        = $('.page');

    $('.comment__reply-btn').click(function() {
        const id = $(this).closest('.comment').data('id');
    
        $commentForm
            .prependTo($(this)
                .closest('.comment')
                .find('.comment__replies')
                .first());
    
        $page.trigger('comment-reply', id);
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
