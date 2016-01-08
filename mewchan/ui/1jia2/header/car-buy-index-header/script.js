var goBack = function(page){
	window.content.switchTo(page, null, {
        "action": "backward"
    });
}

var upDownS = function(){
	var order = $(this.element).attr("order");
	var hg = parseInt($(window).height()) - 107;
	var thisElement = $(this.element);

	//遍历是否有动画
	var animated = false;
	$(".header-nav-box p").find(".header-optionBox").each(function(){
		if($(this).is(":animated")){
			animated = true;
			return;
		}
	});
	if(animated){return;}

	// 如果点击了打开的按钮
	if($(this.element).parent().hasClass("up")){
		$(".header-nav-box p.header-nav").find(".header-optionBox").each(function(){
			if(parseInt($(this).css("height") ) > 0){
				$(this).animate({ height : "0px"},300,function(){
					$(".header-film").css("display","none");
				})
			}
		});
		$(this.element).parent().removeClass("up");
	    $(".check-anchor").css("display","none");
		return;
	}

	//如果点击非打开的按钮
	//先none掉check-anchor
	$(".check-anchor").css("display","none");
	// 关闭
	$(".header-nav-box p.header-nav").each(function(){
		if($(this).hasClass("up")){
			$(this).removeClass("up");
		}
	});
	var state = 0;
	
	$(".header-nav-box p.header-nav").find(".header-optionBox").each(function(){
		
		if(parseInt($(this).css("height") ) > 0){
			state =1;
			$(this).animate({ height : "0px"},300,function(){
				$(this).parent().css("display","none");
				thisElement.next().css("display","block");
		    	thisElement.parent().find(".header-optionBox").animate({
				height : hg
				},200,function(){
					$(this).parent().css("background-color","rgba(0,0,0,0.5)");
				});
			    if(order == 3){
			    	setTimeout("$('.check-anchor').css('display','block')",300);
			    }

				thisElement.parent().addClass("up");
					});
				}
	});

    //跳出film
    if(!state){
    	$(this.element).next().css("display","block");
    	$(this.element).parent().find(".header-optionBox").animate({
		height : hg
		},300,function(){
			$(this).parent().css("background-color","rgba(0,0,0,0.5)");
		});
	    if(order == 3){
	    	setTimeout("$('.check-anchor').css('display','block')",300);
	    }

		$(this.element).parent().addClass("up");
    }
	
}

var checkFil = function(){
	//去除事件冒泡
	(function(event){
		 e = event || window.event;
		 if(e && e.stopPropagation){
			 e.stopPropagation();
		  }else{
				e.cancelBubble = true;
				return flase;
			}
		})();

	/*点击选中*/
	//先遍历去除
	$(".header-optionBox p.header-filterK").each(function(){
		if($(this).hasClass("checked")){
			$(this).removeClass("checked");
		}
	});
	//选中addClass
	$(this.element).addClass("checked");
}

var scrollAnchor= function(n){
    document.body.scrollTop = n;
}

// 暴露函数
module.exports = {
   "goBack"  : goBack,
	 "upDownS" : upDownS,
	 "checkFil": checkFil,
	 "scrollAnchor": scrollAnchor
};
