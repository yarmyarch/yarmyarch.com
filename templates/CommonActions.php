<?php
/** required param:
*@param actionMeta get_meta function for example get_comment_meta.
*@param actionId just the id, for example post_id.
*/
?>

<div class="article_action action_down" title="<?php _e("去他妈个蛋", "yarmyarch"); ?>" id="articleActionDown_<?php echo $actionId; ?>">
<?php 
    _e("踩", "yarmyarch"); 
    $actionCount = $actionMeta($actionId, "down", true);
    if ($actionCount != 0){
        echo("({$actionCount})");
    }
?></div>
<div class="article_action action_up" title=<?php _e("好顶赞", "yarmyarch"); ?> id="articleActionUp_<?php echo $actionId; ?>">
<?php 
    _e("顶", "yarmyarch"); 
    $actionCount = $actionMeta($actionId, "up", true);
    if ($actionCount != 0){
        echo("({$actionCount})");
    }
?></div>
<div class="clear"></div>