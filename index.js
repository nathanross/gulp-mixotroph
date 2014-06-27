'use strict'

var path = require('path');
var fs = require('fs');
var through = require('through2');
var nodeErr = require('./lib/error.js');
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
    srcString = srcString.replace("//=" + mode + "=", "");
    myRe = new RegExp("//%([a-zA-Z0-9_]+)%","g");
    var subs = [];
    var result = myRe.exec(srcString);
    while (result !== null) {
      setAdd(subs, result[1]);
      result = myRe.exec(srcString);
    }
    var snippet;
    for (var i=0;i<subs.length;i++) {
      snippet = fs.readFileSync(snippetsPath + '/' + subs[i]);
      srcString = srcString.replace("//%" + subs[i] + "%");
    }
    return srcString;
  }

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      return callback(nodeErr('Streaming not supported', {
        fileName: file.path,
        showStack: false
      }));
    }

    try {
      file.contents = mixotroph(String(file.contents), 
                                (options.mode !== undefined)? options.mode: '',
                                (options.snippetPath !== undefined)? options.snippetPath : '');
    } catch (e) {
      return callback(nodeErr(e.message, {
        fileName: file.path,
        lineNumber: e.line,
        stack: e.stack,
        showStack: false
      }));
    }

    this.push(file);

    callback();

  });
}