<?php

/*
 Template Name: talking
 */
 
get_header();?>

<div class="content" id="content">
    <div class="article-wrap" id="articleWrap">
    <?php
        // Only generate posts from category about talking.
        global $postHandler;
        global $curCategory;
        
        $curCategory = "talking";
        
        $postInfo = $postHandler->load($curCategory);
        echo $postInfo["contents"];
        // posts for sidebar
        $posts = $postInfo["posts"];
    ?>
    </div>
    <?php 
        include(dirname(__FILE__)."/../sidebar.php");
    ?>
    <div class="clear"></div>
</div>
    
<?php get_footer(); ?>