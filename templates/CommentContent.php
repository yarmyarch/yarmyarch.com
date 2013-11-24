<?php
/**
 *@param $comemnt {WP_Comment} Object.
 */
?>
<div class="comment_item">
    <div class="comment_avatar">
        <img alt="<?php 
        $authorName = htmlspecialchars($comment->comment_author);
        $authorNameWithLink = $authorName;
        if ($url = get_user_meta($comment->user_id, "url", true)) {
            $authorNameWithLink = '<a href="'.$authorNameWithLink.'" target="_blank">'.$authorName.'</a>';
        }
        echo $authorName;
    ?>" src="<?php 
        if (!$avatarLink = get_user_meta($comment->user_id, "avatar_miduim", true)) {
            // use the blank avatar here.
            echo get_template_directory_uri().'/imgs/avatar.gif" style="box-shadow:none;"';
        } else {
            echo $avatarLink;
        }
    ?>" />
    </div>
    <div class="comment_content">
        <div class="comment_text">
            <?php
                echo apply_filters( 'get_comment_text', $comment->comment_content, $comment );
            ?>
        </div>
        <div class="comment_info">
            <?php
                echo "<b>".$authorNameWithLink."</b> @ ".apply_filters( 'get_comment_date', $comment->comment_date, $comment );
                
                $actionMeta = get_comment_meta;
                $actionId = $comment_ID;
                include(dirname(__FILE__)."/CommonActions.php");
            ?>
        </div>
    </div>
    <div class="clear"></div>
</div>