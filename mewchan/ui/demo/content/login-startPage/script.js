var initPage = function() {

};

var didEnterForestage = function() {

};

var siwtchToLogin = function() {
    this.storyboard.switchTo('login-loginPage', {
        'login': "value"
    });
};

var siwtchToRegister = function() {
    this.storyboard.switchTo('login-registerPage');
};

// 暴露函数
module.exports = {
    "initPage": initPage,
    "didEnterForestage": didEnterForestage,
    "siwtchToLogin": siwtchToLogin,
    "siwtchToRegister": siwtchToRegister
};