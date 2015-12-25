
var menuSwitch = function(page) {
    window.content.switchTo(page, null, {
        "action": "forward"
    });
}

// 暴露函数
module.exports = { 
   "menuSwitch":menuSwitch
};
