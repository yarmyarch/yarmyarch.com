<?php
get_header();?>

<div class="content" id="content">
    <div class="article-wrap" id="articleWrap">
    <?php
        // should generate posts in all categories with ajax, and a main picture at the home page.
        global $postHandler;
        global $wp_query;
        
        $postInfo = $postHandler->load("", $wp_query->post->ID);
        echo $postInfo["contents"];
        // posts for sidebar
        $posts = $postInfo["posts"];
    ?>
    </div>
    <?php 
        include(dirname(__FILE__)."/sidebar.php");
    ?>
    <div class="clear"></div>
</div>
    
<?php get_footer(); ?>