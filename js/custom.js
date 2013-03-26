$(window).load(init_main);


function init_main() {
    // nav
    $('.nav>li>a').eq(0).click(function(){
        if(!($('.nav-collapse.inner').hasClass('in'))){
            $('nav-drop-back').animate({
                top: 0
            }, 300, function() {
                // Animation complete.
            });
        }

    });
}


