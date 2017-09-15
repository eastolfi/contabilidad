module.exports  = function (reporter, definition) {
    reporter.extensionsManager.engines.push({
        name: "handlebars",
        pathToEngine: __dirname + "node_modules/handlebars"
    });
};