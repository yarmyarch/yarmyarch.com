<?php
    $postId = $post->ID;
    $category = $globalUtils->getPostCategory($postId);
    if (is_array($category)) $category = $category[0];
?>
<div class="article article_category_<?php echo $category->slug; ?>" id="article_<?php echo $postId; ?>">
    <div class="article_title" id="articleTitle_<?php echo $postId; ?>">
        <img class="article_title_img" src="<?php echo get_template_directory_uri(); ?>/imgs/cat/<?php echo $category->slug; ?>.jpg" />
        <?php
            $title = apply_filters("the_title ", $post->post_title);
        ?>
        <a id="articleLink_<?php echo $postId; ?>" class="article_title_link" href="<?php echo $post->link; ?>" title="<?php echo $title; ?>" onclick="javascript:return false;"><?php echo $title; ?></a>
        <div class="article_date">
        <?php
            echo apply_filters("the_title ", $post->post_date_gmt);
        ?>
        </div>
    </div>
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
            $actionId = "p_".$postId;
            include("CommonActions.php");
        ?>
        <div class="loading" id="commentLoading_<?php echo $postId; ?>"></div>
    </div>
</div>