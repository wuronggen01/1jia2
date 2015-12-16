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
            
        },
        "didSwitchToPage": function(storyboard, pageID, data, options) {
            switchToLock = false;
        },
        "willPageEnterForestage": function(storyboard, page, data) {
            // padding-top css
            if (!data.navnormal) {
                $(storyboard.dom).find('.storyboard-page').css('padding-top', navTabHeight + 'px');
            };

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

module.exports.Navbar = Navbar;
