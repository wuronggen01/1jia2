var loadData = function(data, callback) {
    callback(null, data);
}

var sendCode = function() {

    // $.myApp.jsonrpc.login({

    // }).then(function(error, result) {

    // });

    $.myApp.josnrpc.login({

    }).test("这里跑示例");

    $.myApp.jsonrpc().then(function(result) {
        console.log(result);
    }).rejected(function(error) {
        console.log(this);
        console.log(error);
    });

};

var register = function() {

    // localStorage.lastname = "Minr";
    // console.log(localStorage.lastname);

    var obj = {
        "a": "b"
    };
    var cObj = {};

    $.extend(cObj, obj);

};

var switchToClause = function() {
    this.storyboard.switchTo('login-clausePage');
}

var switchToLogin = function() {
    this.storyboard.switchTo('login-loginPage', {}, {
        'action': 'replace'
    });
}

// 暴露函数
module.exports = {
    "loadData": loadData,
    "sendCode": sendCode,
    "register": register,
    "switchToClause": switchToClause,
    "switchToLogin": switchToLogin
};