<?php
get_header();?>

<div class="content" id="content">
    <div class="article-wrap">
    <?php
        // should generate posts in all categories with ajax, and a main picture at the home page.
        $posts = get_posts(array('category__not_in' => array($globalUtils->getCategoryBySlug("talking")->term_id)));
        $postCount = 0;
        global $yarConfig;
        foreach($posts as $post) {
            ++$postCount;
            include("templates/Article.php");
            
            // load limited post only.
            if ($postCount >= $yarConfig.POST_PER_REQ) break;
        }
    ?>
    </div>
    <?php 
        include(dirname(__FILE__)."/sidebar.php");
    ?>
    <div class="clear"></div>
</div>
    
<?php get_footer(); ?>