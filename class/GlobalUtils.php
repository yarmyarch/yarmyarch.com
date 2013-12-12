<?php

class GlobalUtils {
    
    private $buf;
    
    function __construct() {
    
        $this->buf = array(
            postsByCategoryName => array(),
            categoriesBySlug => array(),
            categoryByPostId => array()
        );
    }

    public function getPostsByCategoryName($name, $count = -1) {
        if (!isset($this->buf["postsByCategoryName"][$name])) {
            $posts = $this->buf["postsByCategoryName"][$name] = get_posts(array('category_name' => $name, "posts_per_page" => $count));
            
            $category = $this->getCategoryBySlug($name);
            foreach($posts as $post) {
                $this->buf["categoryByPostId"][$post->ID] = $category;
            }
        }
        return $this->buf["postsByCategoryName"][$name];
    }
    
    public function getCategoryBySlug($slug) {
        if (!isset($this->buf["categoriesBySlug"][$slug])) {
            $this->buf["categoriesBySlug"][$slug] = get_category_by_slug($slug);
        }
        return $this->buf["categoriesBySlug"][$slug];
    }
    
    public function getPostCategory($postId) {
        
        if (!isset($this->buf["categoryByPostId"][$postId])) {
            $this->buf["categoryByPostId"][$postId] = get_the_category($postId);
        }
        return $this->buf["categoryByPostId"][$postId];
    }
}

?>