'use strict'

var path = require('path');
var fs = require('fs');
var through = require('through2');
var baseDir = process.cwd();

module.exports = function(options) {
  options = options || {};

  function setAdd(list, el) {
    for (var i=0;i<list.length;i++) {
      if (list[i] === el) { return; }
    }
    list.push(el);
  }

  function mixotroph(srcString, mode, snippetsPath) {
    console.log("mode == " + mode);
    var output = srcString;
    output = output.replace(new RegExp("//=" + mode + "=", "g"),"");
    var myRe = new RegExp("//%([a-zA-Z0-9_]+)%","g");
    var subs = [];
    var result = myRe.exec(output);
    while (result !== null) {
      setAdd(subs, result[1]);
      result = myRe.exec(output);
    }
    var snippet;
    for (var i=0;i<subs.length;i++) {
      try {
        snippet = fs.readFileSync(snippetsPath + '/' + subs[i]);
        output = output.replace("//%" + subs[i] + "%", snippet);
      } catch(e) {
        console.log("warrning: could not find requested snippet " + subs[i] + " in snippets Path " + snippetsPath);
      } 
    }
    return output;
  }

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      return cb( new Error('Streaming not supported', {
        fileName: file.path,
        showStack: false
      }));
    }

    try {
      file.contents = new Buffer(mixotroph(String(file.contents), 
                                (options.mode !== undefined)? options.mode: '',
                                (options.snippetPath !== undefined)? 
                                           options.snippetPath : 'src/snippets/'));
    } catch (e) {
      return cb( new Error(e.message, {
        fileName: file.path,
        lineNumber: e.line,
        stack: e.stack,
        showStack: false
      }));
    }

    this.push(file);

    cb();
  });
}