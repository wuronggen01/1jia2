
var check = function(){
    if($(this.element).hasClass("checked")){
      $(this.element).removeClass("checked");
      return
    }
    $(this.element).addClass("checked");
}

var cleanUp = function(){
  $(".car-ownerDis-Labels p").each(function(){
    if($(this).hasClass("checked")){
      $(this).attr("class","");
    }
  });
}

// 暴露函数
module.exports = {
   "check"   :  check,
   "cleanUp"  :  cleanUp
};
