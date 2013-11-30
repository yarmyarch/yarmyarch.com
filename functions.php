<?php

/**
 * Registered global objects:
 * @param globalUtils
 * @param yarAjaxHandlers
*/

error_reporting(E_ALL ^ E_NOTICE);
ini_set('display_errors', '1');

include(dirname(__FILE__)."/class/GlobalUtils.php");
include(dirname(__FILE__)."/class/PostHandler.php");
include(dirname(__FILE__)."/class/AjaxHandler.php");
include(dirname(__FILE__)."/class/TemplateFilter.php");
include(dirname(__FILE__)."/class/Controller.php");

// register session
session_name("yar_mf_tick");
session_start();

new PostHandler();
new TemplateFilter();
global $globalUtils;
global $yarAjaxHandlers;
$yarAjaxHandlers = new YarAjaxHandler();

global $yarController;
$yarController = new YarController();

// TODO:
// ###### «»︽
// ### post titles
// ### sidebar css
// how to locate permalink to each article?

// after verified : 
// templateFilter, normalHeaderAction;

?>