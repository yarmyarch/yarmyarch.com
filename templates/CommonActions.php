<?php
/** required param:
*@param actionMeta get_meta function for example get_comment_meta.
*@param actionId just the id, for example post_id.
*/
?>

<div class="<?php
    $uid = session_id();
    preg_match("/\d+/", $actionId, $curid);
    $curid = $curid[0];
    
    $upList = $actionMeta($curid, "upUserList", 1);
    $downList = $actionMeta($curid, "downUserList", 1);
    $upList = ($upList == null ? array() : $upList);
    $downList = ($downList == null ? array() : $downList);
    $upVoted = 0;
    $downVoted = 0;
    
    if (in_array($uid, $upList)) {
        echo " voted";
        $upVoted = 1;
    }
    if (in_array($uid, $downList)) {
        echo " voted";
        $downVoted = 1;
    }
?>">
    <div class="article_action action_down<?php if ($downVoted) echo " active"; ?>" title="<?php _e("去他妈个蛋", "yarmyarch"); ?>" id="articleActionDown_<?php echo $actionId; ?>">
    <?php 
    
        _e("踩", "yarmyarch"); 
        $actionCount = $actionMeta($curid, "down", true);
        if ($actionCount != 0){
            echo("({$actionCount})");
        }
    ?></div>
    <div class="article_action action_up<?php if ($upVoted) echo " active"; ?>" title=<?php _e("好顶赞", "yarmyarch"); ?> id="articleActionUp_<?php echo $actionId; ?>">
    <?php 
        _e("顶", "yarmyarch"); 
        $actionCount = $actionMeta($curid, "up", true);
        if ($actionCount != 0){
            echo("({$actionCount})");
        }
    ?></div>
</div>
<div class="clear"></div>