/**
 * 1. push state manager
 * 2. keyboard layout solution :
 * ::focus => mewchan receive message => element => postion(record) => parent find scroll top
 * mewchan receive message => element => postion(record) => blank area problem ?  framework7 problem.
 * 3. url data input => rewrite rule => activity switch logic.
 * 4. ui components {
        1. modals [alert , confirm, prompt, loading],
        list, gallery, table, switch(on-off checkbox, radio).
        image view (preloading image view), button, textfield, textarea.
        content editor(find good solution),
        slide, tab
        scrollable.
        date picker, calendar.
        picker,
        2. pull to refresh. pull to fetch.
        slider.
        3. notification
        4. sidebar drawer we require a solution.
        5. context menu
 * }
 * 5. geasture : pan, swipe, tap, (replace jquery mobile) : atom geasture solution.
 * 6. hint solution.
 * 7. status bar helper, action bar helper.
 * 8. theme support.
 * 9. gobackward key solution => hardware button solution
 * 10. ui debugger support!!!
 * 11. safe-click (async click support)
 * 12. disable inline script
 * 13. ui touch start fixed.
 * 14. font solution.
 * 15. spirte bundle debug, dist, solution.
 */

var Activity = function() {
    this.storyboards = {};
    this.rules = {};
    var activity = this;
    var defaultActivityTester = /^\/activity\/(.*)\/(.*)/;
    this.addHashRuleHandler(defaultActivityTester, function(hash) {
        var match = hash.match(defaultActivityTester);
        var channel = match[1];
        var pageID = match[2].split("?")[0];
        var query = match[2].split("?")[1];
        if (query) {
            query = buildQueryObject(query);
        }
        currentActivity.getMainboard().switchTo(pageID, query, {
            channel: channel
        })
    });
    this.defaultOptions = {
        "mainStoryboard": {
            "!valueType": "string",
            "!defaultValue": "content"
        },
        "interceptStartPage": {
            "!valueType": "boolean",
            "!defaultValue": false
        },
        "enableBridge": {
            "!valueType": "boolean",
            "!defaultValue": true
        }
    };
    this.options = $.advancedMerge(this.defaultOptions, {});

    var keyboardShowListener = null;
    var keyboardHideListener = null;
    $.setKeyboardShowListener = function(func) {
        if (typeof func == 'function') {
            keyboardShowListener = func;
        }
    };

    $.setKeyboardHideListener = function(func) {
        if (typeof func == 'function') {
            keyboardHideListener = func;
        }
    };

    $.setKeyboardShowListener(function(frame, height, focused) {
        var findRootParent = function(element) {
            if ($(element).css('position') === 'absolute') {
                return element;
            } else if ($(element).is($(document.body))) {
                return element;
            } else {
                return findRootParent(element.parent());
            }
        };
        $.currentActivity.lastFocused = focused;
        var positionToPage = $(focused).positionToPage({
            "x": 0,
            "y": 0
        });
        var rootNode = findRootParent(focused);
        if ($(rootNode).is($(document.body))) {
            var heightDiff = positionToPage.y - frame.origin.y + 50;
            $('body').css('padding-bottom', height + 'px');
            if (heightDiff > 0) {
                $('html,body').css('height', 'auto');
                $('body').scrollTop(heightDiff);
            } else {
                $('body').scrollTop(0);
                $('html,body').css('height', '100%');
            }

        } else if (window.bottom && window.content && $(rootNode).is($(window.bottom.dom))) {
            $(window.content.currentPage.dom).css('padding-bottom', height + 'px');
            $(window.bottom.dom).css('padding-bottom', height + 'px');
            //$(window.bottom.dom).css('background-color',$(document.body).css('background-color'));
        } else {}
    });

    $.setKeyboardHideListener(function(frame, height, focused) {
        var findRootParent = function(element) {
            if ($(element).css('position') === 'absolute') {
                return element;
            } else if ($(element).is($(document.body))) {
                return element;
            } else {
                return findRootParent(element.parent());
            }
        };
        var rootNode = findRootParent($.currentActivity.lastFocused);
        if (window.bottom && window.content && $(rootNode).is($(window.bottom.dom))) {
            $(window.content.currentPage.dom).css('padding-bottom', '0px');
            $(window.bottom.dom).css('padding-bottom', '0px');
        } else if ($(rootNode).is($(document.body))) {
            $('body').css('padding-bottom', '0px');
            $('body').scrollTop(0);
            $('html,body').css('height', '100%');
        }
    });

    $.uiReady(function() {

        $.uiKitty.heard(["android", "ios"], "device.didShowKeyboard").then(function(mew) {
            var frame = mew.content["device.didShowKeyboard"].frame;
            var height = frame.size.height;
            var focused = $(document.activeElement);
            if (keyboardShowListener) {
                keyboardShowListener(frame, height, focused);
            }
        });

        $.uiKitty.heard(["android", "ios"], "device.didHideKeyboard").then(function(mew) {
            var frame = mew.content["device.didHideKeyboard"].frame;
            var height = frame.size.height;
            var focused = $(document.activeElement);

            if (keyboardHideListener) {
                keyboardHideListener(frame, height, focused);
            }

        });
    });
};

Activity.prototype.addHashRuleHandler = function(rule, handler) {
    if (!this.rules.hasOwnProperty(rule.toString()) && $.isKindOf(handler, Function)) {
        this.rules[rule.toString()] = {
            "rule": rule,
            "handler": handler
        }
    }
};

Activity.prototype.addHashRewriteRule = function(rule) {

};

var jsonizeBridgeInfo = function(object, indent, space) {
    var string = "";
    for (var i = 0; i < space; ++i) {
        string = string + "\t";
    }
    var usage = object["!usage"];
    switch (object["!valueType"]) {
        case "string":
            string = string + "string";
            break;

        case "int":
            string = string + "int";
            break;
        case "float":
            string = string + "float";
            break;
        case "char":
            string = string + "char";
            break;
        case "byte":
            string = string + "byte";
            break;
        case "enum":
            string = string + "enum (";
            object["!enums"].forEach(function(enumValue, idx) {
                if (idx) {
                    string = string + ",";
                }
                string = string + enumValue;
            });
            string = string + ")";
            break;
        case "ref":
            string = string + "=> {" + object["!refClass"] + "}";
            break;
        case "array":

        case "date":
            string = string + "date";
            break;
        case "boolean":
            string = string + "boolean";
            break;
        case "json":
            string = string + "json";
            break;
        case "map":
            string = string + "{";
            string = string + jsonizeBridgeInfo(object["!keyElement"], indent, 0) + " => ";
            string = string + jsonizeBridgeInfo(object["!valueElement"], indent, 0);
            string = string + "}";
            break;
        case "list":
            string = string + "[";
            string = string + jsonizeBridgeInfo(object["!arrayElement"], indent, 0);
            string = string + "]";
            break;
        case "object":
            string = string + "{" + "\t//" + object["!class"] + "\n";
            Object.keys(object).forEach(function(okey) {
                if ("!" !== okey[0]) {
                    var ovalue = object[okey];
                    for (var i = 0; i < (indent + 1); ++i) {
                        string = string + "\t";
                    }
                    string = string + okey + ":";
                    string = string + jsonizeBridgeInfo(object[okey], indent + 1, 1);
                    string = string + "\n";
                }
            });
            for (var i = 0; i < indent; ++i) {
                string = string + "\t";
            }
            string = string + "}"
            break;
    }
    if (usage) {
        string = string + "\t//" + usage;
    }
    return string;
};

Activity.prototype.configure = function(option) {
    this.options = $.advancedMerge(this.defaultOptions, option);
    if (this.options.enableBridge) {
        $.jsonrpc("other.getRPCBridge", [], function(error, bridgeInfo) {

            if (bridgeInfo) {
                $.jsonrpc.search = function(keyword) {
                    console.log("searching result for :" + keyword);
                    Object.keys(bridgeInfo.interfaceInfo).forEach(function(ifaceName) {
                        var objectID = ifaceName.split(".")[0];
                        var method = ifaceName.split(".")[1];
                        var ifaceInfo = bridgeInfo.interfaceInfo[ifaceName];
                        var queryString = (ifaceName + ifaceInfo.usage).toLowerCase();
                        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                        var rs = "";
                        for (var i = 0; i < keyword.length; i++) {
                            rs = rs + keyword.substr(i, 1).replace(pattern, '');
                        }
                        if (queryString.indexOf(rs.toLowerCase()) >= 0) {
                            $.jsonrpc[objectID][method].toString();
                        }
                    });
                };
                Object.keys(bridgeInfo.interfaceInfo).forEach(function(ifaceName) {
                    var objectID = ifaceName.split(".")[0];
                    var method = ifaceName.split(".")[1];
                    var ifaceInfo = bridgeInfo.interfaceInfo[ifaceName];

                    if (!$.jsonrpc[objectID]) {
                        $.jsonrpc[objectID] = {};
                    }

                    Object.defineProperty($.jsonrpc[objectID], method, {
                        get: function() {

                            var remoteFunction = function() {
                                var replyActions = [];
                                var reply = null;
                                var callArguments = [];
                                for (var i = 0; i < arguments.length; ++i) {
                                    callArguments.push(arguments[i]);
                                }
                                $.jsonrpc(ifaceName, callArguments, function(error, result) {
                                    reply = {
                                        error: error,
                                        result: result
                                    };
                                    replyActions.forEach(function(action) {
                                        action(reply.error, reply.result);
                                    });
                                });
                                var replyStep = {
                                    "then": function(action) {
                                        if ($.isKindOf(action, Function)) {
                                            replyActions.push(action);
                                            if (reply) {
                                                action(reply.error, reply.result);
                                            }
                                        } else {
                                            throw new Error("Action is not function");
                                        }
                                        return replyStep;
                                    }
                                }
                                return replyStep;

                            };

                            remoteFunction.toString = function() {
                                var lines = []
                                lines.push("$.jsonrpc." + ifaceName + " = function (){/*\n");
                                if (ifaceInfo.usage) {
                                    lines.push("\t" + ifaceInfo.usage);
                                } else {
                                    lines.push("\t" + ifaceInfo.name);
                                }
                                lines.push("");
                                if (ifaceInfo.author) {
                                    lines.push("\t@author\t" + ifaceInfo.author);
                                }
                                if (ifaceInfo.email) {
                                    lines.push("\t@email\t" + ifaceInfo.email);
                                }
                                if (ifaceInfo.params.length == 0) {
                                    lines.push("\t@param\t无参数");
                                } else {
                                    ifaceInfo.params.forEach(function(param) {
                                        lines.push("\t@param\t" + jsonizeBridgeInfo(param, 1, 0));
                                    });
                                }
                                if (ifaceInfo.file) {
                                    lines.push("\t@option\t包含上传文件");
                                }
                                lines.push("\t@return\t" + jsonizeBridgeInfo(ifaceInfo.returns, 1, 0));
                                if (ifaceInfo.throws.length) {
                                    for (var i = 0; i < ifaceInfo.throws.length; ++i) {
                                        var throwString = "\t@throws\t" + ifaceInfo.throws[i].alias;
                                        if (ifaceInfo.throws[i].usage) {
                                            throwString = throwString + "\t//" + ifaceInfo.throws[i].usage;
                                        }

                                        if (bridgeInfo.errorCodes[ifaceInfo.throws[i].name]) {
                                            throwString = throwString + "\t{";
                                        }
                                        lines.push(throwString);
                                        if (bridgeInfo.errorCodes[ifaceInfo.throws[i].name]) {
                                            var codes = bridgeInfo.errorCodes[ifaceInfo.throws[i].name];
                                            Object.keys(codes).sort(function(k1, k2) {
                                                return codes[k1] - codes[k2];
                                            }).forEach(function(key) {
                                                lines.push("\t\t" + codes[key] + ":\t" + key);
                                            })
                                        }
                                        if (bridgeInfo.errorCodes[ifaceInfo.throws[i].name]) {
                                            lines.push("\t}");
                                        }
                                    }
                                }
                                lines.push("\n*/}");
                                console.log(lines.join("\n"));
                            }

                            return remoteFunction;
                        }
                    });

                })
            }

        });
    } else {
        this.bridge = {};
    }
};

Activity.prototype.buildStoryboard = function(storyboardID) {

    var delegates = Array.prototype.slice.call(arguments, 1);

    return $.storyboard(storyboardID, delegates);
}

Activity.prototype.getMainboard = function() {
    if (this.storyboards[this.options.mainStoryboard]) {
        return this.storyboards[this.options.mainStoryboard].storyboard;
    } else {
        throw new Error("mainboard is not defined");
    }
};

Activity.prototype.isMainboard = function(storyboard) {
    return storyboard.id == this.options.mainStoryboard;
};

Activity.prototype.switchTo = function() {
    var board = getMainboard()
    return board.switchTo.apply(board, arguments);
};

Activity.prototype.goBackward = function() {
    var board = getMainboard();
    return board.goBackward.apply(board, arguments);
};

window.onpopstate = function(event) {
    if (event.state) {
        currentActivity.getMainboard().switchTo(event.state.pageID, event.state.query, {
            channel: event.state.channel
        });
    } else {
        switchToHash();
    }
};

var switchToHash = function() {
    var hashStr = location.hash.replace("#", "");
    var handled = false;
    if (hashStr[0] === '!') {
        hashStr = hashStr.substr(1);
        Object.keys($.currentActivity.rules).forEach(function(key) {
            if (!handled) {
                var ruleInfo = $.currentActivity.rules[key];
                if (ruleInfo.rule.test(hashStr)) {
                    try {
                        ruleInfo.handler(hashStr);
                        handled = true;
                    } catch (ex) {
                        console.error(ex);
                    }
                }
            }
        });
    }
};
//http://127.0.0.1:8000/#!/activity/main/main-indexPage?data.token=2121&data.key=122
var buildQueryObject = function(query) {
    var queries = query.split("&");
    var object = {};
    for (var i = 0; i < queries.length; ++i) {
        var querySingle = queries[i];
        var splitedQuery = querySingle.split("=");
        var key = splitedQuery[0];
        var value = splitedQuery[1];
        var keyArray = key.split(".");
        var reference = object;
        for (var j = 0; j < keyArray.length; ++j) {
            if (j == keyArray.length - 1) {
                reference[keyArray[j]] = value;
            } else {

                if (!reference[keyArray[j]]) {
                    reference[keyArray[j]] = {};
                }
                reference = reference[keyArray[j]];
            }
        }
    }
    return object;
};

var buildObjectQuery = function(prefix, object) {
    var query = "";
    Object.keys(object).forEach(function(key) {
        if (object[key]) {
            var queryKey = "";
            if (prefix) {
                queryKey = prefix + "." + queryKey;
            }
            queryKey = queryKey + key;

            switch (typeof object[key]) {
                case "object":
                    {
                        if (Array.isArray(object[key])) {
                            for (var i = 0; i < object[key].length; ++i) {
                                var arrayElement = object[key][i];
                                if (!$.isKindOf(arrayElement, Object)) {
                                    if (query.length) {
                                        query = query + "&";
                                    }
                                    query = query + queryKey + "[" + i + "]=" + arrayElement;
                                }
                            }
                        } else {
                            if (query.length) {
                                query = query + "&";
                            }
                            query = query + buildObjectQuery(queryKey, object[key]);
                        }
                    }
                    break;
                default:
                    {

                        if (query.length) {
                            query = query + "&";
                        }
                        query = query + queryKey + "=" + object[key];
                    }
            }
        }
    });
    return query;
};

var buildHashURL = function(pageID, channel, data) {
    var hashURL = "#!/activity/" + channel + "/" + pageID;
    if (data) {
        var query = buildObjectQuery(null, data);
        if (query) {
            hashURL = hashURL + "?" + query;
        }
    }
    return hashURL;
};

var currentActivity = new Activity();

$.storyboard.plugins["activity"] = {
    "init": function(storyboard) {
        currentActivity.storyboards[storyboard.id] = {
            "state": null,
            "storyboard": storyboard
        };
        if (currentActivity.isMainboard(storyboard)) {
            $(storyboard.dom).height($(window).height());
        }
    },
    "willSwitchToStartPage": function(storyboard) {
        if (currentActivity.isMainboard(storyboard)) {
            if (currentActivity.options.interceptStartPage && history.state) {

                delete storyboard.options.startPageID;

                storyboard.switchTo(history.state.pageID, history.state.query, {
                    channel: history.state.channel,
                    forceAnimation: true
                })
            } else if (currentActivity.options.interceptStartPage) {
                switchToHash();
            }
        }
    },
    "didPageEnterForestage": function(storyboard, page) {
        if (currentActivity.isMainboard(storyboard)) {
            var channel = storyboard.channel;
            var settings = page.data.settings;
            history.pushState({
                pageID: page.id,
                channel: channel,
                query: settings.data
            }, "", buildHashURL(page.id, channel, settings.data));
        }
    }
};

module.exports = currentActivity;