function goBack(page){
	window.content.switchTo(page, null, {
        "action": "backward"
    });
}

var upDownS = function(){
	if($(this.element).hasClass("up")){
		$(this.element).removeClass("up");
		return;
	}
	$(this.element).addClass("up");

	$(".header-optionBox").slideToggle();
}

// 暴露函数
module.exports = {
   "goBack" : goBack,
	 "upDownS": upDownS
};
