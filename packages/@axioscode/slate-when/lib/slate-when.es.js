/**
 * Handlers to wrap.
 *
 * @type {Array}
 */

var PLUGIN_HANDLERS = ['onBeforeInput', 'onBlur', 'onCopy', 'onCut', 'onDrop', 'onInput', 'onKeyDown', 'onKeyUp', 'onPaste', 'onSelect'];

/**
 * A Slate plugin that wraps another `plugin` to make it only trigger when a
 * `when` function returns true.
 *
 * @param {Object} options
 * @return {Object}
 */

function SlateWhen() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var when = options.when,
      plugin = options.plugin;

  if (!when) throw new Error('You must provide a `when` option.');
  if (!plugin) throw new Error('You must provide a `plugin` option.');

  var wrapped = {};

  var _loop = function _loop(handler) {
    if (plugin[handler]) {
      wrapped[handler] = function (event, change, next) {
        if (!when(change.value)) return next();
        return plugin[handler](event, change, next);
      };
    }
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = PLUGIN_HANDLERS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var handler = _step.value;

      _loop(handler);
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

  return wrapped;
}

export default SlateWhen;
//# sourceMappingURL=slate-when.es.js.map
