// var loginFile = "goodea.json";
var fs = require('fs');
var path = require("path");

// @heard.rpc("mewchan.ui", "goodea.checkFirst").then(function(usage, content, callback) {

//     fs.readFile(path.join(@mewchan().documentPath, 'loding.txt'), function(error, data) {

//         if (error) {
//             callback(null, true);
//         } else {

//             try {
//                 callback(null, false);
//             } catch (Ex) {
//                 callback(Ex);
//             }
//         }

//     });

//     fs.writeFile(path.join(@mewchan().documentPath, 'loding.txt'), "first", function(error) {
//     });

// });

// @heard.rpc("mewchan.ui", "goodea.setLogin").then(function(usage, content, callback) {

//     var loginData = JSON.stringify(content);

//     fs.writeFile(path.join(@mewchan().documentPath, 'login.txt'), loginData, function(error) {
//         if (error) {
//             callback("Not Exists");
//         } else {
//             try {
//                 callback(null, path.join(@mewchan().documentPath + '', 'login.txt'));
//             } catch (Ex) {
//                 callback(Ex);
//             }
//         }
//     });

// });

// @heard.rpc("mewchan.ui", "goodea.getLogin").then(function(usage, content, callback) {

//     fs.readFile(path.join(@mewchan().documentPath, 'login.txt'), function(error, data) {

//         if (error) {
//             callback("Not Exists");
//         } else {

//             try {
//                 callback(null, JSON.parse("" + data));
//             } catch (Ex) {
//                 callback(Ex);
//             }
//         }

//     });


// });

@heard.rpc("mewchan.ui", "myApp.saveData").then(function(usage, content, callback) {

    @info("myApp.saveData");

    var fileName = content.fileName;

    var fileData = JSON.stringify(content.data);

    fs.writeFile(path.join(@mewchan().documentPath, fileName + '.txt'), fileData, function(error) {
        if (error) {
            callback("Not Exists");
        } else {
            try {
                callback(null, path.join(@mewchan().documentPath + '', fileName + '.txt'));
            } catch (Ex) {
                callback(Ex);
            }
        }
    });

});

@heard.rpc("mewchan.ui", "myApp.getData").then(function(usage, content, callback) {

    var fileName = content.fileName;

    fs.readFile(path.join(@mewchan().documentPath, fileName + '.txt'), function(error, data) {

        if (error) {
            callback("Not Exists");
        } else {

            try {
                callback(null, JSON.parse("" + data));
            } catch (Ex) {
                callback(Ex);
            }
        }

    });


});

@heard.hold("mewchan", "mewchan.ready").then(function(mew) {

    @info("hello world now!");

})