var loadData = function(data, callback) {
    callback(null, data);
}

var reset = function() {

	var stack = content.channels.login.stack[1];

	var page = stack;

    Object.keys(page).forEach(function(key) {
    	if (page[key] instanceof Function) {
    		delete page[key];
    	};
    });

    delete stack.storyboard;
    delete stack.pool;
    delete stack.step
    delete stack.template
    delete stack.dom
    delete stack.data.functors
    delete stack.data.page
    delete stack.data.storyboard

    console.log(JSON.stringify(stack));
    console.log(stack);

}

// 暴露函数
module.exports = {
    "loadData": loadData,
    "reset": reset
};