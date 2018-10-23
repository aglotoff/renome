/**
 * Comment Block
 */
$('.comment__reply-btn').click(function() {
    const id = $(this).closest('.comment').data('id');

    $('.comment-form')
        .removeClass('article__comment-form')
        .addClass('comment__reply-form')
        .insertAfter($(this)
            .closest('.comment')
            .find('.comment__body:first'));

    $('.page').trigger('commentReply', [id]);
});
