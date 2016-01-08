var initPage = function () {
    this.page.$(".car-show-box").css({
        "width" : $(window).width() + "px",
        "height": $(window).width()* 0.56
    });
};

var animate = function () {
	            var offset = -this.page.$(window).width();
                var list = $(".image-list");
                var len = 4;
                var left = parseInt(list.css('left')) + offset;
                var thisElement = $(this.element);
                var winWidth = $(window).width();
                

                if (offset>0) {
                    offset = '+=' + offset;
                }
                else {
                    offset = '-=' + Math.abs(offset);
                }
                list.animate({'left': offset}, 300, function () {

                    if(left > 0){
                        list.css('left', -600 * len);
                    }else if(left < (-winWidth * len)) {
                        list.css('left', 0);
                    }
                });
                console.log(thisElement.attr("alt"));
                console.log(list.css("left"));
                console.log(-winWidth*len);
                // if(thisElement.attr("alt") == 3){
                // 	list.css("left","0");
                // }
            }
// 暴露函数
module.exports = { 
	"initPage" : initPage,
	"animate"  : animate
};
