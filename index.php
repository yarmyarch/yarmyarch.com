<?php
get_header();?>

<div class="content" id="content">
    <div class="article-wrap">
    <?php
    
        // should generate posts in all categories with ajax, and a main picture at the home page.
        $posts = get_posts(array('category__not_in' => array($globalUtils->getCategoryBySlug("talking")->term_id)));
        foreach($posts as $post) {
            include("templates/Article.php");
        }
    ?>
    </div>
    <?php get_sidebar(); ?>
    <div class="clear"></div>
</div>
    
<?php get_footer(); ?>