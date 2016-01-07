function goBack(page){
	window.content.switchTo(page, null, {
        "action": "backward"
    });
}

var upDownS = function(){
	var order = $(this.element).attr("order");
	var hg = parseInt($(window).height()) - 107;

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
	if($(this.element).hasClass("up")){
		$(".header-nav-box p.header-nav").find(".header-optionBox").each(function(){
			if(parseInt($(this).css("height") ) > 0){
				$(this).animate({ height : "0px"},200)
			}
		});
		$(this.element).removeClass("up");
		return;
	}

	//如果点击非打开的按钮
	$(".header-nav-box p.header-nav").each(function(){
		if($(this).hasClass("up")){
			$(this).removeClass("up");
		}
	});

	$(".header-nav-box p.header-nav").find(".header-optionBox").each(function(){
		if(parseInt($(this).css("height") ) > 0){
			$(this).animate({ height : "0px"},200);
		}
	});
	console.log(hg);
	$(this.element).find(".header-optionBox").animate({
		height : hg
	},200);


	$(this.element).addClass("up");
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
		})(event);

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

// 暴露函数
module.exports = {
   "goBack"  : goBack,
	 "upDownS" : upDownS,
	 "checkFil": checkFil
};
