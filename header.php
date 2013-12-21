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
    <meta name="keywords" content="<?php _e("Luo Yujia, 骑行, 扣钉骑士, 罗誉家, 自由职业者, web前端, yarmyarch, 木之夏", "yarmyarch"); ?>" />
    <meta name="description" content="<?php _e("竹杖芒鞋轻胜马，一蓑烟雨任平生——扣钉骑士", "yarmyarch"); ?>" />
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