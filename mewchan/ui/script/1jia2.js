// var AdminPlatform = function() {
//     var admin = this;
//     this.sessions = [];
//     this.token = $.accessToken;
//     this.account = null;
// };

// var $myApp = new AdminPlatform();

$.uiReady(function() {

    $.myApp = new CoolCTO();

    $.currentActivity.configure({
        "mainStoryboard": "main-container"
    })

    header = $.currentActivity.buildStoryboard("#header-navbar");

    bottom = $.currentActivity.buildStoryboard("#footer-tabbar");

    content = $.currentActivity.buildStoryboard("#main-container", $.myApp.storyboard.initNavbar(header, bottom, 64), {

        "didPageEnterForestage": function(storyboard, pageID, data, options) {
            
            var storyboardCache;

            if (!localStorage.storyboardCache) {
                storyboardCache = {
                    "channelActivity": "",
                    "channel": {}
                }
            } else {
                storyboardCache = JSON.parse(localStorage.storyboardCache);
            };

            storyboardCache.channelActivity = storyboard.channel;

            if (!storyboardCache.channel[storyboard.channel]) {
                storyboardCache.channel[storyboard.channel] = [];
            };

            storyboardCache.channel[storyboard.channel].push(location.href);

            localStorage.storyboardCache = JSON.stringify(storyboardCache);

            // var cache = {
            //     channelData: outputChannels(storyboard),
            //     channelActivity: storyboard.channel
            // }

            // localStorage.storyboardCache = JSON.stringify(cache);

        },
        "willSwitchToStartPage": function(storyboard) {

            if (localStorage.storyboardCache) {
                console.log(JSON.parse(localStorage.storyboardCache));
            }

            // if (localStorage.storyboardCache) {
            //     delete storyboard.options.startPageID;

            //     var cache = JSON.parse(localStorage.storyboardCache);
            //     console.log(cache);
            //     var channelActivity = cache.channelData[cache.channelActivity].stack;
            //     // var pageActivity = channelActivity[channelActivity.length - 1];
            //     var pageActivity = channelActivity.pop();
            //     storyboard.channel = cache.channelActivity;
            //     storyboard.channels = cache.channelData;

            //     storyboard.switchTo(pageActivity.id);
            // };


            // storyboard.channels = cache;
            // storyboard.channel = localStorage.storyboardCache.channel;
        }

    });

});

var outputChannels = function(storyboard) {
    var cacheObj = {};

    // Object.keys(storyboard.channels).forEach(function(key) {

    //     cacheObj[key] = {
    //         "startPageID": storyboard.channels[key].startPageID,
    //         "stack": []
    //     }

    //     storyboard.channels[key].stack.forEach(function(page, index) {

    //         var pageObj = {
    //             "id": page.id,
    //             "uuid": page.uuid,
    //             "spec": page.spec,
    //             "data": {}
    //         }

    //         Object.keys(page.data).forEach(function(key) {
    //             if (key !== 'storyboard' && key !== 'page' && key !== 'functors') {
    //                 pageObj.data[key] = page.data[key];
    //             };

    //         });

    //         cacheObj[key].stack.push(pageObj);

    //     });
    // });

    return cacheObj;
}

