var onRightButtonClick = function () {
    this.storyboard.onRightButtonClick();
}

var onLeftButtonClick = function () {
    this.storyboard.onLeftButtonClick();
}

// 暴露函数
module.exports = { 
    "onRightButtonClick": onRightButtonClick,
    "onLeftButtonClick": onLeftButtonClick
};
