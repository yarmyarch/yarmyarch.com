<?php

/* shot code in posts */
class PostHandler {

    // image size
    public static $WIDTH = 600;
    public static $HEIGHT = 600;

    function __construct() {
        add_shortcode('postimage', array(&$this, 'scPostImageHandler' ));
        
        // enable the navigation
        register_nav_menus(array('primary' => __( 'WTF' ),)); 
        
        load_theme_textdomain( 'yarmyarch', get_template_directory() . '/languages' );
        
        register_sidebar(array(
            'before_widget' => '<div class="widgets">',
            'after_widget' => '</div>',
            'before_title' => '<div class="widget_title">',
            'after_title' => '</div>'
        ));
    }

    public function scPostImageHandler($attr) {
        
        $src = $attr["src"];
        $root = preg_replace("/\\/$/", "", $_SERVER['DOCUMENT_ROOT'])."/";
        
        if (file_exists($root."resource/upload/$src")) {
        
            $newSrc = $root."resource/bimgs/upload/".$src;
            // if not the scaled version, create it.
            if (!file_exists($newSrc)) {
                
                $info = getimagesize($root."resource/upload/".$src);
                $image = imagecreatefromjpeg($root."resource/upload/".$src);
                $rate = max((PostHandler::$WIDTH / $info[0]), PostHandler::$HEIGHT / $info[1]);
                $newWidth = $info[0] * $rate;
                $newHeight = $info[1] * $rate;
                $new_img = imagecreatetruecolor($newWidth, $newHeight);
                imagecopyresampled($new_img, $image, 0, 0, 0, 0, $newWidth, $newHeight, $info[0], $info[1]);
                
                // no water shadow required at the moment.
                //~ $bg = imagecreatefrompng($root."resource/bimgs/bg2.png");
                //~ imagesavealpha($bg, true);
                //~ imagecopymerge($new_img, $bg, 12, $newHeight - 47, 0, 0, 174, 35, 60);
                
                imagejpeg($new_img, $newSrc);
            }
            
            return '<div class="img"><img src='.home_url().'/resource/bimgs/upload/'.$src.' /></div>';
        }
        else return "";
    }
    
    public function load($categoryName = "", $id = -1) {
        global $yarConfig;
        global $globalUtils;
        
        if (!$categoryName) {
            $posts = get_posts(array('category__not_in' => array($globalUtils->getCategoryBySlug("talking")->term_id)));
        } else {
            $posts = $globalUtils->getPostsByCategoryName($categoryName);
        }
        
        $posts = apply_filters("yar_load_posts", $posts, $id, $categoryName);
        
        // limited post count
        $postCount = 0;
        // start from given index, count $yarConfig.POST_PER_REQ posts returned.
        $start = 0;
        $contents = array();
        
        // genenrate html code from template file.
        ob_start();
        foreach($posts as $post) {
            
            // set post link.
            if (!$categoryName) {
                $post->link = get_permalink($post->ID);
            } else {
                $category = $globalUtils->getPostCategory($post->ID);
                $post->link = get_bloginfo("url")."/".$category->slug."?pid=".$post->ID;
            }
            
            // load limited post only.
            if ($postCount >= $yarConfig["POST_PER_REQ"]) continue;
            
            if ($id != -1 && $post->ID != $id && !$start) {
                continue;
            } elseif ($post->ID == $id) {
                $start = 1;
            }
        
            ++$postCount;
            
            include(dirname(__FILE__)."/../templates/Article.php");
            
            // load content to the result array
            $contents[$post->ID] = ob_get_contents();
            ob_clean();
        }
        ob_end_clean();
        
        $contents = apply_filters("yar_post_contents", $contents, $id, $categoryName);
        
        return array(
            "posts" => $posts,
            "contents" => join("", $contents),
            "contentsInArray" => $contents
        );
    }
}

?>