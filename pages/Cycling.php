<?php

/*
 Template Name: cycling
 */
 
get_header();?>

<div class="content" id="content">
    <div class="article-wrap">
    <?php
    
        // Only generate posts from category about cycling.
        $posts = $globalUtils->getPostsByCategoryName("cycling");
        foreach($posts as $post) {
            include(dirname(__FILE__)."/../templates/Article.php");
        }
    ?>
    </div>
    <?php 
        include(dirname(__FILE__)."/../sidebar.php");
    ?>
    <div class="clear"></div>
</div>

<?php get_footer(); ?>