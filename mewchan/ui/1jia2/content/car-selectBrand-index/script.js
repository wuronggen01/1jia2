var openCheckModel = function(){
	var thisElement = $(this.element);
	$(".selectBrand-film").css("display","block");
	thisElement.find(".brand-models-box").animate({
        width: 250
	},300,function(){
		$(this).addClass("modelsBox-on");
	});
	$(".check-anchor").animate({"right":"-10px"},200);
	$(".wrapper").css("overflow-y","hidden");
}

var closeCheckModel = function(){
	var thisElement = $(this.element);
	$(".modelsBox-on").animate({
		width: 0
	},300,function(){
		$(this).removeClass("modelsBox-on");
		thisElement.css("display","none");
	});

	$(".check-anchor").animate({"right":"10px"},200);
	$(".wrapper").css("overflow-y","auto");
}

var checkModel = function(){
	var thisElement = $(this.element);
	thisElement.parent().find(".models-wrapper").each(function(){
		if($(this).hasClass("checked")){
			$(this).removeClass("checked");
		}
	});
	thisElement.addClass("checked");
}

var initPage = function () {
    
    this.page.$(".wrapper").css("height",$(window).height()-64);
    
};

// 暴露函数
module.exports = { 
   "openCheckModel" : openCheckModel,
   "closeCheckModel": closeCheckModel,
   "checkModel"     : checkModel,
   "initPage"       : initPage
};
