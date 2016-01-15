var menuSwitch = function(page) {
    window.content.switchTo(page, null, {
        "action": "forward"
    });
}

var initPage = function(){
	this.page.$(".wrapper").css("height",$(window).height()-50);
	this.page.$(".car-inforBuy-header").css("height",$(window).width()*0.56+108);
	this.page.$(".header-information-box").css("top",$(window).width()*0.56);
}
// 暴露函数
module.exports = { 
   "menuSwitch" : menuSwitch,
   "initPage"   : initPage,
   "willEnterForestage" : function(){
   	    //pointer-events: auto;
   	    $('#header-navbar').css('pointer-events','none');
   },
   "willLeaveForestage" : function(){
   		$('#header-navbar').css('pointer-events','auto');
   }
};
