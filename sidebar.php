<?php
/**
 *@param $posts
 */
?>
<div class="sidebar" id="sidebar">
    <?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
        <div id="secondary" class="widget-area">
            <?php dynamic_sidebar( 'sidebar-1' ); ?>
        </div>
    <?php endif; 
    /*
    foreach($posts as $post) {
    ?>
        <a href="<?php echo get_permalink($post->ID); ?>" onclick="javascript:return false;" class="side_post_link"><?php echo apply_filters('the_title', $post->post_title, $post->ID); ?></a>
    <?php
    }
    */
    ?>
    使用平台账号登录：
    <span class="open_api_login oal_qq" name="openApiLogin" id="openApiLogin_qq"></span>
    <span class="open_api_login oal_sina" name="openApiLogin" id="openApiLogin_sina"></span>
    <span class="open_api_login oal_renren" name="openApiLogin" id="openApiLogin_renren"></span>
</div>