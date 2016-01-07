function goBack(page){
	window.content.switchTo(page, null, {
        "action": "backward"
    });
}
// 暴露函数
module.exports = { 
   "goBack" : goBack
};
