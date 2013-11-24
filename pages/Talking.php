<?php

/*
 Template Name: talking
 */
 
get_header();?>

<div class="content" id="content">
    <div class="article-wrap">
    <?php
    
        // Only generate posts from category about talking.
        $posts = $globalUtils->getPostsByCategoryName("talking");
        foreach($posts as $post) {
            include(dirname(__FILE__)."/../templates/Article.php");
        }
    ?>
    </div>
    <?php get_sidebar(); ?>
    <div class="clear"></div>
</div>
    
<?php get_footer(); ?>