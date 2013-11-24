<?php

/* shot code in posts */
class PostHandler {

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
}

?>