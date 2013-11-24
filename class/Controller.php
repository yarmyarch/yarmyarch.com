<?php

class YarController {

    
    /**
     *@param request {userName : "name", email : "email"};
     *@return user {WP_User};
     */
    public function validateUser($request) {
    
        $user;
        $request["userName"] = trim($request["userName"]);
        $request["email"] = trim($request["email"]);
        
        // if logged in, do the validation.
        if (is_user_logged_in()) {
            $user = wp_get_current_user();
            
            // validate wp and session.
            if (get_user_meta($user->ID, "yar_mf_tick", true) != session_id()) return false;
            
            // if logged in with api, ignore the newly input username.
            if ($apiName = get_user_meta($user->ID, "apiName", true)) $request["userName"] = $apiName;
        } else {
            if ( get_option('require_name_email') ) {
                if ( 6 > strlen($request["email"]) || '' == $request["userName"] ) {
                    wp_die( __('<strong>ERROR</strong>: please fill the required fields (name, email).') );
                } elseif ( !is_email($request["email"])) {
                    wp_die( __('<strong>ERROR</strong>: please enter a valid email address.') );
                }
            }
            // if the session was never used, possiblity: old user with new sesion; new user with new session,
            // otherwise, illigle visit.
            global $wpdb;
            $user = $wpdb->get_row("SELECT u.ID, u.user_email FROM {$wpdb->prefix}usermeta m LEFT JOIN {$wpdb->prefix}users u ON m.user_id=u.ID WHERE m.meta_key='yar_mf_tick' AND m.meta_value='".session_id()."'");
            if ($wpdb->num_rows) {
                if ($user->user_email != $request["email"] ) return false;
            }
            
            // auto login with email, if the user with that email found.
            if (!$user) $user = get_user_by("email", $request["email"]);
            
            // auto login with user_login, if the user was registered with the api (as privateId)
            if (!$user && $request["privateId"]) $user = get_user_by("user_login", $request["privateId"]);
            
            if ($user) {
                $user = wp_set_current_user($user->ID);
            } else {
                // otherwise register a new user.
                //~ $userId = wp_create_user($request["userName"], md5(time()), $request["email"]);
                $userId = wp_insert_user(array(
                    "user_login" => !empty($request["privateId"]) ? $request["privateId"] : md5("ul".time()), 
                    "user_pass" => md5("up".time()), 
                    "user_email" => $request["email"], 
                    "display_name" => $request["userName"]
                ));
                
                // if create failed, die.
                if (is_wp_error($userId) || !$userId->ID) {
                    wp_die( __('悲剧，内部错误。', "yarmyarch") );
                }
                update_user_meta($userId, "yar_mf_tick", session_id());
                $user = wp_set_current_user($userId);
            }
        }
        // force update user info, if valid.
        $user->display_name = $request["userName"];
        $user->user_email = $request["email"];
        wp_update_user($user);
        return $user;
    }

    public function apiLogin($request) {
    
        // set session and user info.
        if (isset($request["userName"]) && isset($request["privateId"])) {
            $email;
            if ($user = wp_get_current_user()) {
                $email = $user->user_email;
            }
            $email = $email ? $email : $request["privateId"]."@yarmyarch.com";
            $user = $this->validateUser(array("userName" => $request["userName"], "email" => $email));
            
            update_user_meta($user->ID, "privateId", $request["privateId"]);
            update_user_meta($user->ID, "apiName", $request["userName"]);
            if (isset($request["avatar_tiny"])) update_user_meta($user->ID, "avatar_tiny", $request["avatar_tiny"]);
            if (isset($request["avatar_small"])) update_user_meta($user->ID, "avatar_small", $request["avatar_small"]);
            if (isset($request["avatar_miduim"])) update_user_meta($user->ID, "avatar_miduim", $request["avatar_miduim"]);
            if (isset($request["avatar_large"])) update_user_meta($user->ID, "avatar_large", $request["avatar_large"]);
            if (isset($request["url"])) update_user_meta($user->ID, "url", $request["url"]);
            
            // set user info required for js.
            $request["yar_mf_tick"] = session_id();
            $request["yar_df_tick"] = $user->ID;
        }
        return $request;
    }
}

?>