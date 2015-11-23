var loadData = function(data, callback) {
	data.login = "loadData";
    callback(null, data);
};

var switchToReset = function() {
    this.storyboard.switchTo('login-resetPage');
}

var switchToRegister = function() {
    this.storyboard.switchTo('login-registerPage', {}, {
        'action': 'replace'
    });
}

// 暴露函数
module.exports = {
    "loadData": loadData,
    "switchToReset": switchToReset,
    "switchToRegister": switchToRegister
};