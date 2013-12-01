<?php
/**
 * write session:
 * param $_SESSION["last_activity"];
 * param $_SESSION["yar_mf_tick"] session idl
 * param $_SESSION["yar_df_tick"] user id;
 */

class YarAjaxHandler {
        
    public function comment($request) {
        if (empty($request["pid"])) return;
        $postId = preg_replace("/\D/", "", $request["pid"]);
        ob_start();
        include(dirname(__FILE__)."/../templates/CommentList.php");
        $contents = ob_get_contents();
        ob_end_clean();
        
        echo json_encode(array(
            "status" => 0,
            "msg" => "",
            "content" => $contents
        ));
    }

    private function getError($message, $title = '', $args = array()) {
        return array(
            "status" => 1,
            "msg" => $message
        );
    }
    
    private function addComment($user, $comment_post_ID, $comment_content) {
    
        $post = get_post($comment_post_ID);
        $error;

        if ( empty($post->comment_status) ) {
            do_action('comment_id_not_found', $comment_post_ID);
            $error = $this->getError(__("被评论的文章未找到。", "yarmyarch"));
            return $error;
        }

        // get_post_status() will get the parent status for attachments.
        $status = get_post_status($post);

        $status_obj = get_post_status_object($status);

        if ( !comments_open($comment_post_ID) ) {
            do_action('comment_closed', $comment_post_ID);
            wp_die( __('Sorry, comments are closed for this item.') );
        } elseif ( 'trash' == $status ) {
            do_action('comment_on_trash', $comment_post_ID);
            $error = $this->getError(__("内部错误。", "yarmyarch"));
        } elseif ( !$status_obj->public && !$status_obj->private ) {
            do_action('comment_on_draft', $comment_post_ID);
            $error = $this->getError(__("内部错误。", "yarmyarch"));
        } elseif ( post_password_required($comment_post_ID) ) {
            do_action('comment_on_password_protected', $comment_post_ID);
            $error = $this->getError(__("内部错误。", "yarmyarch"));
        } else {
            do_action('pre_comment_on_post', $comment_post_ID);
        }

        if ($error["status"]) return $error;

        // force update the display name and set it into the comment info.
        $comment_author       = $user->display_name;
        $comment_author_email = $user->user_email;
        $comment_author_url   = "";
        if ( current_user_can('unfiltered_html') ) {
            if ( wp_create_nonce('unfiltered-html-comment_' . $comment_post_ID) != $_POST['_wp_unfiltered_html_comment'] ) {
                kses_remove_filters(); // start with a clean slate
                kses_init_filters(); // set up the filters
            }
        }
        
        $comment_type = '';

        if ( '' == $comment_content ) {
            wp_die( __('<strong>ERROR</strong>: please type a comment.') );
        }

        $comment_parent = isset($_POST['comment_parent']) ? absint($_POST['comment_parent']) : 0;
        $user_id = $user->ID;

        $commentdata = compact('comment_post_ID', 'comment_author', 'comment_author_email', 'comment_author_url', 'comment_content', 'comment_type', 'comment_parent', 'user_id');

        $comment_id = wp_new_comment( $commentdata );

        $comment = get_comment($comment_id);
        do_action('set_comment_cookies', $comment, $user);
        
        return array(
            "status" => 0,
            "commentId" => $comment_id,
            "comment" => $comment
        );
    }

    public function sendComment($request) {
        if (empty($request["pid"])) return;
        
        global $yarController;
        $postId = preg_replace("/\D/", "", $request["pid"]);
        $user = $yarController->validateUser($request);
        $sessionId = session_id();
        $result = array();
        $now = time();
        $currentIp;
        $commentWithIp;
        $content;
        
        if (!$user) {
            $result = array(
                "status" => 1,
                "msg" => __("抓到个胡乱翻墙的？", yarmyarch)
            );
        }
        
        // single session made double comments within 30s.
        if (!$result["status"] && ($now - $_SESSION["last_activity"] <= 30)) {
            $result = array(
                "status" => 1,
                "msg" => __("啊不行你太快了...", yarmyarch).($now - $_SESSION["last_activity"]).__("秒之后再试一把看看。", yarmyarch)
            );
        }
        
        // single ip made double comments within 30s.
        if (!$result["status"]) {
            // search for comment with the given ip.
            global $wpdb;
            $currentIp = preg_replace( '/[^0-9a-fA-F:., ]/', '',$_SERVER['REMOTE_ADDR'] );
            $commentWithIp = $wpdb->get_row("
                    SELECT UNIX_TIMESTAMP(comment_date_gmt) as time 
                    FROM {$wpdb->prefix}comments 
                    WHERE comment_author_IP='{$currentIp}' 
                    ORDER BY time DESC
                    LIMIT 1"
                , ARRAY_A
            );
            if ($commentWithIp && ($now - $commentWithIp["time"] <= 30)) {
                $result = array(
                    "status" => 1,
                    "msg" => __("啊不行你太快了...", yarmyarch).($now - $commentWithIp["time"]).__("秒之后再试一把看看。", yarmyarch)
                );
            }
        }
        
        // success.
        if (!$result["status"]) {
            $result = $this->addComment($user, $postId, $request["content"]);
            // record last activity for the next validation.
            $_SESSION["last_activity"] = time();
        }
        
        if (!$result["status"]) {
        
            $comment = $result["comment"];
            ob_start();
            include(dirname(__FILE__)."/../templates/CommentContent.php");
            $contents = ob_get_contents();
            ob_end_clean();            
        
            $result = array(
                'status' => 0,
                'msg' => "",
                'yar_mf_tick' => $sessionId,
                'yar_df_tick' => $user->id,
                'userName' => htmlspecialchars($user->display_name),
                'email' => htmlspecialchars($user->user_email),
                'content' => $contents
            );
        }
        echo json_encode($result);
        
        // update comment list in js.
    }
    
    /**
     * do the auth and other stuff.
     */
    public function callapi($request) {
        
        $url = apply_filters("yar_openapi_url", $request["url"], $request["action"], $request["type"]);
        
        // fuck sina auth2. post only...
        if ($request["method"] == "post") {
            preg_match("/(.*)?\\?/", $url, $postUrl);
            preg_match("/\\?(.*)/", $url, $postParam);
            $postUrl = $postUrl[1];
            $postParam = $postParam[1];
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $postUrl);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postParam);
            $content = curl_exec($ch);
        } else {
            $content = file_get_contents($url);
        }
        
        $content = apply_filters("yar_openapi_return", $content, $request["action"], $request["type"]);
        
        if (is_array($content)) {
            $content["status"] = 0;
            $content["a"] = $request["action"];
            $content["yarType"] = $request["type"];
            echo json_encode($content);
        } else {
            echo $content;
        }
    }
    
    /**
     * if not category given, then try to load the whole post list, but not in "talking" just as it's in index.php.
     */
    public function loadPost(id, category = "") {
        
    }
}
?>