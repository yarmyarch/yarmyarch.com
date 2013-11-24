<?php
    $postId = $post->ID;
    $category = $globalUtils->getPostCategory($postId);
?>
<div class="article arcitle_category_<?php echo $category->term_id; ?>" id="arcitleCategory_<?php echo $postId; ?>">
    <?php
        $content = $post->post_content;
        $content = apply_filters('the_content', $content);
        $content = str_replace(']]>', ']]&gt;', $content);
        echo $content;
    ?>
    <div class="article_action_wrap" id="arcicleActionWrap_<?php echo $postId; ?>">
        <div class="article_action action_comment<?php echo ($post->comment_status == "open" ? "" : " disabled"); ?>" id="articleAction_<?php echo $postId; ?>" title="<?php
            if ($post->comment_status == "open") {
                if ($post->comment_count == 0) {
                    $text = __("暂时没有评论，快来抢沙发！", "yarmyarch"); 
                } else {
                    $text = __("展开/关闭评论列表", "yarmyarch"); 
                }
            } else {
                $text = __("本文已关闭评论。", "yarmyarch"); 
            }
            echo $text;?>"><?php
            echo $text;
        ?>
        </div>
        <?php
            // two params required by the template.
            $actionMeta = get_post_meta;
            $actionId = $postId;
            include("CommonActions.php");
        ?>
        <div class="loading" id="commentLoading_<?php echo $postId; ?>"></div>
    </div>
</div>