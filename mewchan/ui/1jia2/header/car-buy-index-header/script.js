function goBack(page){
	window.content.switchTo(page, null, {
        "action": "backward"
    });
}

var upDownS = function(){
	//遍历是否有动画
	var animated = false;
	$(".header-nav p").find(".header-optionBox").each(function(){
		if($(this).is(":animated")){
			animated = true;
			return;
		}
	});
	if(animated){return;}

	// 如果点击了打开的按钮
	if($(this.element).hasClass("up")){
		$(".header-nav p").find(".header-optionBox").each(function(){
			if(parseInt($(this).css("height") ) > 0){
				$(this).animate({ height : "0px"})
			}
		});
		$(this.element).removeClass("up");
		return;
	}

	//如果点击非打开的按钮
	$(".header-nav p").each(function(){
		if($(this).hasClass("up")){
			$(this).removeClass("up");
		}
	})

	$(".header-nav p").find(".header-optionBox").each(function(){
		if(parseInt($(this).css("height") ) > 0){
			$(this).animate({ height : "0px"})
		}
	});
	$(this.element).find(".header-optionBox").animate({
		height : "300px"
	});


	$(this.element).addClass("up");
}

// 暴露函数
module.exports = {
   "goBack" : goBack,
	 "upDownS": upDownS
};
