<!DOCTYPE html>
<head>
    <title><?php
    // global configurations
    
    // steps changing decorations : 
    // 1. all.js;
    // 2. all.css;
    // 3. TemplateFilter.php.
    global $decorationId;
    $decorationId = 2;
    
	// Add the blog name.
	bloginfo( 'name' );
?></title>
<?php
    // generate keywords and descriptions if it's a page for post/category.
    global $wp_query;
    
    if (isset($wp_query->query["category_name"])) {
        $description = $wp_query->queried_object->category_description;
    } elseif ($postId = $wp_query->query["p"]) {
        $description = $wp_query->queried_object->post_excerpt;
        if (!$description) $description = mb_substr(strip_tags($wp_query->queried_object->post_content),0,220);
        
        // generate tags
        $tags = wp_get_post_tags($postId);
        foreach ($tags as $tag ) {
            $keywords = $keywords . $tag->name . ", ";
        }
    }
    if (!$description) {
        $description = __("竹杖芒鞋轻胜马，一蓑烟雨任平生——扣钉骑士", "yarmyarch");
    }
    if (!$keywords) {
        $keywords = __("骑行, 扣钉骑士, web前端, yarmyarch, Luo Yujia", "yarmyarch");
    }
    if (isset($wp_query->query["category_name"])) {
        $keywords .= ", ".$wp_query->queried_object->name.", ".$wp_query->queried_object->slug;
    }
?>
    <meta name="keywords" content="<?php echo $keywords; ?>" />
    <meta name="description" content="<?php echo $description; ?>" />
    <meta name="author" content="<?php _e("扣钉骑士, yarmyarch@live.cn", "yarmyarch"); ?>" />
    
    <meta property="qc:admins" content="364547601251123063757" />
    <meta property="wb:webmaster" content="6bbf68df0653642c" />
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'template_directory', 'display' ); ?>/asset/css/all.css" />
<noscript>
    <link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'template_directory', 'display' ); ?>/src/css/noscript.css" />
</noscript>
<?php 
    
    wp_head();
    
    // some initializations here.
    do_action("yar_header");
    
    global $globalUtils;
?>
</head>
<body <?php body_class(); ?>>
<div id="show">
    <div class="show_wrap">
    <?php 
        include("decoration/t_{$decorationId}/index.php");
    ?>
    </div>
</div>
<div id="mainWrap">
    <div class="header">
        <div class="head_title"><?php bloginfo( 'name' ); wp_title( '|', true, 'left' ); ?></div>
        <div class="talking_wrap" id="headerTalking">
            <a class="talking_content" href="<?php echo get_category_link($globalUtils->getCategoryBySlug("talking")); ?>" title="<?php 
    $post = $globalUtils->getPostsByCategoryName("talking");
    $post = $post[0];
    $talkingContent = str_replace(']]>', ']]&gt;', apply_filters('the_content', $post->post_content));
    echo $talkingContent;
?>"><?php echo $talkingContent; ?></a>
            <div class="talking_stuff">
                <div class="talking_weather"></div>
                <a href="http://yarmyarch.com/feed/" target="_blank" title="<?php _e("订阅扣钉骑士的骑行日记", "yarmyarch"); ?>"><img id="signature" alt="<?php _e("扣钉骑士", yarmyarch) ?>"></a>
            </div>
        </div>
        <?php wp_nav_menu( array( 'container_class' => 'nav', 'theme_location' => 'primary', "before" => "<div class='menu-bg'></div>" ) ); ?>
        <div class="bicycle_wrap" id="headerBicycle">
            <img class="bicycle" id="h_bicycle" />
            <img class="wheel_1" id="h_wheel_1" />
            <img class="wheel_2" id="h_wheel_2" />
        </div>
    </div>