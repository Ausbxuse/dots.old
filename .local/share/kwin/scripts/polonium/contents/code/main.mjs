var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/obliterator/support.js
var require_support = __commonJS({
  "node_modules/obliterator/support.js"(exports) {
    exports.ARRAY_BUFFER_SUPPORT = typeof ArrayBuffer !== "undefined";
    exports.SYMBOL_SUPPORT = typeof Symbol !== "undefined";
  }
});

// node_modules/obliterator/foreach.js
var require_foreach = __commonJS({
  "node_modules/obliterator/foreach.js"(exports, module) {
    var support = require_support();
    var ARRAY_BUFFER_SUPPORT = support.ARRAY_BUFFER_SUPPORT;
    var SYMBOL_SUPPORT = support.SYMBOL_SUPPORT;
    module.exports = function forEach(iterable, callback) {
      var iterator, k, i, l, s;
      if (!iterable)
        throw new Error("obliterator/forEach: invalid iterable.");
      if (typeof callback !== "function")
        throw new Error("obliterator/forEach: expecting a callback.");
      if (Array.isArray(iterable) || ARRAY_BUFFER_SUPPORT && ArrayBuffer.isView(iterable) || typeof iterable === "string" || iterable.toString() === "[object Arguments]") {
        for (i = 0, l = iterable.length; i < l; i++)
          callback(iterable[i], i);
        return;
      }
      if (typeof iterable.forEach === "function") {
        iterable.forEach(callback);
        return;
      }
      if (SYMBOL_SUPPORT && Symbol.iterator in iterable && typeof iterable.next !== "function") {
        iterable = iterable[Symbol.iterator]();
      }
      if (typeof iterable.next === "function") {
        iterator = iterable;
        i = 0;
        while (s = iterator.next(), s.done !== true) {
          callback(s.value, i);
          i++;
        }
        return;
      }
      for (k in iterable) {
        if (iterable.hasOwnProperty(k)) {
          callback(iterable[k], k);
        }
      }
      return;
    };
  }
});

// node_modules/mnemonist/bi-map.js
var require_bi_map = __commonJS({
  "node_modules/mnemonist/bi-map.js"(exports, module) {
    var forEach = require_foreach();
    function InverseMap(original) {
      this.size = 0;
      this.items = /* @__PURE__ */ new Map();
      this.inverse = original;
    }
    function BiMap3() {
      this.size = 0;
      this.items = /* @__PURE__ */ new Map();
      this.inverse = new InverseMap(this);
    }
    function clear() {
      this.size = 0;
      this.items.clear();
      this.inverse.items.clear();
    }
    BiMap3.prototype.clear = clear;
    InverseMap.prototype.clear = clear;
    function set(key, value) {
      if (this.items.has(key)) {
        var currentValue = this.items.get(key);
        if (currentValue === value)
          return this;
        else
          this.inverse.items.delete(currentValue);
      }
      if (this.inverse.items.has(value)) {
        var currentKey = this.inverse.items.get(value);
        if (currentKey === key)
          return this;
        else
          this.items.delete(currentKey);
      }
      this.items.set(key, value);
      this.inverse.items.set(value, key);
      this.size = this.items.size;
      this.inverse.size = this.inverse.items.size;
      return this;
    }
    BiMap3.prototype.set = set;
    InverseMap.prototype.set = set;
    function del(key) {
      if (this.items.has(key)) {
        var currentValue = this.items.get(key);
        this.items.delete(key);
        this.inverse.items.delete(currentValue);
        this.size = this.items.size;
        this.inverse.size = this.inverse.items.size;
        return true;
      }
      return false;
    }
    BiMap3.prototype.delete = del;
    InverseMap.prototype.delete = del;
    var METHODS = ["has", "get", "forEach", "keys", "values", "entries"];
    METHODS.forEach(function(name) {
      BiMap3.prototype[name] = InverseMap.prototype[name] = function() {
        return Map.prototype[name].apply(this.items, arguments);
      };
    });
    if (typeof Symbol !== "undefined") {
      BiMap3.prototype[Symbol.iterator] = BiMap3.prototype.entries;
      InverseMap.prototype[Symbol.iterator] = InverseMap.prototype.entries;
    }
    BiMap3.prototype.inspect = function() {
      var dummy = {
        left: this.items,
        right: this.inverse.items
      };
      Object.defineProperty(dummy, "constructor", {
        value: BiMap3,
        enumerable: false
      });
      return dummy;
    };
    if (typeof Symbol !== "undefined")
      BiMap3.prototype[Symbol.for("nodejs.util.inspect.custom")] = BiMap3.prototype.inspect;
    InverseMap.prototype.inspect = function() {
      var dummy = {
        left: this.inverse.items,
        right: this.items
      };
      Object.defineProperty(dummy, "constructor", {
        value: InverseMap,
        enumerable: false
      });
      return dummy;
    };
    if (typeof Symbol !== "undefined")
      InverseMap.prototype[Symbol.for("nodejs.util.inspect.custom")] = InverseMap.prototype.inspect;
    BiMap3.from = function(iterable) {
      var bimap = new BiMap3();
      forEach(iterable, function(value, key) {
        bimap.set(key, value);
      });
      return bimap;
    };
    module.exports = BiMap3;
  }
});

// node_modules/obliterator/iterator.js
var require_iterator = __commonJS({
  "node_modules/obliterator/iterator.js"(exports, module) {
    function Iterator(next) {
      if (typeof next !== "function")
        throw new Error("obliterator/iterator: expecting a function!");
      this.next = next;
    }
    if (typeof Symbol !== "undefined")
      Iterator.prototype[Symbol.iterator] = function() {
        return this;
      };
    Iterator.of = function() {
      var args = arguments, l = args.length, i = 0;
      return new Iterator(function() {
        if (i >= l)
          return { done: true };
        return { done: false, value: args[i++] };
      });
    };
    Iterator.empty = function() {
      var iterator = new Iterator(function() {
        return { done: true };
      });
      return iterator;
    };
    Iterator.fromSequence = function(sequence) {
      var i = 0, l = sequence.length;
      return new Iterator(function() {
        if (i >= l)
          return { done: true };
        return { done: false, value: sequence[i++] };
      });
    };
    Iterator.is = function(value) {
      if (value instanceof Iterator)
        return true;
      return typeof value === "object" && value !== null && typeof value.next === "function";
    };
    module.exports = Iterator;
  }
});

// node_modules/mnemonist/queue.js
var require_queue = __commonJS({
  "node_modules/mnemonist/queue.js"(exports, module) {
    var Iterator = require_iterator();
    var forEach = require_foreach();
    function Queue3() {
      this.clear();
    }
    Queue3.prototype.clear = function() {
      this.items = [];
      this.offset = 0;
      this.size = 0;
    };
    Queue3.prototype.enqueue = function(item) {
      this.items.push(item);
      return ++this.size;
    };
    Queue3.prototype.dequeue = function() {
      if (!this.size)
        return;
      var item = this.items[this.offset];
      if (++this.offset * 2 >= this.items.length) {
        this.items = this.items.slice(this.offset);
        this.offset = 0;
      }
      this.size--;
      return item;
    };
    Queue3.prototype.peek = function() {
      if (!this.size)
        return;
      return this.items[this.offset];
    };
    Queue3.prototype.forEach = function(callback, scope) {
      scope = arguments.length > 1 ? scope : this;
      for (var i = this.offset, j = 0, l = this.items.length; i < l; i++, j++)
        callback.call(scope, this.items[i], j, this);
    };
    Queue3.prototype.toArray = function() {
      return this.items.slice(this.offset);
    };
    Queue3.prototype.values = function() {
      var items = this.items, i = this.offset;
      return new Iterator(function() {
        if (i >= items.length)
          return {
            done: true
          };
        var value = items[i];
        i++;
        return {
          value,
          done: false
        };
      });
    };
    Queue3.prototype.entries = function() {
      var items = this.items, i = this.offset, j = 0;
      return new Iterator(function() {
        if (i >= items.length)
          return {
            done: true
          };
        var value = items[i];
        i++;
        return {
          value: [j++, value],
          done: false
        };
      });
    };
    if (typeof Symbol !== "undefined")
      Queue3.prototype[Symbol.iterator] = Queue3.prototype.values;
    Queue3.prototype.toString = function() {
      return this.toArray().join(",");
    };
    Queue3.prototype.toJSON = function() {
      return this.toArray();
    };
    Queue3.prototype.inspect = function() {
      var array = this.toArray();
      Object.defineProperty(array, "constructor", {
        value: Queue3,
        enumerable: false
      });
      return array;
    };
    if (typeof Symbol !== "undefined")
      Queue3.prototype[Symbol.for("nodejs.util.inspect.custom")] = Queue3.prototype.inspect;
    Queue3.from = function(iterable) {
      var queue = new Queue3();
      forEach(iterable, function(value) {
        queue.enqueue(value);
      });
      return queue;
    };
    Queue3.of = function() {
      return Queue3.from(arguments);
    };
    module.exports = Queue3;
  }
});

// src/util/log.ts
var Log = class {
  constructor(config, root) {
    this.printFn = root.printQml;
    this.debugEnabled = config.debug;
  }
  print(opener, stuff) {
    if (this.printFn == void 0) {
      return;
    }
    let ret = opener;
    for (const s of stuff) {
      ret += " ";
      if (typeof s == "string") {
        ret += s;
      } else {
        ret += s.toString();
      }
    }
    this.printFn(ret);
  }
  debug(...stuff) {
    if (!this.debugEnabled)
      return;
    this.print("Polonium DBG:", stuff);
  }
  info(...stuff) {
    this.print("Polonium INF:", stuff);
  }
  error(...stuff) {
    this.print("Polonium ERR:", stuff);
  }
};

// src/util/geometry.ts
var DirectionTools = class {
  constructor(d) {
    this.d = d;
  }
  // rotate clockwise 90 deg
  rotateCw() {
    let ret = (this.d & 4 /* Vertical */) == 4 /* Vertical */ ? 0 /* None */ : 4 /* Vertical */;
    if ((this.d & 1 /* Up */) == 1 /* Up */) {
      if ((this.d & 2 /* Right */) == 2 /* Right */) {
        ret |= 2 /* Right */;
      } else {
        ret |= 2 /* Right */ | 1 /* Up */;
      }
    } else {
      if ((this.d & 2 /* Right */) == 2 /* Right */) {
        ret |= 0 /* None */;
      } else {
        ret |= 1 /* Up */;
      }
    }
    return ret;
  }
  // rotate counterclockwise 90 deg
  rotateCcw() {
    let ret = (this.d & 4 /* Vertical */) == 4 /* Vertical */ ? 0 /* None */ : 4 /* Vertical */;
    if ((this.d & 1 /* Up */) == 1 /* Up */) {
      if ((this.d & 2 /* Right */) == 2 /* Right */) {
        ret |= 1 /* Up */;
      } else {
        ret |= 0 /* None */;
      }
    } else {
      if ((this.d & 2 /* Right */) == 2 /* Right */) {
        ret |= 1 /* Up */ | 2 /* Right */;
      } else {
        ret |= 2 /* Right */;
      }
    }
    return ret;
  }
};
var GPoint = class _GPoint {
  constructor(p) {
    this.x = 0;
    this.y = 0;
    if (p == void 0) {
      return;
    }
    this.x = p.x;
    this.y = p.y;
  }
  static centerOfRect(r) {
    return new _GPoint({
      x: r.x + r.width / 2,
      y: r.y + r.height / 2
    });
  }
};
var GRect = class {
  constructor(r) {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    if (r == void 0) {
      return;
    }
    this.x = r.x;
    this.y = r.y;
    this.width = r.width;
    this.height = r.height;
  }
  directionFromPoint(p) {
    const relativePoint = new GPoint({
      x: p.x - this.x,
      y: p.y - this.y
    });
    if (relativePoint.x < this.width / 2) {
      if (relativePoint.y < this.height / 2) {
        if (relativePoint.x > this.width * relativePoint.y / this.height) {
          return 1 /* Up */ | 4 /* Vertical */;
        } else {
          return 1 /* Up */;
        }
      } else {
        if (relativePoint.x > this.width * relativePoint.y / this.height) {
          return 4 /* Vertical */;
        } else {
          return 0 /* None */;
        }
      }
    } else {
      if (relativePoint.y < this.height / 2) {
        if (relativePoint.x < this.width * relativePoint.y / this.height) {
          return 2 /* Right */ | 1 /* Up */ | 4 /* Vertical */;
        } else {
          return 2 /* Right */ | 1 /* Up */;
        }
      } else {
        if (relativePoint.x < this.width * relativePoint.y / this.height) {
          return 2 /* Right */ | 4 /* Vertical */;
        } else {
          return 2 /* Right */;
        }
      }
    }
  }
  get center() {
    return new GPoint({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    });
  }
};
var GSize = class _GSize {
  constructor(s) {
    this.width = 0;
    this.height = 0;
    if (s == void 0) {
      return;
    }
    this.width = s.width;
    this.height = s.height;
  }
  static fromRect(r) {
    return new _GSize({
      width: r.width,
      height: r.height
    });
  }
  isEqual(s) {
    return s.width == this.width && s.height == this.height;
  }
  // compare two sizes and grow the caller if it is too small
  fitSize(s) {
    if (this.height < s.height) {
      this.height = s.height;
    }
    if (this.width < s.width) {
      this.width = s.width;
    }
  }
  write(s) {
    if (s.width != this.width) {
      s.width = this.width;
    }
    if (s.height != this.height) {
      s.height = this.height;
    }
  }
  get area() {
    return this.width * this.height;
  }
};

// src/engine/engine.ts
var Tile = class _Tile {
  constructor(parent) {
    this.tiles = [];
    this.layoutDirection = 1 /* Horizontal */;
    // requested size in pixels, may not be honored
    this.requestedSize = new GSize();
    this.clients = [];
    this.parent = parent ?? null;
    if (this.parent) {
      this.parent.tiles.push(this);
    }
  }
  // getter/setter for backwards compatibility
  get client() {
    return this.clients.length > 0 ? this.clients[0] : null;
  }
  set client(value) {
    if (value != null) {
      this.clients[0] = value;
    } else {
      this.clients = [];
    }
  }
  // adds a child that will split perpendicularly to the parent. Returns the child
  addChild() {
    let splitDirection = 1;
    if (this.layoutDirection == 1) {
      splitDirection = 2;
    }
    const childTile = new _Tile(this);
    childTile.layoutDirection = splitDirection;
    return childTile;
  }
  // adds a child that will split parallel to the parent. Not really recommeneded
  addChildParallel() {
    const childTile = new _Tile(this);
    childTile.layoutDirection = this.layoutDirection;
    return childTile;
  }
  // split a tile perpendicularly
  split() {
    this.addChild();
    this.addChild();
  }
  // have a tile replace its parent, destroying its siblings
  secede() {
    const parent = this.parent;
    if (parent == null) {
      return;
    }
    this.parent = parent.parent;
    if (this.parent != null) {
      this.parent.tiles[this.parent.tiles.indexOf(parent)] = this;
      for (const tile of parent.tiles) {
        if (tile != this) {
          tile.remove(true);
        }
      }
      parent.tiles = [];
      parent.client = null;
    } else {
      parent.client = this.client;
      parent.tiles = this.tiles;
      this.tiles = [];
      this.client = null;
    }
  }
  // removes a tile and all its children
  remove(batchRemove = false) {
    const parent = this.parent;
    if (parent == null) {
      return;
    }
    if (!batchRemove) {
      parent.tiles.splice(parent.tiles.indexOf(this), 1);
    }
    this.tiles = [];
    this.client = null;
  }
  // remove child tiles
  removeChildren() {
    for (const tile of this.tiles) {
      tile.remove(true);
    }
    this.tiles = [];
  }
};
var TilingEngine = class {
  constructor(output, config) {
    this.rootTile = new Tile();
    this.untiledClients = [];
    this.config = config;
    this.screenSize = output.geometry;
  }
  // overrideable method if more internal engine stuff needs to be constructed
  initEngine() {
  }
};

// src/engine/layouts/btree.ts
var import_bi_map = __toESM(require_bi_map());
var import_queue = __toESM(require_queue());
var TreeNode = class _TreeNode {
  constructor() {
    this.parent = null;
    this.sibling = null;
    this.children = null;
    this.client = null;
    this.requestedSize = new GSize();
  }
  // splits tile
  split() {
    if (this.children != null)
      return;
    this.children = [new _TreeNode(), new _TreeNode()];
    this.children[0].parent = this;
    this.children[0].sibling = this.children[1];
    this.children[1].parent = this;
    this.children[1].sibling = this.children[0];
  }
  // removes self
  remove() {
    if (this.children != null || this.sibling == null || this.parent == null)
      return;
    if (this.sibling.children != null) {
      this.parent.children = this.sibling.children;
      for (const child of this.parent.children) {
        child.parent = this.parent;
      }
    } else {
      this.parent.client = this.sibling.client;
      this.parent.children = null;
    }
    this.parent = null;
    this.sibling.parent = null;
    this.sibling.sibling = null;
    this.sibling = null;
  }
};
var RootNode = class extends TreeNode {
  constructor() {
    super(...arguments);
    this.parent = null;
    this.sibling = null;
  }
  remove() {
    this.children = null;
    this.client = null;
  }
};
var BTreeEngine = class extends TilingEngine {
  constructor() {
    super(...arguments);
    this.engineCapability = 0 /* None */;
    this.rootNode = new RootNode();
    this.nodeMap = new import_bi_map.default();
  }
  buildLayout() {
    this.rootTile = new Tile();
    this.rootTile.layoutDirection = this.config.rotateLayout ? 2 : 1;
    this.nodeMap = new import_bi_map.default();
    let queue = new import_queue.default();
    queue.enqueue(this.rootNode);
    this.nodeMap.set(this.rootNode, this.rootTile);
    while (queue.size > 0) {
      const node = queue.dequeue();
      const tile = this.nodeMap.get(node);
      tile.requestedSize = node.requestedSize;
      if (node.client != null) {
        tile.client = node.client;
      }
      if (node.children != null) {
        tile.split();
        this.nodeMap.set(node.children[0], tile.tiles[0]);
        this.nodeMap.set(node.children[1], tile.tiles[1]);
        queue.enqueue(node.children[0]);
        queue.enqueue(node.children[1]);
      }
    }
  }
  addClient(client) {
    let queue = new import_queue.default();
    queue.enqueue(this.rootNode);
    while (queue.size > 0) {
      const node = queue.dequeue();
      if (node.children == null) {
        if (node.client != null) {
          node.split();
          if (this.config.insertionPoint == 0 /* Left */) {
            node.children[0].client = client;
            node.children[1].client = node.client;
          } else {
            node.children[0].client = node.client;
            node.children[1].client = client;
          }
          node.client = null;
        } else {
          node.client = client;
        }
        return;
      } else {
        const children = Array.from(node.children);
        if (this.config.insertionPoint == 1 /* Right */) {
          children.reverse();
        }
        for (const child of children) {
          queue.enqueue(child);
        }
      }
    }
  }
  removeClient(client) {
    let queue = new import_queue.default();
    queue.enqueue(this.rootNode);
    let deleteQueue = [];
    while (queue.size > 0) {
      const node = queue.dequeue();
      if (node.client == client) {
        deleteQueue.push(node);
      }
      if (node.children != null) {
        for (const child of node.children) {
          queue.enqueue(child);
        }
      }
    }
    for (const node of deleteQueue) {
      node.remove();
    }
  }
  putClientInTile(client, tile, direction) {
    const node = this.nodeMap.inverse.get(tile);
    if (node == void 0) {
      throw new Error("Node not found for tile");
    }
    if (node.client == null) {
      node.client = client;
    } else {
      node.split();
      let putClientInZero = false;
      if (direction != void 0) {
        if (tile.layoutDirection == 1) {
          if (!(direction & 2 /* Right */)) {
            putClientInZero = true;
          }
        } else {
          if (direction & 1 /* Up */) {
            putClientInZero = true;
          }
        }
      }
      if (putClientInZero) {
        node.children[0].client = client;
        node.children[1].client = node.client;
      } else {
        node.children[0].client = node.client;
        node.children[1].client = client;
      }
      node.client = null;
    }
  }
  regenerateLayout() {
    for (const node of this.nodeMap.keys()) {
      const tile = this.nodeMap.get(node);
      if (tile.requestedSize != null) {
        node.requestedSize = new GSize(tile.requestedSize);
      }
    }
  }
};

// src/engine/layouts/half.ts
var ClientBox = class {
  constructor(client) {
    this.client = client;
  }
};
var BoxIndex = class {
  constructor(engine, client) {
    this.left = false;
    this.right = false;
    for (let i = 0; i < engine.left.length; i += 1) {
      if (engine.left[i].client == client) {
        this.index = i;
        this.left = true;
        this.box = engine.left[i];
        return;
      }
    }
    for (let i = 0; i < engine.right.length; i += 1) {
      if (engine.right[i].client == client) {
        this.index = i;
        this.right = true;
        this.box = engine.right[i];
        return;
      }
    }
    throw new Error("Couldn't find box");
  }
};
var HalfEngine = class extends TilingEngine {
  constructor() {
    super(...arguments);
    this.engineCapability = 1 /* TranslateRotation */;
    this.tileMap = /* @__PURE__ */ new Map();
    this.left = [];
    this.right = [];
    this.rightSize = 0;
  }
  initEngine() {
    super.initEngine();
    this.rightSize = this.screenSize.width / 2;
  }
  buildLayout() {
    this.rootTile = new Tile();
    this.rootTile.layoutDirection = this.config.rotateLayout ? 2 : 1;
    if (this.left.length == 0 && this.right.length == 0) {
      return;
    } else if (this.left.length == 0 && this.right.length > 0) {
      for (const box of this.right) {
        const tile = this.rootTile.addChild();
        tile.client = box.client;
        this.tileMap.set(tile, box);
      }
    } else if (this.left.length > 0 && this.right.length == 0) {
      for (const box of this.left) {
        const tile = this.rootTile.addChild();
        tile.client = box.client;
        this.tileMap.set(tile, box);
      }
    } else {
      this.rootTile.split();
      const left = this.rootTile.tiles[0];
      const right = this.rootTile.tiles[1];
      for (const box of this.left) {
        const tile = left.addChild();
        tile.client = box.client;
        this.tileMap.set(tile, box);
      }
      for (const box of this.right) {
        const tile = right.addChild();
        tile.client = box.client;
        this.tileMap.set(tile, box);
      }
    }
  }
  addClient(client) {
    if (this.config.insertionPoint == 0 /* Left */) {
      if (this.right.length == 0) {
        this.right.push(new ClientBox(client));
      } else {
        this.left.push(new ClientBox(client));
      }
    } else {
      if (this.left.length == 0) {
        this.left.push(new ClientBox(client));
      } else {
        this.right.push(new ClientBox(client));
      }
    }
  }
  removeClient(client) {
    let box;
    try {
      box = new BoxIndex(this, client);
    } catch (e) {
      throw e;
    }
    if (box.right) {
      this.right.splice(box.index, 1);
      if (this.right.length == 0 && this.left.length > 1) {
        this.right.push(this.left.splice(0, 1)[0]);
      }
    } else {
      this.left.splice(box.index, 1);
      if (this.left.length == 0 && this.right.length > 1) {
        this.left.push(this.right.splice(0, 1)[0]);
      }
    }
  }
  putClientInTile(client, tile, direction) {
    const clientBox = new ClientBox(client);
    let targetBox;
    const box = this.tileMap.get(tile);
    if (box == void 0) {
      throw new Error("Box not found for tile");
    }
    targetBox = new BoxIndex(this, box.client);
    const targetArr = targetBox.left ? this.left : this.right;
    if (direction == null || direction & 1 /* Up */) {
      targetArr.splice(targetBox.index, 0, clientBox);
    } else {
      targetArr.splice(targetBox.index + 1, 0, clientBox);
    }
  }
  regenerateLayout() {
  }
};

// src/engine/layouts/threecolumn.ts
var ClientBox2 = class {
  constructor(client) {
    this.size = new GSize();
    this.client = client;
  }
};
var BoxIndex2 = class {
  constructor(engine, client) {
    for (let i = 0; i < engine.rows.length; i += 1) {
      const row = engine.rows[i];
      for (let j = 0; j < row.length; j += 1) {
        if (row[j].client == client) {
          this.index = j;
          this.row = i;
          this.box = row[j];
          return;
        }
      }
    }
    throw new Error("Couldn't find box");
  }
};
var ThreeColumnEngine = class extends TilingEngine {
  constructor() {
    super(...arguments);
    this.engineCapability = 1 /* TranslateRotation */;
    this.tileMap = /* @__PURE__ */ new Map();
    this.rows = [[], [], []];
  }
  buildLayout() {
    this.rootTile = new Tile();
    this.rootTile.layoutDirection = this.config.rotateLayout ? 2 : 1;
    for (const row of this.rows) {
      if (row.length == 0) {
        continue;
      }
      const rowRoot = this.rootTile.addChild();
      for (const box of row) {
        const tile = rowRoot.addChild();
        tile.client = box.client;
        tile.requestedSize = box.size;
        this.tileMap.set(tile, box);
      }
    }
  }
  addClient(client) {
    if (this.rows[1].length == 0) {
      this.rows[1].push(new ClientBox2(client));
      return;
    }
    if (this.config.insertionPoint == 0 /* Left */) {
      if (this.rows[0].length > this.rows[2].length) {
        this.rows[2].push(new ClientBox2(client));
      } else {
        this.rows[0].push(new ClientBox2(client));
      }
    } else {
      if (this.rows[2].length > this.rows[0].length) {
        this.rows[0].push(new ClientBox2(client));
      } else {
        this.rows[2].push(new ClientBox2(client));
      }
    }
  }
  removeClient(client) {
    let box;
    try {
      box = new BoxIndex2(this, client);
    } catch (e) {
      throw e;
    }
    const row = this.rows[box.row];
    row.splice(box.index, 1);
  }
  putClientInTile(client, tile, direction) {
    const clientBox = new ClientBox2(client);
    let targetBox;
    try {
      const box = this.tileMap.get(tile);
      if (box == void 0) {
        throw new Error("Box not found for tile");
      }
      targetBox = new BoxIndex2(this, box.client);
    } catch (e) {
      throw e;
    }
    const targetArr = this.rows[targetBox.row];
    if (direction == null || direction & 1 /* Up */) {
      targetArr.splice(targetBox.index, 0, clientBox);
    } else {
      targetArr.splice(targetBox.index + 1, 0, clientBox);
    }
  }
  regenerateLayout() {
    for (const tile of this.tileMap.keys()) {
      if (tile.requestedSize == null) {
        continue;
      }
      this.tileMap.get(tile).size = new GSize(tile.requestedSize);
    }
  }
};

// src/engine/layouts/kwin.ts
var KwinEngine = class extends TilingEngine {
  constructor() {
    super(...arguments);
    // tilesmutable moves all processing work to driver
    this.engineCapability = 2 /* TilesMutable */;
  }
  buildLayout() {
    return;
  }
  addClient(client) {
    this.untiledClients.push(client);
  }
  removeClient(client) {
    if (this.untiledClients.includes(client)) {
      this.untiledClients.splice(this.untiledClients.indexOf(client), 1);
    }
  }
  putClientInTile(client, tile, _direction) {
    tile.client = client;
  }
  regenerateLayout() {
    return;
  }
};

// src/engine/index.ts
var Client5 = class {
  constructor(window) {
    this.name = window.resourceClass;
    this.minSize = window.minSize;
  }
};
var TilingEngineFactory = class {
  constructor(config) {
    this.config = config;
  }
  newEngine(output, optConfig) {
    let config = optConfig;
    if (config == void 0) {
      config = {
        engineType: this.config.engineType,
        insertionPoint: this.config.insertionPoint,
        rotateLayout: this.config.rotateLayout
      };
    }
    const t = config.engineType % 4 /* _loop */;
    let engine;
    switch (t) {
      case 0 /* BTree */:
        engine = new BTreeEngine(output, config);
        break;
      case 1 /* Half */:
        engine = new HalfEngine(output, config);
        break;
      case 2 /* ThreeColumn */:
        engine = new ThreeColumnEngine(output, config);
        break;
      case 3 /* Kwin */:
        engine = new KwinEngine(output, config);
        break;
      default:
        throw new Error("Engine not found for engine type " + t);
    }
    engine.initEngine();
    return engine;
  }
};

// src/util/config.ts
var Config = class {
  constructor(kwinApi) {
    this.debug = false;
    this.tilePopups = false;
    this.filterProcess = [
      "krunner",
      "yakuake",
      "kded",
      "polkit",
      "plasmashell"
    ];
    this.filterCaption = [];
    this.timerDelay = 10;
    this.keepTiledBelow = true;
    this.borders = 1 /* NoTiled */;
    this.maximizeSingle = false;
    this.resizeAmount = 10;
    this.engineType = 0 /* BTree */;
    this.insertionPoint = 0 /* Left */;
    this.rotateLayout = true;
    this.readConfigFn = kwinApi.readConfig;
    this.readConfig();
  }
  readConfig() {
    let rc = this.readConfigFn;
    if (rc == void 0) {
      return;
    }
    this.debug = rc("Debug", false);
    this.tilePopups = rc("TilePopups", false);
    this.filterProcess = rc(
      "FilterProcess",
      "krunner, yakuake, kded, polkit, plasmashell"
    ).split(",").map((x) => x.trim());
    this.filterCaption = rc("FilterCaption", "").split(",").map((x) => x.trim());
    this.timerDelay = rc("TimerDelay", 10);
    this.keepTiledBelow = rc("KeepTiledBelow", true);
    this.borders = rc("Borders", 1 /* NoTiled */);
    this.maximizeSingle = rc("MaximizeSingle", false);
    this.resizeAmount = rc("ResizeAmount", 10);
    this.engineType = rc("EngineType", 0 /* BTree */);
    this.insertionPoint = rc("InsertionPoint", 0 /* Left */);
    this.rotateLayout = rc("RotateLayout", false);
  }
};

// src/driver/driver.ts
var import_bi_map2 = __toESM(require_bi_map());
var import_queue2 = __toESM(require_queue());
var TilingDriver = class {
  constructor(engine, engineType, ctrl) {
    this.tiles = new import_bi_map2.default();
    this.clients = new import_bi_map2.default();
    // windows that have no associated tile but are still in an engine go here
    this.untiledWindows = [];
    // windows that are marked for untiling but are not registered in the engine
    this.windowsToUntile = [];
    this.engine = engine;
    this.engineType = engineType;
    this.ctrl = ctrl;
    this.logger = ctrl.logger;
    this.config = ctrl.config;
  }
  get engineConfig() {
    return {
      engineType: this.engineType,
      insertionPoint: this.engine.config.insertionPoint,
      rotateLayout: this.engine.config.rotateLayout
    };
  }
  switchEngine(engine, engineType) {
    this.engine = engine;
    this.engineType = engineType;
    try {
      for (const client of this.clients.values()) {
        this.engine.addClient(client);
      }
      this.engine.buildLayout();
    } catch (e) {
      this.logger.error(e);
    }
  }
  buildLayout(rootTile) {
    for (const window of this.clients.keys()) {
      window.tile = null;
    }
    while (rootTile.tiles.length > 0) {
      rootTile.tiles[0].remove();
    }
    this.tiles.clear();
    this.untiledWindows = [];
    for (const window of this.windowsToUntile) {
      this.untiledWindows.push(window);
    }
    this.windowsToUntile = [];
    for (const client of this.engine.untiledClients) {
      const window = this.clients.inverse.get(client);
      if (window != null) {
        this.untiledWindows.push(window);
      }
    }
    let realRootTile = this.engine.rootTile;
    while (realRootTile.tiles.length == 1 && realRootTile.client == null) {
      realRootTile = realRootTile.tiles[0];
    }
    if (realRootTile.client != null && this.config.maximizeSingle) {
      const window = this.clients.inverse.get(realRootTile.client);
      if (window == void 0) {
        return;
      }
      window.tile = null;
      window.setMaximize(true, true);
      return;
    }
    const queue = new import_queue2.default();
    queue.enqueue(realRootTile);
    this.tiles.set(rootTile, realRootTile);
    while (queue.size > 0) {
      const tile = queue.dequeue();
      const kwinTile = this.tiles.inverse.get(tile);
      this.ctrl.managedTiles.add(kwinTile);
      kwinTile.layoutDirection = tile.layoutDirection;
      const horizontal = kwinTile.layoutDirection == 1 /* Horizontal */;
      const tilesLen = tile.tiles.length;
      if (tilesLen > 1) {
        for (let i = 0; i < tilesLen; i += 1) {
          if (i == 0) {
            kwinTile.split(tile.layoutDirection);
          } else if (i > 1) {
            kwinTile.tiles[i - 1].split(tile.layoutDirection);
          }
          const childKwinTile = kwinTile.tiles[i];
          const childTile = tile.tiles[i];
          this.tiles.set(childKwinTile, childTile);
          if (horizontal && i > 0) {
            const targetSize = kwinTile.absoluteGeometryInScreen.width / tilesLen * (tilesLen - i);
            kwinTile.tiles[i].resizeByPixels(
              -(targetSize - childKwinTile.absoluteGeometryInScreen.width),
              2 /* LeftEdge */
            );
          } else if (i > 0) {
            const targetSize = kwinTile.absoluteGeometryInScreen.height / tilesLen * (tilesLen - i);
            kwinTile.tiles[i].resizeByPixels(
              -(targetSize - childKwinTile.absoluteGeometryInScreen.height),
              1 /* TopEdge */
            );
          }
          queue.enqueue(tile.tiles[i]);
        }
      } else if (tilesLen == 1) {
        this.tiles.set(kwinTile, tile.tiles[0]);
        queue.enqueue(tile.tiles[0]);
      }
      for (let i = tile.clients.length - 1; i >= 0; i -= 1) {
        const client = tile.clients[i];
        const window = this.clients.inverse.get(client);
        if (window == void 0) {
          this.logger.error("Client", client.name, "does not exist");
          return;
        }
        const extensions = this.ctrl.windowExtensions.get(window);
        window.minimized = false;
        window.fullScreen = false;
        if (extensions.maximized) {
          window.setMaximize(false, false);
        }
        window.tile = kwinTile;
        extensions.lastTiledLocation = GPoint.centerOfRect(
          kwinTile.absoluteGeometry
        );
        this.ctrl.workspace.raiseWindow(window);
      }
      if (tile.parent != null) {
        let index = tile.parent.tiles.indexOf(tile);
        if (tile.requestedSize.width != 0) {
          let diff = tile.requestedSize.width - kwinTile.absoluteGeometryInScreen.width;
          if (horizontal) {
            if (index == 0) {
              kwinTile.resizeByPixels(-diff, 4 /* RightEdge */);
            } else {
              kwinTile.resizeByPixels(-diff, 2 /* LeftEdge */);
            }
          } else if (tile.parent.parent != null) {
            let parentIndex = tile.parent.parent.tiles.indexOf(
              tile.parent
            );
            if (parentIndex == 0) {
              kwinTile.resizeByPixels(-diff, 4 /* RightEdge */);
            } else {
              kwinTile.resizeByPixels(-diff, 2 /* LeftEdge */);
            }
          }
        }
        if (tile.requestedSize.height != 0) {
          let diff = tile.requestedSize.height - kwinTile.absoluteGeometryInScreen.height;
          if (!horizontal) {
            if (index == 0) {
              kwinTile.resizeByPixels(-diff, 1 /* TopEdge */);
            } else {
              kwinTile.resizeByPixels(-diff, 8 /* BottomEdge */);
            }
          } else if (tile.parent.parent != null) {
            let parentIndex = tile.parent.parent.tiles.indexOf(
              tile.parent
            );
            if (parentIndex == 0) {
              kwinTile.resizeByPixels(diff, 1 /* TopEdge */);
            } else {
              kwinTile.resizeByPixels(diff, 8 /* BottomEdge */);
            }
          }
        }
      }
    }
  }
  addWindow(window) {
    if (this.clients.has(window)) {
      return;
    }
    const client = new Client5(window);
    this.clients.set(window, client);
    let failedActive = true;
    activeChecks:
      if (this.engine.config.insertionPoint == 2 /* Active */) {
        failedActive = false;
        const activeWindow = this.ctrl.workspace.activeWindow;
        if (activeWindow == null || activeWindow.tile == null) {
          failedActive = true;
          break activeChecks;
        }
        const tile = this.tiles.get(activeWindow.tile);
        if (tile == void 0) {
          failedActive = true;
          break activeChecks;
        }
        this.engine.putClientInTile(client, tile);
      }
    try {
      if (failedActive) {
        this.engine.addClient(client);
      }
      this.engine.buildLayout();
    } catch (e) {
      this.logger.error(e);
    }
  }
  // returns whether the window is still registered or not
  removeWindow(window) {
    const client = this.clients.get(window);
    if (client == void 0) {
      return false;
    }
    this.clients.delete(window);
    try {
      this.engine.removeClient(client);
      this.engine.buildLayout();
      if (this.engine.untiledClients.includes(client)) {
        return true;
      }
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }
  putWindowInTile(window, kwinTile, direction) {
    const tile = this.tiles.get(kwinTile);
    if (tile == void 0) {
      this.logger.error(
        "Tile",
        kwinTile.absoluteGeometry,
        "not registered"
      );
      return;
    }
    if (!this.clients.has(window)) {
      this.clients.set(window, new Client5(window));
    }
    const client = this.clients.get(window);
    try {
      let rotatedDirection = direction;
      if (rotatedDirection != null && this.engine.config.rotateLayout && (this.engine.engineCapability & 1 /* TranslateRotation */) == 1 /* TranslateRotation */) {
        rotatedDirection = new DirectionTools(
          rotatedDirection
        ).rotateCw();
        this.logger.debug(
          "Insertion direction rotated to",
          rotatedDirection
        );
      }
      this.engine.putClientInTile(client, tile, rotatedDirection);
      this.engine.buildLayout();
    } catch (e) {
      this.logger.error(e);
    }
  }
  regenerateLayout(rootTile) {
    const queue = new import_queue2.default();
    queue.enqueue(rootTile);
    while (queue.size > 0) {
      const kwinTile = queue.dequeue();
      const tile = this.tiles.get(kwinTile);
      if (tile == void 0) {
        this.logger.error(
          "Tile",
          kwinTile.absoluteGeometry,
          "not registered"
        );
        continue;
      }
      tile.requestedSize = GSize.fromRect(kwinTile.absoluteGeometry);
      if ((this.engine.engineCapability & 2 /* TilesMutable */) == 2 /* TilesMutable */) {
        for (const child of tile.tiles) {
          if (this.tiles.inverse.get(child) == null) {
            this.tiles.inverse.delete(child);
            child.remove();
          }
        }
        for (const child of kwinTile.tiles) {
          if (!this.tiles.has(child)) {
            const newTile = tile.addChild();
            this.tiles.set(child, newTile);
          }
        }
      }
      for (const child of kwinTile.tiles) {
        queue.enqueue(child);
      }
    }
    try {
      this.engine.regenerateLayout();
      this.engine.buildLayout();
    } catch (e) {
      this.logger.error(e);
    }
  }
};

// src/controller/desktop.ts
var Desktop = class _Desktop {
  constructor(desktop, activity, output) {
    this.desktop = desktop;
    this.activity = activity;
    this.output = output;
  }
  static fromWindow(window) {
    const ret = [];
    for (const desktop of window.desktops) {
      for (const activity of window.activities) {
        ret.push(new _Desktop(desktop, activity, window.output));
      }
    }
    return ret;
  }
  toRawDesktop() {
    return {
      desktop: this.desktop.id,
      activity: this.activity,
      output: this.output.name
    };
  }
  toString() {
    return JSON.stringify(this.toRawDesktop());
  }
};
var DesktopFactory = class {
  constructor(workspace) {
    this.desktopMap = /* @__PURE__ */ new Map();
    this.outputMap = /* @__PURE__ */ new Map();
    this.workspace = workspace;
    this.desktopsChanged();
    this.screensChanged();
    this.workspace.desktopsChanged.connect(this.desktopsChanged.bind(this));
    this.workspace.screensChanged.connect(this.screensChanged.bind(this));
  }
  desktopsChanged() {
    this.desktopMap.clear();
    for (const desktop of this.workspace.desktops) {
      this.desktopMap.set(desktop.id, desktop);
    }
  }
  screensChanged() {
    this.outputMap.clear();
    for (const output of this.workspace.screens) {
      this.outputMap.set(output.name, output);
    }
  }
  createDesktop(desktop, activity, output) {
    return new Desktop(desktop, activity, output);
  }
  createDefaultDesktop() {
    return new Desktop(
      this.workspace.currentDesktop,
      this.workspace.currentActivity,
      this.workspace.activeScreen
    );
  }
  createDesktopFromStrings(desktop) {
    const virtualDesktop = this.desktopMap.get(desktop.desktop);
    const output = this.outputMap.get(desktop.output);
    if (virtualDesktop == void 0 || output == void 0 || !this.workspace.activities.includes(desktop.activity)) {
      throw new Error("Tried to create a desktop that does not exist!");
    }
    return new Desktop(virtualDesktop, desktop.activity, output);
  }
  createAllDesktops() {
    const ret = [];
    for (const output of this.workspace.screens) {
      for (const activity of this.workspace.activities) {
        for (const desktop of this.workspace.desktops) {
          ret.push(new Desktop(desktop, activity, output));
        }
      }
    }
    return ret;
  }
  createVisibleDesktops() {
    const ret = [];
    for (const output of this.workspace.screens) {
      ret.push(
        new Desktop(
          this.workspace.currentDesktop,
          this.workspace.currentActivity,
          output
        )
      );
    }
    return ret;
  }
};

// src/driver/index.ts
var DriverManager = class {
  constructor(c) {
    this.drivers = /* @__PURE__ */ new Map();
    this.rootTileCallbacks = /* @__PURE__ */ new Map();
    this.buildingLayout = false;
    this.ctrl = c;
    this.engineFactory = new TilingEngineFactory(this.ctrl.config);
    this.logger = c.logger;
    this.config = c.config;
  }
  init() {
    const c = this.ctrl;
    c.workspace.screensChanged.connect(this.generateDrivers.bind(this));
    c.workspace.desktopsChanged.connect(this.generateDrivers.bind(this));
    c.workspace.activitiesChanged.connect(this.generateDrivers.bind(this));
    this.generateDrivers();
  }
  generateDrivers() {
    const currentDesktops = [];
    for (const desktop of this.drivers.keys()) {
      currentDesktops.push(desktop);
    }
    for (const desktop of this.ctrl.desktopFactory.createAllDesktops()) {
      const desktopString = desktop.toString();
      const index = currentDesktops.indexOf(desktopString);
      if (index == -1) {
        this.logger.debug(
          "Creating new engine for desktop",
          desktopString
        );
        let engineType = this.config.engineType;
        const config = {
          engineType,
          insertionPoint: this.config.insertionPoint,
          rotateLayout: this.config.rotateLayout
        };
        const engine = this.engineFactory.newEngine(desktop.output, config);
        const driver = new TilingDriver(engine, engineType, this.ctrl);
        this.drivers.set(desktopString, driver);
        this.ctrl.dbusManager.getSettings(
          desktopString,
          this.setEngineConfig.bind(this, desktop)
        );
      } else {
        currentDesktops.splice(index, 1);
      }
    }
    for (const desktop of currentDesktops) {
      this.drivers.delete(desktop);
    }
    for (const tile of this.rootTileCallbacks.keys()) {
      let remove = true;
      for (const output of this.ctrl.workspace.screens) {
        if (this.ctrl.workspace.tilingForScreen(output).rootTile == tile) {
          remove = false;
          break;
        }
      }
      if (remove && this.rootTileCallbacks.has(tile)) {
        this.rootTileCallbacks.get(tile).destroy();
        this.rootTileCallbacks.delete(tile);
      }
    }
    for (const output of this.ctrl.workspace.screens) {
      const rootTile = this.ctrl.workspace.tilingForScreen(output).rootTile;
      if (this.ctrl.managedTiles.has(rootTile)) {
        continue;
      }
      this.ctrl.managedTiles.add(rootTile);
      const timer = this.ctrl.qmlObjects.root.createTimer();
      timer.interval = this.config.timerDelay;
      timer.triggered.connect(
        this.layoutModifiedCallback.bind(this, rootTile, output)
      );
      timer.repeat = false;
      this.rootTileCallbacks.set(rootTile, timer);
      rootTile.layoutModified.connect(
        this.layoutModified.bind(this, rootTile)
      );
    }
  }
  layoutModified(tile) {
    if (this.buildingLayout) {
      return;
    }
    const timer = this.rootTileCallbacks.get(tile);
    if (timer == void 0) {
      this.logger.error(
        "Callback not registered for root tile",
        tile.absoluteGeometry
      );
      return;
    }
    timer.restart();
  }
  layoutModifiedCallback(tile, output) {
    this.logger.debug("Layout modified for tile", tile.absoluteGeometry);
    const desktop = new Desktop(
      this.ctrl.workspace.currentDesktop,
      this.ctrl.workspace.currentActivity,
      output
    );
    const driver = this.drivers.get(desktop.toString());
    driver.regenerateLayout(tile);
  }
  applyTiled(window) {
    this.ctrl.windowExtensions.get(window).isTiled = true;
    if (this.config.keepTiledBelow) {
      window.keepBelow = true;
    }
    if (this.config.borders == 1 /* NoTiled */ || this.config.borders == 2 /* Selected */) {
      window.noBorder = true;
    }
  }
  applyUntiled(window) {
    this.ctrl.windowExtensions.get(window).isTiled = false;
    if (this.config.keepTiledBelow) {
      window.keepBelow = false;
    }
    if (this.config.borders == 1 /* NoTiled */ || this.config.borders == 2 /* Selected */) {
      window.noBorder = false;
    }
  }
  rebuildLayout(output) {
    this.buildingLayout = true;
    let desktops;
    if (output == void 0) {
      desktops = this.ctrl.desktopFactory.createVisibleDesktops();
    } else {
      desktops = [
        new Desktop(
          this.ctrl.workspace.currentDesktop,
          this.ctrl.workspace.currentActivity,
          output
        )
      ];
    }
    this.logger.debug("Rebuilding layout for desktops", desktops);
    for (const desktop of desktops) {
      const driver = this.drivers.get(desktop.toString());
      driver.buildLayout(
        this.ctrl.workspace.tilingForScreen(desktop.output).rootTile
      );
      for (const window of driver.untiledWindows) {
        window.tile = null;
        this.applyUntiled(window);
      }
      for (const window of driver.clients.keys()) {
        this.applyTiled(window);
      }
    }
    this.buildingLayout = false;
  }
  addWindow(window, desktops) {
    if (desktops == void 0) {
      desktops = Desktop.fromWindow(window);
    }
    this.logger.debug(
      "Adding client",
      window.resourceClass,
      "to desktops",
      desktops
    );
    for (const desktop of desktops) {
      this.drivers.get(desktop.toString()).addWindow(window);
    }
  }
  removeWindow(window, desktops) {
    if (desktops == void 0) {
      desktops = Desktop.fromWindow(window);
    }
    this.logger.debug(
      "Removing client",
      window.resourceClass,
      "from desktops",
      desktops
    );
    for (const desktop of desktops) {
      const driver = this.drivers.get(desktop.toString());
      const windowRemoved = driver.removeWindow(window);
      if (windowRemoved && this.ctrl.windowExtensions.has(window)) {
        driver.windowsToUntile.push(window);
      }
    }
  }
  putWindowInTile(window, tile, direction) {
    const desktop = this.ctrl.desktopFactory.createDefaultDesktop();
    desktop.output = window.output;
    this.logger.debug(
      "Putting client",
      window.resourceClass,
      "in tile",
      tile.absoluteGeometry,
      "with direction",
      direction,
      "on desktop",
      desktop
    );
    this.drivers.get(desktop.toString()).putWindowInTile(window, tile, direction);
    this.ctrl.windowExtensions.get(window).isTiled = true;
    this.applyTiled(window);
  }
  getEngineConfig(desktop) {
    this.logger.debug("Getting engine config for desktop", desktop);
    return this.drivers.get(desktop.toString()).engineConfig;
  }
  setEngineConfig(desktop, config) {
    this.logger.debug("Setting engine config for desktop", desktop);
    const driver = this.drivers.get(desktop.toString());
    if (config.engineType != driver.engineType) {
      driver.switchEngine(
        this.engineFactory.newEngine(desktop.output, config),
        config.engineType
      );
    } else {
      driver.engine.config = config;
    }
    this.ctrl.dbusManager.setSettings(desktop.toString(), config);
    this.rebuildLayout(desktop.output);
  }
  removeEngineConfig(desktop) {
    this.logger.debug("Removing engine config for desktop", desktop);
    const config = {
      engineType: this.config.engineType,
      insertionPoint: this.config.insertionPoint,
      rotateLayout: this.config.rotateLayout
    };
    const driver = this.drivers.get(desktop.toString());
    if (config.engineType != driver.engineType) {
      driver.switchEngine(
        this.engineFactory.newEngine(desktop.output, config),
        config.engineType
      );
    } else {
      driver.engine.config = config;
    }
    this.ctrl.dbusManager.removeSettings(desktop.toString());
    this.rebuildLayout(desktop.output);
  }
};

// src/controller/actions/dbus.ts
var DBusManager = class {
  constructor(ctrl) {
    this.isConnected = false;
    this.logger = ctrl.logger;
    const dbus = ctrl.qmlObjects.dbus;
    this.existsCall = dbus.getExists();
    this.getSettingsCall = dbus.getGetSettings();
    this.setSettingsCall = dbus.getSetSettings();
    this.removeSettingsCall = dbus.getRemoveSettings();
    this.existsCall.finished.connect(this.existsCallback.bind(this));
    this.existsCall.call();
  }
  existsCallback() {
    this.isConnected = true;
    this.logger.debug("DBus connected");
  }
  getSettingsCallback(setEngineConfig, args) {
    if (args[1].length == 0) {
      return;
    }
    let config = JSON.parse(args[1]);
    setEngineConfig(config);
  }
  setSettings(desktop, config) {
    if (!this.isConnected) {
      return;
    }
    const stringConfig = JSON.stringify(config);
    this.logger.debug(
      "Setting settings over dbus for desktop",
      desktop,
      "to",
      stringConfig
    );
    this.setSettingsCall.arguments = [desktop, stringConfig];
    this.setSettingsCall.call();
  }
  getSettings(desktop, fn) {
    if (!this.isConnected) {
      return;
    }
    this.logger.debug("Getting settings over dbus for desktop", desktop);
    this.getSettingsCall.finished.connect(
      this.getSettingsCallback.bind(this, fn)
    );
    this.getSettingsCall.arguments = [desktop];
    this.getSettingsCall.call();
  }
  removeSettings(desktop) {
    if (!this.isConnected) {
      return;
    }
    this.logger.debug("Removing settings over dbus for desktop", desktop);
    this.removeSettingsCall.arguments = [desktop];
    this.removeSettingsCall.call();
  }
};

// src/controller/extensions.ts
var WorkspaceExtensions = class {
  constructor(workspace) {
    this.lastActiveWindow = null;
    this.currentActiveWindow = null;
    this.workspace = workspace;
    this.currentActivity = this.workspace.currentActivity;
    this.currentDesktop = this.workspace.currentDesktop;
    this.lastActivity = this.currentActivity;
    this.lastDesktop = this.currentDesktop;
    this.workspace.currentActivityChanged.connect(this.repoll.bind(this));
    this.workspace.currentDesktopChanged.connect(this.repoll.bind(this));
    this.workspace.windowActivated.connect(((_window) => {
      this.lastActiveWindow = this.currentActiveWindow;
      this.currentActiveWindow = this.workspace.activeWindow;
    }).bind(this));
  }
  repoll() {
    this.lastActivity = this.currentActivity;
    this.lastDesktop = this.currentDesktop;
    this.currentActivity = this.workspace.currentActivity;
    this.currentDesktop = this.workspace.currentDesktop;
  }
};
var WindowExtensions = class {
  constructor(window) {
    // only store state of full maximization (who maximizes only directionally?)
    this.maximized = false;
    this.previousDesktops = [];
    this.previousDesktopsInternal = [];
    this.isTiled = false;
    // not is in a tile, but is registered in engine
    this.wasTiled = false;
    // windows that were tiled when they could be (minimized/maximized/fullscreen)
    this.lastTiledLocation = null;
    this.clientHooks = null;
    this.window = window;
    window.maximizedAboutToChange.connect(
      (m) => this.maximized = m == 3 /* MaximizeFull */
    );
    window.tileChanged.connect(this.tileChanged.bind(this));
    window.desktopsChanged.connect(this.previousDesktopsChanged.bind(this));
    window.activitiesChanged.connect(this.previousDesktopsChanged.bind(this));
    window.outputChanged.connect(this.previousDesktopsChanged.bind(this));
    this.tileChanged();
    this.previousDesktopsChanged();
  }
  tileChanged() {
    this.lastTiledLocation = this.window.tile != null ? new GRect(this.window.tile.absoluteGeometry).center : null;
  }
  previousDesktopsChanged() {
    this.previousDesktops = this.previousDesktopsInternal;
    this.previousDesktopsInternal = [];
    for (const desktop of this.window.desktops) {
      for (const activity of this.window.activities) {
        this.previousDesktopsInternal.push(
          new Desktop(desktop, activity, this.window.output)
        );
      }
    }
  }
};

// src/controller/actions/shortcuts.ts
function pointAbove(window) {
  if (window.tile == null) {
    return null;
  }
  const geometry = window.frameGeometry;
  const coordOffset = 1 + window.tile.padding;
  const x = geometry.x + 1;
  const y = geometry.y - coordOffset;
  return new GPoint({
    x,
    y
  });
}
function pointBelow(window) {
  if (window.tile == null) {
    return null;
  }
  const geometry = window.frameGeometry;
  const coordOffset = 1 + geometry.height + window.tile.padding;
  const x = geometry.x + 1;
  const y = geometry.y + coordOffset;
  return new GPoint({
    x,
    y
  });
}
function pointLeft(window) {
  if (window.tile == null) {
    return null;
  }
  const geometry = window.frameGeometry;
  let coordOffset = 1 + window.tile.padding;
  let x = geometry.x - coordOffset;
  let y = geometry.y + 1;
  return new GPoint({
    x,
    y
  });
}
function pointRight(window) {
  if (window.tile == null) {
    return null;
  }
  const geometry = window.frameGeometry;
  let coordOffset = 1 + geometry.width + window.tile.padding;
  let x = geometry.x + coordOffset;
  let y = geometry.y + 1;
  return new GPoint({
    x,
    y
  });
}
function pointInDirection(window, direction) {
  switch (direction) {
    case 0 /* Above */:
      return pointAbove(window);
    case 1 /* Below */:
      return pointBelow(window);
    case 2 /* Left */:
      return pointLeft(window);
    case 3 /* Right */:
      return pointRight(window);
    default:
      return null;
  }
}
function gdirectionFromDirection(direction) {
  switch (direction) {
    case 0 /* Above */:
      return 1 /* Up */ | 4 /* Vertical */;
    case 1 /* Below */:
      return 4 /* Vertical */;
    case 2 /* Left */:
      return 0 /* None */;
    case 3 /* Right */:
      return 2 /* Right */;
  }
}
var ShortcutManager = class {
  constructor(ctrl) {
    this.ctrl = ctrl;
    this.logger = ctrl.logger;
    this.config = ctrl.config;
    let shortcuts = ctrl.qmlObjects.shortcuts;
    shortcuts.getRetileWindow().activated.connect(this.retileWindow.bind(this));
    shortcuts.getOpenSettings().activated.connect(this.openSettingsDialog.bind(this));
    shortcuts.getFocusAbove().activated.connect(this.focus.bind(this, 0 /* Above */));
    shortcuts.getFocusBelow().activated.connect(this.focus.bind(this, 1 /* Below */));
    shortcuts.getFocusLeft().activated.connect(this.focus.bind(this, 2 /* Left */));
    shortcuts.getFocusRight().activated.connect(this.focus.bind(this, 3 /* Right */));
    shortcuts.getInsertAbove().activated.connect(this.insert.bind(this, 0 /* Above */));
    shortcuts.getInsertBelow().activated.connect(this.insert.bind(this, 1 /* Below */));
    shortcuts.getInsertLeft().activated.connect(this.insert.bind(this, 2 /* Left */));
    shortcuts.getInsertRight().activated.connect(this.insert.bind(this, 3 /* Right */));
    shortcuts.getResizeAbove().activated.connect(this.resize.bind(this, 0 /* Above */));
    shortcuts.getResizeBelow().activated.connect(this.resize.bind(this, 1 /* Below */));
    shortcuts.getResizeLeft().activated.connect(this.resize.bind(this, 2 /* Left */));
    shortcuts.getResizeRight().activated.connect(this.resize.bind(this, 3 /* Right */));
  }
  retileWindow() {
    const window = this.ctrl.workspace.activeWindow;
    if (window == null || !this.ctrl.windowExtensions.has(window)) {
      return;
    }
    if (this.ctrl.windowExtensions.get(window).isTiled) {
      this.ctrl.driverManager.removeWindow(window);
    } else {
      this.ctrl.driverManager.addWindow(window);
    }
    this.ctrl.driverManager.rebuildLayout();
  }
  openSettingsDialog() {
    const settings = this.ctrl.qmlObjects.settings;
    if (settings.isVisible()) {
      settings.hide();
    } else {
      settings.setSettings(
        this.ctrl.driverManager.getEngineConfig(
          this.ctrl.desktopFactory.createDefaultDesktop()
        )
      );
      settings.show();
    }
  }
  tileInDirection(window, point) {
    if (point == null) {
      return null;
    }
    return this.ctrl.workspace.tilingForScreen(window.output).bestTileForPosition(point.x, point.y);
  }
  focus(direction) {
    const window = this.ctrl.workspace.activeWindow;
    if (window == null) {
      return;
    }
    const tile = this.tileInDirection(
      window,
      pointInDirection(window, direction)
    );
    if (tile == null || tile.windows.length == 0) {
      return;
    }
    let newWindow = tile.windows[0];
    this.logger.debug("Focusing", newWindow.resourceClass);
    this.ctrl.workspace.activeWindow = newWindow;
  }
  insert(direction) {
    const window = this.ctrl.workspace.activeWindow;
    if (window == null) {
      return;
    }
    const point = pointInDirection(window, direction);
    if (point == null) {
      return;
    }
    this.logger.debug("Moving", window.resourceClass);
    this.ctrl.driverManager.removeWindow(window);
    this.ctrl.driverManager.rebuildLayout(window.output);
    let tile = this.tileInDirection(window, point);
    if (tile == null) {
      tile = this.ctrl.workspace.tilingForScreen(window.output).rootTile;
      while (tile.tiles.length == 1) {
        tile = tile.tiles[0];
      }
    }
    this.ctrl.driverManager.putWindowInTile(
      window,
      tile,
      gdirectionFromDirection(direction)
    );
    this.ctrl.driverManager.rebuildLayout(window.output);
  }
  resize(direction) {
    const window = this.ctrl.workspace.activeWindow;
    if (window == null || window.tile == null) {
      return;
    }
    const tile = window.tile;
    const resizeAmount = this.config.resizeAmount;
    this.logger.debug("Changing size of", tile.absoluteGeometry);
    switch (direction) {
      case 0 /* Above */:
        tile.resizeByPixels(resizeAmount, 1 /* TopEdge */);
        break;
      case 1 /* Below */:
        tile.resizeByPixels(resizeAmount, 8 /* BottomEdge */);
        break;
      case 2 /* Left */:
        tile.resizeByPixels(resizeAmount, 2 /* LeftEdge */);
        break;
      case 3 /* Right */:
        tile.resizeByPixels(resizeAmount, 4 /* RightEdge */);
    }
  }
};

// src/controller/actions/windowhooks.ts
var WindowHooks = class {
  constructor(ctrl, window) {
    this.ctrl = ctrl;
    this.logger = ctrl.logger;
    this.window = window;
    this.extensions = ctrl.windowExtensions.get(window);
    this.tileChangedTimer = this.ctrl.qmlObjects.root.createTimer();
    this.tileChangedTimer.triggeredOnStart = false;
    this.tileChangedTimer.repeat = false;
    this.tileChangedTimer.interval = this.ctrl.config.timerDelay;
    this.tileChangedTimer.triggered.connect(this.tileChangedCallback.bind(this));
    window.desktopsChanged.connect(this.desktopChanged.bind(this));
    window.activitiesChanged.connect(this.desktopChanged.bind(this));
    window.outputChanged.connect(this.desktopChanged.bind(this));
    window.tileChanged.connect(this.tileChanged.bind(this));
    window.fullScreenChanged.connect(this.fullscreenChanged.bind(this));
    window.minimizedChanged.connect(this.minimizedChanged.bind(this));
    window.maximizedAboutToChange.connect(this.maximizedChanged.bind(this));
  }
  desktopChanged() {
    if (!this.extensions.isTiled) {
      return;
    }
    const currentDesktops = Desktop.fromWindow(this.window);
    const removeDesktops = [];
    for (const desktop of this.extensions.previousDesktops) {
      if (!currentDesktops.includes(desktop)) {
        removeDesktops.push(desktop);
      }
    }
    this.ctrl.driverManager.removeWindow(this.window, removeDesktops);
    const addDesktops = [];
    for (const desktop of currentDesktops) {
      if (!this.extensions.previousDesktops.includes(desktop)) {
        addDesktops.push(desktop);
      }
    }
    this.ctrl.driverManager.addWindow(this.window, addDesktops);
    this.ctrl.driverManager.rebuildLayout();
  }
  tileChanged(_inputTile) {
    this.logger.debug(this.ctrl.driverManager.buildingLayout);
    if (this.ctrl.driverManager.buildingLayout)
      return;
    this.logger.debug("a");
    this.tileChangedTimer.start();
  }
  tileChangedCallback() {
    this.logger.debug("a");
    const inputTile = this.window.tile;
    const inManagedTile = inputTile != null && this.ctrl.managedTiles.has(inputTile);
    if (!this.extensions.isTiled && inManagedTile && inputTile != null) {
      this.logger.debug(
        "Putting client",
        this.window.resourceClass,
        "in tile",
        inputTile.absoluteGeometry
      );
      const direction = new GRect(
        inputTile.absoluteGeometry
      ).directionFromPoint(this.ctrl.workspace.cursorPos);
      this.ctrl.driverManager.putWindowInTile(
        this.window,
        inputTile,
        direction
      );
    } else if (!inManagedTile && inputTile != null) {
      const center = new GRect(this.window.frameGeometry).center;
      let tile = this.ctrl.workspace.tilingForScreen(this.window.output).bestTileForPosition(center.x, center.y);
      if (tile == null) {
        tile = this.ctrl.workspace.tilingForScreen(
          this.window.output
        ).rootTile;
      }
      if (this.extensions.isTiled) {
        this.ctrl.driverManager.removeWindow(this.window);
      }
      this.ctrl.driverManager.putWindowInTile(
        this.window,
        tile,
        new GRect(tile.absoluteGeometry).directionFromPoint(center)
      );
    } else if (this.extensions.isTiled && !inManagedTile && inputTile == null) {
      this.logger.debug(
        "Client",
        this.window.resourceClass,
        "was moved out of a tile"
      );
      this.ctrl.driverManager.removeWindow(this.window);
    }
    this.ctrl.driverManager.rebuildLayout(this.window.output);
  }
  /*
      tileChangedCallback() {
          const inManagedTile =
              this.window.tile != null &&
              this.ctrl.managedTiles.has(this.window.tile);
          // client is moved into managed tile from outside
          if (
              !this.extensions.isTiled &&
              inManagedTile &&
              this.window.tile != null
          ) {
              this.logger.debug(
                  "Putting client",
                  this.window.resourceClass,
                  "in tile",
                  this.window.tile!.absoluteGeometry,
              );
              const direction = new GRect(
                  this.window.tile.absoluteGeometry,
              ).directionFromPoint(this.ctrl.workspace.cursorPos);
              this.ctrl.driverManager.putWindowInTile(
                  this.window,
                  this.window.tile,
                  direction,
              );
          }
          // client is in a non-managed tile (move it to a managed one)
          else if (!inManagedTile && this.window.tile != null) {
              const center = new GRect(this.window.frameGeometry).center;
              let tile = this.ctrl.workspace
                  .tilingForScreen(this.window.output)
                  .bestTileForPosition(center.x, center.y);
              // if its null then its root tile (usually)
              if (tile == null) {
                  tile = this.ctrl.workspace.tilingForScreen(
                      this.window.output,
                  ).rootTile;
              }
              if (this.extensions.isTiled) {
                  this.ctrl.driverManager.removeWindow(this.window);
              }
              this.ctrl.driverManager.putWindowInTile(
                  this.window,
                  tile,
                  new GRect(tile.absoluteGeometry).directionFromPoint(center),
              );
          }
          // client is moved out of a managed tile and into no tile
          else if (
              this.extensions.isTiled &&
              !inManagedTile &&
              this.window.tile == null
          ) {
              this.logger.debug(
                  "Client",
                  this.window.resourceClass,
                  "was moved out of a tile",
              );
              this.ctrl.driverManager.removeWindow(this.window);
          }
  
          this.ctrl.driverManager.rebuildLayout(this.window.output);
      }
      */
  putWindowInBestTile() {
    if (this.extensions.lastTiledLocation != null) {
      let tile = this.ctrl.workspace.tilingForScreen(this.window.output).bestTileForPosition(
        this.extensions.lastTiledLocation.x,
        this.extensions.lastTiledLocation.y
      );
      if (tile == null) {
        tile = this.ctrl.workspace.tilingForScreen(
          this.window.output
        ).rootTile;
      }
      this.ctrl.driverManager.putWindowInTile(
        this.window,
        tile,
        new GRect(tile.absoluteGeometry).directionFromPoint(
          this.extensions.lastTiledLocation
        )
      );
    } else {
      this.ctrl.driverManager.addWindow(this.window);
    }
    this.ctrl.driverManager.rebuildLayout(this.window.output);
  }
  fullscreenChanged() {
    if (this.ctrl.driverManager.buildingLayout) {
      return;
    }
    this.logger.debug(
      "Fullscreen on client",
      this.window.resourceClass,
      "set to",
      this.window.fullScreen
    );
    if (this.window.fullScreen && this.extensions.isTiled) {
      this.ctrl.driverManager.removeWindow(this.window);
      this.ctrl.driverManager.rebuildLayout(this.window.output);
      this.extensions.wasTiled = true;
    } else if (!this.window.fullScreen && this.extensions.wasTiled && !this.extensions.isTiled) {
      this.putWindowInBestTile();
    }
  }
  minimizedChanged() {
    this.logger.debug(
      "Minimized on client",
      this.window.resourceClass,
      "set to",
      this.window.minimized
    );
    if (this.window.minimized && this.extensions.isTiled) {
      this.ctrl.driverManager.removeWindow(this.window);
      this.ctrl.driverManager.rebuildLayout(this.window.output);
      this.extensions.wasTiled = true;
    } else if (!this.window.minimized && this.extensions.wasTiled && !this.extensions.isTiled) {
      this.putWindowInBestTile();
    }
  }
  maximizedChanged(mode) {
    if (this.ctrl.driverManager.buildingLayout) {
      return;
    }
    let maximized = mode == 3 /* MaximizeFull */;
    this.logger.debug(
      "Maximized on window",
      this.window.resourceClass,
      "set to",
      maximized
    );
    if (maximized && this.extensions.isTiled) {
      this.ctrl.driverManager.removeWindow(this.window);
      this.ctrl.driverManager.rebuildLayout(this.window.output);
      this.extensions.wasTiled = true;
    } else if (!maximized && this.extensions.wasTiled && !this.extensions.isTiled) {
      this.putWindowInBestTile();
    }
  }
};
var WindowHookManager = class {
  constructor(ctrl) {
    this.ctrl = ctrl;
    this.logger = this.ctrl.logger;
  }
  attachWindowHooks(window) {
    const extensions = this.ctrl.windowExtensions.get(window);
    if (extensions.clientHooks != null) {
      return;
    }
    this.logger.debug("Window", window.resourceClass, "hooked into script");
    extensions.clientHooks = new WindowHooks(this.ctrl, window);
  }
};

// src/controller/actions/settingsdialog.ts
var SettingsDialogManager = class {
  constructor(ctrl) {
    this.ctrl = ctrl;
    this.ctrl.qmlObjects.settings.saveSettings.connect(this.saveSettings.bind(this));
    this.ctrl.qmlObjects.settings.removeSettings.connect(this.removeSettings.bind(this));
  }
  saveSettings(settings, desktop) {
    this.ctrl.driverManager.setEngineConfig(this.ctrl.desktopFactory.createDesktopFromStrings(desktop), settings);
  }
  removeSettings(desktop) {
    const desktopObj = this.ctrl.desktopFactory.createDesktopFromStrings(desktop);
    this.ctrl.driverManager.removeEngineConfig(desktopObj);
    this.ctrl.dbusManager.removeSettings(desktopObj.toString());
  }
};

// src/controller/actions/basic.ts
var WorkspaceActions = class {
  constructor(ctrl) {
    this.logger = ctrl.logger;
    this.config = ctrl.config;
    this.ctrl = ctrl;
  }
  // done later after loading
  addHooks() {
    const workspace = this.ctrl.workspace;
    workspace.windowAdded.connect(this.windowAdded.bind(this));
    workspace.windowRemoved.connect(this.windowRemoved.bind(this));
    workspace.currentActivityChanged.connect(this.currentDesktopChange.bind(this));
    workspace.currentDesktopChanged.connect(this.currentDesktopChange.bind(this));
    workspace.windowActivated.connect(this.windowActivated.bind(this));
  }
  doTileWindow(c) {
    if (c.normalWindow && !((c.popupWindow || c.transient) && !this.config.tilePopups)) {
      if (c.fullScreen || c.minimized) {
        return false;
      }
      for (const s of this.config.filterProcess) {
        if (s.length > 0 && c.resourceClass.includes(s)) {
          return false;
        }
      }
      for (const s of this.config.filterCaption) {
        if (s.length > 0 && c.caption.includes(s)) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
  windowAdded(window) {
    this.ctrl.windowExtensions.set(window, new WindowExtensions(window));
    this.ctrl.windowHookManager.attachWindowHooks(window);
    if (!this.doTileWindow(window)) {
      this.logger.debug("Not tiling window", window.resourceClass);
      return;
    }
    if (this.config.borders == 0 /* NoAll */) {
      window.noBorder = true;
    }
    this.logger.debug("Window", window.resourceClass, "added");
    this.ctrl.driverManager.addWindow(window);
    this.ctrl.driverManager.rebuildLayout();
  }
  windowRemoved(window) {
    this.logger.debug("Window", window.resourceClass, "removed");
    this.ctrl.windowExtensions.delete(window);
    this.ctrl.driverManager.removeWindow(window);
    this.ctrl.driverManager.rebuildLayout();
  }
  currentDesktopChange() {
    this.ctrl.driverManager.buildingLayout = true;
    for (const window of this.ctrl.workspace.windows) {
      if (window.tile != null && window.activities.includes(
        this.ctrl.workspaceExtensions.lastActivity
      ) && window.desktops.includes(
        this.ctrl.workspaceExtensions.lastDesktop
      )) {
        const tile = window.tile;
        window.tile = null;
        window.frameGeometry = tile.absoluteGeometry;
        window.frameGeometry.width -= 2 * tile.padding;
        window.frameGeometry.height -= 2 * tile.padding;
        window.frameGeometry.x += tile.padding;
        window.frameGeometry.y += tile.padding;
      }
    }
    this.ctrl.driverManager.rebuildLayout();
  }
  windowActivated(_window) {
    if (this.config.borders == 2 /* Selected */) {
      this.ctrl.workspace.activeWindow.noBorder = false;
      const lastActiveWindow = this.ctrl.workspaceExtensions.lastActiveWindow;
      this.logger.debug(lastActiveWindow?.resourceClass);
      if (lastActiveWindow != null && this.ctrl.windowExtensions.get(
        lastActiveWindow
      ).isTiled) {
        lastActiveWindow.noBorder = true;
      }
    }
  }
};

// src/controller/index.ts
var Controller = class {
  constructor(qmlApi, qmlObjects) {
    this.windowExtensions = /* @__PURE__ */ new Map();
    this.managedTiles = /* @__PURE__ */ new Set();
    this.workspace = qmlApi.workspace;
    this.options = qmlApi.options;
    this.kwinApi = qmlApi.kwin;
    this.qmlObjects = qmlObjects;
    this.desktopFactory = new DesktopFactory(this.workspace);
    this.config = new Config(this.kwinApi);
    this.logger = new Log(this.config, this.qmlObjects.root);
    this.logger.info("Polonium started!");
    if (!this.config.debug) {
      this.logger.info(
        "Polonium debug is DISABLED! Enable it and restart KWin before sending logs!"
      );
    }
    this.logger.debug("Config is", JSON.stringify(this.config));
    this.workspaceExtensions = new WorkspaceExtensions(this.workspace);
    this.dbusManager = new DBusManager(this);
    this.driverManager = new DriverManager(this);
    this.shortcutManager = new ShortcutManager(this);
    this.windowHookManager = new WindowHookManager(this);
    this.settingsDialogManager = new SettingsDialogManager(this);
    this.workspaceActions = new WorkspaceActions(this);
    this.initTimer = qmlObjects.root.createTimer();
    this.initTimer.interval = 100;
    this.initTimer.triggered.connect(this.initCallback.bind(this));
    this.initTimer.repeat = false;
  }
  init() {
    this.initTimer.start();
  }
  initCallback() {
    if (this.workspace.activities.length == 1 && this.workspace.activities[0] == "00000000-0000-0000-0000-000000000000") {
      this.logger.debug("Restarting init timer");
      this.initTimer.interval += 100;
      this.initTimer.restart();
      return;
    }
    this.workspaceActions.addHooks();
    this.driverManager.init();
  }
};

// src/index.ts
function main(api, qmlObjects) {
  const ctrl = new Controller(api, qmlObjects);
  ctrl.init();
}
export {
  main
};
