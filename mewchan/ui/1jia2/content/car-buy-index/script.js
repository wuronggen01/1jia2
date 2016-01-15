var initPage = function () {
    this.page.$(".car-show-box").css({
        "width" : $(window).width() + "px",
        "height": $(window).width()* 0.56
    });
    this.page.$(".image-list").css("left",-$(window).width());
};

var animate = function () {
	            var offset = -this.page.$(window).width();
                var list = $(this.element).parent();
                var len = 4;
                var left = parseInt(list.css('left')) + offset;
                var thisElement = $(this.element);
                var winWidth = $(window).width();
                var alt = thisElement.attr("alt");

                if($(".image-list").is(":animated")){
                    console.log("没动");
                    return;
                }
                console.log("动了");

                if(alt == 4){
                    alt = 1
                }else{
                    alt ++;
                }

                if (offset>0) {
                    offset = '+=' + offset;
                }
                else {
                    offset = '-=' + Math.abs(offset);
                }
                list.animate({'left': offset}, 300, function () {
                    if(left >= 0){
                        list.css('left', -$(window).width() * len);
                    }else if(left < (-winWidth * len)) {
                        list.css('left', -$(window).width());
                    }
                });
                // console.log(thisElement.attr("alt"));
                // console.log(list.css("left"));
                // console.log(-winWidth*len);
                // if(thisElement.attr("alt") == 3){
                // 	list.css("left","0");
                // }
                thisElement.parent().parent().find(".buttons-wrapper span").each(function(){
                    if($(this).hasClass("on")){
                        $(this).removeClass("on");
                    }
                });
                thisElement.parent().parent().find(".buttons-wrapper span").each(function(){
                    if($(this).attr("index") == alt){
                        $(this).addClass("on");
                    }
                });
            }
// 暴露函数
module.exports = { 
	"initPage" : initPage,
	"animate"  : animate
};
