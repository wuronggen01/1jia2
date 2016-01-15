var CoolCTO = function() {
    var myApp = this;
    myApp.storyboard = {
        initNavbar: Navbar
    };
    // myApp.jsonrpc = JsonRPC;
}

// var JsonRPC = function() {
//     return $.async(function() {
//         var step = this;
//         $.jsonrpc('coolcto.sendActivationCode', [
//             "13122270985"
//         ], function(error, result) {

//             if (error) {
//                 error.errorMsg = errorMsg[error.code] ? errorMsg[error.code] : "错误编号未定义";
//                 step.reject(error)
//             } else {
//                 step.next(result);
//             }

//         });
//     }).rejected(function(error) {
//         console.log(456);
//     });
// }

/**
 * Init navbar
 * @param {[storyboard] CoolCTO framework header storyboard}
 * @param {[storyboard] CoolCTO framework bottom storyboard}
 * @param {[Integer] CoolCTO framework navbar's height}
 */
var Navbar = function(headerSB, bottomSB, navTabHeight) {

    var switchToLock = false;

    return {
        "init": function(storyboard, page, data) {
            headerSB.onLeftButtonClick = function() {
                if (storyboard.currentPage.spec.module.exports.onBackClick) {
                    storyboard.currentPage.spec.module.exports.onBackClick.call(storyboard.currentPage.data);
                } else {
                    storyboard.goBackward();
                }
            };
            headerSB.onRightButtonClick = function() {
                if (storyboard.currentPage.spec.module.exports.onHeaderRightButtonClick) {
                    storyboard.currentPage.spec.module.exports.onHeaderRightButtonClick.call(storyboard.currentPage.data);
                }
            };
        },
        "willSwitchToPage": function(storyboard, pageID, data, options) {

            if (switchToLock) {
                // throw new Error(storyboard.dom.id + " time interval is not legal");
            } else {
                switchToLock = true;
            };

            setTimeout(function() {
                switchToLock = false;
            }, 1000);

        },
        "didSwitchToPage": function(storyboard, pageID, data, options) {
            switchToLock = false;
        },
        "willPageEnterForestage": function(storyboard, page, data) {
            // padding-top css
            if (data.navnormal     ) {
                var navTabHeightNormal = 20;
                if ($('body').hasClass('system-android')){
                    navTabHeightNormal = 25;
                }
                if (data.navTabNoNav) {
                    $(storyboard.dom).find('.storyboard-page').css('padding-top',  '0px');
                } else {

                 $(storyboard.dom).find('.storyboard-page').css('padding-top', navTabHeightNormal + 'px');
                }
            } else {
                $(storyboard.dom).find('.storyboard-page').css('padding-top', navTabHeight + 'px');
            }

            // header linkage
            if (data.header && headerSB.currentPage) {
                headerSB.switchTo(data.header, data.settings.data, {
                    "action": "reset",
                    "animation": "fading"
                }).then(function() {
                    if (data.needupdateheader) {
                        headerSB.currentPage.update({
                            "rightButtonText": data.rightbuttontext,
                            "contentButtonText": data.contentbuttontext,
                            "leftButtonText": data.leftbuttontext
                        })
                    }
                })
            };

            // bottom linkage
            if (data.bottom && bottomSB.currentPage) {
                bottomSB.switchTo(data.bottom, data.settings.data, {
                    "action": "reset",
                    "animation": "fading"
                });
            };


        }
    };
}

var errorMsg = {
    30090: "未知错误",
    30094: "账号已经被禁止登录",
    30095: "账号已过期",
    30096: "账号名或者密码为空",
    30097: "账号没有找到",
    30098: "账号或者密码错误",
    30099: "需要登录才能继续",
    30100: "不正确的图片验证码",
    30101: "远程登录错误",
    30191: "账号密码长度错误",
    30192: "账号已存在",
    30193: "账号格式错误",
    50000: "没找到对象",
    50001: "没有配置短信发送模板",
    50002: "手机格式错误",
    50003: "管理员禁止了该功能",
    50004: "验证码错误",
    50005: "手机或者邮箱已经存在",
    50006: "昵称已经存在"
}