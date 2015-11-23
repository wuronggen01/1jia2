var fs = require("fs");
var path = require("path");

var Module = require("module");

var foundation = require("./foundation.js");
var storage = require("./storage.js");

var configCaches = {};

var registeredConfigs = {};

var utilHomeDir = null;

var getConfig = function (configPath, noCache, callback) {

    var fs = getUtilFS(configPath);

    if ((!configCaches.hasOwnProperty(configPath)) || noCache) {

        fs.exists(configPath, function (exists) {

            if (exists) {

                fs.stat(configPath, function (error, stats) {

                    if (error) {

                        configCaches[configPath] = {};

                        callback(configCaches[configPath]);

                    } else {

                        if (stats.isFile()) {

                            fs.readFile(configPath, function (error, buffer) {

                                if (error) {
                                    configCaches[configPath] = {};
                                } else {
                                    try {
                                        configCaches[configPath] = JSON.parse(buffer.toString("utf8"));
                                    } catch (error) {
                                        configCaches[configPath] = {};
                                    }
                                }

                                callback(configCaches[configPath]);

                            });

                        } else {

                            configCaches[configPath] = {};

                            callback(configCaches[configPath]);

                        }

                    }

                });

            } else {

                configCaches[configPath] = {};

                callback(configCaches[configPath]);

            }

        });

    } else {

        callback(configCaches[configPath]);

    }

};

var getConfigSync = function (configPath, noCache) {

    var fs = getUtilFS(configPath);

    if ((!configCaches.hasOwnProperty(configPath)) || noCache) {

        try {

            if (fs.existsSync(configPath) && fs.statSync(configPath).isFile()) {
                console.log(">>>>>> " + configPath);
                configCaches[configPath] = JSON.parse(fs.readFileSync(configPath).toString("utf8"));
            } else {
                configCaches[configPath] = {};
            }

        } catch (error) {
            configCaches[configPath] = {};
        }

    }

    return configCaches[configPath];

};

var getUtilHomeDir = function (subpath) {

    if (subpath) {
        if (utilHomeDir) {
            return path.resolve(utilHomeDir, subpath);
        } else {
            return path.resolve(process.cwd(), subpath);
        }
    } else {
        if (utilHomeDir) {
            return utilHomeDir;
        } else {
            return process.cwd();
        }
    }
    
};

var setUtilHomeDir = function (homePath, callback) {

    utilHomeDir = homePath;

    var looper = 0;

    var loop = function () {

        if (looper < registeredConfigs.length) {

            ++looper;

            getUtilConfig(registeredConfigs[looper - 1], null, loop);

        } else {
            callback();
        }

    };

    loop();

};

var getUtilConfig = function (config, mergeRules) {

    if (!mergeRules) {
        mergeRules = registeredConfigs[config];
    }

    var allMergeArguments = foundation.copyAsArray(arguments).slice(2);

    var callback = function () {};
    if (foundation.isKindOf(allMergeArguments[allMergeArguments.length - 1]), Function) {
        callback = allMergeArguments.pop();
    }

    var homeConfigPath = path.resolve(storage.getHomeDir(".mew/conf"), config + ".json");
    var utilConfigPath = path.resolve(getUtilHomeDir("conf"), config + ".json");

    getConfig(homeConfigPath, mergeRules["!noCache"], function (config) {

        allMergeArguments.unshift(config);

        if (homeConfigPath !== utilConfigPath) {

            getConfig(utilConfigPath, mergeRules["!noCache"], function (config) {

                allMergeArguments.unshift(config);

                allMergeArguments.unshift(mergeRules);

                callback(foundation.advancedMerge.apply(foundation, allMergeArguments));

            });

        } else {

            allMergeArguments.unshift(mergeRules);

            callback(foundation.advancedMerge.apply(foundation, allMergeArguments));

        }

    });

};

var getUtilConfigSync = function (config, mergeRules) {

    if (!mergeRules) {
        mergeRules = registeredConfigs[config];
    }

    var allMergeArguments = foundation.copyAsArray(arguments).slice(2);

    var homeConfigPath = path.resolve(storage.getHomeDir(".mew/conf"), config + ".json");

    var utilConfigPath = path.resolve(getUtilHomeDir("conf"), config + ".json");

    allMergeArguments.unshift(getConfigSync(homeConfigPath, mergeRules["!noCache"]));

    if (homeConfigPath !== utilConfigPath) {
        allMergeArguments.unshift(getConfigSync(utilConfigPath, mergeRules["!noCache"]));
    }

    allMergeArguments.unshift(mergeRules);

    return foundation.advancedMerge.apply(foundation, allMergeArguments);

};

var registerUtilConfig = function (config, mergeRules) {

    if (!registeredConfigs.hasOwnProperty(config)) {
        registeredConfigs[config] = mergeRules;
    }

};

var fses = {};
var requires = {};

var registerUtilFS = function (filePath, fs, require) {

    var realPath = path.resolve(filePath);

    fses[realPath] = fs;

    if (require) {
        requires[realPath] = require;
    }

};

var getUtilFS = function (filePath) {

    filePath = path.resolve(filePath);

    var possibleRootPath = null;

    Object.keys(fses).forEach(function (rootPath) {
        if ((filePath === rootPath) || (filePath.indexOf(rootPath + path.sep) === 0)) {
            if ((!possibleRootPath) || (possibleRootPath.length < rootPath.length)) {
                possibleRootPath = rootPath;
            }
        }
    });

    if (possibleRootPath) {
        return fses[possibleRootPath];
    } else {
        return fs;
    }

};

var requireModule = function (module, id) {

    var moduleID = resolveModule(module, id);

    var possibleRootPath = null;

    Object.keys(requires).forEach(function (rootPath) {
        if ((filePath === rootPath) || (filePath.indexOf(rootPath + path.sep) === 0)) {
            if ((!possibleRootPath) || (possibleRootPath.length < rootPath.length)) {
                possibleRootPath = rootPath;
            }
        }
    });

    if (possibleRootPath) {
        return requires[possibleRootPath].require(moduleID);
    } else {
        require("module").prototype.require.call(module, moduleID);
    }

};

var resolveModule = function (module, id) {

    if (id[0] === ".") {

        var moduleID = path.normalize(path.join(path.dirname(module.id), id));

        var fs = getUtilFS(moduleID);

        if (fs.existsSync(moduleID)) {
            return moduleID;
        } else {
            throw new Error("Module not found " + id);
        }

    } else if (!storage.isRootPath(id)) {

        if ([ 
            "child_process", "cluster", "crypto", "debugger",
            "dgram", "dns", "domain", "events", 
            "fs", "http", "https", "module", 
            "net", "os", "path", "process", 
            "punycode", "querystring", "readline", "repl",
            "smalloc", "stream", "string_decoder", "timers",
            "tls", "tty", "url", "util",
            "vm", "zlib"
            ].indexOf(id) !== -1) {
            return id;
        }

        var dir = module.id;
        while (dir !== path.dirname(dir)) {

            dir = path.dirname(dir);

            var moduleID = path.normalize(path.join(dir, "node_modules", id));

            var fs = getUtilFS(moduleID);
            if (fs.existsSync(moduleID) && fs.statSync(moduleID).isDirectory()) {
                return moduleID;
            } else if (fs.existsSync(moduleID + ".js") && fs.statSync(moduleID + ".js").isFile()) {
                return moduleID + ".js";
            } else if (fs.existsSync(moduleID + ".json") && fs.statSync(moduleID + ".json").isFile()) {
                return moduleID + ".json";
            }

        }

        var moduleID = path.normalize(path.join(storage.getHomeDir(".node_modules"), id));
        var fs = getUtilFS(moduleID);
        if (fs.existsSync(moduleID) && fs.statSync(moduleID).isDirectory()) {
            return moduleID;
        } else if (fs.existsSync(moduleID + ".js") && fs.statSync(moduleID + ".js").isFile()) {
            return moduleID + ".js";
        } else if (fs.existsSync(moduleID + ".json") && fs.statSync(moduleID + ".json").isFile()) {
            return moduleID + ".json";
        }

        var moduleID = path.normalize(path.join(storage.getHomeDir(".node_libraries"), id));
        var fs = getUtilFS(moduleID);
        if (fs.existsSync(moduleID) && fs.statSync(moduleID).isDirectory()) {
            return moduleID;
        } else if (fs.existsSync(moduleID + ".js") && fs.statSync(moduleID + ".js").isFile()) {
            return moduleID + ".js";
        } else if (fs.existsSync(moduleID + ".json") && fs.statSync(moduleID + ".json").isFile()) {
            return moduleID + ".json";
        }
        
        throw new Error("Module not found " + id);

    } else {

        var fs = getUtilFS(moduleID);

        if (fs.existsSync(moduleID)) {
            return moduleID;
        } else {
            throw new Error("Module not found " + id);
        }

    }

};

var mewJSes = {};

var registerMewJS = function (id, info) {
    mewJSes[id] = foundation.merge(mewJSes[id], info);
};

// -> offset (for stack)
// -> filePath
//
var getMewJSInfo = function () {

    var filePath = null;
    if (foundation.isKindOf(arguments[0], Number)) {
        filePath = storage.standardizePath(getFileLine(offset + 1, 0).split(":").slice(0, -1).join(":"));
    } else {
        filePath = arguments[0];
    }

    if (path.extname(filePath) === ".mew-js") {

        var id = filePath.split(".").slice(-2)[0];

        return mewJSes[id];

    } else {

        return null;
        
    }

};

var getFileLine = function (offset, components, needColumn) {

    var stack = new Error().stack;

    var prefix = "@";

    if (foundation.getScriptEngineName() === "V8") {

        ++offset;

        prefix = "at";

    }

    if (!foundation.isKindOf(components, Number)) {
        components = 3;
    }

    var components = stack.split("\n")[offset + 1].split(prefix).slice(1).join(prefix).split(path.sep).slice(-components).join("/").split(":");

    if (path.extname(components[0]) === ".jx") {
        components[0] = components[0].substring(0, components[0].length - 3);
    }
    
    if (needColumn) {
        return components.join(":").trim();
    } else {
        return components.slice(0, components.length - 1).join(":").trim();
    }

};

require("module")._extensions[".mew-js"] = function (module, filename, parent) {

    var actualFilename = path.normalize(path.join(path.dirname(filename), path.basename(filename).split(".").slice(0, -2).join(".") + ".js"));

    var content = fs.readFileSync(actualFilename, "utf8");
    // Strip BOM
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    module._compile(content, filename, undefined, undefined);

};

var evaluateScript = function (script, filename, require) {

    var sandbox = {};

    for (var key in global) {
        sandbox[key] = global[key];
    }

    if (!require) {
        sandbox.require = module.require;
    } else {
        sandbox.require = require;
    }

    sandbox.exports = {};

    sandbox.__filename = filename;
    sandbox.__dirname = path.dirname(filename);

    sandbox.module = sandbox;

    sandbox.global = global;
    sandbox.root = root;

    process.binding("evals").NodeScript.runInThisContext(Module.wrap(script), fileID, true).call(sandbox.exports, 
        sandbox.exports, 
        sandbox.require, 
        sandbox, 
        sandbox.__filename, sandbox.__dirname, 
        global.setTimeout, global.setInterval, global.process);

    return sandbox;

}

module.exports = {
    
    "getConfig": getConfig,
    "getConfigSync": getConfigSync,

    "getUtilHomeDir": getUtilHomeDir,
    "setUtilHomeDir": setUtilHomeDir,

    "getUtilConfig": getUtilConfig,
    "getUtilConfigSync": getUtilConfigSync,

    "registerUtilConfig": registerUtilConfig,

    "registerUtilFS": registerUtilFS,
    "getUtilFS": getUtilFS,

    "requireModule": requireModule,
    "resolveModule": resolveModule,

    "registerMewJS": registerMewJS,
    "getMewJSInfo": getMewJSInfo,

    "getFileLine": getFileLine,

    "evaluateScript": evaluateScript

};