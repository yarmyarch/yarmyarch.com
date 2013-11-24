<?php

/*
 Template Name: yarWheelOfFortune
 */

get_header( 'buddypress' ); 
?>

<style type="text/css">
    .winner{
        font-size:48px;position:absolute;top:45%; height:48px; line-height:48px; overflow:hidden;
    }
    .dot {
        -webkit-animation-name: ani-dot;
        -webkit-animation-timing-function: linear;
        -webkit-animation-iteration-count: infinite;
        -webkit-animation-duration: 1s;
        
        opacity:0;
    }
    @-webkit-keyframes ani-dot {
        0%  {   width:16px; opacity:1; }
        33%  {   width:32px; opacity:1; }
        66%  {   width:48px; opacity:1; }
        100%  {   width:16px; opacity:1; }
    }
    .appear {
        -webkit-animation-name: ani-appear-1;
        -webkit-animation-timing-function: ease-out;
        -webkit-animation-iteration-count: 1;
        -webkit-animation-duration: 0.4s;
        
        -moz-animation-name: ani-appear-1;
        -moz-animation-timing-function: ease-out;
        -moz-animation-iteration-count: 1;
        -moz-animation-duration: 0.4s;
        
        -ms-animation-name: ani-appear-1;
        -ms-animation-timing-function: ease-out;
        -ms-animation-iteration-count: 1;
        -ms-animation-duration: 0.4s;
        
        -o-animation-name: ani-appear-1;
        -o-animation-timing-function: ease-out;
        -o-animation-iteration-count: 1;
        -o-animation-duration: 0.4s;
        
        animation-name: ani-appear-1;
        animation-timing-function: ease-out;
        animation-iteration-count: 1;
        animation-duration: 0.4s;
    }
    
    @-webkit-keyframes ani-appear-1 {
        0%      { 
            opacity:0; 
            -webkit-transform:scale(0); 
        }
        50%    { 
            opacity:0.5; 
            -webkit-transform:scale(1.2); 
        }
        75%    { 
            opacity:0.8; 
            -webkit-transform:scale(0.7); 
        }
        100%    { 
            opacity:1; 
            -webkit-transform:scale(1); 
        }
    }
    
    @-moz-keyframes ani-appear-1 {
        0%      { 
            opacity:0; 
            -moz-transform:scale(0); 
        }
        50%    { 
            opacity:0.5; 
            -moz-transform:scale(1.2); 
        }
        75%    { 
            opacity:0.8; 
            -moz-transform:scale(0.7); 
        }
        100%    { 
            opacity:1; 
            -moz-transform:scale(1); 
        }
    }
    @-ms-keyframes ani-appear-1 {
        0%      { 
            opacity:0; 
            -ms-transform:scale(0); 
        }
        50%    { 
            opacity:0.5; 
            -ms-transform:scale(1.2); 
        }
        75%    { 
            opacity:0.8; 
            -ms-transform:scale(0.7); 
        }
        100%    { 
            opacity:1; 
            -ms-transform:scale(1); 
        }
    }
    @-o-keyframes ani-appear-1 {
        0%      { 
            opacity:0; 
            -o-transform:scale(0); 
        }
        50%    { 
            opacity:0.5; 
            -o-transform:scale(1.2); 
        }
        75%    { 
            opacity:0.8; 
            -o-transform:scale(0.7); 
        }
        100%    { 
            opacity:1; 
            -o-transform:scale(1); 
        }
    }
    @keyframes ani-appear-1 {
        0%      { 
            opacity:0; 
            transform:scale(0); 
        }
        50%    { 
            opacity:0.5; 
            transform:scale(1.2); 
        }
        75%    { 
            opacity:0.8; 
            transform:scale(0.7); 
        }
        100%    { 
            opacity:1; 
            transform:scale(1); 
        }
    }
</style>

<?php if ( have_posts() ) while ( have_posts() ) : the_post();
    the_content();
endwhile; ?>

<script type="text/javascript">
    YarWof.onWinner(function(winnerName) {
        var winnerLink = document.getElementById("WinnerLink");
        winnerLink.innerHTML = winnerName;
        winnerLink.title = winnerName;
        winnerLink.href = "/members/" + winnerName + "/profile";
        
        document.getElementById("Dot").style.display = "none";
        document.getElementById("Winner").style.display = "block";
    });
</script>
<?php //~ get_sidebar( 'buddypress' ); ?>
<?php get_footer( 'buddypress' ); ?>
