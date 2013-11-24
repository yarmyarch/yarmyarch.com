<?php
/**
*@param $postId
*/
?>
<div class="comment_wrap active" id="commentWrap_<?php echo $postId; ?>">
    <div class="comment_list">
    <?php
        $comments = get_comments(array("post_id" => $postId, "order" => "ASC"));
        foreach ($comments as $comment) {
            include(dirname(__FILE__)."/CommentContent.php");
        }
    ?>
    </div>
    <div class="comment_input" id="commentInput_<?php echo $postId; ?>">
        <?php 
            $userName = __("朋友", "yarmyarch");
            if (is_user_logged_in()) {
                $user = wp_get_current_user();
                $userName = htmlspecialchars($user->display_name);
                $email = apply_filters("author_email", $user->user_email);
            }
        ?>
        Hi <span class="user_info_edit" name="userInfoEdit" id="userInfoEdit_<?php echo $postId; ?>" title="<?php _e("点击编辑个人资料", "yarmyarch"); ?>"><?php echo $userName; ?></span>, 说点什么：<br>
        <div id="userInfo_<?php echo $postId; ?>" class="user_info<?php if ($user) echo " hidden"; ?>">
            <div class="user_info_item"><?php _e("称呼：", "yarmyarch"); ?>
                <input type="text" <?php if (get_user_meta($user->ID, "apiName", true)) echo "disabled"; ?> id="userName_<?php echo $postId; ?>" name="userName" maxlength="32" value="<?php if (is_user_logged_in()) { echo $userName; } ?>" title="<?php _e("随便写个，让我知道你是谁", "yarmyarch"); ?>"/>
            </div>
            <div class="user_info_item"><?php _e("邮箱：", "yarmyarch"); ?>
                <input type="text" id="email_<?php echo $postId; ?>" name="email" maxlength="48" value="<?php echo $email; ?>" title="<?php _e("随便写个，以便紧急情况例如地球即将爆炸之前我可以给您发来最诚挚的慰问", "yarmyarch"); ?>" />
            </div>
            <!--
            <strong>或</strong>使用其他账号登录：
            <img class="open_api_login" name="openApiLogin" id="openApiLogin_qq_<?php echo $postId; ?>" src="<?php echo get_template_directory_uri()."/imgs/openapi/qqlogin.png"; ?>" />
            <img class="open_api_login" name="openApiLogin" id="openApiLogin_sina_<?php echo $postId; ?>" src="<?php echo get_template_directory_uri()."/imgs/openapi/sinalogin.png"; ?>" />
            -->
        </div>
        
        <textarea class="comment_textarea" id="content_<?php echo $postId; ?>"></textarea>
        <a class="comment_submit" title="<?php _e("点击发送 Ctrl + Enter", "yarmyarch"); ?>" id="commentSubmit_<?php echo $postId; ?>"><?php _e("点击发送 Ctrl + Enter", "yarmyarch"); ?></a>
    </div>
</div>