<?php

/*
 Template Name: cycling
 */
 
get_header();?>

<div class="content" id="content">
    <div class="article-wrap" id="articleWrap">
    <?php
        // Only generate posts from category about cycling.
        global $postHandler;
        global $curCategory;
        
        $curCategory = "cycling";
        $postId = isset($_GET["p"]) ? preg_replace("/\D/", "", $_GET["p"]) : -1;

        $postInfo = $postHandler->load($curCategory, $postId);
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