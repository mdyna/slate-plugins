'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isDataUri = _interopDefault(require('is-data-uri'));
var Promise = _interopDefault(require('es6-promise'));
var isImage = _interopDefault(require('is-image'));
var isUrl = _interopDefault(require('is-url'));
var logger = _interopDefault(require('slate-dev-logger'));
var slateReact = require('slate-react');

/**
 * Return a `Blob` for the given data `uri`.
 *
 * Copied from: https://github.com/component/data-uri-to-blob/blob/master/index.js
 *
 * @param {String} uri
 * @return {Blob}
 */

function dataUriToBlob(uri) {
  var data = uri.split(',')[1];
  var bytes = atob(data);
  var buffer = new window.ArrayBuffer(bytes.length);
  var array = new window.Uint8Array(buffer);

  for (var i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  if (!hasArrayBufferView()) {
    array = buffer;
  }

  var blob = new Blob([array], { type: mime(uri) });

  // COMPAT: ???
  blob.slice = blob.slice || blob.webkitSlice;

  return blob;
}

/**
 * Return the mime type of a data `uri`.
 *
 * @param {String} uri
 * @return {String}
 */

function mime(uri) {
  return uri.split('')[0].slice(5);
}

/**
 * Check if the environment suppoers `ArrayBufferView`.
 *
 * @return {Boolean}
 */

function hasArrayBufferView() {
  return new Blob([new window.Uint8Array(100)]).size == 100;
}

/**
 * Convert an <img> source `url` to a data URI and `callback(err, uri)`.
 *
 * @param {String} url
 * @param {Function} callback
 */

function srcToDataUri(url, callback) {
  var canvas = window.document.createElement('canvas');
  var img = window.document.createElement('img');

  if (!canvas.getContext) {
    return setTimeout(callback, 0, new Error('Canvas is not supported.'));
  }

  img.onload = function () {
    var ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    var dataUri = canvas.toDataURL('image/png');
    callback(null, dataUri);
  };

  img.ononerror = function () {
    callback(new Error('Failed to load image.'));
  };

  img.setAttribute('crossOrigin', 'anonymous');
  img.src = url;
}

/**
 * Load an image file from a src `url`.
 *
 * @param {String} url
 * @param {Function} callback
 */

function loadImageFile(url, callback) {
  if (isDataUri(url)) {
    var file = dataUriToBlob(url);
    setTimeout(function () {
      callback(null, file);
    });
  } else {
    srcToDataUri(url, function (err, uri) {
      var file = dataUriToBlob(uri);
      callback(err, file);
    });
  }
}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version


// path.normalize(path)
// posix version


// posix version


// posix version



// path.relative(from, to)
// posix version










function extname(path) {
  return splitPath(path)[3];
}
// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Insert images on drop or paste.
 *
 * @param {Object} options
 *   @property {Function} insertImage
 *   @property {Array} extensions (optional)
 * @return {Object} plugin
 */

function DropOrPasteImages() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var insertImage = options.insertImage,
      extensions = options.extensions;


  if (options.applyTransform) {
    logger.deprecate('0.6.0', 'The `applyTransform` argument to `slate-drop-or-paste-images` has been renamed to `insertImage` instead.');
    insertImage = options.applyTransform;
  }

  if (!insertImage) {
    throw new Error('You must supply an `insertImage` function.');
  }

  /**
   * Check file extension against user-defined options.
   *
   * @param {Type} string
   * @return {Boolean}
   */

  function matchExt(type) {
    var accepted = false;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = extensions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var ext = _step.value;

        if (type.includes(ext)) accepted = true;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return accepted;
  }

  /**
   * Apply the change for a given file and update the editor with the result.
   *
   * @param {Editor} editor
   * @param {Blob} file
   * @return {Promise}
   */

  function asyncApplyChange(editor, file) {
    return Promise.resolve(insertImage(editor, file)).then(function () {
      editor.onChange(editor);
    });
  }

  /**
   * On drop or paste.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   * @return {State}
   */

  function onInsert(event, editor, next) {
    var transfer = slateReact.getEventTransfer(event);
    var range = editor.findEventRange(event);

    switch (transfer.type) {
      case 'files':
        return onInsertFiles(event, editor, next, transfer, range);
      case 'html':
        return onInsertHtml(event, editor, next, transfer, range);
      case 'text':
        return onInsertText(event, editor, next, transfer, range);
      default:
        return next();
    }
  }

  /**
   * On drop or paste files.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertFiles(event, editor, next, transfer, range) {
    var files = transfer.files;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {

      for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var file = _step2.value;

        if (extensions) {
          var type = file.type;

          var _type$split = type.split('/'),
              _type$split2 = _slicedToArray(_type$split, 2),
              ext = _type$split2[1];

          if (!matchExt(ext)) continue;
        }

        if (range) {
          editor.select(range);
        }

        asyncApplyChange(editor, file);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  /**
   * On drop or paste html.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertHtml(event, editor, next, transfer, range) {
    var html = transfer.html;

    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var body = doc.body;
    var firstChild = body.firstChild;
    if (firstChild.nodeName.toLowerCase() != 'img') return next();

    var src = firstChild.src;

    if (extensions) {
      var ext = extname(src).slice(1);
      if (!matchExt(ext)) return next();
    }

    loadImageFile(src, function (err, file) {
      if (err) return;

      editor.command(function (c) {
        if (range) {
          c.select(range);
        }

        asyncApplyChange(c, file);
      });
    });
  }

  /**
   * On drop or paste text.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @param {Function} next
   * @param {Object} transfer
   * @param {Range} range
   * @return {Boolean}
   */

  function onInsertText(event, editor, next, transfer, range) {
    var text = transfer.text;

    if (!isUrl(text)) return next();
    if (!isImage(text)) return next();

    loadImageFile(text, function (err, file) {
      if (err) return;

      editor.command(function (c) {
        if (range) {
          c.select(range);
        }

        asyncApplyChange(c, editor, file);
      });
    });
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    onDrop: onInsert,
    onPaste: onInsert
  };
}

exports.default = DropOrPasteImages;
//# sourceMappingURL=slate-drop-or-paste-images.js.map
