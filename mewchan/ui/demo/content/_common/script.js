var inputFocus = function() {
    // 发系统消息缩回键盘
    $(this.element).find('input').focus();
};

module.exports = {
    "inputFocus": inputFocus
};