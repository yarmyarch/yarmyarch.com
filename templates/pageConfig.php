<?php global $current_user;?>
<script type="text/javascript">
    var pageConfig = pageConfig || {};
    pageConfig.userLogged = +"<?php echo $current_user->ID; ?>";
    pageConfig.category = "<?php global $curCategory; echo $curCategory; ?>";
    pageConfig.language = {
        notNullUserName : "<?php _e("随便写个名字，让孤知道你是谁。", "yarmyarch") ?>",
        notNullEmail : "<?php _e("随便写个邮箱，以便紧急情况例如地球爆炸前夕孤能发来最诚挚的慰问。", "yarmyarch") ?>",
        notEmail : "<?php _e("严肃点，你的邮箱看起来不太正常。", "yarmyarch") ?>",
        tooShort : "<?php _e("你的...太短。", "yarmyarch") ?>",
        tooLong : "<?php _e("我靠，%d%还不够你写的啊，牛逼。", "yarmyarch") ?>",
        notNullContent : "<?php _e("随便说点啥呗。", "yarmyarch") ?>",
        clickToSend : "<?php _e("点击发送 Ctrl + Enter", "yarmyarch") ?>",
        textCount : "<?php _e("还可以输入%d%字。", "yarmyarch") ?>",
        textCountOverflow : "<?php _e("已超过字数限制%d%字。", "yarmyarch") ?>",
        unknownError : "<?php _e("怪兽袭击了服务器，奇怪的数据返huqkk012hpuh8*h98yqHYQgf7qyw*Q../;;]", "yarmyarch") ?>"
    };
</script>