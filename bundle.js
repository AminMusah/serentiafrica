(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],3:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

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

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":4}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
"use strict";

const tabs = document.querySelectorAll(".tab-btn");
const content = document.querySelectorAll(".tab-content");
const mainTabs = document.querySelectorAll(".main-tab-btn");
const mainContent = document.querySelectorAll(".main-tab-content");

// add event on multiple elements

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

// navbar functionality

const [navbar, navToggler, navbarLinks] = [
  document.querySelector("[data-navbar]"),
  document.querySelector("[data-nav-toggler]"),
  document.querySelectorAll("[data-nav-link]"),
];

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
  document.body.classList.toggle("active");
};

navToggler.addEventListener("click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
  document.body.classList.remove("active");
};

addEventOnElements(navbarLinks, "click", closeNavbar);

// header active

const header = document.querySelector("[data-header]");

const activeElemOnScroll = function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
};

window.addEventListener("scroll", activeElemOnScroll);

// scroll reveal effect

const revealElements = document.querySelectorAll("[data-reveal]");

const revealOnScroll = function () {
  for (let i = 0; i < revealElements.length; i++) {
    // add revealed class on element, when visible in window
    if (
      revealElements[i].getBoundingClientRect().top <
      window.innerHeight / 1.1
    ) {
      revealElements[i].classList.add("revealed");

      // remove long transition from button, after 1 second
      if (revealElements[i].classList.contains("btn")) {
        setTimeout(function () {
          revealElements[i].style.transition = "0.25s ease";
        }, 1000);
      }
    }
  }
};

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

//tabs

tabs.forEach((tab, index) => {
  tabs[index].classList.remove("active");

  tab.addEventListener("click", () => {
    content.forEach((contents) => {
      contents.classList.remove("active-content");
    });

    content[index].classList.add("active-content");
    tabs[index].classList.add("active");
  });
});

mainTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tab.classList.remove("active");
    mainContent.forEach((contents) => {
      contents.classList.remove("main-active-content");
    });

    mainContent[index].classList.add("main-active-content");
    tabs[index].classList.add("active");
  });
});

//year
const year = document.getElementById("year");
const currentYear = new Date();
year.innerHTML = currentYear.getFullYear();

//contentful
const contentful = require("contentful");
require("dotenv").config();

// const client = contentful.createClient({
//   space: process.env.SPACE,
//   accessToken: process.env.ACCESS_TOKEN
// })

// client.getEntries({
//   content_type:'blog'
// })
// .then((response) => console.log(response.items))
// .catch(console.error)

const client = contentful.createClient({
  space: "ev9chkm2wvy8",
  accessToken: "m7J1aVQCNPOMSnG1IWmd-_oUPS0uIJ9FTzzpUHcCUXg",
});

const container = document.querySelector(".blog-content");

{
  /* <img
src="${item.fields.image.fields.file.url}"
alt="${item.fields.title}"
class="w-100"
/>
</figure>

<div class="blogcontent">
<div class="blogcontent-top">
<a href="#" class="card-meta-link">
  <i class="ri-user-fill"></i>
  <span>by: ${item.fields.author || 'Admin'}</span>
</a>

<a href="#" class="card-meta-link">
  <i class="ri-price-tag-3-fill"></i>
  <span>${item.fields.service || 'Real estate'}</span>
</a>
</div>
<h3 class="h3 blogtitle">
<a href="#">${item.fields.title}</a>
</h3>
<div class="blogcontent-bottom">
<div class="publish-date">
  <i class="ri-calendar-todo-fill"></i>
  <time datetime="${new Date(
    item.sys.createdAt
  ).toLocaleString()}">${new Date(
item.sys.createdAt
).toLocaleString()}</time>
</div>

<a href="#" class="read-more-btn" data-post-id="${
  item.sys.id
}">Read More</a> */
}

client
  .getEntries({
    content_type: "blog",
  })
  .then((entries) => {
    console.log(entries);
    const html = entries.items
      .map(
        (item) => `
        <div class="blogcard">
        <figure class="blog-card-banner" data-reveal>
          <img
            src="${item.fields.title}"
            alt="${item.fields.image.fields.file.url}"
            class="w-100"
          />
        </figure>

        <div class="blogcontent">
          <div class="blogcontent-top">
            <a href="#" class="card-meta-link">
              <i class="ri-user-fill"></i>
              <span>by: ${item.fields.author || "Admin"}</span>
            </a>

            <a href="#" class="card-meta-link">
              <i class="ri-price-tag-3-fill"></i>
              <span>${item.fields.service || "Real estate"}</span>
            </a>
          </div>
          <h3 class="h3 blogtitle">
            <a href="#">${item.fields.title}</a>
          </h3>
          <div class="blogcontent-bottom">
            <div class="publish-date">
              <i class="ri-calendar-todo-fill"></i>
              <time datetime="${new Date(
                item.sys.createdAt
              ).toLocaleString()}">${new Date(
          item.sys.createdAt
        ).toLocaleString()}</time>
            </div>

            <a href="#" class="read-more-btn">Read More</a>
          </div>
        </div>
      </div>
  `
      )
      .join(" ");
    container.innerHTML = html;
  })
  .catch((error) => {
    console.log(error);
    if (error) {
      container.innerHTML = `  
      <div  class="not-found">
        <div class="error-content">
            <p>${error} :(</p> 
            <a href="/index.html">Go Home</a>
        </div>
      </div>`;
    } else {
      container.innerHTML = `  
      <div  class="not-found">
        <div class="error-content">
            <p>Oopss...Blog Post Not Found :(</p>
            <a href="/index.html">Go Home</a>
        </div>
      </div>`;
    }
  });

const singleBlog = `<header class="header">
<div class="header-bottom" data-header>
  <div class="container">
    <a href="blog.html" class="logo">
      <img
        src="images/7D1CAE8D-5631-415E-A139-0B95215A0B9F-removebg.png"
        width="216"
        height="80"
        alt="serenti"
        class="w-100"
      />
    </a>

    <a href='/blog.html' data-navbar style="color: white">
    < Go Back
    </a>
  </div>
</div>
</header>
<main>
<div class="post-hero">
  <div class="post-intro">
    <h1 class="single-blog-h1">Lorem</h1>
  
  </div>
</div>
<div class="post-media">
  <img
    src="/images/photo_6034830961490902251_y.jpg"
    alt=""
    class="single-post-banner"
  />
</div>
<article class="post-content">
  <div class="post-author-info">
    <div class="info-text">
    <p class="author-name">Linda Edwards</p>
    <p class="read-duration">5 min read</p>
    </div>
  </div>
  <p class="post-body">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Non autem
    atque obcaecati saepe quae veniam, corrupti voluptas asperiores natus
    aliquid quisquam vel deleniti modi laudantium possimus itaque! Magni
    perspiciatis aspernatur doloremque debitis corporis pariatur voluptate
    repellat adipisci vitae officia quas enim, quos natus quis tempore
    minus ipsum sint qui recusandae tenetur. Corrupti commodi iusto
    consequuntur vel pariatur maxime quia totam! Alias eveniet odio,
    molestias aliquam explicabo, qui expedita voluptate deleniti enim
    cupiditate doloribus nesciunt quia iusto! Cum eius quaerat
    exercitationem officiis necessitatibus ad dicta adipisci numquam nemo
    debitis accusantium labore distinctio impedit earum inventore porro
    qui voluptatibus ipsa odit ipsam, doloribus velit asperiores. Harum
    rerum odio reprehenderit eveniet distinctio laboriosam ipsum excepturi
    commodi animi a facere, iste provident sapiente similique, maxime
    assumenda amet illum quasi ipsam praesentium voluptate. Quibusdam
    placeat adipisci fuga magnam sequi odio iusto earum rerum vel, labore
    eius aliquam fugiat! Qui, ipsum itaque nostrum sapiente quia odit
    pariatur ipsam aut consectetur, quidem et esse tenetur magni laborum
    autem eius illum ducimus atque quo hic. Beatae modi quisquam sapiente
    quia minus assumenda qui, ducimus ea non ipsum, laudantium placeat
    natus accusantium at aperiam in maxime animi harum ad saepe,
    perspiciatis quidem cum nostrum eligendi. Magnam amet vitae nobis.
  </p>
</article>
</main>
<script src="bundle.js"></script>
`;

container.addEventListener("click", (event) => {
  const target = event.target.closest(".read-more-btn");

  if (target) {
    const htmlString = singleBlog;

    document.querySelector("body").innerHTML = htmlString;
    const postId = target.dataset.postId; // Replace with the actual data attribute name
    let url = window.location.href;
    if (url) {
      client
        .getEntries({
          content_type: "blog",
        })
        .then((entries) => {
          const hello = entries.items.filter((item) => {
            return postId === item.sys.id;
          });
          document.body.querySelector(".single-blog-h1").innerHTML =
            hello[0].fields.title;
          document.body.querySelector(".post-body").innerHTML =
            hello[0].fields.content.content[0].content[0].value;
          document.body.querySelector(".single-post-banner").src =
            hello[0].fields.image.fields.file.url;
          document.body.querySelector(".author-name").innerHTML =
            hello[0].fields.author || "Admin";
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
});

},{"contentful":6,"dotenv":7}],6:[function(require,module,exports){
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["contentful"] = factory();
	else
		root["contentful"] = factory();
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/axios/index.js":
/*!**************************************!*\
  !*** ../node_modules/axios/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__(/*! ./lib/axios */ \"../node_modules/axios/lib/axios.js\");\n\n//# sourceURL=webpack://contentful/../node_modules/axios/index.js?");

/***/ }),

/***/ "../node_modules/axios/lib/adapters/xhr.js":
/*!*************************************************!*\
  !*** ../node_modules/axios/lib/adapters/xhr.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\nvar settle = __webpack_require__(/*! ./../core/settle */ \"../node_modules/axios/lib/core/settle.js\");\nvar cookies = __webpack_require__(/*! ./../helpers/cookies */ \"../node_modules/axios/lib/helpers/cookies.js\");\nvar buildURL = __webpack_require__(/*! ./../helpers/buildURL */ \"../node_modules/axios/lib/helpers/buildURL.js\");\nvar buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ \"../node_modules/axios/lib/core/buildFullPath.js\");\nvar parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ \"../node_modules/axios/lib/helpers/parseHeaders.js\");\nvar isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ \"../node_modules/axios/lib/helpers/isURLSameOrigin.js\");\nvar createError = __webpack_require__(/*! ../core/createError */ \"../node_modules/axios/lib/core/createError.js\");\nvar transitionalDefaults = __webpack_require__(/*! ../defaults/transitional */ \"../node_modules/axios/lib/defaults/transitional.js\");\nvar Cancel = __webpack_require__(/*! ../cancel/Cancel */ \"../node_modules/axios/lib/cancel/Cancel.js\");\n\nmodule.exports = function xhrAdapter(config) {\n  return new Promise(function dispatchXhrRequest(resolve, reject) {\n    var requestData = config.data;\n    var requestHeaders = config.headers;\n    var responseType = config.responseType;\n    var onCanceled;\n    function done() {\n      if (config.cancelToken) {\n        config.cancelToken.unsubscribe(onCanceled);\n      }\n\n      if (config.signal) {\n        config.signal.removeEventListener('abort', onCanceled);\n      }\n    }\n\n    if (utils.isFormData(requestData)) {\n      delete requestHeaders['Content-Type']; // Let the browser set it\n    }\n\n    var request = new XMLHttpRequest();\n\n    // HTTP basic authentication\n    if (config.auth) {\n      var username = config.auth.username || '';\n      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';\n      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);\n    }\n\n    var fullPath = buildFullPath(config.baseURL, config.url);\n    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);\n\n    // Set the request timeout in MS\n    request.timeout = config.timeout;\n\n    function onloadend() {\n      if (!request) {\n        return;\n      }\n      // Prepare the response\n      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;\n      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?\n        request.responseText : request.response;\n      var response = {\n        data: responseData,\n        status: request.status,\n        statusText: request.statusText,\n        headers: responseHeaders,\n        config: config,\n        request: request\n      };\n\n      settle(function _resolve(value) {\n        resolve(value);\n        done();\n      }, function _reject(err) {\n        reject(err);\n        done();\n      }, response);\n\n      // Clean up request\n      request = null;\n    }\n\n    if ('onloadend' in request) {\n      // Use onloadend if available\n      request.onloadend = onloadend;\n    } else {\n      // Listen for ready state to emulate onloadend\n      request.onreadystatechange = function handleLoad() {\n        if (!request || request.readyState !== 4) {\n          return;\n        }\n\n        // The request errored out and we didn't get a response, this will be\n        // handled by onerror instead\n        // With one exception: request that using file: protocol, most browsers\n        // will return status as 0 even though it's a successful request\n        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {\n          return;\n        }\n        // readystate handler is calling before onerror or ontimeout handlers,\n        // so we should call onloadend on the next 'tick'\n        setTimeout(onloadend);\n      };\n    }\n\n    // Handle browser request cancellation (as opposed to a manual cancellation)\n    request.onabort = function handleAbort() {\n      if (!request) {\n        return;\n      }\n\n      reject(createError('Request aborted', config, 'ECONNABORTED', request));\n\n      // Clean up request\n      request = null;\n    };\n\n    // Handle low level network errors\n    request.onerror = function handleError() {\n      // Real errors are hidden from us by the browser\n      // onerror should only fire if it's a network error\n      reject(createError('Network Error', config, null, request));\n\n      // Clean up request\n      request = null;\n    };\n\n    // Handle timeout\n    request.ontimeout = function handleTimeout() {\n      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';\n      var transitional = config.transitional || transitionalDefaults;\n      if (config.timeoutErrorMessage) {\n        timeoutErrorMessage = config.timeoutErrorMessage;\n      }\n      reject(createError(\n        timeoutErrorMessage,\n        config,\n        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',\n        request));\n\n      // Clean up request\n      request = null;\n    };\n\n    // Add xsrf header\n    // This is only done if running in a standard browser environment.\n    // Specifically not if we're in a web worker, or react-native.\n    if (utils.isStandardBrowserEnv()) {\n      // Add xsrf header\n      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?\n        cookies.read(config.xsrfCookieName) :\n        undefined;\n\n      if (xsrfValue) {\n        requestHeaders[config.xsrfHeaderName] = xsrfValue;\n      }\n    }\n\n    // Add headers to the request\n    if ('setRequestHeader' in request) {\n      utils.forEach(requestHeaders, function setRequestHeader(val, key) {\n        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {\n          // Remove Content-Type if data is undefined\n          delete requestHeaders[key];\n        } else {\n          // Otherwise add header to the request\n          request.setRequestHeader(key, val);\n        }\n      });\n    }\n\n    // Add withCredentials to request if needed\n    if (!utils.isUndefined(config.withCredentials)) {\n      request.withCredentials = !!config.withCredentials;\n    }\n\n    // Add responseType to request if needed\n    if (responseType && responseType !== 'json') {\n      request.responseType = config.responseType;\n    }\n\n    // Handle progress if needed\n    if (typeof config.onDownloadProgress === 'function') {\n      request.addEventListener('progress', config.onDownloadProgress);\n    }\n\n    // Not all browsers support upload events\n    if (typeof config.onUploadProgress === 'function' && request.upload) {\n      request.upload.addEventListener('progress', config.onUploadProgress);\n    }\n\n    if (config.cancelToken || config.signal) {\n      // Handle cancellation\n      // eslint-disable-next-line func-names\n      onCanceled = function(cancel) {\n        if (!request) {\n          return;\n        }\n        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);\n        request.abort();\n        request = null;\n      };\n\n      config.cancelToken && config.cancelToken.subscribe(onCanceled);\n      if (config.signal) {\n        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);\n      }\n    }\n\n    if (!requestData) {\n      requestData = null;\n    }\n\n    // Send the request\n    request.send(requestData);\n  });\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/adapters/xhr.js?");

/***/ }),

/***/ "../node_modules/axios/lib/axios.js":
/*!******************************************!*\
  !*** ../node_modules/axios/lib/axios.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./utils */ \"../node_modules/axios/lib/utils.js\");\nvar bind = __webpack_require__(/*! ./helpers/bind */ \"../node_modules/axios/lib/helpers/bind.js\");\nvar Axios = __webpack_require__(/*! ./core/Axios */ \"../node_modules/axios/lib/core/Axios.js\");\nvar mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ \"../node_modules/axios/lib/core/mergeConfig.js\");\nvar defaults = __webpack_require__(/*! ./defaults */ \"../node_modules/axios/lib/defaults/index.js\");\n\n/**\n * Create an instance of Axios\n *\n * @param {Object} defaultConfig The default config for the instance\n * @return {Axios} A new instance of Axios\n */\nfunction createInstance(defaultConfig) {\n  var context = new Axios(defaultConfig);\n  var instance = bind(Axios.prototype.request, context);\n\n  // Copy axios.prototype to instance\n  utils.extend(instance, Axios.prototype, context);\n\n  // Copy context to instance\n  utils.extend(instance, context);\n\n  // Factory for creating new instances\n  instance.create = function create(instanceConfig) {\n    return createInstance(mergeConfig(defaultConfig, instanceConfig));\n  };\n\n  return instance;\n}\n\n// Create the default instance to be exported\nvar axios = createInstance(defaults);\n\n// Expose Axios class to allow class inheritance\naxios.Axios = Axios;\n\n// Expose Cancel & CancelToken\naxios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ \"../node_modules/axios/lib/cancel/Cancel.js\");\naxios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ \"../node_modules/axios/lib/cancel/CancelToken.js\");\naxios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ \"../node_modules/axios/lib/cancel/isCancel.js\");\naxios.VERSION = (__webpack_require__(/*! ./env/data */ \"../node_modules/axios/lib/env/data.js\").version);\n\n// Expose all/spread\naxios.all = function all(promises) {\n  return Promise.all(promises);\n};\naxios.spread = __webpack_require__(/*! ./helpers/spread */ \"../node_modules/axios/lib/helpers/spread.js\");\n\n// Expose isAxiosError\naxios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ \"../node_modules/axios/lib/helpers/isAxiosError.js\");\n\nmodule.exports = axios;\n\n// Allow use of default import syntax in TypeScript\nmodule.exports[\"default\"] = axios;\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/axios.js?");

/***/ }),

/***/ "../node_modules/axios/lib/cancel/Cancel.js":
/*!**************************************************!*\
  !*** ../node_modules/axios/lib/cancel/Cancel.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/**\n * A `Cancel` is an object that is thrown when an operation is canceled.\n *\n * @class\n * @param {string=} message The message.\n */\nfunction Cancel(message) {\n  this.message = message;\n}\n\nCancel.prototype.toString = function toString() {\n  return 'Cancel' + (this.message ? ': ' + this.message : '');\n};\n\nCancel.prototype.__CANCEL__ = true;\n\nmodule.exports = Cancel;\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/cancel/Cancel.js?");

/***/ }),

/***/ "../node_modules/axios/lib/cancel/CancelToken.js":
/*!*******************************************************!*\
  !*** ../node_modules/axios/lib/cancel/CancelToken.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar Cancel = __webpack_require__(/*! ./Cancel */ \"../node_modules/axios/lib/cancel/Cancel.js\");\n\n/**\n * A `CancelToken` is an object that can be used to request cancellation of an operation.\n *\n * @class\n * @param {Function} executor The executor function.\n */\nfunction CancelToken(executor) {\n  if (typeof executor !== 'function') {\n    throw new TypeError('executor must be a function.');\n  }\n\n  var resolvePromise;\n\n  this.promise = new Promise(function promiseExecutor(resolve) {\n    resolvePromise = resolve;\n  });\n\n  var token = this;\n\n  // eslint-disable-next-line func-names\n  this.promise.then(function(cancel) {\n    if (!token._listeners) return;\n\n    var i;\n    var l = token._listeners.length;\n\n    for (i = 0; i < l; i++) {\n      token._listeners[i](cancel);\n    }\n    token._listeners = null;\n  });\n\n  // eslint-disable-next-line func-names\n  this.promise.then = function(onfulfilled) {\n    var _resolve;\n    // eslint-disable-next-line func-names\n    var promise = new Promise(function(resolve) {\n      token.subscribe(resolve);\n      _resolve = resolve;\n    }).then(onfulfilled);\n\n    promise.cancel = function reject() {\n      token.unsubscribe(_resolve);\n    };\n\n    return promise;\n  };\n\n  executor(function cancel(message) {\n    if (token.reason) {\n      // Cancellation has already been requested\n      return;\n    }\n\n    token.reason = new Cancel(message);\n    resolvePromise(token.reason);\n  });\n}\n\n/**\n * Throws a `Cancel` if cancellation has been requested.\n */\nCancelToken.prototype.throwIfRequested = function throwIfRequested() {\n  if (this.reason) {\n    throw this.reason;\n  }\n};\n\n/**\n * Subscribe to the cancel signal\n */\n\nCancelToken.prototype.subscribe = function subscribe(listener) {\n  if (this.reason) {\n    listener(this.reason);\n    return;\n  }\n\n  if (this._listeners) {\n    this._listeners.push(listener);\n  } else {\n    this._listeners = [listener];\n  }\n};\n\n/**\n * Unsubscribe from the cancel signal\n */\n\nCancelToken.prototype.unsubscribe = function unsubscribe(listener) {\n  if (!this._listeners) {\n    return;\n  }\n  var index = this._listeners.indexOf(listener);\n  if (index !== -1) {\n    this._listeners.splice(index, 1);\n  }\n};\n\n/**\n * Returns an object that contains a new `CancelToken` and a function that, when called,\n * cancels the `CancelToken`.\n */\nCancelToken.source = function source() {\n  var cancel;\n  var token = new CancelToken(function executor(c) {\n    cancel = c;\n  });\n  return {\n    token: token,\n    cancel: cancel\n  };\n};\n\nmodule.exports = CancelToken;\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/cancel/CancelToken.js?");

/***/ }),

/***/ "../node_modules/axios/lib/cancel/isCancel.js":
/*!****************************************************!*\
  !*** ../node_modules/axios/lib/cancel/isCancel.js ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = function isCancel(value) {\n  return !!(value && value.__CANCEL__);\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/cancel/isCancel.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/Axios.js":
/*!***********************************************!*\
  !*** ../node_modules/axios/lib/core/Axios.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\nvar buildURL = __webpack_require__(/*! ../helpers/buildURL */ \"../node_modules/axios/lib/helpers/buildURL.js\");\nvar InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ \"../node_modules/axios/lib/core/InterceptorManager.js\");\nvar dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ \"../node_modules/axios/lib/core/dispatchRequest.js\");\nvar mergeConfig = __webpack_require__(/*! ./mergeConfig */ \"../node_modules/axios/lib/core/mergeConfig.js\");\nvar validator = __webpack_require__(/*! ../helpers/validator */ \"../node_modules/axios/lib/helpers/validator.js\");\n\nvar validators = validator.validators;\n/**\n * Create a new instance of Axios\n *\n * @param {Object} instanceConfig The default config for the instance\n */\nfunction Axios(instanceConfig) {\n  this.defaults = instanceConfig;\n  this.interceptors = {\n    request: new InterceptorManager(),\n    response: new InterceptorManager()\n  };\n}\n\n/**\n * Dispatch a request\n *\n * @param {Object} config The config specific for this request (merged with this.defaults)\n */\nAxios.prototype.request = function request(configOrUrl, config) {\n  /*eslint no-param-reassign:0*/\n  // Allow for axios('example/url'[, config]) a la fetch API\n  if (typeof configOrUrl === 'string') {\n    config = config || {};\n    config.url = configOrUrl;\n  } else {\n    config = configOrUrl || {};\n  }\n\n  config = mergeConfig(this.defaults, config);\n\n  // Set config.method\n  if (config.method) {\n    config.method = config.method.toLowerCase();\n  } else if (this.defaults.method) {\n    config.method = this.defaults.method.toLowerCase();\n  } else {\n    config.method = 'get';\n  }\n\n  var transitional = config.transitional;\n\n  if (transitional !== undefined) {\n    validator.assertOptions(transitional, {\n      silentJSONParsing: validators.transitional(validators.boolean),\n      forcedJSONParsing: validators.transitional(validators.boolean),\n      clarifyTimeoutError: validators.transitional(validators.boolean)\n    }, false);\n  }\n\n  // filter out skipped interceptors\n  var requestInterceptorChain = [];\n  var synchronousRequestInterceptors = true;\n  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {\n    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {\n      return;\n    }\n\n    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;\n\n    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);\n  });\n\n  var responseInterceptorChain = [];\n  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {\n    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);\n  });\n\n  var promise;\n\n  if (!synchronousRequestInterceptors) {\n    var chain = [dispatchRequest, undefined];\n\n    Array.prototype.unshift.apply(chain, requestInterceptorChain);\n    chain = chain.concat(responseInterceptorChain);\n\n    promise = Promise.resolve(config);\n    while (chain.length) {\n      promise = promise.then(chain.shift(), chain.shift());\n    }\n\n    return promise;\n  }\n\n\n  var newConfig = config;\n  while (requestInterceptorChain.length) {\n    var onFulfilled = requestInterceptorChain.shift();\n    var onRejected = requestInterceptorChain.shift();\n    try {\n      newConfig = onFulfilled(newConfig);\n    } catch (error) {\n      onRejected(error);\n      break;\n    }\n  }\n\n  try {\n    promise = dispatchRequest(newConfig);\n  } catch (error) {\n    return Promise.reject(error);\n  }\n\n  while (responseInterceptorChain.length) {\n    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());\n  }\n\n  return promise;\n};\n\nAxios.prototype.getUri = function getUri(config) {\n  config = mergeConfig(this.defaults, config);\n  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\\?/, '');\n};\n\n// Provide aliases for supported request methods\nutils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {\n  /*eslint func-names:0*/\n  Axios.prototype[method] = function(url, config) {\n    return this.request(mergeConfig(config || {}, {\n      method: method,\n      url: url,\n      data: (config || {}).data\n    }));\n  };\n});\n\nutils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {\n  /*eslint func-names:0*/\n  Axios.prototype[method] = function(url, data, config) {\n    return this.request(mergeConfig(config || {}, {\n      method: method,\n      url: url,\n      data: data\n    }));\n  };\n});\n\nmodule.exports = Axios;\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/Axios.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/InterceptorManager.js":
/*!************************************************************!*\
  !*** ../node_modules/axios/lib/core/InterceptorManager.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\n\nfunction InterceptorManager() {\n  this.handlers = [];\n}\n\n/**\n * Add a new interceptor to the stack\n *\n * @param {Function} fulfilled The function to handle `then` for a `Promise`\n * @param {Function} rejected The function to handle `reject` for a `Promise`\n *\n * @return {Number} An ID used to remove interceptor later\n */\nInterceptorManager.prototype.use = function use(fulfilled, rejected, options) {\n  this.handlers.push({\n    fulfilled: fulfilled,\n    rejected: rejected,\n    synchronous: options ? options.synchronous : false,\n    runWhen: options ? options.runWhen : null\n  });\n  return this.handlers.length - 1;\n};\n\n/**\n * Remove an interceptor from the stack\n *\n * @param {Number} id The ID that was returned by `use`\n */\nInterceptorManager.prototype.eject = function eject(id) {\n  if (this.handlers[id]) {\n    this.handlers[id] = null;\n  }\n};\n\n/**\n * Iterate over all the registered interceptors\n *\n * This method is particularly useful for skipping over any\n * interceptors that may have become `null` calling `eject`.\n *\n * @param {Function} fn The function to call for each interceptor\n */\nInterceptorManager.prototype.forEach = function forEach(fn) {\n  utils.forEach(this.handlers, function forEachHandler(h) {\n    if (h !== null) {\n      fn(h);\n    }\n  });\n};\n\nmodule.exports = InterceptorManager;\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/InterceptorManager.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/buildFullPath.js":
/*!*******************************************************!*\
  !*** ../node_modules/axios/lib/core/buildFullPath.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ \"../node_modules/axios/lib/helpers/isAbsoluteURL.js\");\nvar combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ \"../node_modules/axios/lib/helpers/combineURLs.js\");\n\n/**\n * Creates a new URL by combining the baseURL with the requestedURL,\n * only when the requestedURL is not already an absolute URL.\n * If the requestURL is absolute, this function returns the requestedURL untouched.\n *\n * @param {string} baseURL The base URL\n * @param {string} requestedURL Absolute or relative URL to combine\n * @returns {string} The combined full path\n */\nmodule.exports = function buildFullPath(baseURL, requestedURL) {\n  if (baseURL && !isAbsoluteURL(requestedURL)) {\n    return combineURLs(baseURL, requestedURL);\n  }\n  return requestedURL;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/buildFullPath.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/createError.js":
/*!*****************************************************!*\
  !*** ../node_modules/axios/lib/core/createError.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar enhanceError = __webpack_require__(/*! ./enhanceError */ \"../node_modules/axios/lib/core/enhanceError.js\");\n\n/**\n * Create an Error with the specified message, config, error code, request and response.\n *\n * @param {string} message The error message.\n * @param {Object} config The config.\n * @param {string} [code] The error code (for example, 'ECONNABORTED').\n * @param {Object} [request] The request.\n * @param {Object} [response] The response.\n * @returns {Error} The created error.\n */\nmodule.exports = function createError(message, config, code, request, response) {\n  var error = new Error(message);\n  return enhanceError(error, config, code, request, response);\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/createError.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/dispatchRequest.js":
/*!*********************************************************!*\
  !*** ../node_modules/axios/lib/core/dispatchRequest.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\nvar transformData = __webpack_require__(/*! ./transformData */ \"../node_modules/axios/lib/core/transformData.js\");\nvar isCancel = __webpack_require__(/*! ../cancel/isCancel */ \"../node_modules/axios/lib/cancel/isCancel.js\");\nvar defaults = __webpack_require__(/*! ../defaults */ \"../node_modules/axios/lib/defaults/index.js\");\nvar Cancel = __webpack_require__(/*! ../cancel/Cancel */ \"../node_modules/axios/lib/cancel/Cancel.js\");\n\n/**\n * Throws a `Cancel` if cancellation has been requested.\n */\nfunction throwIfCancellationRequested(config) {\n  if (config.cancelToken) {\n    config.cancelToken.throwIfRequested();\n  }\n\n  if (config.signal && config.signal.aborted) {\n    throw new Cancel('canceled');\n  }\n}\n\n/**\n * Dispatch a request to the server using the configured adapter.\n *\n * @param {object} config The config that is to be used for the request\n * @returns {Promise} The Promise to be fulfilled\n */\nmodule.exports = function dispatchRequest(config) {\n  throwIfCancellationRequested(config);\n\n  // Ensure headers exist\n  config.headers = config.headers || {};\n\n  // Transform request data\n  config.data = transformData.call(\n    config,\n    config.data,\n    config.headers,\n    config.transformRequest\n  );\n\n  // Flatten headers\n  config.headers = utils.merge(\n    config.headers.common || {},\n    config.headers[config.method] || {},\n    config.headers\n  );\n\n  utils.forEach(\n    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],\n    function cleanHeaderConfig(method) {\n      delete config.headers[method];\n    }\n  );\n\n  var adapter = config.adapter || defaults.adapter;\n\n  return adapter(config).then(function onAdapterResolution(response) {\n    throwIfCancellationRequested(config);\n\n    // Transform response data\n    response.data = transformData.call(\n      config,\n      response.data,\n      response.headers,\n      config.transformResponse\n    );\n\n    return response;\n  }, function onAdapterRejection(reason) {\n    if (!isCancel(reason)) {\n      throwIfCancellationRequested(config);\n\n      // Transform response data\n      if (reason && reason.response) {\n        reason.response.data = transformData.call(\n          config,\n          reason.response.data,\n          reason.response.headers,\n          config.transformResponse\n        );\n      }\n    }\n\n    return Promise.reject(reason);\n  });\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/dispatchRequest.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/enhanceError.js":
/*!******************************************************!*\
  !*** ../node_modules/axios/lib/core/enhanceError.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/**\n * Update an Error with the specified config, error code, and response.\n *\n * @param {Error} error The error to update.\n * @param {Object} config The config.\n * @param {string} [code] The error code (for example, 'ECONNABORTED').\n * @param {Object} [request] The request.\n * @param {Object} [response] The response.\n * @returns {Error} The error.\n */\nmodule.exports = function enhanceError(error, config, code, request, response) {\n  error.config = config;\n  if (code) {\n    error.code = code;\n  }\n\n  error.request = request;\n  error.response = response;\n  error.isAxiosError = true;\n\n  error.toJSON = function toJSON() {\n    return {\n      // Standard\n      message: this.message,\n      name: this.name,\n      // Microsoft\n      description: this.description,\n      number: this.number,\n      // Mozilla\n      fileName: this.fileName,\n      lineNumber: this.lineNumber,\n      columnNumber: this.columnNumber,\n      stack: this.stack,\n      // Axios\n      config: this.config,\n      code: this.code,\n      status: this.response && this.response.status ? this.response.status : null\n    };\n  };\n  return error;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/enhanceError.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/mergeConfig.js":
/*!*****************************************************!*\
  !*** ../node_modules/axios/lib/core/mergeConfig.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ../utils */ \"../node_modules/axios/lib/utils.js\");\n\n/**\n * Config-specific merge-function which creates a new config-object\n * by merging two configuration objects together.\n *\n * @param {Object} config1\n * @param {Object} config2\n * @returns {Object} New object resulting from merging config2 to config1\n */\nmodule.exports = function mergeConfig(config1, config2) {\n  // eslint-disable-next-line no-param-reassign\n  config2 = config2 || {};\n  var config = {};\n\n  function getMergedValue(target, source) {\n    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {\n      return utils.merge(target, source);\n    } else if (utils.isPlainObject(source)) {\n      return utils.merge({}, source);\n    } else if (utils.isArray(source)) {\n      return source.slice();\n    }\n    return source;\n  }\n\n  // eslint-disable-next-line consistent-return\n  function mergeDeepProperties(prop) {\n    if (!utils.isUndefined(config2[prop])) {\n      return getMergedValue(config1[prop], config2[prop]);\n    } else if (!utils.isUndefined(config1[prop])) {\n      return getMergedValue(undefined, config1[prop]);\n    }\n  }\n\n  // eslint-disable-next-line consistent-return\n  function valueFromConfig2(prop) {\n    if (!utils.isUndefined(config2[prop])) {\n      return getMergedValue(undefined, config2[prop]);\n    }\n  }\n\n  // eslint-disable-next-line consistent-return\n  function defaultToConfig2(prop) {\n    if (!utils.isUndefined(config2[prop])) {\n      return getMergedValue(undefined, config2[prop]);\n    } else if (!utils.isUndefined(config1[prop])) {\n      return getMergedValue(undefined, config1[prop]);\n    }\n  }\n\n  // eslint-disable-next-line consistent-return\n  function mergeDirectKeys(prop) {\n    if (prop in config2) {\n      return getMergedValue(config1[prop], config2[prop]);\n    } else if (prop in config1) {\n      return getMergedValue(undefined, config1[prop]);\n    }\n  }\n\n  var mergeMap = {\n    'url': valueFromConfig2,\n    'method': valueFromConfig2,\n    'data': valueFromConfig2,\n    'baseURL': defaultToConfig2,\n    'transformRequest': defaultToConfig2,\n    'transformResponse': defaultToConfig2,\n    'paramsSerializer': defaultToConfig2,\n    'timeout': defaultToConfig2,\n    'timeoutMessage': defaultToConfig2,\n    'withCredentials': defaultToConfig2,\n    'adapter': defaultToConfig2,\n    'responseType': defaultToConfig2,\n    'xsrfCookieName': defaultToConfig2,\n    'xsrfHeaderName': defaultToConfig2,\n    'onUploadProgress': defaultToConfig2,\n    'onDownloadProgress': defaultToConfig2,\n    'decompress': defaultToConfig2,\n    'maxContentLength': defaultToConfig2,\n    'maxBodyLength': defaultToConfig2,\n    'transport': defaultToConfig2,\n    'httpAgent': defaultToConfig2,\n    'httpsAgent': defaultToConfig2,\n    'cancelToken': defaultToConfig2,\n    'socketPath': defaultToConfig2,\n    'responseEncoding': defaultToConfig2,\n    'validateStatus': mergeDirectKeys\n  };\n\n  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {\n    var merge = mergeMap[prop] || mergeDeepProperties;\n    var configValue = merge(prop);\n    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);\n  });\n\n  return config;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/mergeConfig.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/settle.js":
/*!************************************************!*\
  !*** ../node_modules/axios/lib/core/settle.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar createError = __webpack_require__(/*! ./createError */ \"../node_modules/axios/lib/core/createError.js\");\n\n/**\n * Resolve or reject a Promise based on response status.\n *\n * @param {Function} resolve A function that resolves the promise.\n * @param {Function} reject A function that rejects the promise.\n * @param {object} response The response.\n */\nmodule.exports = function settle(resolve, reject, response) {\n  var validateStatus = response.config.validateStatus;\n  if (!response.status || !validateStatus || validateStatus(response.status)) {\n    resolve(response);\n  } else {\n    reject(createError(\n      'Request failed with status code ' + response.status,\n      response.config,\n      null,\n      response.request,\n      response\n    ));\n  }\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/settle.js?");

/***/ }),

/***/ "../node_modules/axios/lib/core/transformData.js":
/*!*******************************************************!*\
  !*** ../node_modules/axios/lib/core/transformData.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\nvar defaults = __webpack_require__(/*! ../defaults */ \"../node_modules/axios/lib/defaults/index.js\");\n\n/**\n * Transform the data for a request or a response\n *\n * @param {Object|String} data The data to be transformed\n * @param {Array} headers The headers for the request or response\n * @param {Array|Function} fns A single function or Array of functions\n * @returns {*} The resulting transformed data\n */\nmodule.exports = function transformData(data, headers, fns) {\n  var context = this || defaults;\n  /*eslint no-param-reassign:0*/\n  utils.forEach(fns, function transform(fn) {\n    data = fn.call(context, data, headers);\n  });\n\n  return data;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/core/transformData.js?");

/***/ }),

/***/ "../node_modules/axios/lib/defaults/index.js":
/*!***************************************************!*\
  !*** ../node_modules/axios/lib/defaults/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ../utils */ \"../node_modules/axios/lib/utils.js\");\nvar normalizeHeaderName = __webpack_require__(/*! ../helpers/normalizeHeaderName */ \"../node_modules/axios/lib/helpers/normalizeHeaderName.js\");\nvar enhanceError = __webpack_require__(/*! ../core/enhanceError */ \"../node_modules/axios/lib/core/enhanceError.js\");\nvar transitionalDefaults = __webpack_require__(/*! ./transitional */ \"../node_modules/axios/lib/defaults/transitional.js\");\n\nvar DEFAULT_CONTENT_TYPE = {\n  'Content-Type': 'application/x-www-form-urlencoded'\n};\n\nfunction setContentTypeIfUnset(headers, value) {\n  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {\n    headers['Content-Type'] = value;\n  }\n}\n\nfunction getDefaultAdapter() {\n  var adapter;\n  if (typeof XMLHttpRequest !== 'undefined') {\n    // For browsers use XHR adapter\n    adapter = __webpack_require__(/*! ../adapters/xhr */ \"../node_modules/axios/lib/adapters/xhr.js\");\n  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {\n    // For node use HTTP adapter\n    adapter = __webpack_require__(/*! ../adapters/http */ \"../node_modules/axios/lib/adapters/xhr.js\");\n  }\n  return adapter;\n}\n\nfunction stringifySafely(rawValue, parser, encoder) {\n  if (utils.isString(rawValue)) {\n    try {\n      (parser || JSON.parse)(rawValue);\n      return utils.trim(rawValue);\n    } catch (e) {\n      if (e.name !== 'SyntaxError') {\n        throw e;\n      }\n    }\n  }\n\n  return (encoder || JSON.stringify)(rawValue);\n}\n\nvar defaults = {\n\n  transitional: transitionalDefaults,\n\n  adapter: getDefaultAdapter(),\n\n  transformRequest: [function transformRequest(data, headers) {\n    normalizeHeaderName(headers, 'Accept');\n    normalizeHeaderName(headers, 'Content-Type');\n\n    if (utils.isFormData(data) ||\n      utils.isArrayBuffer(data) ||\n      utils.isBuffer(data) ||\n      utils.isStream(data) ||\n      utils.isFile(data) ||\n      utils.isBlob(data)\n    ) {\n      return data;\n    }\n    if (utils.isArrayBufferView(data)) {\n      return data.buffer;\n    }\n    if (utils.isURLSearchParams(data)) {\n      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');\n      return data.toString();\n    }\n    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {\n      setContentTypeIfUnset(headers, 'application/json');\n      return stringifySafely(data);\n    }\n    return data;\n  }],\n\n  transformResponse: [function transformResponse(data) {\n    var transitional = this.transitional || defaults.transitional;\n    var silentJSONParsing = transitional && transitional.silentJSONParsing;\n    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;\n    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';\n\n    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {\n      try {\n        return JSON.parse(data);\n      } catch (e) {\n        if (strictJSONParsing) {\n          if (e.name === 'SyntaxError') {\n            throw enhanceError(e, this, 'E_JSON_PARSE');\n          }\n          throw e;\n        }\n      }\n    }\n\n    return data;\n  }],\n\n  /**\n   * A timeout in milliseconds to abort a request. If set to 0 (default) a\n   * timeout is not created.\n   */\n  timeout: 0,\n\n  xsrfCookieName: 'XSRF-TOKEN',\n  xsrfHeaderName: 'X-XSRF-TOKEN',\n\n  maxContentLength: -1,\n  maxBodyLength: -1,\n\n  validateStatus: function validateStatus(status) {\n    return status >= 200 && status < 300;\n  },\n\n  headers: {\n    common: {\n      'Accept': 'application/json, text/plain, */*'\n    }\n  }\n};\n\nutils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {\n  defaults.headers[method] = {};\n});\n\nutils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {\n  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);\n});\n\nmodule.exports = defaults;\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/defaults/index.js?");

/***/ }),

/***/ "../node_modules/axios/lib/defaults/transitional.js":
/*!**********************************************************!*\
  !*** ../node_modules/axios/lib/defaults/transitional.js ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = {\n  silentJSONParsing: true,\n  forcedJSONParsing: true,\n  clarifyTimeoutError: false\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/defaults/transitional.js?");

/***/ }),

/***/ "../node_modules/axios/lib/env/data.js":
/*!*********************************************!*\
  !*** ../node_modules/axios/lib/env/data.js ***!
  \*********************************************/
/***/ ((module) => {

eval("module.exports = {\n  \"version\": \"0.26.1\"\n};\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/env/data.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/bind.js":
/*!*************************************************!*\
  !*** ../node_modules/axios/lib/helpers/bind.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = function bind(fn, thisArg) {\n  return function wrap() {\n    var args = new Array(arguments.length);\n    for (var i = 0; i < args.length; i++) {\n      args[i] = arguments[i];\n    }\n    return fn.apply(thisArg, args);\n  };\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/bind.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/buildURL.js":
/*!*****************************************************!*\
  !*** ../node_modules/axios/lib/helpers/buildURL.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\n\nfunction encode(val) {\n  return encodeURIComponent(val).\n    replace(/%3A/gi, ':').\n    replace(/%24/g, '$').\n    replace(/%2C/gi, ',').\n    replace(/%20/g, '+').\n    replace(/%5B/gi, '[').\n    replace(/%5D/gi, ']');\n}\n\n/**\n * Build a URL by appending params to the end\n *\n * @param {string} url The base of the url (e.g., http://www.google.com)\n * @param {object} [params] The params to be appended\n * @returns {string} The formatted url\n */\nmodule.exports = function buildURL(url, params, paramsSerializer) {\n  /*eslint no-param-reassign:0*/\n  if (!params) {\n    return url;\n  }\n\n  var serializedParams;\n  if (paramsSerializer) {\n    serializedParams = paramsSerializer(params);\n  } else if (utils.isURLSearchParams(params)) {\n    serializedParams = params.toString();\n  } else {\n    var parts = [];\n\n    utils.forEach(params, function serialize(val, key) {\n      if (val === null || typeof val === 'undefined') {\n        return;\n      }\n\n      if (utils.isArray(val)) {\n        key = key + '[]';\n      } else {\n        val = [val];\n      }\n\n      utils.forEach(val, function parseValue(v) {\n        if (utils.isDate(v)) {\n          v = v.toISOString();\n        } else if (utils.isObject(v)) {\n          v = JSON.stringify(v);\n        }\n        parts.push(encode(key) + '=' + encode(v));\n      });\n    });\n\n    serializedParams = parts.join('&');\n  }\n\n  if (serializedParams) {\n    var hashmarkIndex = url.indexOf('#');\n    if (hashmarkIndex !== -1) {\n      url = url.slice(0, hashmarkIndex);\n    }\n\n    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;\n  }\n\n  return url;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/buildURL.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/combineURLs.js":
/*!********************************************************!*\
  !*** ../node_modules/axios/lib/helpers/combineURLs.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/**\n * Creates a new URL by combining the specified URLs\n *\n * @param {string} baseURL The base URL\n * @param {string} relativeURL The relative URL\n * @returns {string} The combined URL\n */\nmodule.exports = function combineURLs(baseURL, relativeURL) {\n  return relativeURL\n    ? baseURL.replace(/\\/+$/, '') + '/' + relativeURL.replace(/^\\/+/, '')\n    : baseURL;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/combineURLs.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/cookies.js":
/*!****************************************************!*\
  !*** ../node_modules/axios/lib/helpers/cookies.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\n\nmodule.exports = (\n  utils.isStandardBrowserEnv() ?\n\n  // Standard browser envs support document.cookie\n    (function standardBrowserEnv() {\n      return {\n        write: function write(name, value, expires, path, domain, secure) {\n          var cookie = [];\n          cookie.push(name + '=' + encodeURIComponent(value));\n\n          if (utils.isNumber(expires)) {\n            cookie.push('expires=' + new Date(expires).toGMTString());\n          }\n\n          if (utils.isString(path)) {\n            cookie.push('path=' + path);\n          }\n\n          if (utils.isString(domain)) {\n            cookie.push('domain=' + domain);\n          }\n\n          if (secure === true) {\n            cookie.push('secure');\n          }\n\n          document.cookie = cookie.join('; ');\n        },\n\n        read: function read(name) {\n          var match = document.cookie.match(new RegExp('(^|;\\\\s*)(' + name + ')=([^;]*)'));\n          return (match ? decodeURIComponent(match[3]) : null);\n        },\n\n        remove: function remove(name) {\n          this.write(name, '', Date.now() - 86400000);\n        }\n      };\n    })() :\n\n  // Non standard browser env (web workers, react-native) lack needed support.\n    (function nonStandardBrowserEnv() {\n      return {\n        write: function write() {},\n        read: function read() { return null; },\n        remove: function remove() {}\n      };\n    })()\n);\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/cookies.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!**********************************************************!*\
  !*** ../node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/**\n * Determines whether the specified URL is absolute\n *\n * @param {string} url The URL to test\n * @returns {boolean} True if the specified URL is absolute, otherwise false\n */\nmodule.exports = function isAbsoluteURL(url) {\n  // A URL is considered absolute if it begins with \"<scheme>://\" or \"//\" (protocol-relative URL).\n  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed\n  // by any combination of letters, digits, plus, period, or hyphen.\n  return /^([a-z][a-z\\d+\\-.]*:)?\\/\\//i.test(url);\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/isAbsoluteURL.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/isAxiosError.js":
/*!*********************************************************!*\
  !*** ../node_modules/axios/lib/helpers/isAxiosError.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\n\n/**\n * Determines whether the payload is an error thrown by Axios\n *\n * @param {*} payload The value to test\n * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false\n */\nmodule.exports = function isAxiosError(payload) {\n  return utils.isObject(payload) && (payload.isAxiosError === true);\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/isAxiosError.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!************************************************************!*\
  !*** ../node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\n\nmodule.exports = (\n  utils.isStandardBrowserEnv() ?\n\n  // Standard browser envs have full support of the APIs needed to test\n  // whether the request URL is of the same origin as current location.\n    (function standardBrowserEnv() {\n      var msie = /(msie|trident)/i.test(navigator.userAgent);\n      var urlParsingNode = document.createElement('a');\n      var originURL;\n\n      /**\n    * Parse a URL to discover it's components\n    *\n    * @param {String} url The URL to be parsed\n    * @returns {Object}\n    */\n      function resolveURL(url) {\n        var href = url;\n\n        if (msie) {\n        // IE needs attribute set twice to normalize properties\n          urlParsingNode.setAttribute('href', href);\n          href = urlParsingNode.href;\n        }\n\n        urlParsingNode.setAttribute('href', href);\n\n        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils\n        return {\n          href: urlParsingNode.href,\n          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',\n          host: urlParsingNode.host,\n          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\\?/, '') : '',\n          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',\n          hostname: urlParsingNode.hostname,\n          port: urlParsingNode.port,\n          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?\n            urlParsingNode.pathname :\n            '/' + urlParsingNode.pathname\n        };\n      }\n\n      originURL = resolveURL(window.location.href);\n\n      /**\n    * Determine if a URL shares the same origin as the current location\n    *\n    * @param {String} requestURL The URL to test\n    * @returns {boolean} True if URL shares the same origin, otherwise false\n    */\n      return function isURLSameOrigin(requestURL) {\n        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;\n        return (parsed.protocol === originURL.protocol &&\n            parsed.host === originURL.host);\n      };\n    })() :\n\n  // Non standard browser envs (web workers, react-native) lack needed support.\n    (function nonStandardBrowserEnv() {\n      return function isURLSameOrigin() {\n        return true;\n      };\n    })()\n);\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/isURLSameOrigin.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!****************************************************************!*\
  !*** ../node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ../utils */ \"../node_modules/axios/lib/utils.js\");\n\nmodule.exports = function normalizeHeaderName(headers, normalizedName) {\n  utils.forEach(headers, function processHeader(value, name) {\n    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {\n      headers[normalizedName] = value;\n      delete headers[name];\n    }\n  });\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/normalizeHeaderName.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/parseHeaders.js":
/*!*********************************************************!*\
  !*** ../node_modules/axios/lib/helpers/parseHeaders.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./../utils */ \"../node_modules/axios/lib/utils.js\");\n\n// Headers whose duplicates are ignored by node\n// c.f. https://nodejs.org/api/http.html#http_message_headers\nvar ignoreDuplicateOf = [\n  'age', 'authorization', 'content-length', 'content-type', 'etag',\n  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',\n  'last-modified', 'location', 'max-forwards', 'proxy-authorization',\n  'referer', 'retry-after', 'user-agent'\n];\n\n/**\n * Parse headers into an object\n *\n * ```\n * Date: Wed, 27 Aug 2014 08:58:49 GMT\n * Content-Type: application/json\n * Connection: keep-alive\n * Transfer-Encoding: chunked\n * ```\n *\n * @param {String} headers Headers needing to be parsed\n * @returns {Object} Headers parsed into an object\n */\nmodule.exports = function parseHeaders(headers) {\n  var parsed = {};\n  var key;\n  var val;\n  var i;\n\n  if (!headers) { return parsed; }\n\n  utils.forEach(headers.split('\\n'), function parser(line) {\n    i = line.indexOf(':');\n    key = utils.trim(line.substr(0, i)).toLowerCase();\n    val = utils.trim(line.substr(i + 1));\n\n    if (key) {\n      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {\n        return;\n      }\n      if (key === 'set-cookie') {\n        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);\n      } else {\n        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;\n      }\n    }\n  });\n\n  return parsed;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/parseHeaders.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/spread.js":
/*!***************************************************!*\
  !*** ../node_modules/axios/lib/helpers/spread.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/**\n * Syntactic sugar for invoking a function and expanding an array for arguments.\n *\n * Common use case would be to use `Function.prototype.apply`.\n *\n *  ```js\n *  function f(x, y, z) {}\n *  var args = [1, 2, 3];\n *  f.apply(null, args);\n *  ```\n *\n * With `spread` this example can be re-written.\n *\n *  ```js\n *  spread(function(x, y, z) {})([1, 2, 3]);\n *  ```\n *\n * @param {Function} callback\n * @returns {Function}\n */\nmodule.exports = function spread(callback) {\n  return function wrap(arr) {\n    return callback.apply(null, arr);\n  };\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/spread.js?");

/***/ }),

/***/ "../node_modules/axios/lib/helpers/validator.js":
/*!******************************************************!*\
  !*** ../node_modules/axios/lib/helpers/validator.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar VERSION = (__webpack_require__(/*! ../env/data */ \"../node_modules/axios/lib/env/data.js\").version);\n\nvar validators = {};\n\n// eslint-disable-next-line func-names\n['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {\n  validators[type] = function validator(thing) {\n    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;\n  };\n});\n\nvar deprecatedWarnings = {};\n\n/**\n * Transitional option validator\n * @param {function|boolean?} validator - set to false if the transitional option has been removed\n * @param {string?} version - deprecated version / removed since version\n * @param {string?} message - some message with additional info\n * @returns {function}\n */\nvalidators.transitional = function transitional(validator, version, message) {\n  function formatMessage(opt, desc) {\n    return '[Axios v' + VERSION + '] Transitional option \\'' + opt + '\\'' + desc + (message ? '. ' + message : '');\n  }\n\n  // eslint-disable-next-line func-names\n  return function(value, opt, opts) {\n    if (validator === false) {\n      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));\n    }\n\n    if (version && !deprecatedWarnings[opt]) {\n      deprecatedWarnings[opt] = true;\n      // eslint-disable-next-line no-console\n      console.warn(\n        formatMessage(\n          opt,\n          ' has been deprecated since v' + version + ' and will be removed in the near future'\n        )\n      );\n    }\n\n    return validator ? validator(value, opt, opts) : true;\n  };\n};\n\n/**\n * Assert object's properties type\n * @param {object} options\n * @param {object} schema\n * @param {boolean?} allowUnknown\n */\n\nfunction assertOptions(options, schema, allowUnknown) {\n  if (typeof options !== 'object') {\n    throw new TypeError('options must be an object');\n  }\n  var keys = Object.keys(options);\n  var i = keys.length;\n  while (i-- > 0) {\n    var opt = keys[i];\n    var validator = schema[opt];\n    if (validator) {\n      var value = options[opt];\n      var result = value === undefined || validator(value, opt, options);\n      if (result !== true) {\n        throw new TypeError('option ' + opt + ' must be ' + result);\n      }\n      continue;\n    }\n    if (allowUnknown !== true) {\n      throw Error('Unknown option ' + opt);\n    }\n  }\n}\n\nmodule.exports = {\n  assertOptions: assertOptions,\n  validators: validators\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/helpers/validator.js?");

/***/ }),

/***/ "../node_modules/axios/lib/utils.js":
/*!******************************************!*\
  !*** ../node_modules/axios/lib/utils.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar bind = __webpack_require__(/*! ./helpers/bind */ \"../node_modules/axios/lib/helpers/bind.js\");\n\n// utils is a library of generic helper functions non-specific to axios\n\nvar toString = Object.prototype.toString;\n\n/**\n * Determine if a value is an Array\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is an Array, otherwise false\n */\nfunction isArray(val) {\n  return Array.isArray(val);\n}\n\n/**\n * Determine if a value is undefined\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if the value is undefined, otherwise false\n */\nfunction isUndefined(val) {\n  return typeof val === 'undefined';\n}\n\n/**\n * Determine if a value is a Buffer\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a Buffer, otherwise false\n */\nfunction isBuffer(val) {\n  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)\n    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);\n}\n\n/**\n * Determine if a value is an ArrayBuffer\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is an ArrayBuffer, otherwise false\n */\nfunction isArrayBuffer(val) {\n  return toString.call(val) === '[object ArrayBuffer]';\n}\n\n/**\n * Determine if a value is a FormData\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is an FormData, otherwise false\n */\nfunction isFormData(val) {\n  return toString.call(val) === '[object FormData]';\n}\n\n/**\n * Determine if a value is a view on an ArrayBuffer\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false\n */\nfunction isArrayBufferView(val) {\n  var result;\n  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {\n    result = ArrayBuffer.isView(val);\n  } else {\n    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));\n  }\n  return result;\n}\n\n/**\n * Determine if a value is a String\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a String, otherwise false\n */\nfunction isString(val) {\n  return typeof val === 'string';\n}\n\n/**\n * Determine if a value is a Number\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a Number, otherwise false\n */\nfunction isNumber(val) {\n  return typeof val === 'number';\n}\n\n/**\n * Determine if a value is an Object\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is an Object, otherwise false\n */\nfunction isObject(val) {\n  return val !== null && typeof val === 'object';\n}\n\n/**\n * Determine if a value is a plain Object\n *\n * @param {Object} val The value to test\n * @return {boolean} True if value is a plain Object, otherwise false\n */\nfunction isPlainObject(val) {\n  if (toString.call(val) !== '[object Object]') {\n    return false;\n  }\n\n  var prototype = Object.getPrototypeOf(val);\n  return prototype === null || prototype === Object.prototype;\n}\n\n/**\n * Determine if a value is a Date\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a Date, otherwise false\n */\nfunction isDate(val) {\n  return toString.call(val) === '[object Date]';\n}\n\n/**\n * Determine if a value is a File\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a File, otherwise false\n */\nfunction isFile(val) {\n  return toString.call(val) === '[object File]';\n}\n\n/**\n * Determine if a value is a Blob\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a Blob, otherwise false\n */\nfunction isBlob(val) {\n  return toString.call(val) === '[object Blob]';\n}\n\n/**\n * Determine if a value is a Function\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a Function, otherwise false\n */\nfunction isFunction(val) {\n  return toString.call(val) === '[object Function]';\n}\n\n/**\n * Determine if a value is a Stream\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a Stream, otherwise false\n */\nfunction isStream(val) {\n  return isObject(val) && isFunction(val.pipe);\n}\n\n/**\n * Determine if a value is a URLSearchParams object\n *\n * @param {Object} val The value to test\n * @returns {boolean} True if value is a URLSearchParams object, otherwise false\n */\nfunction isURLSearchParams(val) {\n  return toString.call(val) === '[object URLSearchParams]';\n}\n\n/**\n * Trim excess whitespace off the beginning and end of a string\n *\n * @param {String} str The String to trim\n * @returns {String} The String freed of excess whitespace\n */\nfunction trim(str) {\n  return str.trim ? str.trim() : str.replace(/^\\s+|\\s+$/g, '');\n}\n\n/**\n * Determine if we're running in a standard browser environment\n *\n * This allows axios to run in a web worker, and react-native.\n * Both environments support XMLHttpRequest, but not fully standard globals.\n *\n * web workers:\n *  typeof window -> undefined\n *  typeof document -> undefined\n *\n * react-native:\n *  navigator.product -> 'ReactNative'\n * nativescript\n *  navigator.product -> 'NativeScript' or 'NS'\n */\nfunction isStandardBrowserEnv() {\n  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||\n                                           navigator.product === 'NativeScript' ||\n                                           navigator.product === 'NS')) {\n    return false;\n  }\n  return (\n    typeof window !== 'undefined' &&\n    typeof document !== 'undefined'\n  );\n}\n\n/**\n * Iterate over an Array or an Object invoking a function for each item.\n *\n * If `obj` is an Array callback will be called passing\n * the value, index, and complete array for each item.\n *\n * If 'obj' is an Object callback will be called passing\n * the value, key, and complete object for each property.\n *\n * @param {Object|Array} obj The object to iterate\n * @param {Function} fn The callback to invoke for each item\n */\nfunction forEach(obj, fn) {\n  // Don't bother if no value provided\n  if (obj === null || typeof obj === 'undefined') {\n    return;\n  }\n\n  // Force an array if not already something iterable\n  if (typeof obj !== 'object') {\n    /*eslint no-param-reassign:0*/\n    obj = [obj];\n  }\n\n  if (isArray(obj)) {\n    // Iterate over array values\n    for (var i = 0, l = obj.length; i < l; i++) {\n      fn.call(null, obj[i], i, obj);\n    }\n  } else {\n    // Iterate over object keys\n    for (var key in obj) {\n      if (Object.prototype.hasOwnProperty.call(obj, key)) {\n        fn.call(null, obj[key], key, obj);\n      }\n    }\n  }\n}\n\n/**\n * Accepts varargs expecting each argument to be an object, then\n * immutably merges the properties of each object and returns result.\n *\n * When multiple objects contain the same key the later object in\n * the arguments list will take precedence.\n *\n * Example:\n *\n * ```js\n * var result = merge({foo: 123}, {foo: 456});\n * console.log(result.foo); // outputs 456\n * ```\n *\n * @param {Object} obj1 Object to merge\n * @returns {Object} Result of all merge properties\n */\nfunction merge(/* obj1, obj2, obj3, ... */) {\n  var result = {};\n  function assignValue(val, key) {\n    if (isPlainObject(result[key]) && isPlainObject(val)) {\n      result[key] = merge(result[key], val);\n    } else if (isPlainObject(val)) {\n      result[key] = merge({}, val);\n    } else if (isArray(val)) {\n      result[key] = val.slice();\n    } else {\n      result[key] = val;\n    }\n  }\n\n  for (var i = 0, l = arguments.length; i < l; i++) {\n    forEach(arguments[i], assignValue);\n  }\n  return result;\n}\n\n/**\n * Extends object a by mutably adding to it the properties of object b.\n *\n * @param {Object} a The object to be extended\n * @param {Object} b The object to copy properties from\n * @param {Object} thisArg The object to bind function to\n * @return {Object} The resulting value of object a\n */\nfunction extend(a, b, thisArg) {\n  forEach(b, function assignValue(val, key) {\n    if (thisArg && typeof val === 'function') {\n      a[key] = bind(val, thisArg);\n    } else {\n      a[key] = val;\n    }\n  });\n  return a;\n}\n\n/**\n * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)\n *\n * @param {string} content with BOM\n * @return {string} content value without BOM\n */\nfunction stripBOM(content) {\n  if (content.charCodeAt(0) === 0xFEFF) {\n    content = content.slice(1);\n  }\n  return content;\n}\n\nmodule.exports = {\n  isArray: isArray,\n  isArrayBuffer: isArrayBuffer,\n  isBuffer: isBuffer,\n  isFormData: isFormData,\n  isArrayBufferView: isArrayBufferView,\n  isString: isString,\n  isNumber: isNumber,\n  isObject: isObject,\n  isPlainObject: isPlainObject,\n  isUndefined: isUndefined,\n  isDate: isDate,\n  isFile: isFile,\n  isBlob: isBlob,\n  isFunction: isFunction,\n  isStream: isStream,\n  isURLSearchParams: isURLSearchParams,\n  isStandardBrowserEnv: isStandardBrowserEnv,\n  forEach: forEach,\n  merge: merge,\n  extend: extend,\n  trim: trim,\n  stripBOM: stripBOM\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/axios/lib/utils.js?");

/***/ }),

/***/ "../node_modules/call-bind/callBound.js":
/*!**********************************************!*\
  !*** ../node_modules/call-bind/callBound.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar GetIntrinsic = __webpack_require__(/*! get-intrinsic */ \"../node_modules/get-intrinsic/index.js\");\n\nvar callBind = __webpack_require__(/*! ./ */ \"../node_modules/call-bind/index.js\");\n\nvar $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));\n\nmodule.exports = function callBoundIntrinsic(name, allowMissing) {\n\tvar intrinsic = GetIntrinsic(name, !!allowMissing);\n\tif (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {\n\t\treturn callBind(intrinsic);\n\t}\n\treturn intrinsic;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/call-bind/callBound.js?");

/***/ }),

/***/ "../node_modules/call-bind/index.js":
/*!******************************************!*\
  !*** ../node_modules/call-bind/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar bind = __webpack_require__(/*! function-bind */ \"../node_modules/function-bind/index.js\");\nvar GetIntrinsic = __webpack_require__(/*! get-intrinsic */ \"../node_modules/get-intrinsic/index.js\");\n\nvar $apply = GetIntrinsic('%Function.prototype.apply%');\nvar $call = GetIntrinsic('%Function.prototype.call%');\nvar $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);\n\nvar $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);\nvar $defineProperty = GetIntrinsic('%Object.defineProperty%', true);\nvar $max = GetIntrinsic('%Math.max%');\n\nif ($defineProperty) {\n\ttry {\n\t\t$defineProperty({}, 'a', { value: 1 });\n\t} catch (e) {\n\t\t// IE 8 has a broken defineProperty\n\t\t$defineProperty = null;\n\t}\n}\n\nmodule.exports = function callBind(originalFunction) {\n\tvar func = $reflectApply(bind, $call, arguments);\n\tif ($gOPD && $defineProperty) {\n\t\tvar desc = $gOPD(func, 'length');\n\t\tif (desc.configurable) {\n\t\t\t// original length, plus the receiver, minus any additional arguments (after the receiver)\n\t\t\t$defineProperty(\n\t\t\t\tfunc,\n\t\t\t\t'length',\n\t\t\t\t{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }\n\t\t\t);\n\t\t}\n\t}\n\treturn func;\n};\n\nvar applyBind = function applyBind() {\n\treturn $reflectApply(bind, $apply, arguments);\n};\n\nif ($defineProperty) {\n\t$defineProperty(module.exports, 'apply', { value: applyBind });\n} else {\n\tmodule.exports.apply = applyBind;\n}\n\n\n//# sourceURL=webpack://contentful/../node_modules/call-bind/index.js?");

/***/ }),

/***/ "../node_modules/contentful-resolve-response/dist/esm/index.js":
/*!*********************************************************************!*\
  !*** ../node_modules/contentful-resolve-response/dist/esm/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var fast_copy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fast-copy */ \"../node_modules/fast-copy/dist/fast-copy.js\");\n/* harmony import */ var fast_copy__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fast_copy__WEBPACK_IMPORTED_MODULE_0__);\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"]) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); } }; }();\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\n\n\nvar UNRESOLVED_LINK = {}; // unique object to avoid polyfill bloat using Symbol()\n\n/**\n * isLink Function\n * Checks if the object has sys.type \"Link\"\n * @param object\n */\nvar isLink = function isLink(object) {\n  return object && object.sys && object.sys.type === 'Link';\n};\n\n/**\n * isResourceLink Function\n * Checks if the object has sys.type \"ResourceLink\"\n * @param object\n */\nvar isResourceLink = function isResourceLink(object) {\n  return object && object.sys && object.sys.type === 'ResourceLink';\n};\n\n/**\n * Creates a key with spaceId and a key without for entityMap\n *\n * @param {*} sys\n * @param {String} sys.type\n * @param {String} sys.id\n * @param {*} sys.space\n * @param {*} sys.space.sys\n * @param {String} sys.space.id\n * @return {string[]}\n */\nvar makeEntityMapKeys = function makeEntityMapKeys(sys) {\n  return sys.space ? [sys.type + '!' + sys.id, sys.space.sys.id + '!' + sys.type + '!' + sys.id] : [sys.type + '!' + sys.id];\n};\n\n/**\n * Looks up in entityMap\n *\n * @param entityMap\n * @param {*} linkData\n * @param {String} linkData.type\n * @param {String} linkData.linkType\n * @param {String} linkData.id\n * @param {String} linkData.urn\n * @return {String}\n */\nvar lookupInEntityMap = function lookupInEntityMap(entityMap, linkData) {\n  var entryId = linkData.entryId,\n      linkType = linkData.linkType,\n      spaceId = linkData.spaceId;\n\n  if (spaceId) {\n    return entityMap.get(spaceId + '!' + linkType + '!' + entryId);\n  }\n  return entityMap.get(linkType + '!' + entryId);\n};\n\n/**\n * getResolvedLink Function\n *\n * @param entityMap\n * @param link\n * @return {undefined}\n */\nvar getResolvedLink = function getResolvedLink(entityMap, link) {\n  var _link$sys = link.sys,\n      type = _link$sys.type,\n      linkType = _link$sys.linkType;\n\n  if (type === 'ResourceLink') {\n    var urn = link.sys.urn;\n\n    var regExp = /.*:spaces\\/([A-Za-z0-9]*)\\/entries\\/([A-Za-z0-9]*)/;\n    if (!regExp.test(urn)) {\n      return UNRESOLVED_LINK;\n    }\n\n    var _urn$match = urn.match(regExp),\n        _urn$match2 = _slicedToArray(_urn$match, 3),\n        _ = _urn$match2[0],\n        spaceId = _urn$match2[1],\n        _entryId = _urn$match2[2];\n\n    var extractedLinkType = linkType.split(':')[1];\n    return lookupInEntityMap(entityMap, { linkType: extractedLinkType, entryId: _entryId, spaceId: spaceId }) || UNRESOLVED_LINK;\n  }\n  var entryId = link.sys.id;\n\n  return lookupInEntityMap(entityMap, { linkType: linkType, entryId: entryId }) || UNRESOLVED_LINK;\n};\n\n/**\n * cleanUpLinks Function\n * - Removes unresolvable links from Arrays and Objects\n *\n * @param {Object[]|Object} input\n */\nvar cleanUpLinks = function cleanUpLinks(input) {\n  if (Array.isArray(input)) {\n    return input.filter(function (val) {\n      return val !== UNRESOLVED_LINK;\n    });\n  }\n  for (var key in input) {\n    if (input[key] === UNRESOLVED_LINK) {\n      delete input[key];\n    }\n  }\n  return input;\n};\n\n/**\n * walkMutate Function\n * @param input\n * @param predicate\n * @param mutator\n * @param removeUnresolved\n * @return {*}\n */\nvar walkMutate = function walkMutate(input, predicate, mutator, removeUnresolved) {\n  if (predicate(input)) {\n    return mutator(input);\n  }\n\n  if (input && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {\n    for (var key in input) {\n      // eslint-disable-next-line no-prototype-builtins\n      if (input.hasOwnProperty(key)) {\n        input[key] = walkMutate(input[key], predicate, mutator, removeUnresolved);\n      }\n    }\n    if (removeUnresolved) {\n      input = cleanUpLinks(input);\n    }\n  }\n  return input;\n};\n\nvar normalizeLink = function normalizeLink(entityMap, link, removeUnresolved) {\n  var resolvedLink = getResolvedLink(entityMap, link);\n  if (resolvedLink === UNRESOLVED_LINK) {\n    return removeUnresolved ? resolvedLink : link;\n  }\n  return resolvedLink;\n};\n\nvar makeEntryObject = function makeEntryObject(item, itemEntryPoints) {\n  if (!Array.isArray(itemEntryPoints)) {\n    return item;\n  }\n\n  var entryPoints = Object.keys(item).filter(function (ownKey) {\n    return itemEntryPoints.indexOf(ownKey) !== -1;\n  });\n\n  return entryPoints.reduce(function (entryObj, entryPoint) {\n    entryObj[entryPoint] = item[entryPoint];\n    return entryObj;\n  }, {});\n};\n\n/**\n * resolveResponse Function\n * Resolves contentful response to normalized form.\n * @param {Object} response Contentful response\n * @param {{removeUnresolved: Boolean, itemEntryPoints: Array<String>}|{}} options\n * @param {Boolean} options.removeUnresolved - Remove unresolved links default:false\n * @param {Array<String>} options.itemEntryPoints - Resolve links only in those item properties\n * @return {Object}\n */\nvar resolveResponse = function resolveResponse(response, options) {\n  options = options || {};\n  if (!response.items) {\n    return [];\n  }\n  var responseClone = fast_copy__WEBPACK_IMPORTED_MODULE_0___default()(response);\n  var allIncludes = Object.keys(responseClone.includes || {}).reduce(function (all, type) {\n    return [].concat(_toConsumableArray(all), _toConsumableArray(response.includes[type]));\n  }, []);\n\n  var allEntries = [].concat(_toConsumableArray(responseClone.items), _toConsumableArray(allIncludes)).filter(function (entity) {\n    return Boolean(entity.sys);\n  });\n\n  var entityMap = new Map(allEntries.reduce(function (acc, entity) {\n    var entries = makeEntityMapKeys(entity.sys).map(function (key) {\n      return [key, entity];\n    });\n    acc.push.apply(acc, _toConsumableArray(entries));\n    return acc;\n  }, []));\n\n  allEntries.forEach(function (item) {\n    var entryObject = makeEntryObject(item, options.itemEntryPoints);\n\n    Object.assign(item, walkMutate(entryObject, function (x) {\n      return isLink(x) || isResourceLink(x);\n    }, function (link) {\n      return normalizeLink(entityMap, link, options.removeUnresolved);\n    }, options.removeUnresolved));\n  });\n\n  return responseClone.items;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (resolveResponse);\n\n//# sourceURL=webpack://contentful/../node_modules/contentful-resolve-response/dist/esm/index.js?");

/***/ }),

/***/ "../node_modules/contentful-sdk-core/dist/index.es-modules.js":
/*!********************************************************************!*\
  !*** ../node_modules/contentful-sdk-core/dist/index.es-modules.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createHttpClient\": () => (/* binding */ createHttpClient),\n/* harmony export */   \"createRequestConfig\": () => (/* binding */ createRequestConfig),\n/* harmony export */   \"enforceObjPath\": () => (/* binding */ enforceObjPath),\n/* harmony export */   \"errorHandler\": () => (/* binding */ errorHandler),\n/* harmony export */   \"freezeSys\": () => (/* binding */ freezeSys),\n/* harmony export */   \"getUserAgentHeader\": () => (/* binding */ getUserAgentHeader),\n/* harmony export */   \"toPlainObject\": () => (/* binding */ toPlainObject)\n/* harmony export */ });\n/* harmony import */ var fast_copy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fast-copy */ \"../node_modules/fast-copy/dist/fast-copy.js\");\n/* harmony import */ var fast_copy__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fast_copy__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! qs */ \"../node_modules/qs/lib/index.js\");\n/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var lodash_isstring__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash.isstring */ \"../node_modules/lodash.isstring/index.js\");\n/* harmony import */ var lodash_isstring__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_isstring__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var p_throttle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! p-throttle */ \"../node_modules/p-throttle/index.js\");\n/* harmony import */ var p_throttle__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(p_throttle__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var lodash_isplainobject__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash.isplainobject */ \"../node_modules/lodash.isplainobject/index.js\");\n/* harmony import */ var lodash_isplainobject__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_isplainobject__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\n\nfunction _iterableToArrayLimit(arr, i) {\n  var _i = null == arr ? null : \"undefined\" != typeof Symbol && arr[Symbol.iterator] || arr[\"@@iterator\"];\n  if (null != _i) {\n    var _s,\n      _e,\n      _x,\n      _r,\n      _arr = [],\n      _n = !0,\n      _d = !1;\n    try {\n      if (_x = (_i = _i.call(arr)).next, 0 === i) {\n        if (Object(_i) !== _i) return;\n        _n = !1;\n      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);\n    } catch (err) {\n      _d = !0, _e = err;\n    } finally {\n      try {\n        if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;\n      } finally {\n        if (_d) throw _e;\n      }\n    }\n    return _arr;\n  }\n}\nfunction ownKeys(object, enumerableOnly) {\n  var keys = Object.keys(object);\n  if (Object.getOwnPropertySymbols) {\n    var symbols = Object.getOwnPropertySymbols(object);\n    enumerableOnly && (symbols = symbols.filter(function (sym) {\n      return Object.getOwnPropertyDescriptor(object, sym).enumerable;\n    })), keys.push.apply(keys, symbols);\n  }\n  return keys;\n}\nfunction _objectSpread2(target) {\n  for (var i = 1; i < arguments.length; i++) {\n    var source = null != arguments[i] ? arguments[i] : {};\n    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {\n      _defineProperty(target, key, source[key]);\n    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {\n      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));\n    });\n  }\n  return target;\n}\nfunction _typeof(obj) {\n  \"@babel/helpers - typeof\";\n\n  return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (obj) {\n    return typeof obj;\n  } : function (obj) {\n    return obj && \"function\" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n  }, _typeof(obj);\n}\nfunction _wrapRegExp() {\n  _wrapRegExp = function (re, groups) {\n    return new BabelRegExp(re, void 0, groups);\n  };\n  var _super = RegExp.prototype,\n    _groups = new WeakMap();\n  function BabelRegExp(re, flags, groups) {\n    var _this = new RegExp(re, flags);\n    return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);\n  }\n  function buildGroups(result, re) {\n    var g = _groups.get(re);\n    return Object.keys(g).reduce(function (groups, name) {\n      var i = g[name];\n      if (\"number\" == typeof i) groups[name] = result[i];else {\n        for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) k++;\n        groups[name] = result[i[k]];\n      }\n      return groups;\n    }, Object.create(null));\n  }\n  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {\n    var result = _super.exec.call(this, str);\n    if (result) {\n      result.groups = buildGroups(result, this);\n      var indices = result.indices;\n      indices && (indices.groups = buildGroups(indices, this));\n    }\n    return result;\n  }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {\n    if (\"string\" == typeof substitution) {\n      var groups = _groups.get(this);\n      return _super[Symbol.replace].call(this, str, substitution.replace(/\\$<([^>]+)>/g, function (_, name) {\n        var group = groups[name];\n        return \"$\" + (Array.isArray(group) ? group.join(\"$\") : group);\n      }));\n    }\n    if (\"function\" == typeof substitution) {\n      var _this = this;\n      return _super[Symbol.replace].call(this, str, function () {\n        var args = arguments;\n        return \"object\" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);\n      });\n    }\n    return _super[Symbol.replace].call(this, str, substitution);\n  }, _wrapRegExp.apply(this, arguments);\n}\nfunction _defineProperty(obj, key, value) {\n  key = _toPropertyKey(key);\n  if (key in obj) {\n    Object.defineProperty(obj, key, {\n      value: value,\n      enumerable: true,\n      configurable: true,\n      writable: true\n    });\n  } else {\n    obj[key] = value;\n  }\n  return obj;\n}\nfunction _inherits(subClass, superClass) {\n  if (typeof superClass !== \"function\" && superClass !== null) {\n    throw new TypeError(\"Super expression must either be null or a function\");\n  }\n  subClass.prototype = Object.create(superClass && superClass.prototype, {\n    constructor: {\n      value: subClass,\n      writable: true,\n      configurable: true\n    }\n  });\n  Object.defineProperty(subClass, \"prototype\", {\n    writable: false\n  });\n  if (superClass) _setPrototypeOf(subClass, superClass);\n}\nfunction _setPrototypeOf(o, p) {\n  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {\n    o.__proto__ = p;\n    return o;\n  };\n  return _setPrototypeOf(o, p);\n}\nfunction _slicedToArray(arr, i) {\n  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();\n}\nfunction _arrayWithHoles(arr) {\n  if (Array.isArray(arr)) return arr;\n}\nfunction _unsupportedIterableToArray(o, minLen) {\n  if (!o) return;\n  if (typeof o === \"string\") return _arrayLikeToArray(o, minLen);\n  var n = Object.prototype.toString.call(o).slice(8, -1);\n  if (n === \"Object\" && o.constructor) n = o.constructor.name;\n  if (n === \"Map\" || n === \"Set\") return Array.from(o);\n  if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);\n}\nfunction _arrayLikeToArray(arr, len) {\n  if (len == null || len > arr.length) len = arr.length;\n  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];\n  return arr2;\n}\nfunction _nonIterableRest() {\n  throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");\n}\nfunction _createForOfIteratorHelper(o, allowArrayLike) {\n  var it = typeof Symbol !== \"undefined\" && o[Symbol.iterator] || o[\"@@iterator\"];\n  if (!it) {\n    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") {\n      if (it) o = it;\n      var i = 0;\n      var F = function () {};\n      return {\n        s: F,\n        n: function () {\n          if (i >= o.length) return {\n            done: true\n          };\n          return {\n            done: false,\n            value: o[i++]\n          };\n        },\n        e: function (e) {\n          throw e;\n        },\n        f: F\n      };\n    }\n    throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");\n  }\n  var normalCompletion = true,\n    didErr = false,\n    err;\n  return {\n    s: function () {\n      it = it.call(o);\n    },\n    n: function () {\n      var step = it.next();\n      normalCompletion = step.done;\n      return step;\n    },\n    e: function (e) {\n      didErr = true;\n      err = e;\n    },\n    f: function () {\n      try {\n        if (!normalCompletion && it.return != null) it.return();\n      } finally {\n        if (didErr) throw err;\n      }\n    }\n  };\n}\nfunction _toPrimitive(input, hint) {\n  if (typeof input !== \"object\" || input === null) return input;\n  var prim = input[Symbol.toPrimitive];\n  if (prim !== undefined) {\n    var res = prim.call(input, hint || \"default\");\n    if (typeof res !== \"object\") return res;\n    throw new TypeError(\"@@toPrimitive must return a primitive value.\");\n  }\n  return (hint === \"string\" ? String : Number)(input);\n}\nfunction _toPropertyKey(arg) {\n  var key = _toPrimitive(arg, \"string\");\n  return typeof key === \"symbol\" ? key : String(key);\n}\n\nfunction isNode() {\n  /**\n   * Polyfills of 'process' might set process.browser === true\n   *\n   * See:\n   * https://github.com/webpack/node-libs-browser/blob/master/mock/process.js#L8\n   * https://github.com/defunctzombie/node-process/blob/master/browser.js#L156\n   **/\n  return typeof process !== 'undefined' && !process.browser;\n}\nfunction isReactNative() {\n  return typeof window !== 'undefined' && 'navigator' in window && 'product' in window.navigator && window.navigator.product === 'ReactNative';\n}\nfunction getNodeVersion() {\n  return process.versions && process.versions.node ? \"v\".concat(process.versions.node) : process.version;\n}\nfunction getWindow() {\n  return window;\n}\nfunction noop() {\n  return undefined;\n}\n\nvar PERCENTAGE_REGEX = /*#__PURE__*/_wrapRegExp(/(\\d+)(%)/, {\n  value: 1\n});\nfunction calculateLimit(type) {\n  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;\n  var limit = max;\n  if (PERCENTAGE_REGEX.test(type)) {\n    var _type$match;\n    var groups = (_type$match = type.match(PERCENTAGE_REGEX)) === null || _type$match === void 0 ? void 0 : _type$match.groups;\n    if (groups && groups.value) {\n      var percentage = parseInt(groups.value) / 100;\n      limit = Math.round(max * percentage);\n    }\n  }\n  return Math.min(30, Math.max(1, limit));\n}\nfunction createThrottle(limit, logger) {\n  logger('info', \"Throttle request to \".concat(limit, \"/s\"));\n  return p_throttle__WEBPACK_IMPORTED_MODULE_3___default()({\n    limit: limit,\n    interval: 1000,\n    strict: false\n  });\n}\nvar rateLimitThrottle = (function (axiosInstance) {\n  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'auto';\n  var _axiosInstance$defaul = axiosInstance.defaults.logHandler,\n    logHandler = _axiosInstance$defaul === void 0 ? noop : _axiosInstance$defaul;\n  var limit = lodash_isstring__WEBPACK_IMPORTED_MODULE_2___default()(type) ? calculateLimit(type) : calculateLimit('auto', type);\n  var throttle = createThrottle(limit, logHandler);\n  var isCalculated = false;\n  var requestInterceptorId = axiosInstance.interceptors.request.use(function (config) {\n    return throttle(function () {\n      return config;\n    })();\n  }, function (error) {\n    return Promise.reject(error);\n  });\n  var responseInterceptorId = axiosInstance.interceptors.response.use(function (response) {\n    if (!isCalculated && lodash_isstring__WEBPACK_IMPORTED_MODULE_2___default()(type) && (type === 'auto' || PERCENTAGE_REGEX.test(type)) && response.headers && response.headers['x-contentful-ratelimit-second-limit']) {\n      var rawLimit = parseInt(response.headers['x-contentful-ratelimit-second-limit']);\n      var nextLimit = calculateLimit(type, rawLimit);\n      if (nextLimit !== limit) {\n        if (requestInterceptorId) {\n          axiosInstance.interceptors.request.eject(requestInterceptorId);\n        }\n        limit = nextLimit;\n        throttle = createThrottle(nextLimit, logHandler);\n        requestInterceptorId = axiosInstance.interceptors.request.use(function (config) {\n          return throttle(function () {\n            return config;\n          })();\n        }, function (error) {\n          return Promise.reject(error);\n        });\n      }\n      isCalculated = true;\n    }\n    return response;\n  }, function (error) {\n    return Promise.reject(error);\n  });\n  return function () {\n    axiosInstance.interceptors.request.eject(requestInterceptorId);\n    axiosInstance.interceptors.response.eject(responseInterceptorId);\n  };\n});\n\nvar delay = function delay(ms) {\n  return new Promise(function (resolve) {\n    setTimeout(resolve, ms);\n  });\n};\nvar defaultWait = function defaultWait(attempts) {\n  return Math.pow(Math.SQRT2, attempts);\n};\nfunction rateLimit(instance) {\n  var maxRetry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;\n  var _instance$defaults = instance.defaults,\n    _instance$defaults$re = _instance$defaults.responseLogger,\n    responseLogger = _instance$defaults$re === void 0 ? noop : _instance$defaults$re,\n    _instance$defaults$re2 = _instance$defaults.requestLogger,\n    requestLogger = _instance$defaults$re2 === void 0 ? noop : _instance$defaults$re2;\n  instance.interceptors.request.use(function (config) {\n    requestLogger(config);\n    return config;\n  }, function (error) {\n    requestLogger(error);\n    return Promise.reject(error);\n  });\n  instance.interceptors.response.use(function (response) {\n    // we don't need to do anything here\n    responseLogger(response);\n    return response;\n  }, function (error) {\n    var response = error.response;\n    var config = error.config;\n    responseLogger(error);\n    // Do not retry if it is disabled or no request config exists (not an axios error)\n    if (!config || !instance.defaults.retryOnError) {\n      return Promise.reject(error);\n    }\n\n    // Retried already for max attempts\n    var doneAttempts = config.attempts || 1;\n    if (doneAttempts > maxRetry) {\n      error.attempts = config.attempts;\n      return Promise.reject(error);\n    }\n    var retryErrorType = null;\n    var wait = defaultWait(doneAttempts);\n\n    // Errors without response did not receive anything from the server\n    if (!response) {\n      retryErrorType = 'Connection';\n    } else if (response.status >= 500 && response.status < 600) {\n      // 5** errors are server related\n      retryErrorType = \"Server \".concat(response.status);\n    } else if (response.status === 429) {\n      // 429 errors are exceeded rate limit exceptions\n      retryErrorType = 'Rate limit';\n      // all headers are lowercased by axios https://github.com/mzabriskie/axios/issues/413\n      if (response.headers && error.response.headers['x-contentful-ratelimit-reset']) {\n        wait = response.headers['x-contentful-ratelimit-reset'];\n      }\n    }\n    if (retryErrorType) {\n      // convert to ms and add jitter\n      wait = Math.floor(wait * 1000 + Math.random() * 200 + 500);\n      instance.defaults.logHandler('warning', \"\".concat(retryErrorType, \" error occurred. Waiting for \").concat(wait, \" ms before retrying...\"));\n\n      // increase attempts counter\n      config.attempts = doneAttempts + 1;\n\n      /* Somehow between the interceptor and retrying the request the httpAgent/httpsAgent gets transformed from an Agent-like object\n       to a regular object, causing failures on retries after rate limits. Removing these properties here fixes the error, but retry\n       requests still use the original http/httpsAgent property */\n      delete config.httpAgent;\n      delete config.httpsAgent;\n      return delay(wait).then(function () {\n        return instance(config);\n      });\n    }\n    return Promise.reject(error);\n  });\n}\n\nfunction asyncToken(instance, getToken) {\n  instance.interceptors.request.use(function (config) {\n    return getToken().then(function (accessToken) {\n      config.headers = _objectSpread2(_objectSpread2({}, config.headers), {}, {\n        Authorization: \"Bearer \".concat(accessToken)\n      });\n      return config;\n    });\n  });\n}\n\n// Matches 'sub.host:port' or 'host:port' and extracts hostname and port\n// Also enforces toplevel domain specified, no spaces and no protocol\nvar HOST_REGEX = /^(?!\\w+:\\/\\/)([^\\s:]+\\.?[^\\s:]+)(?::(\\d+))?(?!:)$/;\n\n/**\n * Create pre configured axios instance\n * @private\n * @param {AxiosStatic} axios - Axios library\n * @param {CreateHttpClientParams} options - Initialization parameters for the HTTP client\n * @return {ContentfulAxiosInstance} Initialized axios instance\n */\nfunction createHttpClient(axios, options) {\n  var defaultConfig = {\n    insecure: false,\n    retryOnError: true,\n    // eslint-disable-next-line @typescript-eslint/no-explicit-any\n    logHandler: function logHandler(level, data) {\n      if (level === 'error' && data) {\n        var title = [data.name, data.message].filter(function (a) {\n          return a;\n        }).join(' - ');\n        console.error(\"[error] \".concat(title));\n        console.error(data);\n        return;\n      }\n      console.log(\"[\".concat(level, \"] \").concat(data));\n    },\n    // Passed to axios\n    headers: {},\n    httpAgent: false,\n    httpsAgent: false,\n    timeout: 30000,\n    throttle: 0,\n    proxy: false,\n    basePath: '',\n    adapter: undefined,\n    maxContentLength: 1073741824,\n    // 1GB\n    maxBodyLength: 1073741824 // 1GB\n  };\n\n  var config = _objectSpread2(_objectSpread2({}, defaultConfig), options);\n  if (!config.accessToken) {\n    var missingAccessTokenError = new TypeError('Expected parameter accessToken');\n    config.logHandler('error', missingAccessTokenError);\n    throw missingAccessTokenError;\n  }\n\n  // Construct axios baseURL option\n  var protocol = config.insecure ? 'http' : 'https';\n  var space = config.space ? \"\".concat(config.space, \"/\") : '';\n  var hostname = config.defaultHostname;\n  var port = config.insecure ? 80 : 443;\n  if (config.host && HOST_REGEX.test(config.host)) {\n    var parsed = config.host.split(':');\n    if (parsed.length === 2) {\n      var _parsed = _slicedToArray(parsed, 2);\n      hostname = _parsed[0];\n      port = _parsed[1];\n    } else {\n      hostname = parsed[0];\n    }\n  }\n\n  // Ensure that basePath does start but not end with a slash\n  if (config.basePath) {\n    config.basePath = \"/\".concat(config.basePath.split('/').filter(Boolean).join('/'));\n  }\n  var baseURL = options.baseURL || \"\".concat(protocol, \"://\").concat(hostname, \":\").concat(port).concat(config.basePath, \"/spaces/\").concat(space);\n  if (!config.headers.Authorization && typeof config.accessToken !== 'function') {\n    config.headers.Authorization = 'Bearer ' + config.accessToken;\n  }\n  var axiosOptions = {\n    // Axios\n    baseURL: baseURL,\n    headers: config.headers,\n    httpAgent: config.httpAgent,\n    httpsAgent: config.httpsAgent,\n    paramsSerializer: (qs__WEBPACK_IMPORTED_MODULE_1___default().stringify),\n    proxy: config.proxy,\n    timeout: config.timeout,\n    adapter: config.adapter,\n    maxContentLength: config.maxContentLength,\n    maxBodyLength: config.maxBodyLength,\n    // Contentful\n    logHandler: config.logHandler,\n    responseLogger: config.responseLogger,\n    requestLogger: config.requestLogger,\n    retryOnError: config.retryOnError\n  };\n  var instance = axios.create(axiosOptions);\n  instance.httpClientParams = options;\n\n  /**\n   * Creates a new axios instance with the same default base parameters as the\n   * current one, and with any overrides passed to the newParams object\n   * This is useful as the SDKs use dependency injection to get the axios library\n   * and the version of the library comes from different places depending\n   * on whether it's a browser build or a node.js build.\n   * @private\n   * @param {CreateHttpClientParams} httpClientParams - Initialization parameters for the HTTP client\n   * @return {ContentfulAxiosInstance} Initialized axios instance\n   */\n  instance.cloneWithNewParams = function (newParams) {\n    return createHttpClient(axios, _objectSpread2(_objectSpread2({}, fast_copy__WEBPACK_IMPORTED_MODULE_0___default()(options)), newParams));\n  };\n\n  /**\n   * Apply interceptors.\n   * Please note that the order of interceptors is important\n   */\n\n  if (config.onBeforeRequest) {\n    instance.interceptors.request.use(config.onBeforeRequest);\n  }\n  if (typeof config.accessToken === 'function') {\n    asyncToken(instance, config.accessToken);\n  }\n  if (config.throttle) {\n    rateLimitThrottle(instance, config.throttle);\n  }\n  rateLimit(instance, config.retryLimit);\n  if (config.onError) {\n    instance.interceptors.response.use(function (response) {\n      return response;\n    }, config.onError);\n  }\n  return instance;\n}\n\n/* eslint-disable @typescript-eslint/no-explicit-any */\n/**\n * Creates request parameters configuration by parsing an existing query object\n * @private\n * @param {Object} query\n * @return {Object} Config object with `params` property, ready to be used in axios\n */\nfunction createRequestConfig(_ref) {\n  var query = _ref.query;\n  var config = {};\n  delete query.resolveLinks;\n  config.params = fast_copy__WEBPACK_IMPORTED_MODULE_0___default()(query);\n  return config;\n}\n\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction enforceObjPath(obj, path) {\n  if (!(path in obj)) {\n    var err = new Error();\n    err.name = 'PropertyMissing';\n    err.message = \"Required property \".concat(path, \" missing from:\\n\\n\").concat(JSON.stringify(obj), \"\\n\\n\");\n    throw err;\n  }\n  return true;\n}\n\n// copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze\n\nfunction deepFreeze(object) {\n  var propNames = Object.getOwnPropertyNames(object);\n  var _iterator = _createForOfIteratorHelper(propNames),\n    _step;\n  try {\n    for (_iterator.s(); !(_step = _iterator.n()).done;) {\n      var name = _step.value;\n      var value = object[name];\n      if (value && _typeof(value) === 'object') {\n        deepFreeze(value);\n      }\n    }\n  } catch (err) {\n    _iterator.e(err);\n  } finally {\n    _iterator.f();\n  }\n  return Object.freeze(object);\n}\nfunction freezeSys(obj) {\n  deepFreeze(obj.sys || {});\n  return obj;\n}\n\nfunction getBrowserOS() {\n  var win = getWindow();\n  if (!win) {\n    return null;\n  }\n  var userAgent = win.navigator.userAgent;\n  // TODO: platform is deprecated.\n  var platform = win.navigator.platform;\n  var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];\n  var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];\n  var iosPlatforms = ['iPhone', 'iPad', 'iPod'];\n  if (macosPlatforms.indexOf(platform) !== -1) {\n    return 'macOS';\n  } else if (iosPlatforms.indexOf(platform) !== -1) {\n    return 'iOS';\n  } else if (windowsPlatforms.indexOf(platform) !== -1) {\n    return 'Windows';\n  } else if (/Android/.test(userAgent)) {\n    return 'Android';\n  } else if (/Linux/.test(platform)) {\n    return 'Linux';\n  }\n  return null;\n}\nfunction getNodeOS() {\n  var platform = process.platform || 'linux';\n  var version = process.version || '0.0.0';\n  var platformMap = {\n    android: 'Android',\n    aix: 'Linux',\n    darwin: 'macOS',\n    freebsd: 'Linux',\n    linux: 'Linux',\n    openbsd: 'Linux',\n    sunos: 'Linux',\n    win32: 'Windows'\n  };\n  if (platform in platformMap) {\n    return \"\".concat(platformMap[platform] || 'Linux', \"/\").concat(version);\n  }\n  return null;\n}\nfunction getUserAgentHeader(sdk, application, integration, feature) {\n  var headerParts = [];\n  if (application) {\n    headerParts.push(\"app \".concat(application));\n  }\n  if (integration) {\n    headerParts.push(\"integration \".concat(integration));\n  }\n  if (feature) {\n    headerParts.push('feature ' + feature);\n  }\n  headerParts.push(\"sdk \".concat(sdk));\n  var platform = null;\n  try {\n    if (isReactNative()) {\n      platform = getBrowserOS();\n      headerParts.push('platform ReactNative');\n    } else if (isNode()) {\n      platform = getNodeOS();\n      headerParts.push(\"platform node.js/\".concat(getNodeVersion()));\n    } else {\n      platform = getBrowserOS();\n      headerParts.push('platform browser');\n    }\n  } catch (e) {\n    platform = null;\n  }\n  if (platform) {\n    headerParts.push(\"os \".concat(platform));\n  }\n  return \"\".concat(headerParts.filter(function (item) {\n    return item !== '';\n  }).join('; '), \";\");\n}\n\n/**\n * Mixes in a method to return just a plain object with no additional methods\n * @private\n * @param data - Any plain JSON response returned from the API\n * @return Enhanced object with toPlainObject method\n */\nfunction toPlainObject(data) {\n  // eslint-disable-next-line @typescript-eslint/ban-ts-comment\n  // @ts-expect-error\n  return Object.defineProperty(data, 'toPlainObject', {\n    enumerable: false,\n    configurable: false,\n    writable: false,\n    value: function value() {\n      return fast_copy__WEBPACK_IMPORTED_MODULE_0___default()(this);\n    }\n  });\n}\n\n/**\n * Handles errors received from the server. Parses the error into a more useful\n * format, places it in an exception and throws it.\n * See https://www.contentful.com/developers/docs/references/errors/\n * for more details on the data received on the errorResponse.data property\n * and the expected error codes.\n * @private\n */\nfunction errorHandler(errorResponse) {\n  var config = errorResponse.config,\n    response = errorResponse.response;\n  var errorName;\n\n  // Obscure the Management token\n  if (config && config.headers && config.headers['Authorization']) {\n    var token = \"...\".concat(config.headers['Authorization'].toString().substr(-5));\n    config.headers['Authorization'] = \"Bearer \".concat(token);\n  }\n  if (!lodash_isplainobject__WEBPACK_IMPORTED_MODULE_4___default()(response) || !lodash_isplainobject__WEBPACK_IMPORTED_MODULE_4___default()(config)) {\n    throw errorResponse;\n  }\n  var data = response === null || response === void 0 ? void 0 : response.data;\n  var errorData = {\n    status: response === null || response === void 0 ? void 0 : response.status,\n    statusText: response === null || response === void 0 ? void 0 : response.statusText,\n    message: '',\n    details: {}\n  };\n  if (lodash_isplainobject__WEBPACK_IMPORTED_MODULE_4___default()(config)) {\n    errorData.request = {\n      url: config.url,\n      headers: config.headers,\n      method: config.method,\n      payloadData: config.data\n    };\n  }\n  if (data && lodash_isplainobject__WEBPACK_IMPORTED_MODULE_4___default()(data)) {\n    if ('requestId' in data) {\n      errorData.requestId = data.requestId || 'UNKNOWN';\n    }\n    if ('message' in data) {\n      errorData.message = data.message || '';\n    }\n    if ('details' in data) {\n      errorData.details = data.details || {};\n    }\n    if ('sys' in data) {\n      if ('id' in data.sys) {\n        errorName = data.sys.id;\n      }\n    }\n  }\n  var error = new Error();\n  error.name = errorName && errorName !== 'Unknown' ? errorName : \"\".concat(response === null || response === void 0 ? void 0 : response.status, \" \").concat(response === null || response === void 0 ? void 0 : response.statusText);\n  try {\n    error.message = JSON.stringify(errorData, null, '  ');\n  } catch (_unused) {\n    var _errorData$message;\n    error.message = (_errorData$message = errorData === null || errorData === void 0 ? void 0 : errorData.message) !== null && _errorData$message !== void 0 ? _errorData$message : '';\n  }\n  throw error;\n}\n\n\n\n\n//# sourceURL=webpack://contentful/../node_modules/contentful-sdk-core/dist/index.es-modules.js?");

/***/ }),

/***/ "../node_modules/fast-copy/dist/fast-copy.js":
/*!***************************************************!*\
  !*** ../node_modules/fast-copy/dist/fast-copy.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("(function (global, factory) {\n     true ? module.exports = factory() :\n    0;\n})(this, (function () { 'use strict';\n\n    var toStringFunction = Function.prototype.toString;\n    var create = Object.create, defineProperty = Object.defineProperty, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, getOwnPropertyNames = Object.getOwnPropertyNames, getOwnPropertySymbols = Object.getOwnPropertySymbols, getPrototypeOf$1 = Object.getPrototypeOf;\n    var _a = Object.prototype, hasOwnProperty = _a.hasOwnProperty, propertyIsEnumerable = _a.propertyIsEnumerable;\n    var SYMBOL_PROPERTIES = typeof getOwnPropertySymbols === 'function';\n    var WEAK_MAP = typeof WeakMap === 'function';\n    /**\n     * @function createCache\n     *\n     * @description\n     * get a new cache object to prevent circular references\n     *\n     * @returns the new cache object\n     */\n    var createCache = (function () {\n        if (WEAK_MAP) {\n            return function () { return new WeakMap(); };\n        }\n        var Cache = /** @class */ (function () {\n            function Cache() {\n                this._keys = [];\n                this._values = [];\n            }\n            Cache.prototype.has = function (key) {\n                return !!~this._keys.indexOf(key);\n            };\n            Cache.prototype.get = function (key) {\n                return this._values[this._keys.indexOf(key)];\n            };\n            Cache.prototype.set = function (key, value) {\n                this._keys.push(key);\n                this._values.push(value);\n            };\n            return Cache;\n        }());\n        return function () { return new Cache(); };\n    })();\n    /**\n     * @function getCleanClone\n     *\n     * @description\n     * get an empty version of the object with the same prototype it has\n     *\n     * @param object the object to build a clean clone from\n     * @param realm the realm the object resides in\n     * @returns the empty cloned object\n     */\n    var getCleanClone = function (object, realm) {\n        var prototype = object.__proto__ || getPrototypeOf$1(object);\n        if (!prototype) {\n            return create(null);\n        }\n        var Constructor = prototype.constructor;\n        if (Constructor === realm.Object) {\n            return prototype === realm.Object.prototype ? {} : create(prototype);\n        }\n        if (~toStringFunction.call(Constructor).indexOf('[native code]')) {\n            try {\n                return new Constructor();\n            }\n            catch (_a) { }\n        }\n        return create(prototype);\n    };\n    /**\n     * @function getObjectCloneLoose\n     *\n     * @description\n     * get a copy of the object based on loose rules, meaning all enumerable keys\n     * and symbols are copied, but property descriptors are not considered\n     *\n     * @param object the object to clone\n     * @param realm the realm the object resides in\n     * @param handleCopy the function that handles copying the object\n     * @returns the copied object\n     */\n    var getObjectCloneLoose = function (object, realm, handleCopy, cache) {\n        var clone = getCleanClone(object, realm);\n        // set in the cache immediately to be able to reuse the object recursively\n        cache.set(object, clone);\n        for (var key in object) {\n            if (hasOwnProperty.call(object, key)) {\n                clone[key] = handleCopy(object[key], cache);\n            }\n        }\n        if (SYMBOL_PROPERTIES) {\n            var symbols = getOwnPropertySymbols(object);\n            for (var index = 0, length_1 = symbols.length, symbol = void 0; index < length_1; ++index) {\n                symbol = symbols[index];\n                if (propertyIsEnumerable.call(object, symbol)) {\n                    clone[symbol] = handleCopy(object[symbol], cache);\n                }\n            }\n        }\n        return clone;\n    };\n    /**\n     * @function getObjectCloneStrict\n     *\n     * @description\n     * get a copy of the object based on strict rules, meaning all keys and symbols\n     * are copied based on the original property descriptors\n     *\n     * @param object the object to clone\n     * @param realm the realm the object resides in\n     * @param handleCopy the function that handles copying the object\n     * @returns the copied object\n     */\n    var getObjectCloneStrict = function (object, realm, handleCopy, cache) {\n        var clone = getCleanClone(object, realm);\n        // set in the cache immediately to be able to reuse the object recursively\n        cache.set(object, clone);\n        var properties = SYMBOL_PROPERTIES\n            ? getOwnPropertyNames(object).concat(getOwnPropertySymbols(object))\n            : getOwnPropertyNames(object);\n        for (var index = 0, length_2 = properties.length, property = void 0, descriptor = void 0; index < length_2; ++index) {\n            property = properties[index];\n            if (property !== 'callee' && property !== 'caller') {\n                descriptor = getOwnPropertyDescriptor(object, property);\n                if (descriptor) {\n                    // Only clone the value if actually a value, not a getter / setter.\n                    if (!descriptor.get && !descriptor.set) {\n                        descriptor.value = handleCopy(object[property], cache);\n                    }\n                    try {\n                        defineProperty(clone, property, descriptor);\n                    }\n                    catch (error) {\n                        // Tee above can fail on node in edge cases, so fall back to the loose assignment.\n                        clone[property] = descriptor.value;\n                    }\n                }\n                else {\n                    // In extra edge cases where the property descriptor cannot be retrived, fall back to\n                    // the loose assignment.\n                    clone[property] = handleCopy(object[property], cache);\n                }\n            }\n        }\n        return clone;\n    };\n    /**\n     * @function getRegExpFlags\n     *\n     * @description\n     * get the flags to apply to the copied regexp\n     *\n     * @param regExp the regexp to get the flags of\n     * @returns the flags for the regexp\n     */\n    var getRegExpFlags = function (regExp) {\n        var flags = '';\n        if (regExp.global) {\n            flags += 'g';\n        }\n        if (regExp.ignoreCase) {\n            flags += 'i';\n        }\n        if (regExp.multiline) {\n            flags += 'm';\n        }\n        if (regExp.unicode) {\n            flags += 'u';\n        }\n        if (regExp.sticky) {\n            flags += 'y';\n        }\n        return flags;\n    };\n\n    // utils\n    var isArray = Array.isArray;\n    var getPrototypeOf = Object.getPrototypeOf;\n    var GLOBAL_THIS = (function () {\n        if (typeof globalThis !== 'undefined') {\n            return globalThis;\n        }\n        if (typeof self !== 'undefined') {\n            return self;\n        }\n        if (typeof window !== 'undefined') {\n            return window;\n        }\n        if (typeof __webpack_require__.g !== 'undefined') {\n            return __webpack_require__.g;\n        }\n        if (console && console.error) {\n            console.error('Unable to locate global object, returning \"this\".');\n        }\n        return this;\n    })();\n    /**\n     * @function copy\n     *\n     * @description\n     * copy an value deeply as much as possible\n     *\n     * If `strict` is applied, then all properties (including non-enumerable ones)\n     * are copied with their original property descriptors on both objects and arrays.\n     *\n     * The value is compared to the global constructors in the `realm` provided,\n     * and the native constructor is always used to ensure that extensions of native\n     * objects (allows in ES2015+) are maintained.\n     *\n     * @param value the value to copy\n     * @param [options] the options for copying with\n     * @param [options.isStrict] should the copy be strict\n     * @param [options.realm] the realm (this) value the value is copied from\n     * @returns the copied value\n     */\n    function copy(value, options) {\n        // manually coalesced instead of default parameters for performance\n        var isStrict = !!(options && options.isStrict);\n        var realm = (options && options.realm) || GLOBAL_THIS;\n        var getObjectClone = isStrict ? getObjectCloneStrict : getObjectCloneLoose;\n        /**\n         * @function handleCopy\n         *\n         * @description\n         * copy the value recursively based on its type\n         *\n         * @param value the value to copy\n         * @returns the copied value\n         */\n        var handleCopy = function (value, cache) {\n            if (!value || typeof value !== 'object') {\n                return value;\n            }\n            if (cache.has(value)) {\n                return cache.get(value);\n            }\n            var prototype = value.__proto__ || getPrototypeOf(value);\n            var Constructor = prototype && prototype.constructor;\n            // plain objects\n            if (!Constructor || Constructor === realm.Object) {\n                return getObjectClone(value, realm, handleCopy, cache);\n            }\n            var clone;\n            // arrays\n            if (isArray(value)) {\n                // if strict, include non-standard properties\n                if (isStrict) {\n                    return getObjectCloneStrict(value, realm, handleCopy, cache);\n                }\n                clone = new Constructor();\n                cache.set(value, clone);\n                for (var index = 0, length_1 = value.length; index < length_1; ++index) {\n                    clone[index] = handleCopy(value[index], cache);\n                }\n                return clone;\n            }\n            // dates\n            if (value instanceof realm.Date) {\n                return new Constructor(value.getTime());\n            }\n            // regexps\n            if (value instanceof realm.RegExp) {\n                clone = new Constructor(value.source, value.flags || getRegExpFlags(value));\n                clone.lastIndex = value.lastIndex;\n                return clone;\n            }\n            // maps\n            if (realm.Map && value instanceof realm.Map) {\n                clone = new Constructor();\n                cache.set(value, clone);\n                value.forEach(function (value, key) {\n                    clone.set(key, handleCopy(value, cache));\n                });\n                return clone;\n            }\n            // sets\n            if (realm.Set && value instanceof realm.Set) {\n                clone = new Constructor();\n                cache.set(value, clone);\n                value.forEach(function (value) {\n                    clone.add(handleCopy(value, cache));\n                });\n                return clone;\n            }\n            // blobs\n            if (realm.Blob && value instanceof realm.Blob) {\n                return value.slice(0, value.size, value.type);\n            }\n            // buffers (node-only)\n            if (realm.Buffer && realm.Buffer.isBuffer(value)) {\n                clone = realm.Buffer.allocUnsafe\n                    ? realm.Buffer.allocUnsafe(value.length)\n                    : new Constructor(value.length);\n                cache.set(value, clone);\n                value.copy(clone);\n                return clone;\n            }\n            // arraybuffers / dataviews\n            if (realm.ArrayBuffer) {\n                // dataviews\n                if (realm.ArrayBuffer.isView(value)) {\n                    clone = new Constructor(value.buffer.slice(0));\n                    cache.set(value, clone);\n                    return clone;\n                }\n                // arraybuffers\n                if (value instanceof realm.ArrayBuffer) {\n                    clone = value.slice(0);\n                    cache.set(value, clone);\n                    return clone;\n                }\n            }\n            // if the value cannot / should not be cloned, don't\n            if (\n            // promise-like\n            typeof value.then === 'function' ||\n                // errors\n                value instanceof Error ||\n                // weakmaps\n                (realm.WeakMap && value instanceof realm.WeakMap) ||\n                // weaksets\n                (realm.WeakSet && value instanceof realm.WeakSet)) {\n                return value;\n            }\n            // assume anything left is a custom constructor\n            return getObjectClone(value, realm, handleCopy, cache);\n        };\n        return handleCopy(value, createCache());\n    }\n    // Adding reference to allow usage in CommonJS libraries compiled using TSC, which\n    // expects there to be a default property on the exported value. See\n    // [#37](https://github.com/planttheidea/fast-copy/issues/37) for details.\n    copy.default = copy;\n    /**\n     * @function strictCopy\n     *\n     * @description\n     * copy the value with `strict` option pre-applied\n     *\n     * @param value the value to copy\n     * @param [options] the options for copying with\n     * @param [options.realm] the realm (this) value the value is copied from\n     * @returns the copied value\n     */\n    copy.strict = function strictCopy(value, options) {\n        return copy(value, {\n            isStrict: true,\n            realm: options ? options.realm : void 0,\n        });\n    };\n\n    return copy;\n\n}));\n//# sourceMappingURL=fast-copy.js.map\n\n\n//# sourceURL=webpack://contentful/../node_modules/fast-copy/dist/fast-copy.js?");

/***/ }),

/***/ "../node_modules/function-bind/implementation.js":
/*!*******************************************************!*\
  !*** ../node_modules/function-bind/implementation.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* eslint no-invalid-this: 1 */\n\nvar ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';\nvar slice = Array.prototype.slice;\nvar toStr = Object.prototype.toString;\nvar funcType = '[object Function]';\n\nmodule.exports = function bind(that) {\n    var target = this;\n    if (typeof target !== 'function' || toStr.call(target) !== funcType) {\n        throw new TypeError(ERROR_MESSAGE + target);\n    }\n    var args = slice.call(arguments, 1);\n\n    var bound;\n    var binder = function () {\n        if (this instanceof bound) {\n            var result = target.apply(\n                this,\n                args.concat(slice.call(arguments))\n            );\n            if (Object(result) === result) {\n                return result;\n            }\n            return this;\n        } else {\n            return target.apply(\n                that,\n                args.concat(slice.call(arguments))\n            );\n        }\n    };\n\n    var boundLength = Math.max(0, target.length - args.length);\n    var boundArgs = [];\n    for (var i = 0; i < boundLength; i++) {\n        boundArgs.push('$' + i);\n    }\n\n    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);\n\n    if (target.prototype) {\n        var Empty = function Empty() {};\n        Empty.prototype = target.prototype;\n        bound.prototype = new Empty();\n        Empty.prototype = null;\n    }\n\n    return bound;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/function-bind/implementation.js?");

/***/ }),

/***/ "../node_modules/function-bind/index.js":
/*!**********************************************!*\
  !*** ../node_modules/function-bind/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar implementation = __webpack_require__(/*! ./implementation */ \"../node_modules/function-bind/implementation.js\");\n\nmodule.exports = Function.prototype.bind || implementation;\n\n\n//# sourceURL=webpack://contentful/../node_modules/function-bind/index.js?");

/***/ }),

/***/ "../node_modules/get-intrinsic/index.js":
/*!**********************************************!*\
  !*** ../node_modules/get-intrinsic/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar undefined;\n\nvar $SyntaxError = SyntaxError;\nvar $Function = Function;\nvar $TypeError = TypeError;\n\n// eslint-disable-next-line consistent-return\nvar getEvalledConstructor = function (expressionSyntax) {\n\ttry {\n\t\treturn $Function('\"use strict\"; return (' + expressionSyntax + ').constructor;')();\n\t} catch (e) {}\n};\n\nvar $gOPD = Object.getOwnPropertyDescriptor;\nif ($gOPD) {\n\ttry {\n\t\t$gOPD({}, '');\n\t} catch (e) {\n\t\t$gOPD = null; // this is IE 8, which has a broken gOPD\n\t}\n}\n\nvar throwTypeError = function () {\n\tthrow new $TypeError();\n};\nvar ThrowTypeError = $gOPD\n\t? (function () {\n\t\ttry {\n\t\t\t// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties\n\t\t\targuments.callee; // IE 8 does not throw here\n\t\t\treturn throwTypeError;\n\t\t} catch (calleeThrows) {\n\t\t\ttry {\n\t\t\t\t// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')\n\t\t\t\treturn $gOPD(arguments, 'callee').get;\n\t\t\t} catch (gOPDthrows) {\n\t\t\t\treturn throwTypeError;\n\t\t\t}\n\t\t}\n\t}())\n\t: throwTypeError;\n\nvar hasSymbols = __webpack_require__(/*! has-symbols */ \"../node_modules/has-symbols/index.js\")();\n\nvar getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto\n\nvar needsEval = {};\n\nvar TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);\n\nvar INTRINSICS = {\n\t'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,\n\t'%Array%': Array,\n\t'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,\n\t'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,\n\t'%AsyncFromSyncIteratorPrototype%': undefined,\n\t'%AsyncFunction%': needsEval,\n\t'%AsyncGenerator%': needsEval,\n\t'%AsyncGeneratorFunction%': needsEval,\n\t'%AsyncIteratorPrototype%': needsEval,\n\t'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,\n\t'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,\n\t'%Boolean%': Boolean,\n\t'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,\n\t'%Date%': Date,\n\t'%decodeURI%': decodeURI,\n\t'%decodeURIComponent%': decodeURIComponent,\n\t'%encodeURI%': encodeURI,\n\t'%encodeURIComponent%': encodeURIComponent,\n\t'%Error%': Error,\n\t'%eval%': eval, // eslint-disable-line no-eval\n\t'%EvalError%': EvalError,\n\t'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,\n\t'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,\n\t'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,\n\t'%Function%': $Function,\n\t'%GeneratorFunction%': needsEval,\n\t'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,\n\t'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,\n\t'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,\n\t'%isFinite%': isFinite,\n\t'%isNaN%': isNaN,\n\t'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,\n\t'%JSON%': typeof JSON === 'object' ? JSON : undefined,\n\t'%Map%': typeof Map === 'undefined' ? undefined : Map,\n\t'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),\n\t'%Math%': Math,\n\t'%Number%': Number,\n\t'%Object%': Object,\n\t'%parseFloat%': parseFloat,\n\t'%parseInt%': parseInt,\n\t'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,\n\t'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,\n\t'%RangeError%': RangeError,\n\t'%ReferenceError%': ReferenceError,\n\t'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,\n\t'%RegExp%': RegExp,\n\t'%Set%': typeof Set === 'undefined' ? undefined : Set,\n\t'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),\n\t'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,\n\t'%String%': String,\n\t'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,\n\t'%Symbol%': hasSymbols ? Symbol : undefined,\n\t'%SyntaxError%': $SyntaxError,\n\t'%ThrowTypeError%': ThrowTypeError,\n\t'%TypedArray%': TypedArray,\n\t'%TypeError%': $TypeError,\n\t'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,\n\t'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,\n\t'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,\n\t'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,\n\t'%URIError%': URIError,\n\t'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,\n\t'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,\n\t'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet\n};\n\nvar doEval = function doEval(name) {\n\tvar value;\n\tif (name === '%AsyncFunction%') {\n\t\tvalue = getEvalledConstructor('async function () {}');\n\t} else if (name === '%GeneratorFunction%') {\n\t\tvalue = getEvalledConstructor('function* () {}');\n\t} else if (name === '%AsyncGeneratorFunction%') {\n\t\tvalue = getEvalledConstructor('async function* () {}');\n\t} else if (name === '%AsyncGenerator%') {\n\t\tvar fn = doEval('%AsyncGeneratorFunction%');\n\t\tif (fn) {\n\t\t\tvalue = fn.prototype;\n\t\t}\n\t} else if (name === '%AsyncIteratorPrototype%') {\n\t\tvar gen = doEval('%AsyncGenerator%');\n\t\tif (gen) {\n\t\t\tvalue = getProto(gen.prototype);\n\t\t}\n\t}\n\n\tINTRINSICS[name] = value;\n\n\treturn value;\n};\n\nvar LEGACY_ALIASES = {\n\t'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],\n\t'%ArrayPrototype%': ['Array', 'prototype'],\n\t'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],\n\t'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],\n\t'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],\n\t'%ArrayProto_values%': ['Array', 'prototype', 'values'],\n\t'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],\n\t'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],\n\t'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],\n\t'%BooleanPrototype%': ['Boolean', 'prototype'],\n\t'%DataViewPrototype%': ['DataView', 'prototype'],\n\t'%DatePrototype%': ['Date', 'prototype'],\n\t'%ErrorPrototype%': ['Error', 'prototype'],\n\t'%EvalErrorPrototype%': ['EvalError', 'prototype'],\n\t'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],\n\t'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],\n\t'%FunctionPrototype%': ['Function', 'prototype'],\n\t'%Generator%': ['GeneratorFunction', 'prototype'],\n\t'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],\n\t'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],\n\t'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],\n\t'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],\n\t'%JSONParse%': ['JSON', 'parse'],\n\t'%JSONStringify%': ['JSON', 'stringify'],\n\t'%MapPrototype%': ['Map', 'prototype'],\n\t'%NumberPrototype%': ['Number', 'prototype'],\n\t'%ObjectPrototype%': ['Object', 'prototype'],\n\t'%ObjProto_toString%': ['Object', 'prototype', 'toString'],\n\t'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],\n\t'%PromisePrototype%': ['Promise', 'prototype'],\n\t'%PromiseProto_then%': ['Promise', 'prototype', 'then'],\n\t'%Promise_all%': ['Promise', 'all'],\n\t'%Promise_reject%': ['Promise', 'reject'],\n\t'%Promise_resolve%': ['Promise', 'resolve'],\n\t'%RangeErrorPrototype%': ['RangeError', 'prototype'],\n\t'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],\n\t'%RegExpPrototype%': ['RegExp', 'prototype'],\n\t'%SetPrototype%': ['Set', 'prototype'],\n\t'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],\n\t'%StringPrototype%': ['String', 'prototype'],\n\t'%SymbolPrototype%': ['Symbol', 'prototype'],\n\t'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],\n\t'%TypedArrayPrototype%': ['TypedArray', 'prototype'],\n\t'%TypeErrorPrototype%': ['TypeError', 'prototype'],\n\t'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],\n\t'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],\n\t'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],\n\t'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],\n\t'%URIErrorPrototype%': ['URIError', 'prototype'],\n\t'%WeakMapPrototype%': ['WeakMap', 'prototype'],\n\t'%WeakSetPrototype%': ['WeakSet', 'prototype']\n};\n\nvar bind = __webpack_require__(/*! function-bind */ \"../node_modules/function-bind/index.js\");\nvar hasOwn = __webpack_require__(/*! has */ \"../node_modules/has/src/index.js\");\nvar $concat = bind.call(Function.call, Array.prototype.concat);\nvar $spliceApply = bind.call(Function.apply, Array.prototype.splice);\nvar $replace = bind.call(Function.call, String.prototype.replace);\nvar $strSlice = bind.call(Function.call, String.prototype.slice);\nvar $exec = bind.call(Function.call, RegExp.prototype.exec);\n\n/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */\nvar rePropName = /[^%.[\\]]+|\\[(?:(-?\\d+(?:\\.\\d+)?)|([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|%$))/g;\nvar reEscapeChar = /\\\\(\\\\)?/g; /** Used to match backslashes in property paths. */\nvar stringToPath = function stringToPath(string) {\n\tvar first = $strSlice(string, 0, 1);\n\tvar last = $strSlice(string, -1);\n\tif (first === '%' && last !== '%') {\n\t\tthrow new $SyntaxError('invalid intrinsic syntax, expected closing `%`');\n\t} else if (last === '%' && first !== '%') {\n\t\tthrow new $SyntaxError('invalid intrinsic syntax, expected opening `%`');\n\t}\n\tvar result = [];\n\t$replace(string, rePropName, function (match, number, quote, subString) {\n\t\tresult[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;\n\t});\n\treturn result;\n};\n/* end adaptation */\n\nvar getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {\n\tvar intrinsicName = name;\n\tvar alias;\n\tif (hasOwn(LEGACY_ALIASES, intrinsicName)) {\n\t\talias = LEGACY_ALIASES[intrinsicName];\n\t\tintrinsicName = '%' + alias[0] + '%';\n\t}\n\n\tif (hasOwn(INTRINSICS, intrinsicName)) {\n\t\tvar value = INTRINSICS[intrinsicName];\n\t\tif (value === needsEval) {\n\t\t\tvalue = doEval(intrinsicName);\n\t\t}\n\t\tif (typeof value === 'undefined' && !allowMissing) {\n\t\t\tthrow new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');\n\t\t}\n\n\t\treturn {\n\t\t\talias: alias,\n\t\t\tname: intrinsicName,\n\t\t\tvalue: value\n\t\t};\n\t}\n\n\tthrow new $SyntaxError('intrinsic ' + name + ' does not exist!');\n};\n\nmodule.exports = function GetIntrinsic(name, allowMissing) {\n\tif (typeof name !== 'string' || name.length === 0) {\n\t\tthrow new $TypeError('intrinsic name must be a non-empty string');\n\t}\n\tif (arguments.length > 1 && typeof allowMissing !== 'boolean') {\n\t\tthrow new $TypeError('\"allowMissing\" argument must be a boolean');\n\t}\n\n\tif ($exec(/^%?[^%]*%?$/, name) === null) {\n\t\tthrow new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');\n\t}\n\tvar parts = stringToPath(name);\n\tvar intrinsicBaseName = parts.length > 0 ? parts[0] : '';\n\n\tvar intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);\n\tvar intrinsicRealName = intrinsic.name;\n\tvar value = intrinsic.value;\n\tvar skipFurtherCaching = false;\n\n\tvar alias = intrinsic.alias;\n\tif (alias) {\n\t\tintrinsicBaseName = alias[0];\n\t\t$spliceApply(parts, $concat([0, 1], alias));\n\t}\n\n\tfor (var i = 1, isOwn = true; i < parts.length; i += 1) {\n\t\tvar part = parts[i];\n\t\tvar first = $strSlice(part, 0, 1);\n\t\tvar last = $strSlice(part, -1);\n\t\tif (\n\t\t\t(\n\t\t\t\t(first === '\"' || first === \"'\" || first === '`')\n\t\t\t\t|| (last === '\"' || last === \"'\" || last === '`')\n\t\t\t)\n\t\t\t&& first !== last\n\t\t) {\n\t\t\tthrow new $SyntaxError('property names with quotes must have matching quotes');\n\t\t}\n\t\tif (part === 'constructor' || !isOwn) {\n\t\t\tskipFurtherCaching = true;\n\t\t}\n\n\t\tintrinsicBaseName += '.' + part;\n\t\tintrinsicRealName = '%' + intrinsicBaseName + '%';\n\n\t\tif (hasOwn(INTRINSICS, intrinsicRealName)) {\n\t\t\tvalue = INTRINSICS[intrinsicRealName];\n\t\t} else if (value != null) {\n\t\t\tif (!(part in value)) {\n\t\t\t\tif (!allowMissing) {\n\t\t\t\t\tthrow new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');\n\t\t\t\t}\n\t\t\t\treturn void undefined;\n\t\t\t}\n\t\t\tif ($gOPD && (i + 1) >= parts.length) {\n\t\t\t\tvar desc = $gOPD(value, part);\n\t\t\t\tisOwn = !!desc;\n\n\t\t\t\t// By convention, when a data property is converted to an accessor\n\t\t\t\t// property to emulate a data property that does not suffer from\n\t\t\t\t// the override mistake, that accessor's getter is marked with\n\t\t\t\t// an `originalValue` property. Here, when we detect this, we\n\t\t\t\t// uphold the illusion by pretending to see that original data\n\t\t\t\t// property, i.e., returning the value rather than the getter\n\t\t\t\t// itself.\n\t\t\t\tif (isOwn && 'get' in desc && !('originalValue' in desc.get)) {\n\t\t\t\t\tvalue = desc.get;\n\t\t\t\t} else {\n\t\t\t\t\tvalue = value[part];\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tisOwn = hasOwn(value, part);\n\t\t\t\tvalue = value[part];\n\t\t\t}\n\n\t\t\tif (isOwn && !skipFurtherCaching) {\n\t\t\t\tINTRINSICS[intrinsicRealName] = value;\n\t\t\t}\n\t\t}\n\t}\n\treturn value;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/get-intrinsic/index.js?");

/***/ }),

/***/ "../node_modules/has-symbols/index.js":
/*!********************************************!*\
  !*** ../node_modules/has-symbols/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar origSymbol = typeof Symbol !== 'undefined' && Symbol;\nvar hasSymbolSham = __webpack_require__(/*! ./shams */ \"../node_modules/has-symbols/shams.js\");\n\nmodule.exports = function hasNativeSymbols() {\n\tif (typeof origSymbol !== 'function') { return false; }\n\tif (typeof Symbol !== 'function') { return false; }\n\tif (typeof origSymbol('foo') !== 'symbol') { return false; }\n\tif (typeof Symbol('bar') !== 'symbol') { return false; }\n\n\treturn hasSymbolSham();\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/has-symbols/index.js?");

/***/ }),

/***/ "../node_modules/has-symbols/shams.js":
/*!********************************************!*\
  !*** ../node_modules/has-symbols/shams.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";
eval("\n\n/* eslint complexity: [2, 18], max-statements: [2, 33] */\nmodule.exports = function hasSymbols() {\n\tif (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }\n\tif (typeof Symbol.iterator === 'symbol') { return true; }\n\n\tvar obj = {};\n\tvar sym = Symbol('test');\n\tvar symObj = Object(sym);\n\tif (typeof sym === 'string') { return false; }\n\n\tif (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }\n\tif (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }\n\n\t// temp disabled per https://github.com/ljharb/object.assign/issues/17\n\t// if (sym instanceof Symbol) { return false; }\n\t// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4\n\t// if (!(symObj instanceof Symbol)) { return false; }\n\n\t// if (typeof Symbol.prototype.toString !== 'function') { return false; }\n\t// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }\n\n\tvar symVal = 42;\n\tobj[sym] = symVal;\n\tfor (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop\n\tif (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }\n\n\tif (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }\n\n\tvar syms = Object.getOwnPropertySymbols(obj);\n\tif (syms.length !== 1 || syms[0] !== sym) { return false; }\n\n\tif (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }\n\n\tif (typeof Object.getOwnPropertyDescriptor === 'function') {\n\t\tvar descriptor = Object.getOwnPropertyDescriptor(obj, sym);\n\t\tif (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }\n\t}\n\n\treturn true;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/has-symbols/shams.js?");

/***/ }),

/***/ "../node_modules/has/src/index.js":
/*!****************************************!*\
  !*** ../node_modules/has/src/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar bind = __webpack_require__(/*! function-bind */ \"../node_modules/function-bind/index.js\");\n\nmodule.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);\n\n\n//# sourceURL=webpack://contentful/../node_modules/has/src/index.js?");

/***/ }),

/***/ "../node_modules/json-stringify-safe/stringify.js":
/*!********************************************************!*\
  !*** ../node_modules/json-stringify-safe/stringify.js ***!
  \********************************************************/
/***/ ((module, exports) => {

eval("exports = module.exports = stringify\nexports.getSerialize = serializer\n\nfunction stringify(obj, replacer, spaces, cycleReplacer) {\n  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)\n}\n\nfunction serializer(replacer, cycleReplacer) {\n  var stack = [], keys = []\n\n  if (cycleReplacer == null) cycleReplacer = function(key, value) {\n    if (stack[0] === value) return \"[Circular ~]\"\n    return \"[Circular ~.\" + keys.slice(0, stack.indexOf(value)).join(\".\") + \"]\"\n  }\n\n  return function(key, value) {\n    if (stack.length > 0) {\n      var thisPos = stack.indexOf(this)\n      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)\n      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)\n      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)\n    }\n    else stack.push(value)\n\n    return replacer == null ? value : replacer.call(this, key, value)\n  }\n}\n\n\n//# sourceURL=webpack://contentful/../node_modules/json-stringify-safe/stringify.js?");

/***/ }),

/***/ "../node_modules/lodash.isplainobject/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/lodash.isplainobject/index.js ***!
  \*****************************************************/
/***/ ((module) => {

eval("/**\n * lodash (Custom Build) <https://lodash.com/>\n * Build: `lodash modularize exports=\"npm\" -o ./`\n * Copyright jQuery Foundation and other contributors <https://jquery.org/>\n * Released under MIT license <https://lodash.com/license>\n * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>\n * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n */\n\n/** `Object#toString` result references. */\nvar objectTag = '[object Object]';\n\n/**\n * Checks if `value` is a host object in IE < 9.\n *\n * @private\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a host object, else `false`.\n */\nfunction isHostObject(value) {\n  // Many host objects are `Object` objects that can coerce to strings\n  // despite having improperly defined `toString` methods.\n  var result = false;\n  if (value != null && typeof value.toString != 'function') {\n    try {\n      result = !!(value + '');\n    } catch (e) {}\n  }\n  return result;\n}\n\n/**\n * Creates a unary function that invokes `func` with its argument transformed.\n *\n * @private\n * @param {Function} func The function to wrap.\n * @param {Function} transform The argument transform.\n * @returns {Function} Returns the new function.\n */\nfunction overArg(func, transform) {\n  return function(arg) {\n    return func(transform(arg));\n  };\n}\n\n/** Used for built-in method references. */\nvar funcProto = Function.prototype,\n    objectProto = Object.prototype;\n\n/** Used to resolve the decompiled source of functions. */\nvar funcToString = funcProto.toString;\n\n/** Used to check objects for own properties. */\nvar hasOwnProperty = objectProto.hasOwnProperty;\n\n/** Used to infer the `Object` constructor. */\nvar objectCtorString = funcToString.call(Object);\n\n/**\n * Used to resolve the\n * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)\n * of values.\n */\nvar objectToString = objectProto.toString;\n\n/** Built-in value references. */\nvar getPrototype = overArg(Object.getPrototypeOf, Object);\n\n/**\n * Checks if `value` is object-like. A value is object-like if it's not `null`\n * and has a `typeof` result of \"object\".\n *\n * @static\n * @memberOf _\n * @since 4.0.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is object-like, else `false`.\n * @example\n *\n * _.isObjectLike({});\n * // => true\n *\n * _.isObjectLike([1, 2, 3]);\n * // => true\n *\n * _.isObjectLike(_.noop);\n * // => false\n *\n * _.isObjectLike(null);\n * // => false\n */\nfunction isObjectLike(value) {\n  return !!value && typeof value == 'object';\n}\n\n/**\n * Checks if `value` is a plain object, that is, an object created by the\n * `Object` constructor or one with a `[[Prototype]]` of `null`.\n *\n * @static\n * @memberOf _\n * @since 0.8.0\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.\n * @example\n *\n * function Foo() {\n *   this.a = 1;\n * }\n *\n * _.isPlainObject(new Foo);\n * // => false\n *\n * _.isPlainObject([1, 2, 3]);\n * // => false\n *\n * _.isPlainObject({ 'x': 0, 'y': 0 });\n * // => true\n *\n * _.isPlainObject(Object.create(null));\n * // => true\n */\nfunction isPlainObject(value) {\n  if (!isObjectLike(value) ||\n      objectToString.call(value) != objectTag || isHostObject(value)) {\n    return false;\n  }\n  var proto = getPrototype(value);\n  if (proto === null) {\n    return true;\n  }\n  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;\n  return (typeof Ctor == 'function' &&\n    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);\n}\n\nmodule.exports = isPlainObject;\n\n\n//# sourceURL=webpack://contentful/../node_modules/lodash.isplainobject/index.js?");

/***/ }),

/***/ "../node_modules/lodash.isstring/index.js":
/*!************************************************!*\
  !*** ../node_modules/lodash.isstring/index.js ***!
  \************************************************/
/***/ ((module) => {

eval("/**\n * lodash 4.0.1 (Custom Build) <https://lodash.com/>\n * Build: `lodash modularize exports=\"npm\" -o ./`\n * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>\n * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>\n * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n * Available under MIT license <https://lodash.com/license>\n */\n\n/** `Object#toString` result references. */\nvar stringTag = '[object String]';\n\n/** Used for built-in method references. */\nvar objectProto = Object.prototype;\n\n/**\n * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)\n * of values.\n */\nvar objectToString = objectProto.toString;\n\n/**\n * Checks if `value` is classified as an `Array` object.\n *\n * @static\n * @memberOf _\n * @type Function\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.\n * @example\n *\n * _.isArray([1, 2, 3]);\n * // => true\n *\n * _.isArray(document.body.children);\n * // => false\n *\n * _.isArray('abc');\n * // => false\n *\n * _.isArray(_.noop);\n * // => false\n */\nvar isArray = Array.isArray;\n\n/**\n * Checks if `value` is object-like. A value is object-like if it's not `null`\n * and has a `typeof` result of \"object\".\n *\n * @static\n * @memberOf _\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is object-like, else `false`.\n * @example\n *\n * _.isObjectLike({});\n * // => true\n *\n * _.isObjectLike([1, 2, 3]);\n * // => true\n *\n * _.isObjectLike(_.noop);\n * // => false\n *\n * _.isObjectLike(null);\n * // => false\n */\nfunction isObjectLike(value) {\n  return !!value && typeof value == 'object';\n}\n\n/**\n * Checks if `value` is classified as a `String` primitive or object.\n *\n * @static\n * @memberOf _\n * @category Lang\n * @param {*} value The value to check.\n * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.\n * @example\n *\n * _.isString('abc');\n * // => true\n *\n * _.isString(1);\n * // => false\n */\nfunction isString(value) {\n  return typeof value == 'string' ||\n    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);\n}\n\nmodule.exports = isString;\n\n\n//# sourceURL=webpack://contentful/../node_modules/lodash.isstring/index.js?");

/***/ }),

/***/ "../node_modules/object-inspect/index.js":
/*!***********************************************!*\
  !*** ../node_modules/object-inspect/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var hasMap = typeof Map === 'function' && Map.prototype;\nvar mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;\nvar mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;\nvar mapForEach = hasMap && Map.prototype.forEach;\nvar hasSet = typeof Set === 'function' && Set.prototype;\nvar setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;\nvar setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;\nvar setForEach = hasSet && Set.prototype.forEach;\nvar hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;\nvar weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;\nvar hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;\nvar weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;\nvar hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;\nvar weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;\nvar booleanValueOf = Boolean.prototype.valueOf;\nvar objectToString = Object.prototype.toString;\nvar functionToString = Function.prototype.toString;\nvar $match = String.prototype.match;\nvar $slice = String.prototype.slice;\nvar $replace = String.prototype.replace;\nvar $toUpperCase = String.prototype.toUpperCase;\nvar $toLowerCase = String.prototype.toLowerCase;\nvar $test = RegExp.prototype.test;\nvar $concat = Array.prototype.concat;\nvar $join = Array.prototype.join;\nvar $arrSlice = Array.prototype.slice;\nvar $floor = Math.floor;\nvar bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;\nvar gOPS = Object.getOwnPropertySymbols;\nvar symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;\nvar hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';\n// ie, `has-tostringtag/shams\nvar toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')\n    ? Symbol.toStringTag\n    : null;\nvar isEnumerable = Object.prototype.propertyIsEnumerable;\n\nvar gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (\n    [].__proto__ === Array.prototype // eslint-disable-line no-proto\n        ? function (O) {\n            return O.__proto__; // eslint-disable-line no-proto\n        }\n        : null\n);\n\nfunction addNumericSeparator(num, str) {\n    if (\n        num === Infinity\n        || num === -Infinity\n        || num !== num\n        || (num && num > -1000 && num < 1000)\n        || $test.call(/e/, str)\n    ) {\n        return str;\n    }\n    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;\n    if (typeof num === 'number') {\n        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)\n        if (int !== num) {\n            var intStr = String(int);\n            var dec = $slice.call(str, intStr.length + 1);\n            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');\n        }\n    }\n    return $replace.call(str, sepRegex, '$&_');\n}\n\nvar utilInspect = __webpack_require__(/*! ./util.inspect */ \"?d91c\");\nvar inspectCustom = utilInspect.custom;\nvar inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;\n\nmodule.exports = function inspect_(obj, options, depth, seen) {\n    var opts = options || {};\n\n    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {\n        throw new TypeError('option \"quoteStyle\" must be \"single\" or \"double\"');\n    }\n    if (\n        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'\n            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity\n            : opts.maxStringLength !== null\n        )\n    ) {\n        throw new TypeError('option \"maxStringLength\", if provided, must be a positive integer, Infinity, or `null`');\n    }\n    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;\n    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {\n        throw new TypeError('option \"customInspect\", if provided, must be `true`, `false`, or `\\'symbol\\'`');\n    }\n\n    if (\n        has(opts, 'indent')\n        && opts.indent !== null\n        && opts.indent !== '\\t'\n        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)\n    ) {\n        throw new TypeError('option \"indent\" must be \"\\\\t\", an integer > 0, or `null`');\n    }\n    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {\n        throw new TypeError('option \"numericSeparator\", if provided, must be `true` or `false`');\n    }\n    var numericSeparator = opts.numericSeparator;\n\n    if (typeof obj === 'undefined') {\n        return 'undefined';\n    }\n    if (obj === null) {\n        return 'null';\n    }\n    if (typeof obj === 'boolean') {\n        return obj ? 'true' : 'false';\n    }\n\n    if (typeof obj === 'string') {\n        return inspectString(obj, opts);\n    }\n    if (typeof obj === 'number') {\n        if (obj === 0) {\n            return Infinity / obj > 0 ? '0' : '-0';\n        }\n        var str = String(obj);\n        return numericSeparator ? addNumericSeparator(obj, str) : str;\n    }\n    if (typeof obj === 'bigint') {\n        var bigIntStr = String(obj) + 'n';\n        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;\n    }\n\n    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;\n    if (typeof depth === 'undefined') { depth = 0; }\n    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {\n        return isArray(obj) ? '[Array]' : '[Object]';\n    }\n\n    var indent = getIndent(opts, depth);\n\n    if (typeof seen === 'undefined') {\n        seen = [];\n    } else if (indexOf(seen, obj) >= 0) {\n        return '[Circular]';\n    }\n\n    function inspect(value, from, noIndent) {\n        if (from) {\n            seen = $arrSlice.call(seen);\n            seen.push(from);\n        }\n        if (noIndent) {\n            var newOpts = {\n                depth: opts.depth\n            };\n            if (has(opts, 'quoteStyle')) {\n                newOpts.quoteStyle = opts.quoteStyle;\n            }\n            return inspect_(value, newOpts, depth + 1, seen);\n        }\n        return inspect_(value, opts, depth + 1, seen);\n    }\n\n    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable\n        var name = nameOf(obj);\n        var keys = arrObjKeys(obj, inspect);\n        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');\n    }\n    if (isSymbol(obj)) {\n        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\\(.*\\))_[^)]*$/, '$1') : symToString.call(obj);\n        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;\n    }\n    if (isElement(obj)) {\n        var s = '<' + $toLowerCase.call(String(obj.nodeName));\n        var attrs = obj.attributes || [];\n        for (var i = 0; i < attrs.length; i++) {\n            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);\n        }\n        s += '>';\n        if (obj.childNodes && obj.childNodes.length) { s += '...'; }\n        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';\n        return s;\n    }\n    if (isArray(obj)) {\n        if (obj.length === 0) { return '[]'; }\n        var xs = arrObjKeys(obj, inspect);\n        if (indent && !singleLineValues(xs)) {\n            return '[' + indentedJoin(xs, indent) + ']';\n        }\n        return '[ ' + $join.call(xs, ', ') + ' ]';\n    }\n    if (isError(obj)) {\n        var parts = arrObjKeys(obj, inspect);\n        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {\n            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';\n        }\n        if (parts.length === 0) { return '[' + String(obj) + ']'; }\n        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';\n    }\n    if (typeof obj === 'object' && customInspect) {\n        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {\n            return utilInspect(obj, { depth: maxDepth - depth });\n        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {\n            return obj.inspect();\n        }\n    }\n    if (isMap(obj)) {\n        var mapParts = [];\n        if (mapForEach) {\n            mapForEach.call(obj, function (value, key) {\n                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));\n            });\n        }\n        return collectionOf('Map', mapSize.call(obj), mapParts, indent);\n    }\n    if (isSet(obj)) {\n        var setParts = [];\n        if (setForEach) {\n            setForEach.call(obj, function (value) {\n                setParts.push(inspect(value, obj));\n            });\n        }\n        return collectionOf('Set', setSize.call(obj), setParts, indent);\n    }\n    if (isWeakMap(obj)) {\n        return weakCollectionOf('WeakMap');\n    }\n    if (isWeakSet(obj)) {\n        return weakCollectionOf('WeakSet');\n    }\n    if (isWeakRef(obj)) {\n        return weakCollectionOf('WeakRef');\n    }\n    if (isNumber(obj)) {\n        return markBoxed(inspect(Number(obj)));\n    }\n    if (isBigInt(obj)) {\n        return markBoxed(inspect(bigIntValueOf.call(obj)));\n    }\n    if (isBoolean(obj)) {\n        return markBoxed(booleanValueOf.call(obj));\n    }\n    if (isString(obj)) {\n        return markBoxed(inspect(String(obj)));\n    }\n    if (!isDate(obj) && !isRegExp(obj)) {\n        var ys = arrObjKeys(obj, inspect);\n        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;\n        var protoTag = obj instanceof Object ? '' : 'null prototype';\n        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';\n        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';\n        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');\n        if (ys.length === 0) { return tag + '{}'; }\n        if (indent) {\n            return tag + '{' + indentedJoin(ys, indent) + '}';\n        }\n        return tag + '{ ' + $join.call(ys, ', ') + ' }';\n    }\n    return String(obj);\n};\n\nfunction wrapQuotes(s, defaultStyle, opts) {\n    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '\"' : \"'\";\n    return quoteChar + s + quoteChar;\n}\n\nfunction quote(s) {\n    return $replace.call(String(s), /\"/g, '&quot;');\n}\n\nfunction isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }\nfunction isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }\nfunction isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }\nfunction isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }\nfunction isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }\nfunction isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }\nfunction isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }\n\n// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives\nfunction isSymbol(obj) {\n    if (hasShammedSymbols) {\n        return obj && typeof obj === 'object' && obj instanceof Symbol;\n    }\n    if (typeof obj === 'symbol') {\n        return true;\n    }\n    if (!obj || typeof obj !== 'object' || !symToString) {\n        return false;\n    }\n    try {\n        symToString.call(obj);\n        return true;\n    } catch (e) {}\n    return false;\n}\n\nfunction isBigInt(obj) {\n    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {\n        return false;\n    }\n    try {\n        bigIntValueOf.call(obj);\n        return true;\n    } catch (e) {}\n    return false;\n}\n\nvar hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };\nfunction has(obj, key) {\n    return hasOwn.call(obj, key);\n}\n\nfunction toStr(obj) {\n    return objectToString.call(obj);\n}\n\nfunction nameOf(f) {\n    if (f.name) { return f.name; }\n    var m = $match.call(functionToString.call(f), /^function\\s*([\\w$]+)/);\n    if (m) { return m[1]; }\n    return null;\n}\n\nfunction indexOf(xs, x) {\n    if (xs.indexOf) { return xs.indexOf(x); }\n    for (var i = 0, l = xs.length; i < l; i++) {\n        if (xs[i] === x) { return i; }\n    }\n    return -1;\n}\n\nfunction isMap(x) {\n    if (!mapSize || !x || typeof x !== 'object') {\n        return false;\n    }\n    try {\n        mapSize.call(x);\n        try {\n            setSize.call(x);\n        } catch (s) {\n            return true;\n        }\n        return x instanceof Map; // core-js workaround, pre-v2.5.0\n    } catch (e) {}\n    return false;\n}\n\nfunction isWeakMap(x) {\n    if (!weakMapHas || !x || typeof x !== 'object') {\n        return false;\n    }\n    try {\n        weakMapHas.call(x, weakMapHas);\n        try {\n            weakSetHas.call(x, weakSetHas);\n        } catch (s) {\n            return true;\n        }\n        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0\n    } catch (e) {}\n    return false;\n}\n\nfunction isWeakRef(x) {\n    if (!weakRefDeref || !x || typeof x !== 'object') {\n        return false;\n    }\n    try {\n        weakRefDeref.call(x);\n        return true;\n    } catch (e) {}\n    return false;\n}\n\nfunction isSet(x) {\n    if (!setSize || !x || typeof x !== 'object') {\n        return false;\n    }\n    try {\n        setSize.call(x);\n        try {\n            mapSize.call(x);\n        } catch (m) {\n            return true;\n        }\n        return x instanceof Set; // core-js workaround, pre-v2.5.0\n    } catch (e) {}\n    return false;\n}\n\nfunction isWeakSet(x) {\n    if (!weakSetHas || !x || typeof x !== 'object') {\n        return false;\n    }\n    try {\n        weakSetHas.call(x, weakSetHas);\n        try {\n            weakMapHas.call(x, weakMapHas);\n        } catch (s) {\n            return true;\n        }\n        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0\n    } catch (e) {}\n    return false;\n}\n\nfunction isElement(x) {\n    if (!x || typeof x !== 'object') { return false; }\n    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {\n        return true;\n    }\n    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';\n}\n\nfunction inspectString(str, opts) {\n    if (str.length > opts.maxStringLength) {\n        var remaining = str.length - opts.maxStringLength;\n        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');\n        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;\n    }\n    // eslint-disable-next-line no-control-regex\n    var s = $replace.call($replace.call(str, /(['\\\\])/g, '\\\\$1'), /[\\x00-\\x1f]/g, lowbyte);\n    return wrapQuotes(s, 'single', opts);\n}\n\nfunction lowbyte(c) {\n    var n = c.charCodeAt(0);\n    var x = {\n        8: 'b',\n        9: 't',\n        10: 'n',\n        12: 'f',\n        13: 'r'\n    }[n];\n    if (x) { return '\\\\' + x; }\n    return '\\\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));\n}\n\nfunction markBoxed(str) {\n    return 'Object(' + str + ')';\n}\n\nfunction weakCollectionOf(type) {\n    return type + ' { ? }';\n}\n\nfunction collectionOf(type, size, entries, indent) {\n    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');\n    return type + ' (' + size + ') {' + joinedEntries + '}';\n}\n\nfunction singleLineValues(xs) {\n    for (var i = 0; i < xs.length; i++) {\n        if (indexOf(xs[i], '\\n') >= 0) {\n            return false;\n        }\n    }\n    return true;\n}\n\nfunction getIndent(opts, depth) {\n    var baseIndent;\n    if (opts.indent === '\\t') {\n        baseIndent = '\\t';\n    } else if (typeof opts.indent === 'number' && opts.indent > 0) {\n        baseIndent = $join.call(Array(opts.indent + 1), ' ');\n    } else {\n        return null;\n    }\n    return {\n        base: baseIndent,\n        prev: $join.call(Array(depth + 1), baseIndent)\n    };\n}\n\nfunction indentedJoin(xs, indent) {\n    if (xs.length === 0) { return ''; }\n    var lineJoiner = '\\n' + indent.prev + indent.base;\n    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\\n' + indent.prev;\n}\n\nfunction arrObjKeys(obj, inspect) {\n    var isArr = isArray(obj);\n    var xs = [];\n    if (isArr) {\n        xs.length = obj.length;\n        for (var i = 0; i < obj.length; i++) {\n            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';\n        }\n    }\n    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];\n    var symMap;\n    if (hasShammedSymbols) {\n        symMap = {};\n        for (var k = 0; k < syms.length; k++) {\n            symMap['$' + syms[k]] = syms[k];\n        }\n    }\n\n    for (var key in obj) { // eslint-disable-line no-restricted-syntax\n        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue\n        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue\n        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {\n            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section\n            continue; // eslint-disable-line no-restricted-syntax, no-continue\n        } else if ($test.call(/[^\\w$]/, key)) {\n            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));\n        } else {\n            xs.push(key + ': ' + inspect(obj[key], obj));\n        }\n    }\n    if (typeof gOPS === 'function') {\n        for (var j = 0; j < syms.length; j++) {\n            if (isEnumerable.call(obj, syms[j])) {\n                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));\n            }\n        }\n    }\n    return xs;\n}\n\n\n//# sourceURL=webpack://contentful/../node_modules/object-inspect/index.js?");

/***/ }),

/***/ "../node_modules/p-throttle/index.js":
/*!*******************************************!*\
  !*** ../node_modules/p-throttle/index.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
eval("\n\nclass AbortError extends Error {\n\tconstructor() {\n\t\tsuper('Throttled function aborted');\n\t\tthis.name = 'AbortError';\n\t}\n}\n\nconst pThrottle = ({limit, interval, strict}) => {\n\tif (!Number.isFinite(limit)) {\n\t\tthrow new TypeError('Expected `limit` to be a finite number');\n\t}\n\n\tif (!Number.isFinite(interval)) {\n\t\tthrow new TypeError('Expected `interval` to be a finite number');\n\t}\n\n\tconst queue = new Map();\n\n\tlet currentTick = 0;\n\tlet activeCount = 0;\n\n\tfunction windowedDelay() {\n\t\tconst now = Date.now();\n\n\t\tif ((now - currentTick) > interval) {\n\t\t\tactiveCount = 1;\n\t\t\tcurrentTick = now;\n\t\t\treturn 0;\n\t\t}\n\n\t\tif (activeCount < limit) {\n\t\t\tactiveCount++;\n\t\t} else {\n\t\t\tcurrentTick += interval;\n\t\t\tactiveCount = 1;\n\t\t}\n\n\t\treturn currentTick - now;\n\t}\n\n\tconst strictTicks = [];\n\n\tfunction strictDelay() {\n\t\tconst now = Date.now();\n\n\t\tif (strictTicks.length < limit) {\n\t\t\tstrictTicks.push(now);\n\t\t\treturn 0;\n\t\t}\n\n\t\tconst earliestTime = strictTicks.shift() + interval;\n\n\t\tif (now >= earliestTime) {\n\t\t\tstrictTicks.push(now);\n\t\t\treturn 0;\n\t\t}\n\n\t\tstrictTicks.push(earliestTime);\n\t\treturn earliestTime - now;\n\t}\n\n\tconst getDelay = strict ? strictDelay : windowedDelay;\n\n\treturn function_ => {\n\t\tconst throttled = function (...args) {\n\t\t\tif (!throttled.isEnabled) {\n\t\t\t\treturn (async () => function_.apply(this, args))();\n\t\t\t}\n\n\t\t\tlet timeout;\n\t\t\treturn new Promise((resolve, reject) => {\n\t\t\t\tconst execute = () => {\n\t\t\t\t\tresolve(function_.apply(this, args));\n\t\t\t\t\tqueue.delete(timeout);\n\t\t\t\t};\n\n\t\t\t\ttimeout = setTimeout(execute, getDelay());\n\n\t\t\t\tqueue.set(timeout, reject);\n\t\t\t});\n\t\t};\n\n\t\tthrottled.abort = () => {\n\t\t\tfor (const timeout of queue.keys()) {\n\t\t\t\tclearTimeout(timeout);\n\t\t\t\tqueue.get(timeout)(new AbortError());\n\t\t\t}\n\n\t\t\tqueue.clear();\n\t\t\tstrictTicks.splice(0, strictTicks.length);\n\t\t};\n\n\t\tthrottled.isEnabled = true;\n\n\t\treturn throttled;\n\t};\n};\n\nmodule.exports = pThrottle;\nmodule.exports.AbortError = AbortError;\n\n\n//# sourceURL=webpack://contentful/../node_modules/p-throttle/index.js?");

/***/ }),

/***/ "../node_modules/qs/lib/formats.js":
/*!*****************************************!*\
  !*** ../node_modules/qs/lib/formats.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar replace = String.prototype.replace;\nvar percentTwenties = /%20/g;\n\nvar Format = {\n    RFC1738: 'RFC1738',\n    RFC3986: 'RFC3986'\n};\n\nmodule.exports = {\n    'default': Format.RFC3986,\n    formatters: {\n        RFC1738: function (value) {\n            return replace.call(value, percentTwenties, '+');\n        },\n        RFC3986: function (value) {\n            return String(value);\n        }\n    },\n    RFC1738: Format.RFC1738,\n    RFC3986: Format.RFC3986\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/qs/lib/formats.js?");

/***/ }),

/***/ "../node_modules/qs/lib/index.js":
/*!***************************************!*\
  !*** ../node_modules/qs/lib/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar stringify = __webpack_require__(/*! ./stringify */ \"../node_modules/qs/lib/stringify.js\");\nvar parse = __webpack_require__(/*! ./parse */ \"../node_modules/qs/lib/parse.js\");\nvar formats = __webpack_require__(/*! ./formats */ \"../node_modules/qs/lib/formats.js\");\n\nmodule.exports = {\n    formats: formats,\n    parse: parse,\n    stringify: stringify\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/qs/lib/index.js?");

/***/ }),

/***/ "../node_modules/qs/lib/parse.js":
/*!***************************************!*\
  !*** ../node_modules/qs/lib/parse.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./utils */ \"../node_modules/qs/lib/utils.js\");\n\nvar has = Object.prototype.hasOwnProperty;\nvar isArray = Array.isArray;\n\nvar defaults = {\n    allowDots: false,\n    allowPrototypes: false,\n    allowSparse: false,\n    arrayLimit: 20,\n    charset: 'utf-8',\n    charsetSentinel: false,\n    comma: false,\n    decoder: utils.decode,\n    delimiter: '&',\n    depth: 5,\n    ignoreQueryPrefix: false,\n    interpretNumericEntities: false,\n    parameterLimit: 1000,\n    parseArrays: true,\n    plainObjects: false,\n    strictNullHandling: false\n};\n\nvar interpretNumericEntities = function (str) {\n    return str.replace(/&#(\\d+);/g, function ($0, numberStr) {\n        return String.fromCharCode(parseInt(numberStr, 10));\n    });\n};\n\nvar parseArrayValue = function (val, options) {\n    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {\n        return val.split(',');\n    }\n\n    return val;\n};\n\n// This is what browsers will submit when the ✓ character occurs in an\n// application/x-www-form-urlencoded body and the encoding of the page containing\n// the form is iso-8859-1, or when the submitted form has an accept-charset\n// attribute of iso-8859-1. Presumably also with other charsets that do not contain\n// the ✓ character, such as us-ascii.\nvar isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')\n\n// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.\nvar charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')\n\nvar parseValues = function parseQueryStringValues(str, options) {\n    var obj = {};\n    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\\?/, '') : str;\n    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;\n    var parts = cleanStr.split(options.delimiter, limit);\n    var skipIndex = -1; // Keep track of where the utf8 sentinel was found\n    var i;\n\n    var charset = options.charset;\n    if (options.charsetSentinel) {\n        for (i = 0; i < parts.length; ++i) {\n            if (parts[i].indexOf('utf8=') === 0) {\n                if (parts[i] === charsetSentinel) {\n                    charset = 'utf-8';\n                } else if (parts[i] === isoSentinel) {\n                    charset = 'iso-8859-1';\n                }\n                skipIndex = i;\n                i = parts.length; // The eslint settings do not allow break;\n            }\n        }\n    }\n\n    for (i = 0; i < parts.length; ++i) {\n        if (i === skipIndex) {\n            continue;\n        }\n        var part = parts[i];\n\n        var bracketEqualsPos = part.indexOf(']=');\n        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;\n\n        var key, val;\n        if (pos === -1) {\n            key = options.decoder(part, defaults.decoder, charset, 'key');\n            val = options.strictNullHandling ? null : '';\n        } else {\n            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');\n            val = utils.maybeMap(\n                parseArrayValue(part.slice(pos + 1), options),\n                function (encodedVal) {\n                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');\n                }\n            );\n        }\n\n        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {\n            val = interpretNumericEntities(val);\n        }\n\n        if (part.indexOf('[]=') > -1) {\n            val = isArray(val) ? [val] : val;\n        }\n\n        if (has.call(obj, key)) {\n            obj[key] = utils.combine(obj[key], val);\n        } else {\n            obj[key] = val;\n        }\n    }\n\n    return obj;\n};\n\nvar parseObject = function (chain, val, options, valuesParsed) {\n    var leaf = valuesParsed ? val : parseArrayValue(val, options);\n\n    for (var i = chain.length - 1; i >= 0; --i) {\n        var obj;\n        var root = chain[i];\n\n        if (root === '[]' && options.parseArrays) {\n            obj = [].concat(leaf);\n        } else {\n            obj = options.plainObjects ? Object.create(null) : {};\n            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;\n            var index = parseInt(cleanRoot, 10);\n            if (!options.parseArrays && cleanRoot === '') {\n                obj = { 0: leaf };\n            } else if (\n                !isNaN(index)\n                && root !== cleanRoot\n                && String(index) === cleanRoot\n                && index >= 0\n                && (options.parseArrays && index <= options.arrayLimit)\n            ) {\n                obj = [];\n                obj[index] = leaf;\n            } else if (cleanRoot !== '__proto__') {\n                obj[cleanRoot] = leaf;\n            }\n        }\n\n        leaf = obj;\n    }\n\n    return leaf;\n};\n\nvar parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {\n    if (!givenKey) {\n        return;\n    }\n\n    // Transform dot notation to bracket notation\n    var key = options.allowDots ? givenKey.replace(/\\.([^.[]+)/g, '[$1]') : givenKey;\n\n    // The regex chunks\n\n    var brackets = /(\\[[^[\\]]*])/;\n    var child = /(\\[[^[\\]]*])/g;\n\n    // Get the parent\n\n    var segment = options.depth > 0 && brackets.exec(key);\n    var parent = segment ? key.slice(0, segment.index) : key;\n\n    // Stash the parent if it exists\n\n    var keys = [];\n    if (parent) {\n        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties\n        if (!options.plainObjects && has.call(Object.prototype, parent)) {\n            if (!options.allowPrototypes) {\n                return;\n            }\n        }\n\n        keys.push(parent);\n    }\n\n    // Loop through children appending to the array until we hit depth\n\n    var i = 0;\n    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {\n        i += 1;\n        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {\n            if (!options.allowPrototypes) {\n                return;\n            }\n        }\n        keys.push(segment[1]);\n    }\n\n    // If there's a remainder, just add whatever is left\n\n    if (segment) {\n        keys.push('[' + key.slice(segment.index) + ']');\n    }\n\n    return parseObject(keys, val, options, valuesParsed);\n};\n\nvar normalizeParseOptions = function normalizeParseOptions(opts) {\n    if (!opts) {\n        return defaults;\n    }\n\n    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {\n        throw new TypeError('Decoder has to be a function.');\n    }\n\n    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {\n        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');\n    }\n    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;\n\n    return {\n        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,\n        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,\n        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,\n        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,\n        charset: charset,\n        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,\n        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,\n        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,\n        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,\n        // eslint-disable-next-line no-implicit-coercion, no-extra-parens\n        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,\n        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,\n        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,\n        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,\n        parseArrays: opts.parseArrays !== false,\n        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,\n        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling\n    };\n};\n\nmodule.exports = function (str, opts) {\n    var options = normalizeParseOptions(opts);\n\n    if (str === '' || str === null || typeof str === 'undefined') {\n        return options.plainObjects ? Object.create(null) : {};\n    }\n\n    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;\n    var obj = options.plainObjects ? Object.create(null) : {};\n\n    // Iterate over the keys and setup the new object\n\n    var keys = Object.keys(tempObj);\n    for (var i = 0; i < keys.length; ++i) {\n        var key = keys[i];\n        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');\n        obj = utils.merge(obj, newObj, options);\n    }\n\n    if (options.allowSparse === true) {\n        return obj;\n    }\n\n    return utils.compact(obj);\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/qs/lib/parse.js?");

/***/ }),

/***/ "../node_modules/qs/lib/stringify.js":
/*!*******************************************!*\
  !*** ../node_modules/qs/lib/stringify.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar getSideChannel = __webpack_require__(/*! side-channel */ \"../node_modules/side-channel/index.js\");\nvar utils = __webpack_require__(/*! ./utils */ \"../node_modules/qs/lib/utils.js\");\nvar formats = __webpack_require__(/*! ./formats */ \"../node_modules/qs/lib/formats.js\");\nvar has = Object.prototype.hasOwnProperty;\n\nvar arrayPrefixGenerators = {\n    brackets: function brackets(prefix) {\n        return prefix + '[]';\n    },\n    comma: 'comma',\n    indices: function indices(prefix, key) {\n        return prefix + '[' + key + ']';\n    },\n    repeat: function repeat(prefix) {\n        return prefix;\n    }\n};\n\nvar isArray = Array.isArray;\nvar split = String.prototype.split;\nvar push = Array.prototype.push;\nvar pushToArray = function (arr, valueOrArray) {\n    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);\n};\n\nvar toISO = Date.prototype.toISOString;\n\nvar defaultFormat = formats['default'];\nvar defaults = {\n    addQueryPrefix: false,\n    allowDots: false,\n    charset: 'utf-8',\n    charsetSentinel: false,\n    delimiter: '&',\n    encode: true,\n    encoder: utils.encode,\n    encodeValuesOnly: false,\n    format: defaultFormat,\n    formatter: formats.formatters[defaultFormat],\n    // deprecated\n    indices: false,\n    serializeDate: function serializeDate(date) {\n        return toISO.call(date);\n    },\n    skipNulls: false,\n    strictNullHandling: false\n};\n\nvar isNonNullishPrimitive = function isNonNullishPrimitive(v) {\n    return typeof v === 'string'\n        || typeof v === 'number'\n        || typeof v === 'boolean'\n        || typeof v === 'symbol'\n        || typeof v === 'bigint';\n};\n\nvar sentinel = {};\n\nvar stringify = function stringify(\n    object,\n    prefix,\n    generateArrayPrefix,\n    commaRoundTrip,\n    strictNullHandling,\n    skipNulls,\n    encoder,\n    filter,\n    sort,\n    allowDots,\n    serializeDate,\n    format,\n    formatter,\n    encodeValuesOnly,\n    charset,\n    sideChannel\n) {\n    var obj = object;\n\n    var tmpSc = sideChannel;\n    var step = 0;\n    var findFlag = false;\n    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {\n        // Where object last appeared in the ref tree\n        var pos = tmpSc.get(object);\n        step += 1;\n        if (typeof pos !== 'undefined') {\n            if (pos === step) {\n                throw new RangeError('Cyclic object value');\n            } else {\n                findFlag = true; // Break while\n            }\n        }\n        if (typeof tmpSc.get(sentinel) === 'undefined') {\n            step = 0;\n        }\n    }\n\n    if (typeof filter === 'function') {\n        obj = filter(prefix, obj);\n    } else if (obj instanceof Date) {\n        obj = serializeDate(obj);\n    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {\n        obj = utils.maybeMap(obj, function (value) {\n            if (value instanceof Date) {\n                return serializeDate(value);\n            }\n            return value;\n        });\n    }\n\n    if (obj === null) {\n        if (strictNullHandling) {\n            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;\n        }\n\n        obj = '';\n    }\n\n    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {\n        if (encoder) {\n            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);\n            if (generateArrayPrefix === 'comma' && encodeValuesOnly) {\n                var valuesArray = split.call(String(obj), ',');\n                var valuesJoined = '';\n                for (var i = 0; i < valuesArray.length; ++i) {\n                    valuesJoined += (i === 0 ? '' : ',') + formatter(encoder(valuesArray[i], defaults.encoder, charset, 'value', format));\n                }\n                return [formatter(keyValue) + (commaRoundTrip && isArray(obj) && valuesArray.length === 1 ? '[]' : '') + '=' + valuesJoined];\n            }\n            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];\n        }\n        return [formatter(prefix) + '=' + formatter(String(obj))];\n    }\n\n    var values = [];\n\n    if (typeof obj === 'undefined') {\n        return values;\n    }\n\n    var objKeys;\n    if (generateArrayPrefix === 'comma' && isArray(obj)) {\n        // we need to join elements in\n        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];\n    } else if (isArray(filter)) {\n        objKeys = filter;\n    } else {\n        var keys = Object.keys(obj);\n        objKeys = sort ? keys.sort(sort) : keys;\n    }\n\n    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? prefix + '[]' : prefix;\n\n    for (var j = 0; j < objKeys.length; ++j) {\n        var key = objKeys[j];\n        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];\n\n        if (skipNulls && value === null) {\n            continue;\n        }\n\n        var keyPrefix = isArray(obj)\n            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix\n            : adjustedPrefix + (allowDots ? '.' + key : '[' + key + ']');\n\n        sideChannel.set(object, step);\n        var valueSideChannel = getSideChannel();\n        valueSideChannel.set(sentinel, sideChannel);\n        pushToArray(values, stringify(\n            value,\n            keyPrefix,\n            generateArrayPrefix,\n            commaRoundTrip,\n            strictNullHandling,\n            skipNulls,\n            encoder,\n            filter,\n            sort,\n            allowDots,\n            serializeDate,\n            format,\n            formatter,\n            encodeValuesOnly,\n            charset,\n            valueSideChannel\n        ));\n    }\n\n    return values;\n};\n\nvar normalizeStringifyOptions = function normalizeStringifyOptions(opts) {\n    if (!opts) {\n        return defaults;\n    }\n\n    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {\n        throw new TypeError('Encoder has to be a function.');\n    }\n\n    var charset = opts.charset || defaults.charset;\n    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {\n        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');\n    }\n\n    var format = formats['default'];\n    if (typeof opts.format !== 'undefined') {\n        if (!has.call(formats.formatters, opts.format)) {\n            throw new TypeError('Unknown format option provided.');\n        }\n        format = opts.format;\n    }\n    var formatter = formats.formatters[format];\n\n    var filter = defaults.filter;\n    if (typeof opts.filter === 'function' || isArray(opts.filter)) {\n        filter = opts.filter;\n    }\n\n    return {\n        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,\n        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,\n        charset: charset,\n        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,\n        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,\n        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,\n        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,\n        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,\n        filter: filter,\n        format: format,\n        formatter: formatter,\n        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,\n        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,\n        sort: typeof opts.sort === 'function' ? opts.sort : null,\n        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling\n    };\n};\n\nmodule.exports = function (object, opts) {\n    var obj = object;\n    var options = normalizeStringifyOptions(opts);\n\n    var objKeys;\n    var filter;\n\n    if (typeof options.filter === 'function') {\n        filter = options.filter;\n        obj = filter('', obj);\n    } else if (isArray(options.filter)) {\n        filter = options.filter;\n        objKeys = filter;\n    }\n\n    var keys = [];\n\n    if (typeof obj !== 'object' || obj === null) {\n        return '';\n    }\n\n    var arrayFormat;\n    if (opts && opts.arrayFormat in arrayPrefixGenerators) {\n        arrayFormat = opts.arrayFormat;\n    } else if (opts && 'indices' in opts) {\n        arrayFormat = opts.indices ? 'indices' : 'repeat';\n    } else {\n        arrayFormat = 'indices';\n    }\n\n    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];\n    if (opts && 'commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {\n        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');\n    }\n    var commaRoundTrip = generateArrayPrefix === 'comma' && opts && opts.commaRoundTrip;\n\n    if (!objKeys) {\n        objKeys = Object.keys(obj);\n    }\n\n    if (options.sort) {\n        objKeys.sort(options.sort);\n    }\n\n    var sideChannel = getSideChannel();\n    for (var i = 0; i < objKeys.length; ++i) {\n        var key = objKeys[i];\n\n        if (options.skipNulls && obj[key] === null) {\n            continue;\n        }\n        pushToArray(keys, stringify(\n            obj[key],\n            key,\n            generateArrayPrefix,\n            commaRoundTrip,\n            options.strictNullHandling,\n            options.skipNulls,\n            options.encode ? options.encoder : null,\n            options.filter,\n            options.sort,\n            options.allowDots,\n            options.serializeDate,\n            options.format,\n            options.formatter,\n            options.encodeValuesOnly,\n            options.charset,\n            sideChannel\n        ));\n    }\n\n    var joined = keys.join(options.delimiter);\n    var prefix = options.addQueryPrefix === true ? '?' : '';\n\n    if (options.charsetSentinel) {\n        if (options.charset === 'iso-8859-1') {\n            // encodeURIComponent('&#10003;'), the \"numeric entity\" representation of a checkmark\n            prefix += 'utf8=%26%2310003%3B&';\n        } else {\n            // encodeURIComponent('✓')\n            prefix += 'utf8=%E2%9C%93&';\n        }\n    }\n\n    return joined.length > 0 ? prefix + joined : '';\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/qs/lib/stringify.js?");

/***/ }),

/***/ "../node_modules/qs/lib/utils.js":
/*!***************************************!*\
  !*** ../node_modules/qs/lib/utils.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar formats = __webpack_require__(/*! ./formats */ \"../node_modules/qs/lib/formats.js\");\n\nvar has = Object.prototype.hasOwnProperty;\nvar isArray = Array.isArray;\n\nvar hexTable = (function () {\n    var array = [];\n    for (var i = 0; i < 256; ++i) {\n        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());\n    }\n\n    return array;\n}());\n\nvar compactQueue = function compactQueue(queue) {\n    while (queue.length > 1) {\n        var item = queue.pop();\n        var obj = item.obj[item.prop];\n\n        if (isArray(obj)) {\n            var compacted = [];\n\n            for (var j = 0; j < obj.length; ++j) {\n                if (typeof obj[j] !== 'undefined') {\n                    compacted.push(obj[j]);\n                }\n            }\n\n            item.obj[item.prop] = compacted;\n        }\n    }\n};\n\nvar arrayToObject = function arrayToObject(source, options) {\n    var obj = options && options.plainObjects ? Object.create(null) : {};\n    for (var i = 0; i < source.length; ++i) {\n        if (typeof source[i] !== 'undefined') {\n            obj[i] = source[i];\n        }\n    }\n\n    return obj;\n};\n\nvar merge = function merge(target, source, options) {\n    /* eslint no-param-reassign: 0 */\n    if (!source) {\n        return target;\n    }\n\n    if (typeof source !== 'object') {\n        if (isArray(target)) {\n            target.push(source);\n        } else if (target && typeof target === 'object') {\n            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {\n                target[source] = true;\n            }\n        } else {\n            return [target, source];\n        }\n\n        return target;\n    }\n\n    if (!target || typeof target !== 'object') {\n        return [target].concat(source);\n    }\n\n    var mergeTarget = target;\n    if (isArray(target) && !isArray(source)) {\n        mergeTarget = arrayToObject(target, options);\n    }\n\n    if (isArray(target) && isArray(source)) {\n        source.forEach(function (item, i) {\n            if (has.call(target, i)) {\n                var targetItem = target[i];\n                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {\n                    target[i] = merge(targetItem, item, options);\n                } else {\n                    target.push(item);\n                }\n            } else {\n                target[i] = item;\n            }\n        });\n        return target;\n    }\n\n    return Object.keys(source).reduce(function (acc, key) {\n        var value = source[key];\n\n        if (has.call(acc, key)) {\n            acc[key] = merge(acc[key], value, options);\n        } else {\n            acc[key] = value;\n        }\n        return acc;\n    }, mergeTarget);\n};\n\nvar assign = function assignSingleSource(target, source) {\n    return Object.keys(source).reduce(function (acc, key) {\n        acc[key] = source[key];\n        return acc;\n    }, target);\n};\n\nvar decode = function (str, decoder, charset) {\n    var strWithoutPlus = str.replace(/\\+/g, ' ');\n    if (charset === 'iso-8859-1') {\n        // unescape never throws, no try...catch needed:\n        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);\n    }\n    // utf-8\n    try {\n        return decodeURIComponent(strWithoutPlus);\n    } catch (e) {\n        return strWithoutPlus;\n    }\n};\n\nvar encode = function encode(str, defaultEncoder, charset, kind, format) {\n    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.\n    // It has been adapted here for stricter adherence to RFC 3986\n    if (str.length === 0) {\n        return str;\n    }\n\n    var string = str;\n    if (typeof str === 'symbol') {\n        string = Symbol.prototype.toString.call(str);\n    } else if (typeof str !== 'string') {\n        string = String(str);\n    }\n\n    if (charset === 'iso-8859-1') {\n        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {\n            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';\n        });\n    }\n\n    var out = '';\n    for (var i = 0; i < string.length; ++i) {\n        var c = string.charCodeAt(i);\n\n        if (\n            c === 0x2D // -\n            || c === 0x2E // .\n            || c === 0x5F // _\n            || c === 0x7E // ~\n            || (c >= 0x30 && c <= 0x39) // 0-9\n            || (c >= 0x41 && c <= 0x5A) // a-z\n            || (c >= 0x61 && c <= 0x7A) // A-Z\n            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )\n        ) {\n            out += string.charAt(i);\n            continue;\n        }\n\n        if (c < 0x80) {\n            out = out + hexTable[c];\n            continue;\n        }\n\n        if (c < 0x800) {\n            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);\n            continue;\n        }\n\n        if (c < 0xD800 || c >= 0xE000) {\n            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);\n            continue;\n        }\n\n        i += 1;\n        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));\n        /* eslint operator-linebreak: [2, \"before\"] */\n        out += hexTable[0xF0 | (c >> 18)]\n            + hexTable[0x80 | ((c >> 12) & 0x3F)]\n            + hexTable[0x80 | ((c >> 6) & 0x3F)]\n            + hexTable[0x80 | (c & 0x3F)];\n    }\n\n    return out;\n};\n\nvar compact = function compact(value) {\n    var queue = [{ obj: { o: value }, prop: 'o' }];\n    var refs = [];\n\n    for (var i = 0; i < queue.length; ++i) {\n        var item = queue[i];\n        var obj = item.obj[item.prop];\n\n        var keys = Object.keys(obj);\n        for (var j = 0; j < keys.length; ++j) {\n            var key = keys[j];\n            var val = obj[key];\n            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {\n                queue.push({ obj: obj, prop: key });\n                refs.push(val);\n            }\n        }\n    }\n\n    compactQueue(queue);\n\n    return value;\n};\n\nvar isRegExp = function isRegExp(obj) {\n    return Object.prototype.toString.call(obj) === '[object RegExp]';\n};\n\nvar isBuffer = function isBuffer(obj) {\n    if (!obj || typeof obj !== 'object') {\n        return false;\n    }\n\n    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));\n};\n\nvar combine = function combine(a, b) {\n    return [].concat(a, b);\n};\n\nvar maybeMap = function maybeMap(val, fn) {\n    if (isArray(val)) {\n        var mapped = [];\n        for (var i = 0; i < val.length; i += 1) {\n            mapped.push(fn(val[i]));\n        }\n        return mapped;\n    }\n    return fn(val);\n};\n\nmodule.exports = {\n    arrayToObject: arrayToObject,\n    assign: assign,\n    combine: combine,\n    compact: compact,\n    decode: decode,\n    encode: encode,\n    isBuffer: isBuffer,\n    isRegExp: isRegExp,\n    maybeMap: maybeMap,\n    merge: merge\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/qs/lib/utils.js?");

/***/ }),

/***/ "../node_modules/side-channel/index.js":
/*!*********************************************!*\
  !*** ../node_modules/side-channel/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar GetIntrinsic = __webpack_require__(/*! get-intrinsic */ \"../node_modules/get-intrinsic/index.js\");\nvar callBound = __webpack_require__(/*! call-bind/callBound */ \"../node_modules/call-bind/callBound.js\");\nvar inspect = __webpack_require__(/*! object-inspect */ \"../node_modules/object-inspect/index.js\");\n\nvar $TypeError = GetIntrinsic('%TypeError%');\nvar $WeakMap = GetIntrinsic('%WeakMap%', true);\nvar $Map = GetIntrinsic('%Map%', true);\n\nvar $weakMapGet = callBound('WeakMap.prototype.get', true);\nvar $weakMapSet = callBound('WeakMap.prototype.set', true);\nvar $weakMapHas = callBound('WeakMap.prototype.has', true);\nvar $mapGet = callBound('Map.prototype.get', true);\nvar $mapSet = callBound('Map.prototype.set', true);\nvar $mapHas = callBound('Map.prototype.has', true);\n\n/*\n * This function traverses the list returning the node corresponding to the\n * given key.\n *\n * That node is also moved to the head of the list, so that if it's accessed\n * again we don't need to traverse the whole list. By doing so, all the recently\n * used nodes can be accessed relatively quickly.\n */\nvar listGetNode = function (list, key) { // eslint-disable-line consistent-return\n\tfor (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {\n\t\tif (curr.key === key) {\n\t\t\tprev.next = curr.next;\n\t\t\tcurr.next = list.next;\n\t\t\tlist.next = curr; // eslint-disable-line no-param-reassign\n\t\t\treturn curr;\n\t\t}\n\t}\n};\n\nvar listGet = function (objects, key) {\n\tvar node = listGetNode(objects, key);\n\treturn node && node.value;\n};\nvar listSet = function (objects, key, value) {\n\tvar node = listGetNode(objects, key);\n\tif (node) {\n\t\tnode.value = value;\n\t} else {\n\t\t// Prepend the new node to the beginning of the list\n\t\tobjects.next = { // eslint-disable-line no-param-reassign\n\t\t\tkey: key,\n\t\t\tnext: objects.next,\n\t\t\tvalue: value\n\t\t};\n\t}\n};\nvar listHas = function (objects, key) {\n\treturn !!listGetNode(objects, key);\n};\n\nmodule.exports = function getSideChannel() {\n\tvar $wm;\n\tvar $m;\n\tvar $o;\n\tvar channel = {\n\t\tassert: function (key) {\n\t\t\tif (!channel.has(key)) {\n\t\t\t\tthrow new $TypeError('Side channel does not contain ' + inspect(key));\n\t\t\t}\n\t\t},\n\t\tget: function (key) { // eslint-disable-line consistent-return\n\t\t\tif ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {\n\t\t\t\tif ($wm) {\n\t\t\t\t\treturn $weakMapGet($wm, key);\n\t\t\t\t}\n\t\t\t} else if ($Map) {\n\t\t\t\tif ($m) {\n\t\t\t\t\treturn $mapGet($m, key);\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tif ($o) { // eslint-disable-line no-lonely-if\n\t\t\t\t\treturn listGet($o, key);\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\thas: function (key) {\n\t\t\tif ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {\n\t\t\t\tif ($wm) {\n\t\t\t\t\treturn $weakMapHas($wm, key);\n\t\t\t\t}\n\t\t\t} else if ($Map) {\n\t\t\t\tif ($m) {\n\t\t\t\t\treturn $mapHas($m, key);\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tif ($o) { // eslint-disable-line no-lonely-if\n\t\t\t\t\treturn listHas($o, key);\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn false;\n\t\t},\n\t\tset: function (key, value) {\n\t\t\tif ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {\n\t\t\t\tif (!$wm) {\n\t\t\t\t\t$wm = new $WeakMap();\n\t\t\t\t}\n\t\t\t\t$weakMapSet($wm, key, value);\n\t\t\t} else if ($Map) {\n\t\t\t\tif (!$m) {\n\t\t\t\t\t$m = new $Map();\n\t\t\t\t}\n\t\t\t\t$mapSet($m, key, value);\n\t\t\t} else {\n\t\t\t\tif (!$o) {\n\t\t\t\t\t/*\n\t\t\t\t\t * Initialize the linked list as an empty node, so that we don't have\n\t\t\t\t\t * to special-case handling of the first node: we can always refer to\n\t\t\t\t\t * it as (previous node).next, instead of something like (list).head\n\t\t\t\t\t */\n\t\t\t\t\t$o = { key: {}, next: null };\n\t\t\t\t}\n\t\t\t\tlistSet($o, key, value);\n\t\t\t}\n\t\t}\n\t};\n\treturn channel;\n};\n\n\n//# sourceURL=webpack://contentful/../node_modules/side-channel/index.js?");

/***/ }),

/***/ "./contentful.ts":
/*!***********************!*\
  !*** ./contentful.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createClient\": () => (/* binding */ createClient)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"../node_modules/axios/index.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var contentful_sdk_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! contentful-sdk-core */ \"../node_modules/contentful-sdk-core/dist/index.es-modules.js\");\n/* harmony import */ var _create_global_options__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./create-global-options */ \"./create-global-options.ts\");\n/* harmony import */ var _make_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./make-client */ \"./make-client.ts\");\n/* harmony import */ var _utils_validate_params__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/validate-params */ \"./utils/validate-params.ts\");\n/**\n * Contentful Delivery API SDK. Allows you to create instances of a client\n * with access to the Contentful Content Delivery API.\n */\n\n\n\n\n\n/**\n * Create a client instance\n * @param params - Client initialization parameters\n * @category Client\n * @example\n * ```typescript\n * const contentful = require('contentful')\n * const client = contentful.createClient({\n *   accessToken: 'myAccessToken',\n *   space: 'mySpaceId'\n * })\n * ```\n */\nfunction createClient(params) {\n    if (!params.accessToken) {\n        throw new TypeError('Expected parameter accessToken');\n    }\n    if (!params.space) {\n        throw new TypeError('Expected parameter space');\n    }\n    (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_4__.validateResolveLinksParam)(params);\n    (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_4__.validateRemoveUnresolvedParam)(params);\n    const defaultConfig = {\n        resolveLinks: true,\n        removeUnresolved: false,\n        defaultHostname: 'cdn.contentful.com',\n        environment: 'master',\n    };\n    const config = {\n        ...defaultConfig,\n        ...params,\n    };\n    const userAgentHeader = (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)(`contentful.js/${\"10.1.0\"}`, config.application, config.integration);\n    config.headers = {\n        ...config.headers,\n        'Content-Type': 'application/vnd.contentful.delivery.v1+json',\n        'X-Contentful-User-Agent': userAgentHeader,\n    };\n    const http = (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_1__.createHttpClient)((axios__WEBPACK_IMPORTED_MODULE_0___default()), config);\n    if (!http.defaults.baseURL) {\n        throw new Error('Please define a baseURL');\n    }\n    const getGlobalOptions = (0,_create_global_options__WEBPACK_IMPORTED_MODULE_2__.createGlobalOptions)({\n        space: config.space,\n        environment: config.environment,\n        spaceBaseUrl: http.defaults.baseURL,\n        environmentBaseUrl: `${http.defaults.baseURL}environments/${config.environment}`,\n    });\n    // Append environment to baseURL\n    http.defaults.baseURL = getGlobalOptions({}).environmentBaseUrl;\n    return (0,_make_client__WEBPACK_IMPORTED_MODULE_3__.makeClient)({\n        http,\n        getGlobalOptions,\n    });\n}\n\n\n//# sourceURL=webpack://contentful/./contentful.ts?");

/***/ }),

/***/ "./create-contentful-api.ts":
/*!**********************************!*\
  !*** ./create-contentful-api.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ createContentfulApi)\n/* harmony export */ });\n/* harmony import */ var contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! contentful-sdk-core */ \"../node_modules/contentful-sdk-core/dist/index.es-modules.js\");\n/* harmony import */ var _paged_sync__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./paged-sync */ \"./paged-sync.ts\");\n/* harmony import */ var _utils_normalize_search_parameters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/normalize-search-parameters */ \"./utils/normalize-search-parameters.ts\");\n/* harmony import */ var _utils_normalize_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/normalize-select */ \"./utils/normalize-select.ts\");\n/* harmony import */ var _utils_resolve_circular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/resolve-circular */ \"./utils/resolve-circular.ts\");\n/* harmony import */ var _utils_validate_timestamp__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/validate-timestamp */ \"./utils/validate-timestamp.ts\");\n/* harmony import */ var _utils_validate_params__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/validate-params */ \"./utils/validate-params.ts\");\n/* harmony import */ var _utils_validate_search_parameters__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/validate-search-parameters */ \"./utils/validate-search-parameters.ts\");\n/**\n * Contentful Delivery API Client. Contains methods which allow access to the\n * different kinds of entities present in Contentful (Entries, Assets, etc).\n */\n\n\n\n\n\n\n\n\nconst ASSET_KEY_MAX_LIFETIME = 48 * 60 * 60;\nclass NotFoundError extends Error {\n    sys;\n    details;\n    constructor(id, environment, space) {\n        super('The resource could not be found.');\n        this.sys = {\n            type: 'Error',\n            id: 'NotFound',\n        };\n        this.details = {\n            type: 'Entry',\n            id,\n            environment,\n            space,\n        };\n    }\n}\nfunction createContentfulApi({ http, getGlobalOptions }, options) {\n    const notFoundError = (id = 'unknown') => {\n        return new NotFoundError(id, getGlobalOptions().environment, getGlobalOptions().space);\n    };\n    const getBaseUrl = (context) => {\n        let baseUrl = context === 'space' ? getGlobalOptions().spaceBaseUrl : getGlobalOptions().environmentBaseUrl;\n        if (!baseUrl) {\n            throw new Error('Please define baseUrl for ' + context);\n        }\n        if (!baseUrl.endsWith('/')) {\n            baseUrl += '/';\n        }\n        return baseUrl;\n    };\n    async function get({ context, path, config }) {\n        const baseUrl = getBaseUrl(context);\n        try {\n            const response = await http.get(baseUrl + path, config);\n            return response.data;\n        }\n        catch (error) {\n            (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.errorHandler)(error);\n        }\n    }\n    async function post({ context, path, data, config }) {\n        const baseUrl = getBaseUrl(context);\n        try {\n            const response = await http.post(baseUrl + path, data, config);\n            return response.data;\n        }\n        catch (error) {\n            (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.errorHandler)(error);\n        }\n    }\n    async function getSpace() {\n        return get({ context: 'space', path: '' });\n    }\n    async function getContentType(id) {\n        return get({\n            context: 'environment',\n            path: `content_types/${id}`,\n        });\n    }\n    async function getContentTypes(query = {}) {\n        return get({\n            context: 'environment',\n            path: 'content_types',\n            config: (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.createRequestConfig)({ query }),\n        });\n    }\n    async function getEntry(id, query = {}) {\n        return makeGetEntry(id, query, options);\n    }\n    async function getEntries(query = {}) {\n        return makeGetEntries(query, options);\n    }\n    async function makeGetEntry(id, query, options = {\n        withAllLocales: false,\n        withoutLinkResolution: false,\n        withoutUnresolvableLinks: false,\n    }) {\n        const { withAllLocales } = options;\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateLocaleParam)(query, withAllLocales);\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateResolveLinksParam)(query);\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateRemoveUnresolvedParam)(query);\n        (0,_utils_validate_search_parameters__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(query);\n        return internalGetEntry(id, withAllLocales ? { ...query, locale: '*' } : query, options);\n    }\n    async function internalGetEntry(id, query, options) {\n        if (!id) {\n            throw notFoundError(id);\n        }\n        try {\n            const response = await internalGetEntries({ 'sys.id': id, ...query }, options);\n            if (response.items.length > 0) {\n                return response.items[0];\n            }\n            else {\n                throw notFoundError(id);\n            }\n        }\n        catch (error) {\n            (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.errorHandler)(error);\n        }\n    }\n    async function makeGetEntries(query, options = {\n        withAllLocales: false,\n        withoutLinkResolution: false,\n        withoutUnresolvableLinks: false,\n    }) {\n        const { withAllLocales } = options;\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateLocaleParam)(query, withAllLocales);\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateResolveLinksParam)(query);\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateRemoveUnresolvedParam)(query);\n        (0,_utils_validate_search_parameters__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(query);\n        return internalGetEntries(withAllLocales\n            ? {\n                ...query,\n                locale: '*',\n            }\n            : query, options);\n    }\n    async function internalGetEntries(query, options) {\n        const { withoutLinkResolution, withoutUnresolvableLinks } = options;\n        try {\n            const entries = await get({\n                context: 'environment',\n                path: 'entries',\n                config: (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.createRequestConfig)({ query: (0,_utils_normalize_search_parameters__WEBPACK_IMPORTED_MODULE_2__[\"default\"])((0,_utils_normalize_select__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(query)) }),\n            });\n            return (0,_utils_resolve_circular__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(entries, {\n                resolveLinks: !withoutLinkResolution ?? true,\n                removeUnresolved: withoutUnresolvableLinks ?? false,\n            });\n        }\n        catch (error) {\n            (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.errorHandler)(error);\n        }\n    }\n    async function getAsset(id, query = {}) {\n        return makeGetAsset(id, query, options);\n    }\n    async function getAssets(query = {}) {\n        return makeGetAssets(query, options);\n    }\n    async function makeGetAssets(query, options = {\n        withAllLocales: false,\n        withoutLinkResolution: false,\n        withoutUnresolvableLinks: false,\n    }) {\n        const { withAllLocales } = options;\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateLocaleParam)(query, withAllLocales);\n        (0,_utils_validate_search_parameters__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(query);\n        const localeSpecificQuery = withAllLocales ? { ...query, locale: '*' } : query;\n        return internalGetAssets(localeSpecificQuery);\n    }\n    async function internalGetAsset(id, query) {\n        try {\n            return get({\n                context: 'environment',\n                path: `assets/${id}`,\n                config: (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.createRequestConfig)({ query: (0,_utils_normalize_select__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(query) }),\n            });\n        }\n        catch (error) {\n            (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.errorHandler)(error);\n        }\n    }\n    async function makeGetAsset(id, query, options = {\n        withAllLocales: false,\n        withoutLinkResolution: false,\n        withoutUnresolvableLinks: false,\n    }) {\n        const { withAllLocales } = options;\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateLocaleParam)(query, withAllLocales);\n        (0,_utils_validate_search_parameters__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(query);\n        const localeSpecificQuery = withAllLocales ? { ...query, locale: '*' } : query;\n        return internalGetAsset(id, localeSpecificQuery);\n    }\n    async function internalGetAssets(query) {\n        try {\n            return get({\n                context: 'environment',\n                path: 'assets',\n                config: (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.createRequestConfig)({ query: (0,_utils_normalize_search_parameters__WEBPACK_IMPORTED_MODULE_2__[\"default\"])((0,_utils_normalize_select__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(query)) }),\n            });\n        }\n        catch (error) {\n            (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.errorHandler)(error);\n        }\n    }\n    async function getTag(id) {\n        return get({\n            context: 'environment',\n            path: `tags/${id}`,\n        });\n    }\n    async function getTags(query = {}) {\n        (0,_utils_validate_search_parameters__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(query);\n        return get({\n            context: 'environment',\n            path: 'tags',\n            config: (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.createRequestConfig)({ query: (0,_utils_normalize_search_parameters__WEBPACK_IMPORTED_MODULE_2__[\"default\"])((0,_utils_normalize_select__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(query)) }),\n        });\n    }\n    async function createAssetKey(expiresAt) {\n        try {\n            const now = Math.floor(Date.now() / 1000);\n            const currentMaxLifetime = now + ASSET_KEY_MAX_LIFETIME;\n            (0,_utils_validate_timestamp__WEBPACK_IMPORTED_MODULE_5__[\"default\"])('expiresAt', expiresAt, { maximum: currentMaxLifetime, now });\n        }\n        catch (error) {\n            (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.errorHandler)(error);\n        }\n        return post({\n            context: 'environment',\n            path: 'asset_keys',\n            data: { expiresAt },\n        });\n    }\n    async function getLocales(query = {}) {\n        (0,_utils_validate_search_parameters__WEBPACK_IMPORTED_MODULE_7__[\"default\"])(query);\n        return get({\n            context: 'environment',\n            path: 'locales',\n            config: (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_0__.createRequestConfig)({ query: (0,_utils_normalize_select__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(query) }),\n        });\n    }\n    async function sync(query, syncOptions = { paginate: true }) {\n        return makePagedSync(query, syncOptions, options);\n    }\n    async function makePagedSync(query, syncOptions, options = {\n        withAllLocales: false,\n        withoutLinkResolution: false,\n        withoutUnresolvableLinks: false,\n    }) {\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateResolveLinksParam)(query);\n        (0,_utils_validate_params__WEBPACK_IMPORTED_MODULE_6__.validateRemoveUnresolvedParam)(query);\n        const combinedOptions = {\n            ...syncOptions,\n            ...options,\n        };\n        switchToEnvironment(http);\n        return (0,_paged_sync__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(http, query, combinedOptions);\n    }\n    function parseEntries(data) {\n        return makeParseEntries(data, options);\n    }\n    function makeParseEntries(data, options = {\n        withAllLocales: false,\n        withoutLinkResolution: false,\n        withoutUnresolvableLinks: false,\n    }) {\n        return internalParseEntries(data, options);\n    }\n    function internalParseEntries(data, options) {\n        const { withoutLinkResolution, withoutUnresolvableLinks } = options;\n        return (0,_utils_resolve_circular__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(data, {\n            resolveLinks: !withoutLinkResolution ?? true,\n            removeUnresolved: withoutUnresolvableLinks ?? false,\n        });\n    }\n    /*\n     * Switches BaseURL to use /environments path\n     * */\n    function switchToEnvironment(http) {\n        http.defaults.baseURL = getGlobalOptions().environmentBaseUrl;\n    }\n    return {\n        version: \"10.1.0\",\n        getSpace,\n        getContentType,\n        getContentTypes,\n        getAsset,\n        getAssets,\n        getTag,\n        getTags,\n        getLocales,\n        parseEntries,\n        sync,\n        getEntry,\n        getEntries,\n        createAssetKey,\n    };\n}\n\n\n//# sourceURL=webpack://contentful/./create-contentful-api.ts?");

/***/ }),

/***/ "./create-global-options.ts":
/*!**********************************!*\
  !*** ./create-global-options.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createGlobalOptions\": () => (/* binding */ createGlobalOptions)\n/* harmony export */ });\n/**\n * @param globalSettings - Global library settings\n * @returns getGlobalSettings - Method returning client settings\n * @category Client\n */\nfunction createGlobalOptions(globalSettings) {\n    /**\n     * Method merging pre-configured global options and provided local parameters\n     * @param query - regular query object used for collection endpoints\n     * @param query.environment - optional name of the environment\n     * @param query.space - optional space ID\n     * @param query.spaceBaseUrl - optional base URL for the space\n     * @param query.environmentBaseUrl - optional base URL for the environment\n     * @returns global options\n     */\n    return function getGlobalOptions(query) {\n        return Object.assign({}, globalSettings, query);\n    };\n}\n\n\n//# sourceURL=webpack://contentful/./create-global-options.ts?");

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createClient\": () => (/* reexport safe */ _contentful__WEBPACK_IMPORTED_MODULE_0__.createClient),\n/* harmony export */   \"createGlobalOptions\": () => (/* reexport safe */ _create_global_options__WEBPACK_IMPORTED_MODULE_1__.createGlobalOptions)\n/* harmony export */ });\n/* harmony import */ var _contentful__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contentful */ \"./contentful.ts\");\n/* harmony import */ var _create_global_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-global-options */ \"./create-global-options.ts\");\n/* harmony import */ var _mixins_stringify_safe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mixins/stringify-safe */ \"./mixins/stringify-safe.ts\");\n/* harmony import */ var _utils_normalize_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/normalize-select */ \"./utils/normalize-select.ts\");\n/* harmony import */ var _utils_resolve_circular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/resolve-circular */ \"./utils/resolve-circular.ts\");\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types */ \"./types/index.ts\");\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://contentful/./index.ts?");

/***/ }),

/***/ "./make-client.ts":
/*!************************!*\
  !*** ./make-client.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"makeClient\": () => (/* binding */ makeClient)\n/* harmony export */ });\n/* harmony import */ var _create_contentful_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-contentful-api */ \"./create-contentful-api.ts\");\n\nfunction create({ http, getGlobalOptions }, options, makeInnerClient) {\n    const client = (0,_create_contentful_api__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n        http,\n        getGlobalOptions,\n    }, options);\n    const response = client;\n    Object.defineProperty(response, 'withAllLocales', {\n        get: () => makeInnerClient({ ...options, withAllLocales: true }),\n    });\n    Object.defineProperty(response, 'withoutLinkResolution', {\n        get: () => makeInnerClient({ ...options, withoutLinkResolution: true }),\n    });\n    Object.defineProperty(response, 'withoutUnresolvableLinks', {\n        get: () => makeInnerClient({ ...options, withoutUnresolvableLinks: true }),\n    });\n    return Object.create(response);\n}\nconst makeClient = ({ http, getGlobalOptions, }) => {\n    function makeInnerClient(options) {\n        return create({ http, getGlobalOptions }, options, makeInnerClient);\n    }\n    const client = (0,_create_contentful_api__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({ http, getGlobalOptions }, {\n        withoutLinkResolution: false,\n        withAllLocales: false,\n        withoutUnresolvableLinks: false,\n    });\n    return {\n        ...client,\n        get withAllLocales() {\n            return makeInnerClient({\n                withAllLocales: true,\n                withoutLinkResolution: false,\n                withoutUnresolvableLinks: false,\n            });\n        },\n        get withoutLinkResolution() {\n            return makeInnerClient({\n                withAllLocales: false,\n                withoutLinkResolution: true,\n                withoutUnresolvableLinks: false,\n            });\n        },\n        get withoutUnresolvableLinks() {\n            return makeInnerClient({\n                withAllLocales: false,\n                withoutLinkResolution: false,\n                withoutUnresolvableLinks: true,\n            });\n        },\n    };\n};\n\n\n//# sourceURL=webpack://contentful/./make-client.ts?");

/***/ }),

/***/ "./mixins/stringify-safe.ts":
/*!**********************************!*\
  !*** ./mixins/stringify-safe.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ mixinStringifySafe)\n/* harmony export */ });\n/* harmony import */ var json_stringify_safe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! json-stringify-safe */ \"../node_modules/json-stringify-safe/stringify.js\");\n/* harmony import */ var json_stringify_safe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(json_stringify_safe__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction mixinStringifySafe(data) {\n    return Object.defineProperty(data, 'stringifySafe', {\n        enumerable: false,\n        configurable: false,\n        writable: false,\n        value: function (serializer = null, indent = '') {\n            return json_stringify_safe__WEBPACK_IMPORTED_MODULE_0___default()(this, serializer, indent, (key, value) => {\n                return {\n                    sys: {\n                        type: 'Link',\n                        linkType: 'Entry',\n                        id: value.sys.id,\n                        circular: true,\n                    },\n                };\n            });\n        },\n    });\n}\n\n\n//# sourceURL=webpack://contentful/./mixins/stringify-safe.ts?");

/***/ }),

/***/ "./paged-sync.ts":
/*!***********************!*\
  !*** ./paged-sync.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ pagedSync)\n/* harmony export */ });\n/* harmony import */ var contentful_resolve_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! contentful-resolve-response */ \"../node_modules/contentful-resolve-response/dist/esm/index.js\");\n/* harmony import */ var contentful_sdk_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! contentful-sdk-core */ \"../node_modules/contentful-sdk-core/dist/index.es-modules.js\");\n/* harmony import */ var _mixins_stringify_safe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mixins/stringify-safe */ \"./mixins/stringify-safe.ts\");\n\n\n\n/**\n * Retrieves all the available pages for a sync operation\n */\nasync function pagedSync(http, query, options) {\n    if (!query || (!query.initial && !query.nextSyncToken && !query.nextPageToken)) {\n        throw new Error('Please provide one of `initial`, `nextSyncToken` or `nextPageToken` parameters for syncing');\n    }\n    if (query['content_type'] && !query.type) {\n        query.type = 'Entry';\n    }\n    else if (query['content_type'] && query.type && query.type !== 'Entry') {\n        throw new Error('When using the `content_type` filter your `type` parameter cannot be different from `Entry`.');\n    }\n    const defaultOptions = {\n        withoutLinkResolution: false,\n        withoutUnresolvableLinks: false,\n        paginate: true,\n    };\n    const { withoutLinkResolution, withoutUnresolvableLinks, paginate } = {\n        ...defaultOptions,\n        ...options,\n    };\n    const response = await getSyncPage(http, [], query, { paginate });\n    // clones response.items used in includes because we don't want these to be mutated\n    if (!withoutLinkResolution) {\n        response.items = (0,contentful_resolve_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(response, {\n            removeUnresolved: withoutUnresolvableLinks,\n            itemEntryPoints: ['fields'],\n        });\n    }\n    // maps response items again after getters are attached\n    const mappedResponseItems = mapResponseItems(response.items);\n    if (response.nextSyncToken) {\n        mappedResponseItems.nextSyncToken = response.nextSyncToken;\n    }\n    if (response.nextPageToken) {\n        mappedResponseItems.nextPageToken = response.nextPageToken;\n    }\n    return (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_1__.freezeSys)((0,_mixins_stringify_safe__WEBPACK_IMPORTED_MODULE_2__[\"default\"])((0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_1__.toPlainObject)(mappedResponseItems)));\n}\n/**\n * @private\n * @param items\n * @returns Entities mapped to an object for each entity type\n */\nfunction mapResponseItems(items) {\n    const reducer = (type) => {\n        return (accumulated, item) => {\n            if (item.sys.type === type) {\n                accumulated.push((0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_1__.toPlainObject)(item));\n            }\n            return accumulated;\n        };\n    };\n    return {\n        entries: items.reduce(reducer('Entry'), []),\n        assets: items.reduce(reducer('Asset'), []),\n        deletedEntries: items.reduce(reducer('DeletedEntry'), []),\n        deletedAssets: items.reduce(reducer('DeletedAsset'), []),\n    };\n}\nfunction createRequestQuery(originalQuery) {\n    if (originalQuery.nextPageToken) {\n        return { sync_token: originalQuery.nextPageToken };\n    }\n    if (originalQuery.nextSyncToken) {\n        return { sync_token: originalQuery.nextSyncToken };\n    }\n    if (originalQuery.sync_token) {\n        return { sync_token: originalQuery.sync_token };\n    }\n    return originalQuery;\n}\n/**\n * If the response contains a nextPageUrl, extracts the sync token to get the\n * next page and calls itself again with that token.\n * Otherwise, if the response contains a nextSyncUrl, extracts the sync token\n * and returns it.\n * On each call of this function, any retrieved items are collected in the\n * supplied items array, which gets returned in the end.\n */\nasync function getSyncPage(http, items, query, { paginate }) {\n    const requestQuery = createRequestQuery(query);\n    const response = await http.get('sync', (0,contentful_sdk_core__WEBPACK_IMPORTED_MODULE_1__.createRequestConfig)({ query: requestQuery }));\n    const data = response.data || {};\n    items = items.concat(data.items || []);\n    if (data.nextPageUrl) {\n        if (paginate) {\n            delete requestQuery.initial;\n            requestQuery.sync_token = getToken(data.nextPageUrl);\n            return getSyncPage(http, items, requestQuery, { paginate });\n        }\n        return {\n            items,\n            nextPageToken: getToken(data.nextPageUrl),\n        };\n    }\n    else if (data.nextSyncUrl) {\n        return {\n            items,\n            nextSyncToken: getToken(data.nextSyncUrl),\n        };\n    }\n    else {\n        return { items: [] };\n    }\n}\n/**\n * Extracts token out of an url\n * @private\n */\nfunction getToken(url) {\n    const urlParts = url.split('?');\n    return urlParts.length > 0 ? urlParts[1].replace('sync_token=', '') : '';\n}\n\n\n//# sourceURL=webpack://contentful/./paged-sync.ts?");

/***/ }),

/***/ "./types/asset-key.ts":
/*!****************************!*\
  !*** ./types/asset-key.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/asset-key.ts?");

/***/ }),

/***/ "./types/asset.ts":
/*!************************!*\
  !*** ./types/asset.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/asset.ts?");

/***/ }),

/***/ "./types/collection.ts":
/*!*****************************!*\
  !*** ./types/collection.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/collection.ts?");

/***/ }),

/***/ "./types/content-type.ts":
/*!*******************************!*\
  !*** ./types/content-type.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/content-type.ts?");

/***/ }),

/***/ "./types/entry.ts":
/*!************************!*\
  !*** ./types/entry.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/entry.ts?");

/***/ }),

/***/ "./types/index.ts":
/*!************************!*\
  !*** ./types/index.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _asset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./asset */ \"./types/asset.ts\");\n/* harmony import */ var _asset_key__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./asset-key */ \"./types/asset-key.ts\");\n/* harmony import */ var _collection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./collection */ \"./types/collection.ts\");\n/* harmony import */ var _content_type__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./content-type */ \"./types/content-type.ts\");\n/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./entry */ \"./types/entry.ts\");\n/* harmony import */ var _link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./link */ \"./types/link.ts\");\n/* harmony import */ var _locale__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./locale */ \"./types/locale.ts\");\n/* harmony import */ var _metadata__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./metadata */ \"./types/metadata.ts\");\n/* harmony import */ var _query__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./query */ \"./types/query/index.ts\");\n/* harmony import */ var _resource_link__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./resource-link */ \"./types/resource-link.ts\");\n/* harmony import */ var _space__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./space */ \"./types/space.ts\");\n/* harmony import */ var _sync__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./sync */ \"./types/sync.ts\");\n/* harmony import */ var _sys__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./sys */ \"./types/sys.ts\");\n/* harmony import */ var _tag__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./tag */ \"./types/tag.ts\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://contentful/./types/index.ts?");

/***/ }),

/***/ "./types/link.ts":
/*!***********************!*\
  !*** ./types/link.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/link.ts?");

/***/ }),

/***/ "./types/locale.ts":
/*!*************************!*\
  !*** ./types/locale.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/locale.ts?");

/***/ }),

/***/ "./types/metadata.ts":
/*!***************************!*\
  !*** ./types/metadata.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/metadata.ts?");

/***/ }),

/***/ "./types/query/equality.ts":
/*!*********************************!*\
  !*** ./types/query/equality.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/equality.ts?");

/***/ }),

/***/ "./types/query/existence.ts":
/*!**********************************!*\
  !*** ./types/query/existence.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/existence.ts?");

/***/ }),

/***/ "./types/query/index.ts":
/*!******************************!*\
  !*** ./types/query/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _equality__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./equality */ \"./types/query/equality.ts\");\n/* harmony import */ var _existence__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./existence */ \"./types/query/existence.ts\");\n/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./location */ \"./types/query/location.ts\");\n/* harmony import */ var _order__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./order */ \"./types/query/order.ts\");\n/* harmony import */ var _query__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./query */ \"./types/query/query.ts\");\n/* harmony import */ var _range__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./range */ \"./types/query/range.ts\");\n/* harmony import */ var _reference__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reference */ \"./types/query/reference.ts\");\n/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./search */ \"./types/query/search.ts\");\n/* harmony import */ var _select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./select */ \"./types/query/select.ts\");\n/* harmony import */ var _set__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./set */ \"./types/query/set.ts\");\n/* harmony import */ var _subset__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./subset */ \"./types/query/subset.ts\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://contentful/./types/query/index.ts?");

/***/ }),

/***/ "./types/query/location.ts":
/*!*********************************!*\
  !*** ./types/query/location.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/location.ts?");

/***/ }),

/***/ "./types/query/order.ts":
/*!******************************!*\
  !*** ./types/query/order.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/order.ts?");

/***/ }),

/***/ "./types/query/query.ts":
/*!******************************!*\
  !*** ./types/query/query.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/query.ts?");

/***/ }),

/***/ "./types/query/range.ts":
/*!******************************!*\
  !*** ./types/query/range.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/range.ts?");

/***/ }),

/***/ "./types/query/reference.ts":
/*!**********************************!*\
  !*** ./types/query/reference.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/reference.ts?");

/***/ }),

/***/ "./types/query/search.ts":
/*!*******************************!*\
  !*** ./types/query/search.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/search.ts?");

/***/ }),

/***/ "./types/query/select.ts":
/*!*******************************!*\
  !*** ./types/query/select.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/select.ts?");

/***/ }),

/***/ "./types/query/set.ts":
/*!****************************!*\
  !*** ./types/query/set.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/set.ts?");

/***/ }),

/***/ "./types/query/subset.ts":
/*!*******************************!*\
  !*** ./types/query/subset.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/query/subset.ts?");

/***/ }),

/***/ "./types/resource-link.ts":
/*!********************************!*\
  !*** ./types/resource-link.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/resource-link.ts?");

/***/ }),

/***/ "./types/space.ts":
/*!************************!*\
  !*** ./types/space.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/space.ts?");

/***/ }),

/***/ "./types/sync.ts":
/*!***********************!*\
  !*** ./types/sync.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/sync.ts?");

/***/ }),

/***/ "./types/sys.ts":
/*!**********************!*\
  !*** ./types/sys.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/sys.ts?");

/***/ }),

/***/ "./types/tag.ts":
/*!**********************!*\
  !*** ./types/tag.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n\n\n//# sourceURL=webpack://contentful/./types/tag.ts?");

/***/ }),

/***/ "./utils/normalize-search-parameters.ts":
/*!**********************************************!*\
  !*** ./utils/normalize-search-parameters.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ normalizeSearchParameters)\n/* harmony export */ });\nfunction normalizeSearchParameters(query) {\n    const convertedQuery = {};\n    let hasConverted = false;\n    for (const key in query) {\n        // We allow multiple values to be passed as arrays\n        // which have to be converted to comma-separated strings before being sent to the API\n        if (Array.isArray(query[key])) {\n            convertedQuery[key] = query[key].join(',');\n            hasConverted = true;\n        }\n    }\n    if (hasConverted) {\n        return { ...query, ...convertedQuery };\n    }\n    return query;\n}\n\n\n//# sourceURL=webpack://contentful/./utils/normalize-search-parameters.ts?");

/***/ }),

/***/ "./utils/normalize-select.ts":
/*!***********************************!*\
  !*** ./utils/normalize-select.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ normalizeSelect)\n/* harmony export */ });\n/*\n * sdk relies heavily on sys metadata\n * so we cannot omit the sys property on sdk level entirely\n * and we have to ensure that at least `id` and `type` are present\n * */\nfunction normalizeSelect(query) {\n    if (!query.select) {\n        return query;\n    }\n    // The selection of fields for the query is limited\n    // Get the different parts that are listed for selection\n    const allSelects = Array.isArray(query.select)\n        ? query.select\n        : query.select.split(',').map((q) => q.trim());\n    // Move the parts into a set for easy access and deduplication\n    const selectedSet = new Set(allSelects);\n    // If we already select all of `sys` we can just return\n    // since we're anyway fetching everything that is needed\n    if (selectedSet.has('sys')) {\n        return query;\n    }\n    // We don't select `sys` so we need to ensure the minimum set\n    selectedSet.add('sys.id');\n    selectedSet.add('sys.type');\n    // Reassign the normalized sys properties\n    return {\n        ...query,\n        select: [...selectedSet].join(','),\n    };\n}\n\n\n//# sourceURL=webpack://contentful/./utils/normalize-select.ts?");

/***/ }),

/***/ "./utils/resolve-circular.ts":
/*!***********************************!*\
  !*** ./utils/resolve-circular.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ resolveCircular)\n/* harmony export */ });\n/* harmony import */ var _mixins_stringify_safe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../mixins/stringify-safe */ \"./mixins/stringify-safe.ts\");\n/* harmony import */ var contentful_resolve_response__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! contentful-resolve-response */ \"../node_modules/contentful-resolve-response/dist/esm/index.js\");\n\n\nfunction resolveCircular(data, { resolveLinks, removeUnresolved }) {\n    const wrappedData = (0,_mixins_stringify_safe__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(data);\n    if (resolveLinks) {\n        wrappedData.items = (0,contentful_resolve_response__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(wrappedData, {\n            removeUnresolved,\n            itemEntryPoints: ['fields'],\n        });\n    }\n    return wrappedData;\n}\n\n\n//# sourceURL=webpack://contentful/./utils/resolve-circular.ts?");

/***/ }),

/***/ "./utils/validate-params.ts":
/*!**********************************!*\
  !*** ./utils/validate-params.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"validateLocaleParam\": () => (/* binding */ validateLocaleParam),\n/* harmony export */   \"validateRemoveUnresolvedParam\": () => (/* binding */ validateRemoveUnresolvedParam),\n/* harmony export */   \"validateResolveLinksParam\": () => (/* binding */ validateResolveLinksParam)\n/* harmony export */ });\n/* harmony import */ var _validation_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation-error */ \"./utils/validation-error.ts\");\n\nfunction checkLocaleParamIsAll(query) {\n    if (query.locale === '*') {\n        throw new _validation_error__WEBPACK_IMPORTED_MODULE_0__.ValidationError('locale', `The use of locale='*' is no longer supported.To fetch an entry in all existing locales, \n      use client.withAllLocales instead of the locale='*' parameter.`);\n    }\n}\nfunction checkLocaleParamExists(query) {\n    if (query.locale) {\n        throw new _validation_error__WEBPACK_IMPORTED_MODULE_0__.ValidationError('locale', 'The `locale` parameter is not allowed');\n    }\n}\nfunction validateLocaleParam(query, isWithAllLocalesClient) {\n    if (isWithAllLocalesClient) {\n        checkLocaleParamExists(query);\n    }\n    else {\n        checkLocaleParamIsAll(query);\n    }\n    return;\n}\nfunction validateResolveLinksParam(query) {\n    if ('resolveLinks' in query) {\n        throw new _validation_error__WEBPACK_IMPORTED_MODULE_0__.ValidationError('resolveLinks', `The use of the 'resolveLinks' parameter is no longer supported. By default, links are resolved. \n      If you do not want to resolve links, use client.withoutLinkResolution.`);\n    }\n    return;\n}\nfunction validateRemoveUnresolvedParam(query) {\n    if ('removeUnresolved' in query) {\n        throw new _validation_error__WEBPACK_IMPORTED_MODULE_0__.ValidationError('removeUnresolved', `The use of the 'removeUnresolved' parameter is no longer supported. By default, unresolved links are kept as link objects.\n      If you do not want to include unresolved links, use client.withoutUnresolvableLinks.`);\n    }\n    return;\n}\n\n\n//# sourceURL=webpack://contentful/./utils/validate-params.ts?");

/***/ }),

/***/ "./utils/validate-search-parameters.ts":
/*!*********************************************!*\
  !*** ./utils/validate-search-parameters.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ validateSearchParameters)\n/* harmony export */ });\nfunction validateSearchParameters(query) {\n    for (const key in query) {\n        const value = query[key];\n        // We don’t allow any objects as values for query parameters\n        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {\n            throw new Error(`Objects are not supported as value for the \"${key}\" query parameter.`);\n        }\n    }\n}\n\n\n//# sourceURL=webpack://contentful/./utils/validate-search-parameters.ts?");

/***/ }),

/***/ "./utils/validate-timestamp.ts":
/*!*************************************!*\
  !*** ./utils/validate-timestamp.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ validateTimestamp)\n/* harmony export */ });\n/* harmony import */ var _validation_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validation-error */ \"./utils/validation-error.ts\");\n\nfunction validateTimestamp(name, timestamp, options) {\n    options = options || {};\n    if (typeof timestamp !== 'number') {\n        throw new _validation_error__WEBPACK_IMPORTED_MODULE_0__.ValidationError(name, `only numeric values are allowed for timestamps, provided type was \"${typeof timestamp}\"`);\n    }\n    if (options.maximum && timestamp > options.maximum) {\n        throw new _validation_error__WEBPACK_IMPORTED_MODULE_0__.ValidationError(name, `value (${timestamp}) cannot be further in the future than expected maximum (${options.maximum})`);\n    }\n    if (options.now && timestamp < options.now) {\n        throw new _validation_error__WEBPACK_IMPORTED_MODULE_0__.ValidationError(name, `value (${timestamp}) cannot be in the past, current time was ${options.now}`);\n    }\n}\n\n\n//# sourceURL=webpack://contentful/./utils/validate-timestamp.ts?");

/***/ }),

/***/ "./utils/validation-error.ts":
/*!***********************************!*\
  !*** ./utils/validation-error.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ValidationError\": () => (/* binding */ ValidationError)\n/* harmony export */ });\nclass ValidationError extends Error {\n    constructor(name, message) {\n        super(`Invalid \"${name}\" provided, ` + message);\n        this.name = 'ValidationError';\n    }\n}\n\n\n//# sourceURL=webpack://contentful/./utils/validation-error.ts?");

/***/ }),

/***/ "?d91c":
/*!********************************!*\
  !*** ./util.inspect (ignored) ***!
  \********************************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://contentful/./util.inspect_(ignored)?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
},{}],7:[function(require,module,exports){
(function (process){(function (){
const fs = require('fs')
const path = require('path')
const os = require('os')
const packageJson = require('../package.json')

const version = packageJson.version

const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

// Parser src into an Object
function parse (src) {
  const obj = {}

  // Convert buffer to string
  let lines = src.toString()

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/mg, '\n')

  let match
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1]

    // Default undefined or null to empty string
    let value = (match[2] || '')

    // Remove whitespace
    value = value.trim()

    // Check if double quoted
    const maybeQuote = value[0]

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }

    // Add to object
    obj[key] = value
  }

  return obj
}

function _log (message) {
  console.log(`[dotenv@${version}][DEBUG] ${message}`)
}

function _resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// Populates process.env from .env file
function config (options) {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'
  const debug = Boolean(options && options.debug)
  const override = Boolean(options && options.override)

  if (options) {
    if (options.path != null) {
      dotenvPath = _resolveHome(options.path)
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
  }

  try {
    // Specifying an encoding returns a string instead of a buffer
    const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }))

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
      } else {
        if (override === true) {
          process.env[key] = parsed[key]
        }

        if (debug) {
          if (override === true) {
            _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`)
          } else {
            _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`)
          }
        }
      }
    })

    return { parsed }
  } catch (e) {
    if (debug) {
      _log(`Failed to load ${dotenvPath} ${e.message}`)
    }

    return { error: e }
  }
}

const DotenvModule = {
  config,
  parse
}

module.exports.config = DotenvModule.config
module.exports.parse = DotenvModule.parse
module.exports = DotenvModule

}).call(this)}).call(this,require('_process'))
},{"../package.json":8,"_process":4,"fs":1,"os":2,"path":3}],8:[function(require,module,exports){
module.exports={
  "name": "dotenv",
  "version": "16.0.3",
  "description": "Loads environment variables from .env file",
  "main": "lib/main.js",
  "types": "lib/main.d.ts",
  "exports": {
    ".": {
      "require": "./lib/main.js",
      "types": "./lib/main.d.ts",
      "default": "./lib/main.js"
    },
    "./config": "./config.js",
    "./config.js": "./config.js",
    "./lib/env-options": "./lib/env-options.js",
    "./lib/env-options.js": "./lib/env-options.js",
    "./lib/cli-options": "./lib/cli-options.js",
    "./lib/cli-options.js": "./lib/cli-options.js",
    "./package.json": "./package.json"
  },
  "scripts": {
    "dts-check": "tsc --project tests/types/tsconfig.json",
    "lint": "standard",
    "lint-readme": "standard-markdown",
    "pretest": "npm run lint && npm run dts-check",
    "test": "tap tests/*.js --100 -Rspec",
    "prerelease": "npm test",
    "release": "standard-version"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/motdotla/dotenv.git"
  },
  "keywords": [
    "dotenv",
    "env",
    ".env",
    "environment",
    "variables",
    "config",
    "settings"
  ],
  "readmeFilename": "README.md",
  "license": "BSD-2-Clause",
  "devDependencies": {
    "@types/node": "^17.0.9",
    "decache": "^4.6.1",
    "dtslint": "^3.7.0",
    "sinon": "^12.0.1",
    "standard": "^16.0.4",
    "standard-markdown": "^7.1.0",
    "standard-version": "^9.3.2",
    "tap": "^15.1.6",
    "tar": "^6.1.11",
    "typescript": "^4.5.4"
  },
  "engines": {
    "node": ">=12"
  }
}

},{}]},{},[5]);