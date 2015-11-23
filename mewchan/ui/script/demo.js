
$.uiReady(function() {

    $.myApp = new CoolCTO();

    $.currentActivity.configure({
        "mainStoryboard": "main-container"
    })

    header = $.currentActivity.buildStoryboard("#header-navbar");

    bottom = $.currentActivity.buildStoryboard("#footer-tabbar");

    content = $.currentActivity.buildStoryboard("#main-container", $.myApp.storyboard.initNavbar(header, bottom, 64), {

        "didPageEnterForestage": function(storyboard, pageID, data, options) {

            var cache = {
                channelData: outputChannels(storyboard),
                channelActivity: storyboard.channel
            }

            localStorage.storyboardCache = JSON.stringify(cache);

        },
        "willSwitchToStartPage": function(storyboard) {

            if (localStorage.storyboardCache) {
                // delete storyboard.options.startPageID;

                var cache = JSON.parse(localStorage.storyboardCache);
                var channelActivity = cache.channelData[cache.channelActivity].stack;

                channelActivity.forEach(function(page) {
                    // storyboard.switchTo(page.id, page.data.settings.data);
                });

                // var pageActivity = channelActivity[channelActivity.length - 1];
                // var pageActivity = channelActivity.pop();
                // storyboard.channel = cache.channelActivity;
                // storyboard.channels = cache.channelData;

                // storyboard.switchTo(pageActivity.id);
            };


            // storyboard.channels = cache;
            // storyboard.channel = localStorage.storyboardCache.channel;
        },
        "willPageBackwardDataDecorated": function(storyboard, page, data) {
            if (page.isReset) {
                console.log(page.id);
                var cache = storyboard.channels[storyboard.channel].stack.pop;
                storyboard.switchTo('login-loginPage');
            };
        }

    });

});

var outputChannels = function(storyboard) {
    var cacheObj = {};

    Object.keys(storyboard.channels).forEach(function(key) {

        cacheObj[key] = {
            "startPageID": storyboard.channels[key].startPageID,
            "stack": []
        }

        storyboard.channels[key].stack.forEach(function(page, index) {

            var pageObj = {
                "isReset": true,
                "id": page.id,
                "uuid": page.uuid,
                "spec": page.spec,
                "data": {}
            }

            Object.keys(page.data).forEach(function(key) {
                if (key !== 'storyboard' && key !== 'page' && key !== 'functors') {
                    pageObj.data[key] = page.data[key];
                };

            });

            cacheObj[key].stack.push(pageObj);

        });
    });

    return cacheObj;
}