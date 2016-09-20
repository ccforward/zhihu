var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var co = require('co');

function FileUploadPlugin(options) {
    this.options = options;
}

FileUploadPlugin.prototype.apply = function(compiler) {
    var options = this.options;
    compiler.plugin('after-emit', function(compilation, callback) {

        var distPath = compilation.options.output.path + "/";
        var filelist = [],
            localFileArr = [],
            uploadFileArr = [];

        
        for(var file in compilation.assets){
            if(options.filter.indexOf(path.extname(file)) >= 0){
                // localFileArr.push(distPath + file)
                localFileArr.push(file)
            }
        }
        // up(localFileArr[0])
        // .then(function(d){
        //     console.log('upload success')
        // }).catch(function(err){
        //     console.log(err)
        // });

        // 文件内容替换
        for (var filename in compilation.assets) {
            var f = {};
            f["local"] = distPath + filename;
            f["url"] = filename;
            filelist.push(JSON.stringify(f));
        }
        console.log(compilation.assets)
        // Insert this list into the Webpack build as a new file asset:
        compilation.assets['static.json'] = {
            source: function() {
                return inspect(filelist);
            },
            size: function() {
                return filelist.length;
            }
        };
        callback();


        function up(file) {
            return new Promise(function(resolve, reject){
                options.uploadFn(file, function(err, file){
                    if(err) return reject(err);
                    resolve(file);
                });
            });
        }
    });
};



module.exports = FileUploadPlugin;
