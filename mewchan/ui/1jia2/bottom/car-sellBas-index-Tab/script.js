
var loadData = function(data, callback)
{
   
}

var initPage = function () {
 
};

var didEnterForestage = function () {

};

var leaveForestage = function () {
    
};

var destroyPage = function () {

};


var menuSwitch = function(page) {
    window.content.switchTo(page, null, {
        "action": "forward"
    });
}


// 暴露函数
module.exports = {  
    "initPage": initPage,
    "didEnterForestage": didEnterForestage,
    "leaveForestage": leaveForestage,
    "destroyPage": destroyPage,
    "menuSwitch":menuSwitch
};
