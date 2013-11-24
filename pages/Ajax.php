<?php

/*
 Template Name: ajax
 */

$request = ($_SERVER['REQUEST_METHOD'] == "POST") ? $_POST : $_GET;
if (!empty($_SESSION["yar_df_tick"]) && !empty($request["a"])) {

    global $yarAjaxHandlers;
    
    function ajaxErrorHandler($message, $title = '', $args = array()) {
    
        $r = wp_parse_args($args, $defaults);
        $have_gettext = function_exists('__');
        
        if ( function_exists( 'is_wp_error' ) && is_wp_error( $message ) ) {
            if ( empty( $title ) ) {
                $error_data = $message->get_error_data();
                if ( is_array( $error_data ) && isset( $error_data['title'] ) )
                    $title = $error_data['title'];
            }
            $errors = $message->get_error_messages();
            switch ( count( $errors ) ) :
            case 0 :
                $message = '';
                break;
            case 1 :
                $message = "<p>{$errors[0]}</p>";
                break;
            default :
                $message = "<ul>\n\t\t<li>" . join( "</li>\n\t\t<li>", $errors ) . "</li>\n\t</ul>";
                break;
            endswitch;
        } elseif ( is_string( $message ) ) {
            $message = "<p>$message</p>";
        }
        
        echo json_encode(array(
            "status" => 1,
            "msg" => $message
        ));
        exit(0);
    }
    
    function ajaxErrorFilter($defaultFunction){
        
        return 'ajaxErrorHandler';
    }
    
    // add self-made error message.
    add_filter("wp_die_handler", "ajaxErrorFilter");
    
    if (is_callable(array($yarAjaxHandlers, $request["a"]))) {
        echo call_user_func(array($yarAjaxHandlers, $request["a"]), $request);
    }
} else {
    exit(0);
}

?>