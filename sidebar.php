<?php
/**
 *@param $categories
 *@param $posts
 */
?>
<div class="sidebar" id="sidebar">
    <div class="sidebar_content">
    <?php
    // them by categories->monthes->posts.
    
    $layeredMenu;
    $group;
    $category;
    
    // grouped by monthes
    foreach ($posts as $post) {
    
        // current post, if post id then given post, or the first post in each group.
        preg_match("/\d{4}-\d{2}/", $post->post_date, $group);
        $group = $group[0];
        $category = $globalUtils->getPostCategory($post->ID);
        if (is_array($category)) $category = $category[0];
        
        if (!isset($layeredMenu[$category->slug])) {
            $layeredMenu[$category->slug] = array(
                "id" => "sideCategory_".$category->slug,
                "title" => $category->name,
                "link" => get_category_link($category->cat_ID),
                "groups" => array()
            );
        }
        if (!isset($layeredMenu[$category->slug]["groups"][$group])) {
            $layeredMenu[$category->slug]["groups"][$group] = array(
                "id" => $group."_".$category->cat_ID,
                "title" => $group,
                // page to the first post of this group.
                "link" => $post->link,
                "posts" => array()
            );
        }
        array_push($layeredMenu[$category->slug]["groups"][$group]["posts"], array(
            // give it a post id for locating.
            "id" => "sidePost_".$post->ID,
            "title" => htmlspecialchars($post->post_title),
            "link" => $post->link
        ));
    }
    
    foreach ($layeredMenu as $category) {
        
        ?>
        <a href="<?php echo $category["link"]; ?>" class="side_menu_category" id="<?php echo $category["id"]; ?>" title="<?php echo $category["title"]; ?>"><?php echo $category["title"]; ?></a>
        <?php
        foreach($category["groups"] as $groupId=>$group) {
            ?>
            <div class="side_group_wrap" id="sideGWrap_<?php echo $group["id"]; ?>">
                <a href="<?php echo $group["link"]; ?>" onclick="javascript:return false;" class="side_menu_group" id="t_sideGroup_<?php echo $group["id"]; ?>" title="<?php echo $group["title"]; ?>"><?php echo $group["title"]; ?></a>
                <div class="side_menu_posts" id="p_sideGroup_<?php echo $group["id"]; ?>" style="height:0;overflow:hidden;">
                <?php
                foreach($group["posts"] as $post) {
                    ?>
                    <a id="<?php echo $post["id"]; ?>" href="<?php echo $post["link"]; ?>" onclick="javascript:return false;" title="<?php echo $post["title"] ?>" class="side_post_link"><?php echo $post["title"] ?></a>
                    <?php
                }
                ?>
                </div>
            </div>
            <?php
        }
    }
    ?>
    <!--
    <?php _e("使用平台账号登录：", "yarmyarch"); ?>
    <span class="open_api_login oal_qq" name="openApiLogin" id="openApiLogin_qq"></span>
    <span class="open_api_login oal_sina" name="openApiLogin" id="openApiLogin_sina"></span>
    <span class="open_api_login oal_renren" name="openApiLogin" id="openApiLogin_renren"></span>
    -->
    </div>
    <?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
    <div id="secondary" class="widget-area sidebar_content">
        <?php dynamic_sidebar( 'sidebar-1' ); ?>
    </div>
    <?php endif; ?>
</div>