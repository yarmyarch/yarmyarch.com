<?php

/*
 Template Name: OpenApi
 *
 * The contents that displayed as an iframe which would receive the returned value from other open api login.
 */

$API_VALIDATE = array(
    "login" => array(
        "qq" => "state",
        "sina" => "state"
    )
);

$request = ($_SERVER['REQUEST_METHOD'] == "POST") ? $_POST : $_GET;
$handler = "callback";

if (!empty($request["yarType"])) {
    if (
        $request["yarType"] && 
        isset($API_VALIDATE[$request["a"]][$request["yarType"]]) && 
        ($request[$API_VALIDATE[$request["a"]][$request["yarType"]]] != $_SESSION["apiValidate"])
    ) {
        /*
        $request = array (
            "a" => $request["a"],
            "yarType" => $request["yarType"],
            "status" => "1",
            "msg" => __("登录验证失败", "yarmyarch")
        );
        */
    } else {
        // validate succeed
    }
} else {
    $request = array (
        "a" => $request["a"],
        "yarType" => $request["yarType"],
        "status" => "1",
        "msg" => __("非法的登录请求", "yarmyarch")
    );
}
?>
<!DOCTYPE html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script type="text/javascript">
    if (window.top.OpenApi) {
        window.top.OpenApi.callback(
        <?php
            echo json_encode($request);
        ?>);
    }
</script>
</head>