// @bun
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// node_modules/bn.js/lib/bn.js
var require_bn = __commonJS((exports, module) => {
  (function(module2, exports2) {
    function assert(val, msg) {
      if (!val)
        throw new Error(msg || "Assertion failed");
    }
    function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor;
      ctor.prototype.constructor = ctor;
    }
    function BN(number2, base, endian) {
      if (BN.isBN(number2)) {
        return number2;
      }
      this.negative = 0;
      this.words = null;
      this.length = 0;
      this.red = null;
      if (number2 !== null) {
        if (base === "le" || base === "be") {
          endian = base;
          base = 10;
        }
        this._init(number2 || 0, base || 10, endian || "be");
      }
    }
    if (typeof module2 === "object") {
      module2.exports = BN;
    } else {
      exports2.BN = BN;
    }
    BN.BN = BN;
    BN.wordSize = 26;
    var Buffer2;
    try {
      if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
        Buffer2 = window.Buffer;
      } else {
        Buffer2 = import.meta.require("buffer").Buffer;
      }
    } catch (e) {
    }
    BN.isBN = function isBN(num) {
      if (num instanceof BN) {
        return true;
      }
      return num !== null && typeof num === "object" && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
    };
    BN.max = function max(left, right) {
      if (left.cmp(right) > 0)
        return left;
      return right;
    };
    BN.min = function min(left, right) {
      if (left.cmp(right) < 0)
        return left;
      return right;
    };
    BN.prototype._init = function init(number2, base, endian) {
      if (typeof number2 === "number") {
        return this._initNumber(number2, base, endian);
      }
      if (typeof number2 === "object") {
        return this._initArray(number2, base, endian);
      }
      if (base === "hex") {
        base = 16;
      }
      assert(base === (base | 0) && base >= 2 && base <= 36);
      number2 = number2.toString().replace(/\s+/g, "");
      var start = 0;
      if (number2[0] === "-") {
        start++;
        this.negative = 1;
      }
      if (start < number2.length) {
        if (base === 16) {
          this._parseHex(number2, start, endian);
        } else {
          this._parseBase(number2, base, start);
          if (endian === "le") {
            this._initArray(this.toArray(), base, endian);
          }
        }
      }
    };
    BN.prototype._initNumber = function _initNumber(number2, base, endian) {
      if (number2 < 0) {
        this.negative = 1;
        number2 = -number2;
      }
      if (number2 < 67108864) {
        this.words = [number2 & 67108863];
        this.length = 1;
      } else if (number2 < 4503599627370496) {
        this.words = [
          number2 & 67108863,
          number2 / 67108864 & 67108863
        ];
        this.length = 2;
      } else {
        assert(number2 < 9007199254740992);
        this.words = [
          number2 & 67108863,
          number2 / 67108864 & 67108863,
          1
        ];
        this.length = 3;
      }
      if (endian !== "le")
        return;
      this._initArray(this.toArray(), base, endian);
    };
    BN.prototype._initArray = function _initArray(number2, base, endian) {
      assert(typeof number2.length === "number");
      if (number2.length <= 0) {
        this.words = [0];
        this.length = 1;
        return this;
      }
      this.length = Math.ceil(number2.length / 3);
      this.words = new Array(this.length);
      for (var i = 0;i < this.length; i++) {
        this.words[i] = 0;
      }
      var j, w;
      var off = 0;
      if (endian === "be") {
        for (i = number2.length - 1, j = 0;i >= 0; i -= 3) {
          w = number2[i] | number2[i - 1] << 8 | number2[i - 2] << 16;
          this.words[j] |= w << off & 67108863;
          this.words[j + 1] = w >>> 26 - off & 67108863;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      } else if (endian === "le") {
        for (i = 0, j = 0;i < number2.length; i += 3) {
          w = number2[i] | number2[i + 1] << 8 | number2[i + 2] << 16;
          this.words[j] |= w << off & 67108863;
          this.words[j + 1] = w >>> 26 - off & 67108863;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      }
      return this._strip();
    };
    function parseHex4Bits(string, index) {
      var c = string.charCodeAt(index);
      if (c >= 48 && c <= 57) {
        return c - 48;
      } else if (c >= 65 && c <= 70) {
        return c - 55;
      } else if (c >= 97 && c <= 102) {
        return c - 87;
      } else {
        assert(false, "Invalid character in " + string);
      }
    }
    function parseHexByte(string, lowerBound, index) {
      var r = parseHex4Bits(string, index);
      if (index - 1 >= lowerBound) {
        r |= parseHex4Bits(string, index - 1) << 4;
      }
      return r;
    }
    BN.prototype._parseHex = function _parseHex(number2, start, endian) {
      this.length = Math.ceil((number2.length - start) / 6);
      this.words = new Array(this.length);
      for (var i = 0;i < this.length; i++) {
        this.words[i] = 0;
      }
      var off = 0;
      var j = 0;
      var w;
      if (endian === "be") {
        for (i = number2.length - 1;i >= start; i -= 2) {
          w = parseHexByte(number2, start, i) << off;
          this.words[j] |= w & 67108863;
          if (off >= 18) {
            off -= 18;
            j += 1;
            this.words[j] |= w >>> 26;
          } else {
            off += 8;
          }
        }
      } else {
        var parseLength = number2.length - start;
        for (i = parseLength % 2 === 0 ? start + 1 : start;i < number2.length; i += 2) {
          w = parseHexByte(number2, start, i) << off;
          this.words[j] |= w & 67108863;
          if (off >= 18) {
            off -= 18;
            j += 1;
            this.words[j] |= w >>> 26;
          } else {
            off += 8;
          }
        }
      }
      this._strip();
    };
    function parseBase(str, start, end, mul) {
      var r = 0;
      var b = 0;
      var len = Math.min(str.length, end);
      for (var i = start;i < len; i++) {
        var c = str.charCodeAt(i) - 48;
        r *= mul;
        if (c >= 49) {
          b = c - 49 + 10;
        } else if (c >= 17) {
          b = c - 17 + 10;
        } else {
          b = c;
        }
        assert(c >= 0 && b < mul, "Invalid character");
        r += b;
      }
      return r;
    }
    BN.prototype._parseBase = function _parseBase(number2, base, start) {
      this.words = [0];
      this.length = 1;
      for (var limbLen = 0, limbPow = 1;limbPow <= 67108863; limbPow *= base) {
        limbLen++;
      }
      limbLen--;
      limbPow = limbPow / base | 0;
      var total = number2.length - start;
      var mod2 = total % limbLen;
      var end = Math.min(total, total - mod2) + start;
      var word = 0;
      for (var i = start;i < end; i += limbLen) {
        word = parseBase(number2, i, i + limbLen, base);
        this.imuln(limbPow);
        if (this.words[0] + word < 67108864) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
      if (mod2 !== 0) {
        var pow3 = 1;
        word = parseBase(number2, i, number2.length, base);
        for (i = 0;i < mod2; i++) {
          pow3 *= base;
        }
        this.imuln(pow3);
        if (this.words[0] + word < 67108864) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
      this._strip();
    };
    BN.prototype.copy = function copy(dest) {
      dest.words = new Array(this.length);
      for (var i = 0;i < this.length; i++) {
        dest.words[i] = this.words[i];
      }
      dest.length = this.length;
      dest.negative = this.negative;
      dest.red = this.red;
    };
    function move(dest, src) {
      dest.words = src.words;
      dest.length = src.length;
      dest.negative = src.negative;
      dest.red = src.red;
    }
    BN.prototype._move = function _move(dest) {
      move(dest, this);
    };
    BN.prototype.clone = function clone() {
      var r = new BN(null);
      this.copy(r);
      return r;
    };
    BN.prototype._expand = function _expand(size) {
      while (this.length < size) {
        this.words[this.length++] = 0;
      }
      return this;
    };
    BN.prototype._strip = function strip() {
      while (this.length > 1 && this.words[this.length - 1] === 0) {
        this.length--;
      }
      return this._normSign();
    };
    BN.prototype._normSign = function _normSign() {
      if (this.length === 1 && this.words[0] === 0) {
        this.negative = 0;
      }
      return this;
    };
    if (typeof Symbol !== "undefined" && typeof Symbol.for === "function") {
      try {
        BN.prototype[Symbol.for("nodejs.util.inspect.custom")] = inspect;
      } catch (e) {
        BN.prototype.inspect = inspect;
      }
    } else {
      BN.prototype.inspect = inspect;
    }
    function inspect() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    }
    var zeros = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ];
    var groupSizes = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ];
    var groupBases = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64000000,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      24300000,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    BN.prototype.toString = function toString(base, padding) {
      base = base || 10;
      padding = padding | 0 || 1;
      var out;
      if (base === 16 || base === "hex") {
        out = "";
        var off = 0;
        var carry = 0;
        for (var i = 0;i < this.length; i++) {
          var w = this.words[i];
          var word = ((w << off | carry) & 16777215).toString(16);
          carry = w >>> 24 - off & 16777215;
          off += 2;
          if (off >= 26) {
            off -= 26;
            i--;
          }
          if (carry !== 0 || i !== this.length - 1) {
            out = zeros[6 - word.length] + word + out;
          } else {
            out = word + out;
          }
        }
        if (carry !== 0) {
          out = carry.toString(16) + out;
        }
        while (out.length % padding !== 0) {
          out = "0" + out;
        }
        if (this.negative !== 0) {
          out = "-" + out;
        }
        return out;
      }
      if (base === (base | 0) && base >= 2 && base <= 36) {
        var groupSize = groupSizes[base];
        var groupBase = groupBases[base];
        out = "";
        var c = this.clone();
        c.negative = 0;
        while (!c.isZero()) {
          var r = c.modrn(groupBase).toString(base);
          c = c.idivn(groupBase);
          if (!c.isZero()) {
            out = zeros[groupSize - r.length] + r + out;
          } else {
            out = r + out;
          }
        }
        if (this.isZero()) {
          out = "0" + out;
        }
        while (out.length % padding !== 0) {
          out = "0" + out;
        }
        if (this.negative !== 0) {
          out = "-" + out;
        }
        return out;
      }
      assert(false, "Base should be between 2 and 36");
    };
    BN.prototype.toNumber = function toNumber() {
      var ret = this.words[0];
      if (this.length === 2) {
        ret += this.words[1] * 67108864;
      } else if (this.length === 3 && this.words[2] === 1) {
        ret += 4503599627370496 + this.words[1] * 67108864;
      } else if (this.length > 2) {
        assert(false, "Number can only safely store up to 53 bits");
      }
      return this.negative !== 0 ? -ret : ret;
    };
    BN.prototype.toJSON = function toJSON() {
      return this.toString(16, 2);
    };
    if (Buffer2) {
      BN.prototype.toBuffer = function toBuffer(endian, length) {
        return this.toArrayLike(Buffer2, endian, length);
      };
    }
    BN.prototype.toArray = function toArray(endian, length) {
      return this.toArrayLike(Array, endian, length);
    };
    var allocate = function allocate(ArrayType, size) {
      if (ArrayType.allocUnsafe) {
        return ArrayType.allocUnsafe(size);
      }
      return new ArrayType(size);
    };
    BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
      this._strip();
      var byteLength = this.byteLength();
      var reqLength = length || Math.max(1, byteLength);
      assert(byteLength <= reqLength, "byte array longer than desired length");
      assert(reqLength > 0, "Requested array length <= 0");
      var res = allocate(ArrayType, reqLength);
      var postfix = endian === "le" ? "LE" : "BE";
      this["_toArrayLike" + postfix](res, byteLength);
      return res;
    };
    BN.prototype._toArrayLikeLE = function _toArrayLikeLE(res, byteLength) {
      var position = 0;
      var carry = 0;
      for (var i = 0, shift = 0;i < this.length; i++) {
        var word = this.words[i] << shift | carry;
        res[position++] = word & 255;
        if (position < res.length) {
          res[position++] = word >> 8 & 255;
        }
        if (position < res.length) {
          res[position++] = word >> 16 & 255;
        }
        if (shift === 6) {
          if (position < res.length) {
            res[position++] = word >> 24 & 255;
          }
          carry = 0;
          shift = 0;
        } else {
          carry = word >>> 24;
          shift += 2;
        }
      }
      if (position < res.length) {
        res[position++] = carry;
        while (position < res.length) {
          res[position++] = 0;
        }
      }
    };
    BN.prototype._toArrayLikeBE = function _toArrayLikeBE(res, byteLength) {
      var position = res.length - 1;
      var carry = 0;
      for (var i = 0, shift = 0;i < this.length; i++) {
        var word = this.words[i] << shift | carry;
        res[position--] = word & 255;
        if (position >= 0) {
          res[position--] = word >> 8 & 255;
        }
        if (position >= 0) {
          res[position--] = word >> 16 & 255;
        }
        if (shift === 6) {
          if (position >= 0) {
            res[position--] = word >> 24 & 255;
          }
          carry = 0;
          shift = 0;
        } else {
          carry = word >>> 24;
          shift += 2;
        }
      }
      if (position >= 0) {
        res[position--] = carry;
        while (position >= 0) {
          res[position--] = 0;
        }
      }
    };
    if (Math.clz32) {
      BN.prototype._countBits = function _countBits(w) {
        return 32 - Math.clz32(w);
      };
    } else {
      BN.prototype._countBits = function _countBits(w) {
        var t = w;
        var r = 0;
        if (t >= 4096) {
          r += 13;
          t >>>= 13;
        }
        if (t >= 64) {
          r += 7;
          t >>>= 7;
        }
        if (t >= 8) {
          r += 4;
          t >>>= 4;
        }
        if (t >= 2) {
          r += 2;
          t >>>= 2;
        }
        return r + t;
      };
    }
    BN.prototype._zeroBits = function _zeroBits(w) {
      if (w === 0)
        return 26;
      var t = w;
      var r = 0;
      if ((t & 8191) === 0) {
        r += 13;
        t >>>= 13;
      }
      if ((t & 127) === 0) {
        r += 7;
        t >>>= 7;
      }
      if ((t & 15) === 0) {
        r += 4;
        t >>>= 4;
      }
      if ((t & 3) === 0) {
        r += 2;
        t >>>= 2;
      }
      if ((t & 1) === 0) {
        r++;
      }
      return r;
    };
    BN.prototype.bitLength = function bitLength() {
      var w = this.words[this.length - 1];
      var hi = this._countBits(w);
      return (this.length - 1) * 26 + hi;
    };
    function toBitArray(num) {
      var w = new Array(num.bitLength());
      for (var bit = 0;bit < w.length; bit++) {
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        w[bit] = num.words[off] >>> wbit & 1;
      }
      return w;
    }
    BN.prototype.zeroBits = function zeroBits() {
      if (this.isZero())
        return 0;
      var r = 0;
      for (var i = 0;i < this.length; i++) {
        var b = this._zeroBits(this.words[i]);
        r += b;
        if (b !== 26)
          break;
      }
      return r;
    };
    BN.prototype.byteLength = function byteLength() {
      return Math.ceil(this.bitLength() / 8);
    };
    BN.prototype.toTwos = function toTwos(width) {
      if (this.negative !== 0) {
        return this.abs().inotn(width).iaddn(1);
      }
      return this.clone();
    };
    BN.prototype.fromTwos = function fromTwos(width) {
      if (this.testn(width - 1)) {
        return this.notn(width).iaddn(1).ineg();
      }
      return this.clone();
    };
    BN.prototype.isNeg = function isNeg() {
      return this.negative !== 0;
    };
    BN.prototype.neg = function neg() {
      return this.clone().ineg();
    };
    BN.prototype.ineg = function ineg() {
      if (!this.isZero()) {
        this.negative ^= 1;
      }
      return this;
    };
    BN.prototype.iuor = function iuor(num) {
      while (this.length < num.length) {
        this.words[this.length++] = 0;
      }
      for (var i = 0;i < num.length; i++) {
        this.words[i] = this.words[i] | num.words[i];
      }
      return this._strip();
    };
    BN.prototype.ior = function ior(num) {
      assert((this.negative | num.negative) === 0);
      return this.iuor(num);
    };
    BN.prototype.or = function or(num) {
      if (this.length > num.length)
        return this.clone().ior(num);
      return num.clone().ior(this);
    };
    BN.prototype.uor = function uor(num) {
      if (this.length > num.length)
        return this.clone().iuor(num);
      return num.clone().iuor(this);
    };
    BN.prototype.iuand = function iuand(num) {
      var b;
      if (this.length > num.length) {
        b = num;
      } else {
        b = this;
      }
      for (var i = 0;i < b.length; i++) {
        this.words[i] = this.words[i] & num.words[i];
      }
      this.length = b.length;
      return this._strip();
    };
    BN.prototype.iand = function iand(num) {
      assert((this.negative | num.negative) === 0);
      return this.iuand(num);
    };
    BN.prototype.and = function and(num) {
      if (this.length > num.length)
        return this.clone().iand(num);
      return num.clone().iand(this);
    };
    BN.prototype.uand = function uand(num) {
      if (this.length > num.length)
        return this.clone().iuand(num);
      return num.clone().iuand(this);
    };
    BN.prototype.iuxor = function iuxor(num) {
      var a;
      var b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }
      for (var i = 0;i < b.length; i++) {
        this.words[i] = a.words[i] ^ b.words[i];
      }
      if (this !== a) {
        for (;i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }
      this.length = a.length;
      return this._strip();
    };
    BN.prototype.ixor = function ixor(num) {
      assert((this.negative | num.negative) === 0);
      return this.iuxor(num);
    };
    BN.prototype.xor = function xor(num) {
      if (this.length > num.length)
        return this.clone().ixor(num);
      return num.clone().ixor(this);
    };
    BN.prototype.uxor = function uxor(num) {
      if (this.length > num.length)
        return this.clone().iuxor(num);
      return num.clone().iuxor(this);
    };
    BN.prototype.inotn = function inotn(width) {
      assert(typeof width === "number" && width >= 0);
      var bytesNeeded = Math.ceil(width / 26) | 0;
      var bitsLeft = width % 26;
      this._expand(bytesNeeded);
      if (bitsLeft > 0) {
        bytesNeeded--;
      }
      for (var i = 0;i < bytesNeeded; i++) {
        this.words[i] = ~this.words[i] & 67108863;
      }
      if (bitsLeft > 0) {
        this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft;
      }
      return this._strip();
    };
    BN.prototype.notn = function notn(width) {
      return this.clone().inotn(width);
    };
    BN.prototype.setn = function setn(bit, val) {
      assert(typeof bit === "number" && bit >= 0);
      var off = bit / 26 | 0;
      var wbit = bit % 26;
      this._expand(off + 1);
      if (val) {
        this.words[off] = this.words[off] | 1 << wbit;
      } else {
        this.words[off] = this.words[off] & ~(1 << wbit);
      }
      return this._strip();
    };
    BN.prototype.iadd = function iadd(num) {
      var r;
      if (this.negative !== 0 && num.negative === 0) {
        this.negative = 0;
        r = this.isub(num);
        this.negative ^= 1;
        return this._normSign();
      } else if (this.negative === 0 && num.negative !== 0) {
        num.negative = 0;
        r = this.isub(num);
        num.negative = 1;
        return r._normSign();
      }
      var a, b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }
      var carry = 0;
      for (var i = 0;i < b.length; i++) {
        r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
        this.words[i] = r & 67108863;
        carry = r >>> 26;
      }
      for (;carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        this.words[i] = r & 67108863;
        carry = r >>> 26;
      }
      this.length = a.length;
      if (carry !== 0) {
        this.words[this.length] = carry;
        this.length++;
      } else if (a !== this) {
        for (;i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }
      return this;
    };
    BN.prototype.add = function add(num) {
      var res;
      if (num.negative !== 0 && this.negative === 0) {
        num.negative = 0;
        res = this.sub(num);
        num.negative ^= 1;
        return res;
      } else if (num.negative === 0 && this.negative !== 0) {
        this.negative = 0;
        res = num.sub(this);
        this.negative = 1;
        return res;
      }
      if (this.length > num.length)
        return this.clone().iadd(num);
      return num.clone().iadd(this);
    };
    BN.prototype.isub = function isub(num) {
      if (num.negative !== 0) {
        num.negative = 0;
        var r = this.iadd(num);
        num.negative = 1;
        return r._normSign();
      } else if (this.negative !== 0) {
        this.negative = 0;
        this.iadd(num);
        this.negative = 1;
        return this._normSign();
      }
      var cmp = this.cmp(num);
      if (cmp === 0) {
        this.negative = 0;
        this.length = 1;
        this.words[0] = 0;
        return this;
      }
      var a, b;
      if (cmp > 0) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }
      var carry = 0;
      for (var i = 0;i < b.length; i++) {
        r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 67108863;
      }
      for (;carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 67108863;
      }
      if (carry === 0 && i < a.length && a !== this) {
        for (;i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }
      this.length = Math.max(this.length, i);
      if (a !== this) {
        this.negative = 1;
      }
      return this._strip();
    };
    BN.prototype.sub = function sub(num) {
      return this.clone().isub(num);
    };
    function smallMulTo(self, num, out) {
      out.negative = num.negative ^ self.negative;
      var len = self.length + num.length | 0;
      out.length = len;
      len = len - 1 | 0;
      var a = self.words[0] | 0;
      var b = num.words[0] | 0;
      var r = a * b;
      var lo = r & 67108863;
      var carry = r / 67108864 | 0;
      out.words[0] = lo;
      for (var k = 1;k < len; k++) {
        var ncarry = carry >>> 26;
        var rword = carry & 67108863;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1);j <= maxJ; j++) {
          var i = k - j | 0;
          a = self.words[i] | 0;
          b = num.words[j] | 0;
          r = a * b + rword;
          ncarry += r / 67108864 | 0;
          rword = r & 67108863;
        }
        out.words[k] = rword | 0;
        carry = ncarry | 0;
      }
      if (carry !== 0) {
        out.words[k] = carry | 0;
      } else {
        out.length--;
      }
      return out._strip();
    }
    var comb10MulTo = function comb10MulTo(self, num, out) {
      var a = self.words;
      var b = num.words;
      var o = out.words;
      var c = 0;
      var lo;
      var mid;
      var hi;
      var a0 = a[0] | 0;
      var al0 = a0 & 8191;
      var ah0 = a0 >>> 13;
      var a1 = a[1] | 0;
      var al1 = a1 & 8191;
      var ah1 = a1 >>> 13;
      var a2 = a[2] | 0;
      var al2 = a2 & 8191;
      var ah2 = a2 >>> 13;
      var a3 = a[3] | 0;
      var al3 = a3 & 8191;
      var ah3 = a3 >>> 13;
      var a4 = a[4] | 0;
      var al4 = a4 & 8191;
      var ah4 = a4 >>> 13;
      var a5 = a[5] | 0;
      var al5 = a5 & 8191;
      var ah5 = a5 >>> 13;
      var a6 = a[6] | 0;
      var al6 = a6 & 8191;
      var ah6 = a6 >>> 13;
      var a7 = a[7] | 0;
      var al7 = a7 & 8191;
      var ah7 = a7 >>> 13;
      var a8 = a[8] | 0;
      var al8 = a8 & 8191;
      var ah8 = a8 >>> 13;
      var a9 = a[9] | 0;
      var al9 = a9 & 8191;
      var ah9 = a9 >>> 13;
      var b0 = b[0] | 0;
      var bl0 = b0 & 8191;
      var bh0 = b0 >>> 13;
      var b1 = b[1] | 0;
      var bl1 = b1 & 8191;
      var bh1 = b1 >>> 13;
      var b2 = b[2] | 0;
      var bl2 = b2 & 8191;
      var bh2 = b2 >>> 13;
      var b3 = b[3] | 0;
      var bl3 = b3 & 8191;
      var bh3 = b3 >>> 13;
      var b4 = b[4] | 0;
      var bl4 = b4 & 8191;
      var bh4 = b4 >>> 13;
      var b5 = b[5] | 0;
      var bl5 = b5 & 8191;
      var bh5 = b5 >>> 13;
      var b6 = b[6] | 0;
      var bl6 = b6 & 8191;
      var bh6 = b6 >>> 13;
      var b7 = b[7] | 0;
      var bl7 = b7 & 8191;
      var bh7 = b7 >>> 13;
      var b8 = b[8] | 0;
      var bl8 = b8 & 8191;
      var bh8 = b8 >>> 13;
      var b9 = b[9] | 0;
      var bl9 = b9 & 8191;
      var bh9 = b9 >>> 13;
      out.negative = self.negative ^ num.negative;
      out.length = 19;
      lo = Math.imul(al0, bl0);
      mid = Math.imul(al0, bh0);
      mid = mid + Math.imul(ah0, bl0) | 0;
      hi = Math.imul(ah0, bh0);
      var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
      w0 &= 67108863;
      lo = Math.imul(al1, bl0);
      mid = Math.imul(al1, bh0);
      mid = mid + Math.imul(ah1, bl0) | 0;
      hi = Math.imul(ah1, bh0);
      lo = lo + Math.imul(al0, bl1) | 0;
      mid = mid + Math.imul(al0, bh1) | 0;
      mid = mid + Math.imul(ah0, bl1) | 0;
      hi = hi + Math.imul(ah0, bh1) | 0;
      var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
      w1 &= 67108863;
      lo = Math.imul(al2, bl0);
      mid = Math.imul(al2, bh0);
      mid = mid + Math.imul(ah2, bl0) | 0;
      hi = Math.imul(ah2, bh0);
      lo = lo + Math.imul(al1, bl1) | 0;
      mid = mid + Math.imul(al1, bh1) | 0;
      mid = mid + Math.imul(ah1, bl1) | 0;
      hi = hi + Math.imul(ah1, bh1) | 0;
      lo = lo + Math.imul(al0, bl2) | 0;
      mid = mid + Math.imul(al0, bh2) | 0;
      mid = mid + Math.imul(ah0, bl2) | 0;
      hi = hi + Math.imul(ah0, bh2) | 0;
      var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
      w2 &= 67108863;
      lo = Math.imul(al3, bl0);
      mid = Math.imul(al3, bh0);
      mid = mid + Math.imul(ah3, bl0) | 0;
      hi = Math.imul(ah3, bh0);
      lo = lo + Math.imul(al2, bl1) | 0;
      mid = mid + Math.imul(al2, bh1) | 0;
      mid = mid + Math.imul(ah2, bl1) | 0;
      hi = hi + Math.imul(ah2, bh1) | 0;
      lo = lo + Math.imul(al1, bl2) | 0;
      mid = mid + Math.imul(al1, bh2) | 0;
      mid = mid + Math.imul(ah1, bl2) | 0;
      hi = hi + Math.imul(ah1, bh2) | 0;
      lo = lo + Math.imul(al0, bl3) | 0;
      mid = mid + Math.imul(al0, bh3) | 0;
      mid = mid + Math.imul(ah0, bl3) | 0;
      hi = hi + Math.imul(ah0, bh3) | 0;
      var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
      w3 &= 67108863;
      lo = Math.imul(al4, bl0);
      mid = Math.imul(al4, bh0);
      mid = mid + Math.imul(ah4, bl0) | 0;
      hi = Math.imul(ah4, bh0);
      lo = lo + Math.imul(al3, bl1) | 0;
      mid = mid + Math.imul(al3, bh1) | 0;
      mid = mid + Math.imul(ah3, bl1) | 0;
      hi = hi + Math.imul(ah3, bh1) | 0;
      lo = lo + Math.imul(al2, bl2) | 0;
      mid = mid + Math.imul(al2, bh2) | 0;
      mid = mid + Math.imul(ah2, bl2) | 0;
      hi = hi + Math.imul(ah2, bh2) | 0;
      lo = lo + Math.imul(al1, bl3) | 0;
      mid = mid + Math.imul(al1, bh3) | 0;
      mid = mid + Math.imul(ah1, bl3) | 0;
      hi = hi + Math.imul(ah1, bh3) | 0;
      lo = lo + Math.imul(al0, bl4) | 0;
      mid = mid + Math.imul(al0, bh4) | 0;
      mid = mid + Math.imul(ah0, bl4) | 0;
      hi = hi + Math.imul(ah0, bh4) | 0;
      var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
      w4 &= 67108863;
      lo = Math.imul(al5, bl0);
      mid = Math.imul(al5, bh0);
      mid = mid + Math.imul(ah5, bl0) | 0;
      hi = Math.imul(ah5, bh0);
      lo = lo + Math.imul(al4, bl1) | 0;
      mid = mid + Math.imul(al4, bh1) | 0;
      mid = mid + Math.imul(ah4, bl1) | 0;
      hi = hi + Math.imul(ah4, bh1) | 0;
      lo = lo + Math.imul(al3, bl2) | 0;
      mid = mid + Math.imul(al3, bh2) | 0;
      mid = mid + Math.imul(ah3, bl2) | 0;
      hi = hi + Math.imul(ah3, bh2) | 0;
      lo = lo + Math.imul(al2, bl3) | 0;
      mid = mid + Math.imul(al2, bh3) | 0;
      mid = mid + Math.imul(ah2, bl3) | 0;
      hi = hi + Math.imul(ah2, bh3) | 0;
      lo = lo + Math.imul(al1, bl4) | 0;
      mid = mid + Math.imul(al1, bh4) | 0;
      mid = mid + Math.imul(ah1, bl4) | 0;
      hi = hi + Math.imul(ah1, bh4) | 0;
      lo = lo + Math.imul(al0, bl5) | 0;
      mid = mid + Math.imul(al0, bh5) | 0;
      mid = mid + Math.imul(ah0, bl5) | 0;
      hi = hi + Math.imul(ah0, bh5) | 0;
      var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
      w5 &= 67108863;
      lo = Math.imul(al6, bl0);
      mid = Math.imul(al6, bh0);
      mid = mid + Math.imul(ah6, bl0) | 0;
      hi = Math.imul(ah6, bh0);
      lo = lo + Math.imul(al5, bl1) | 0;
      mid = mid + Math.imul(al5, bh1) | 0;
      mid = mid + Math.imul(ah5, bl1) | 0;
      hi = hi + Math.imul(ah5, bh1) | 0;
      lo = lo + Math.imul(al4, bl2) | 0;
      mid = mid + Math.imul(al4, bh2) | 0;
      mid = mid + Math.imul(ah4, bl2) | 0;
      hi = hi + Math.imul(ah4, bh2) | 0;
      lo = lo + Math.imul(al3, bl3) | 0;
      mid = mid + Math.imul(al3, bh3) | 0;
      mid = mid + Math.imul(ah3, bl3) | 0;
      hi = hi + Math.imul(ah3, bh3) | 0;
      lo = lo + Math.imul(al2, bl4) | 0;
      mid = mid + Math.imul(al2, bh4) | 0;
      mid = mid + Math.imul(ah2, bl4) | 0;
      hi = hi + Math.imul(ah2, bh4) | 0;
      lo = lo + Math.imul(al1, bl5) | 0;
      mid = mid + Math.imul(al1, bh5) | 0;
      mid = mid + Math.imul(ah1, bl5) | 0;
      hi = hi + Math.imul(ah1, bh5) | 0;
      lo = lo + Math.imul(al0, bl6) | 0;
      mid = mid + Math.imul(al0, bh6) | 0;
      mid = mid + Math.imul(ah0, bl6) | 0;
      hi = hi + Math.imul(ah0, bh6) | 0;
      var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
      w6 &= 67108863;
      lo = Math.imul(al7, bl0);
      mid = Math.imul(al7, bh0);
      mid = mid + Math.imul(ah7, bl0) | 0;
      hi = Math.imul(ah7, bh0);
      lo = lo + Math.imul(al6, bl1) | 0;
      mid = mid + Math.imul(al6, bh1) | 0;
      mid = mid + Math.imul(ah6, bl1) | 0;
      hi = hi + Math.imul(ah6, bh1) | 0;
      lo = lo + Math.imul(al5, bl2) | 0;
      mid = mid + Math.imul(al5, bh2) | 0;
      mid = mid + Math.imul(ah5, bl2) | 0;
      hi = hi + Math.imul(ah5, bh2) | 0;
      lo = lo + Math.imul(al4, bl3) | 0;
      mid = mid + Math.imul(al4, bh3) | 0;
      mid = mid + Math.imul(ah4, bl3) | 0;
      hi = hi + Math.imul(ah4, bh3) | 0;
      lo = lo + Math.imul(al3, bl4) | 0;
      mid = mid + Math.imul(al3, bh4) | 0;
      mid = mid + Math.imul(ah3, bl4) | 0;
      hi = hi + Math.imul(ah3, bh4) | 0;
      lo = lo + Math.imul(al2, bl5) | 0;
      mid = mid + Math.imul(al2, bh5) | 0;
      mid = mid + Math.imul(ah2, bl5) | 0;
      hi = hi + Math.imul(ah2, bh5) | 0;
      lo = lo + Math.imul(al1, bl6) | 0;
      mid = mid + Math.imul(al1, bh6) | 0;
      mid = mid + Math.imul(ah1, bl6) | 0;
      hi = hi + Math.imul(ah1, bh6) | 0;
      lo = lo + Math.imul(al0, bl7) | 0;
      mid = mid + Math.imul(al0, bh7) | 0;
      mid = mid + Math.imul(ah0, bl7) | 0;
      hi = hi + Math.imul(ah0, bh7) | 0;
      var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
      w7 &= 67108863;
      lo = Math.imul(al8, bl0);
      mid = Math.imul(al8, bh0);
      mid = mid + Math.imul(ah8, bl0) | 0;
      hi = Math.imul(ah8, bh0);
      lo = lo + Math.imul(al7, bl1) | 0;
      mid = mid + Math.imul(al7, bh1) | 0;
      mid = mid + Math.imul(ah7, bl1) | 0;
      hi = hi + Math.imul(ah7, bh1) | 0;
      lo = lo + Math.imul(al6, bl2) | 0;
      mid = mid + Math.imul(al6, bh2) | 0;
      mid = mid + Math.imul(ah6, bl2) | 0;
      hi = hi + Math.imul(ah6, bh2) | 0;
      lo = lo + Math.imul(al5, bl3) | 0;
      mid = mid + Math.imul(al5, bh3) | 0;
      mid = mid + Math.imul(ah5, bl3) | 0;
      hi = hi + Math.imul(ah5, bh3) | 0;
      lo = lo + Math.imul(al4, bl4) | 0;
      mid = mid + Math.imul(al4, bh4) | 0;
      mid = mid + Math.imul(ah4, bl4) | 0;
      hi = hi + Math.imul(ah4, bh4) | 0;
      lo = lo + Math.imul(al3, bl5) | 0;
      mid = mid + Math.imul(al3, bh5) | 0;
      mid = mid + Math.imul(ah3, bl5) | 0;
      hi = hi + Math.imul(ah3, bh5) | 0;
      lo = lo + Math.imul(al2, bl6) | 0;
      mid = mid + Math.imul(al2, bh6) | 0;
      mid = mid + Math.imul(ah2, bl6) | 0;
      hi = hi + Math.imul(ah2, bh6) | 0;
      lo = lo + Math.imul(al1, bl7) | 0;
      mid = mid + Math.imul(al1, bh7) | 0;
      mid = mid + Math.imul(ah1, bl7) | 0;
      hi = hi + Math.imul(ah1, bh7) | 0;
      lo = lo + Math.imul(al0, bl8) | 0;
      mid = mid + Math.imul(al0, bh8) | 0;
      mid = mid + Math.imul(ah0, bl8) | 0;
      hi = hi + Math.imul(ah0, bh8) | 0;
      var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
      w8 &= 67108863;
      lo = Math.imul(al9, bl0);
      mid = Math.imul(al9, bh0);
      mid = mid + Math.imul(ah9, bl0) | 0;
      hi = Math.imul(ah9, bh0);
      lo = lo + Math.imul(al8, bl1) | 0;
      mid = mid + Math.imul(al8, bh1) | 0;
      mid = mid + Math.imul(ah8, bl1) | 0;
      hi = hi + Math.imul(ah8, bh1) | 0;
      lo = lo + Math.imul(al7, bl2) | 0;
      mid = mid + Math.imul(al7, bh2) | 0;
      mid = mid + Math.imul(ah7, bl2) | 0;
      hi = hi + Math.imul(ah7, bh2) | 0;
      lo = lo + Math.imul(al6, bl3) | 0;
      mid = mid + Math.imul(al6, bh3) | 0;
      mid = mid + Math.imul(ah6, bl3) | 0;
      hi = hi + Math.imul(ah6, bh3) | 0;
      lo = lo + Math.imul(al5, bl4) | 0;
      mid = mid + Math.imul(al5, bh4) | 0;
      mid = mid + Math.imul(ah5, bl4) | 0;
      hi = hi + Math.imul(ah5, bh4) | 0;
      lo = lo + Math.imul(al4, bl5) | 0;
      mid = mid + Math.imul(al4, bh5) | 0;
      mid = mid + Math.imul(ah4, bl5) | 0;
      hi = hi + Math.imul(ah4, bh5) | 0;
      lo = lo + Math.imul(al3, bl6) | 0;
      mid = mid + Math.imul(al3, bh6) | 0;
      mid = mid + Math.imul(ah3, bl6) | 0;
      hi = hi + Math.imul(ah3, bh6) | 0;
      lo = lo + Math.imul(al2, bl7) | 0;
      mid = mid + Math.imul(al2, bh7) | 0;
      mid = mid + Math.imul(ah2, bl7) | 0;
      hi = hi + Math.imul(ah2, bh7) | 0;
      lo = lo + Math.imul(al1, bl8) | 0;
      mid = mid + Math.imul(al1, bh8) | 0;
      mid = mid + Math.imul(ah1, bl8) | 0;
      hi = hi + Math.imul(ah1, bh8) | 0;
      lo = lo + Math.imul(al0, bl9) | 0;
      mid = mid + Math.imul(al0, bh9) | 0;
      mid = mid + Math.imul(ah0, bl9) | 0;
      hi = hi + Math.imul(ah0, bh9) | 0;
      var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
      w9 &= 67108863;
      lo = Math.imul(al9, bl1);
      mid = Math.imul(al9, bh1);
      mid = mid + Math.imul(ah9, bl1) | 0;
      hi = Math.imul(ah9, bh1);
      lo = lo + Math.imul(al8, bl2) | 0;
      mid = mid + Math.imul(al8, bh2) | 0;
      mid = mid + Math.imul(ah8, bl2) | 0;
      hi = hi + Math.imul(ah8, bh2) | 0;
      lo = lo + Math.imul(al7, bl3) | 0;
      mid = mid + Math.imul(al7, bh3) | 0;
      mid = mid + Math.imul(ah7, bl3) | 0;
      hi = hi + Math.imul(ah7, bh3) | 0;
      lo = lo + Math.imul(al6, bl4) | 0;
      mid = mid + Math.imul(al6, bh4) | 0;
      mid = mid + Math.imul(ah6, bl4) | 0;
      hi = hi + Math.imul(ah6, bh4) | 0;
      lo = lo + Math.imul(al5, bl5) | 0;
      mid = mid + Math.imul(al5, bh5) | 0;
      mid = mid + Math.imul(ah5, bl5) | 0;
      hi = hi + Math.imul(ah5, bh5) | 0;
      lo = lo + Math.imul(al4, bl6) | 0;
      mid = mid + Math.imul(al4, bh6) | 0;
      mid = mid + Math.imul(ah4, bl6) | 0;
      hi = hi + Math.imul(ah4, bh6) | 0;
      lo = lo + Math.imul(al3, bl7) | 0;
      mid = mid + Math.imul(al3, bh7) | 0;
      mid = mid + Math.imul(ah3, bl7) | 0;
      hi = hi + Math.imul(ah3, bh7) | 0;
      lo = lo + Math.imul(al2, bl8) | 0;
      mid = mid + Math.imul(al2, bh8) | 0;
      mid = mid + Math.imul(ah2, bl8) | 0;
      hi = hi + Math.imul(ah2, bh8) | 0;
      lo = lo + Math.imul(al1, bl9) | 0;
      mid = mid + Math.imul(al1, bh9) | 0;
      mid = mid + Math.imul(ah1, bl9) | 0;
      hi = hi + Math.imul(ah1, bh9) | 0;
      var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
      w10 &= 67108863;
      lo = Math.imul(al9, bl2);
      mid = Math.imul(al9, bh2);
      mid = mid + Math.imul(ah9, bl2) | 0;
      hi = Math.imul(ah9, bh2);
      lo = lo + Math.imul(al8, bl3) | 0;
      mid = mid + Math.imul(al8, bh3) | 0;
      mid = mid + Math.imul(ah8, bl3) | 0;
      hi = hi + Math.imul(ah8, bh3) | 0;
      lo = lo + Math.imul(al7, bl4) | 0;
      mid = mid + Math.imul(al7, bh4) | 0;
      mid = mid + Math.imul(ah7, bl4) | 0;
      hi = hi + Math.imul(ah7, bh4) | 0;
      lo = lo + Math.imul(al6, bl5) | 0;
      mid = mid + Math.imul(al6, bh5) | 0;
      mid = mid + Math.imul(ah6, bl5) | 0;
      hi = hi + Math.imul(ah6, bh5) | 0;
      lo = lo + Math.imul(al5, bl6) | 0;
      mid = mid + Math.imul(al5, bh6) | 0;
      mid = mid + Math.imul(ah5, bl6) | 0;
      hi = hi + Math.imul(ah5, bh6) | 0;
      lo = lo + Math.imul(al4, bl7) | 0;
      mid = mid + Math.imul(al4, bh7) | 0;
      mid = mid + Math.imul(ah4, bl7) | 0;
      hi = hi + Math.imul(ah4, bh7) | 0;
      lo = lo + Math.imul(al3, bl8) | 0;
      mid = mid + Math.imul(al3, bh8) | 0;
      mid = mid + Math.imul(ah3, bl8) | 0;
      hi = hi + Math.imul(ah3, bh8) | 0;
      lo = lo + Math.imul(al2, bl9) | 0;
      mid = mid + Math.imul(al2, bh9) | 0;
      mid = mid + Math.imul(ah2, bl9) | 0;
      hi = hi + Math.imul(ah2, bh9) | 0;
      var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
      w11 &= 67108863;
      lo = Math.imul(al9, bl3);
      mid = Math.imul(al9, bh3);
      mid = mid + Math.imul(ah9, bl3) | 0;
      hi = Math.imul(ah9, bh3);
      lo = lo + Math.imul(al8, bl4) | 0;
      mid = mid + Math.imul(al8, bh4) | 0;
      mid = mid + Math.imul(ah8, bl4) | 0;
      hi = hi + Math.imul(ah8, bh4) | 0;
      lo = lo + Math.imul(al7, bl5) | 0;
      mid = mid + Math.imul(al7, bh5) | 0;
      mid = mid + Math.imul(ah7, bl5) | 0;
      hi = hi + Math.imul(ah7, bh5) | 0;
      lo = lo + Math.imul(al6, bl6) | 0;
      mid = mid + Math.imul(al6, bh6) | 0;
      mid = mid + Math.imul(ah6, bl6) | 0;
      hi = hi + Math.imul(ah6, bh6) | 0;
      lo = lo + Math.imul(al5, bl7) | 0;
      mid = mid + Math.imul(al5, bh7) | 0;
      mid = mid + Math.imul(ah5, bl7) | 0;
      hi = hi + Math.imul(ah5, bh7) | 0;
      lo = lo + Math.imul(al4, bl8) | 0;
      mid = mid + Math.imul(al4, bh8) | 0;
      mid = mid + Math.imul(ah4, bl8) | 0;
      hi = hi + Math.imul(ah4, bh8) | 0;
      lo = lo + Math.imul(al3, bl9) | 0;
      mid = mid + Math.imul(al3, bh9) | 0;
      mid = mid + Math.imul(ah3, bl9) | 0;
      hi = hi + Math.imul(ah3, bh9) | 0;
      var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
      w12 &= 67108863;
      lo = Math.imul(al9, bl4);
      mid = Math.imul(al9, bh4);
      mid = mid + Math.imul(ah9, bl4) | 0;
      hi = Math.imul(ah9, bh4);
      lo = lo + Math.imul(al8, bl5) | 0;
      mid = mid + Math.imul(al8, bh5) | 0;
      mid = mid + Math.imul(ah8, bl5) | 0;
      hi = hi + Math.imul(ah8, bh5) | 0;
      lo = lo + Math.imul(al7, bl6) | 0;
      mid = mid + Math.imul(al7, bh6) | 0;
      mid = mid + Math.imul(ah7, bl6) | 0;
      hi = hi + Math.imul(ah7, bh6) | 0;
      lo = lo + Math.imul(al6, bl7) | 0;
      mid = mid + Math.imul(al6, bh7) | 0;
      mid = mid + Math.imul(ah6, bl7) | 0;
      hi = hi + Math.imul(ah6, bh7) | 0;
      lo = lo + Math.imul(al5, bl8) | 0;
      mid = mid + Math.imul(al5, bh8) | 0;
      mid = mid + Math.imul(ah5, bl8) | 0;
      hi = hi + Math.imul(ah5, bh8) | 0;
      lo = lo + Math.imul(al4, bl9) | 0;
      mid = mid + Math.imul(al4, bh9) | 0;
      mid = mid + Math.imul(ah4, bl9) | 0;
      hi = hi + Math.imul(ah4, bh9) | 0;
      var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
      w13 &= 67108863;
      lo = Math.imul(al9, bl5);
      mid = Math.imul(al9, bh5);
      mid = mid + Math.imul(ah9, bl5) | 0;
      hi = Math.imul(ah9, bh5);
      lo = lo + Math.imul(al8, bl6) | 0;
      mid = mid + Math.imul(al8, bh6) | 0;
      mid = mid + Math.imul(ah8, bl6) | 0;
      hi = hi + Math.imul(ah8, bh6) | 0;
      lo = lo + Math.imul(al7, bl7) | 0;
      mid = mid + Math.imul(al7, bh7) | 0;
      mid = mid + Math.imul(ah7, bl7) | 0;
      hi = hi + Math.imul(ah7, bh7) | 0;
      lo = lo + Math.imul(al6, bl8) | 0;
      mid = mid + Math.imul(al6, bh8) | 0;
      mid = mid + Math.imul(ah6, bl8) | 0;
      hi = hi + Math.imul(ah6, bh8) | 0;
      lo = lo + Math.imul(al5, bl9) | 0;
      mid = mid + Math.imul(al5, bh9) | 0;
      mid = mid + Math.imul(ah5, bl9) | 0;
      hi = hi + Math.imul(ah5, bh9) | 0;
      var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
      w14 &= 67108863;
      lo = Math.imul(al9, bl6);
      mid = Math.imul(al9, bh6);
      mid = mid + Math.imul(ah9, bl6) | 0;
      hi = Math.imul(ah9, bh6);
      lo = lo + Math.imul(al8, bl7) | 0;
      mid = mid + Math.imul(al8, bh7) | 0;
      mid = mid + Math.imul(ah8, bl7) | 0;
      hi = hi + Math.imul(ah8, bh7) | 0;
      lo = lo + Math.imul(al7, bl8) | 0;
      mid = mid + Math.imul(al7, bh8) | 0;
      mid = mid + Math.imul(ah7, bl8) | 0;
      hi = hi + Math.imul(ah7, bh8) | 0;
      lo = lo + Math.imul(al6, bl9) | 0;
      mid = mid + Math.imul(al6, bh9) | 0;
      mid = mid + Math.imul(ah6, bl9) | 0;
      hi = hi + Math.imul(ah6, bh9) | 0;
      var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
      w15 &= 67108863;
      lo = Math.imul(al9, bl7);
      mid = Math.imul(al9, bh7);
      mid = mid + Math.imul(ah9, bl7) | 0;
      hi = Math.imul(ah9, bh7);
      lo = lo + Math.imul(al8, bl8) | 0;
      mid = mid + Math.imul(al8, bh8) | 0;
      mid = mid + Math.imul(ah8, bl8) | 0;
      hi = hi + Math.imul(ah8, bh8) | 0;
      lo = lo + Math.imul(al7, bl9) | 0;
      mid = mid + Math.imul(al7, bh9) | 0;
      mid = mid + Math.imul(ah7, bl9) | 0;
      hi = hi + Math.imul(ah7, bh9) | 0;
      var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
      w16 &= 67108863;
      lo = Math.imul(al9, bl8);
      mid = Math.imul(al9, bh8);
      mid = mid + Math.imul(ah9, bl8) | 0;
      hi = Math.imul(ah9, bh8);
      lo = lo + Math.imul(al8, bl9) | 0;
      mid = mid + Math.imul(al8, bh9) | 0;
      mid = mid + Math.imul(ah8, bl9) | 0;
      hi = hi + Math.imul(ah8, bh9) | 0;
      var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
      w17 &= 67108863;
      lo = Math.imul(al9, bl9);
      mid = Math.imul(al9, bh9);
      mid = mid + Math.imul(ah9, bl9) | 0;
      hi = Math.imul(ah9, bh9);
      var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
      c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
      w18 &= 67108863;
      o[0] = w0;
      o[1] = w1;
      o[2] = w2;
      o[3] = w3;
      o[4] = w4;
      o[5] = w5;
      o[6] = w6;
      o[7] = w7;
      o[8] = w8;
      o[9] = w9;
      o[10] = w10;
      o[11] = w11;
      o[12] = w12;
      o[13] = w13;
      o[14] = w14;
      o[15] = w15;
      o[16] = w16;
      o[17] = w17;
      o[18] = w18;
      if (c !== 0) {
        o[19] = c;
        out.length++;
      }
      return out;
    };
    if (!Math.imul) {
      comb10MulTo = smallMulTo;
    }
    function bigMulTo(self, num, out) {
      out.negative = num.negative ^ self.negative;
      out.length = self.length + num.length;
      var carry = 0;
      var hncarry = 0;
      for (var k = 0;k < out.length - 1; k++) {
        var ncarry = hncarry;
        hncarry = 0;
        var rword = carry & 67108863;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1);j <= maxJ; j++) {
          var i = k - j;
          var a = self.words[i] | 0;
          var b = num.words[j] | 0;
          var r = a * b;
          var lo = r & 67108863;
          ncarry = ncarry + (r / 67108864 | 0) | 0;
          lo = lo + rword | 0;
          rword = lo & 67108863;
          ncarry = ncarry + (lo >>> 26) | 0;
          hncarry += ncarry >>> 26;
          ncarry &= 67108863;
        }
        out.words[k] = rword;
        carry = ncarry;
        ncarry = hncarry;
      }
      if (carry !== 0) {
        out.words[k] = carry;
      } else {
        out.length--;
      }
      return out._strip();
    }
    function jumboMulTo(self, num, out) {
      return bigMulTo(self, num, out);
    }
    BN.prototype.mulTo = function mulTo(num, out) {
      var res;
      var len = this.length + num.length;
      if (this.length === 10 && num.length === 10) {
        res = comb10MulTo(this, num, out);
      } else if (len < 63) {
        res = smallMulTo(this, num, out);
      } else if (len < 1024) {
        res = bigMulTo(this, num, out);
      } else {
        res = jumboMulTo(this, num, out);
      }
      return res;
    };
    function FFTM(x, y) {
      this.x = x;
      this.y = y;
    }
    FFTM.prototype.makeRBT = function makeRBT(N) {
      var t = new Array(N);
      var l = BN.prototype._countBits(N) - 1;
      for (var i = 0;i < N; i++) {
        t[i] = this.revBin(i, l, N);
      }
      return t;
    };
    FFTM.prototype.revBin = function revBin(x, l, N) {
      if (x === 0 || x === N - 1)
        return x;
      var rb = 0;
      for (var i = 0;i < l; i++) {
        rb |= (x & 1) << l - i - 1;
        x >>= 1;
      }
      return rb;
    };
    FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
      for (var i = 0;i < N; i++) {
        rtws[i] = rws[rbt[i]];
        itws[i] = iws[rbt[i]];
      }
    };
    FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
      this.permute(rbt, rws, iws, rtws, itws, N);
      for (var s = 1;s < N; s <<= 1) {
        var l = s << 1;
        var rtwdf = Math.cos(2 * Math.PI / l);
        var itwdf = Math.sin(2 * Math.PI / l);
        for (var p = 0;p < N; p += l) {
          var rtwdf_ = rtwdf;
          var itwdf_ = itwdf;
          for (var j = 0;j < s; j++) {
            var re = rtws[p + j];
            var ie = itws[p + j];
            var ro = rtws[p + j + s];
            var io = itws[p + j + s];
            var rx = rtwdf_ * ro - itwdf_ * io;
            io = rtwdf_ * io + itwdf_ * ro;
            ro = rx;
            rtws[p + j] = re + ro;
            itws[p + j] = ie + io;
            rtws[p + j + s] = re - ro;
            itws[p + j + s] = ie - io;
            if (j !== l) {
              rx = rtwdf * rtwdf_ - itwdf * itwdf_;
              itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
              rtwdf_ = rx;
            }
          }
        }
      }
    };
    FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
      var N = Math.max(m, n) | 1;
      var odd = N & 1;
      var i = 0;
      for (N = N / 2 | 0;N; N = N >>> 1) {
        i++;
      }
      return 1 << i + 1 + odd;
    };
    FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
      if (N <= 1)
        return;
      for (var i = 0;i < N / 2; i++) {
        var t = rws[i];
        rws[i] = rws[N - i - 1];
        rws[N - i - 1] = t;
        t = iws[i];
        iws[i] = -iws[N - i - 1];
        iws[N - i - 1] = -t;
      }
    };
    FFTM.prototype.normalize13b = function normalize13b(ws, N) {
      var carry = 0;
      for (var i = 0;i < N / 2; i++) {
        var w = Math.round(ws[2 * i + 1] / N) * 8192 + Math.round(ws[2 * i] / N) + carry;
        ws[i] = w & 67108863;
        if (w < 67108864) {
          carry = 0;
        } else {
          carry = w / 67108864 | 0;
        }
      }
      return ws;
    };
    FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
      var carry = 0;
      for (var i = 0;i < len; i++) {
        carry = carry + (ws[i] | 0);
        rws[2 * i] = carry & 8191;
        carry = carry >>> 13;
        rws[2 * i + 1] = carry & 8191;
        carry = carry >>> 13;
      }
      for (i = 2 * len;i < N; ++i) {
        rws[i] = 0;
      }
      assert(carry === 0);
      assert((carry & ~8191) === 0);
    };
    FFTM.prototype.stub = function stub(N) {
      var ph = new Array(N);
      for (var i = 0;i < N; i++) {
        ph[i] = 0;
      }
      return ph;
    };
    FFTM.prototype.mulp = function mulp(x, y, out) {
      var N = 2 * this.guessLen13b(x.length, y.length);
      var rbt = this.makeRBT(N);
      var _ = this.stub(N);
      var rws = new Array(N);
      var rwst = new Array(N);
      var iwst = new Array(N);
      var nrws = new Array(N);
      var nrwst = new Array(N);
      var niwst = new Array(N);
      var rmws = out.words;
      rmws.length = N;
      this.convert13b(x.words, x.length, rws, N);
      this.convert13b(y.words, y.length, nrws, N);
      this.transform(rws, _, rwst, iwst, N, rbt);
      this.transform(nrws, _, nrwst, niwst, N, rbt);
      for (var i = 0;i < N; i++) {
        var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
        iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
        rwst[i] = rx;
      }
      this.conjugate(rwst, iwst, N);
      this.transform(rwst, iwst, rmws, _, N, rbt);
      this.conjugate(rmws, _, N);
      this.normalize13b(rmws, N);
      out.negative = x.negative ^ y.negative;
      out.length = x.length + y.length;
      return out._strip();
    };
    BN.prototype.mul = function mul(num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return this.mulTo(num, out);
    };
    BN.prototype.mulf = function mulf(num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return jumboMulTo(this, num, out);
    };
    BN.prototype.imul = function imul(num) {
      return this.clone().mulTo(num, this);
    };
    BN.prototype.imuln = function imuln(num) {
      var isNegNum = num < 0;
      if (isNegNum)
        num = -num;
      assert(typeof num === "number");
      assert(num < 67108864);
      var carry = 0;
      for (var i = 0;i < this.length; i++) {
        var w = (this.words[i] | 0) * num;
        var lo = (w & 67108863) + (carry & 67108863);
        carry >>= 26;
        carry += w / 67108864 | 0;
        carry += lo >>> 26;
        this.words[i] = lo & 67108863;
      }
      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }
      return isNegNum ? this.ineg() : this;
    };
    BN.prototype.muln = function muln(num) {
      return this.clone().imuln(num);
    };
    BN.prototype.sqr = function sqr() {
      return this.mul(this);
    };
    BN.prototype.isqr = function isqr() {
      return this.imul(this.clone());
    };
    BN.prototype.pow = function pow(num) {
      var w = toBitArray(num);
      if (w.length === 0)
        return new BN(1);
      var res = this;
      for (var i = 0;i < w.length; i++, res = res.sqr()) {
        if (w[i] !== 0)
          break;
      }
      if (++i < w.length) {
        for (var q = res.sqr();i < w.length; i++, q = q.sqr()) {
          if (w[i] === 0)
            continue;
          res = res.mul(q);
        }
      }
      return res;
    };
    BN.prototype.iushln = function iushln(bits) {
      assert(typeof bits === "number" && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;
      var carryMask = 67108863 >>> 26 - r << 26 - r;
      var i;
      if (r !== 0) {
        var carry = 0;
        for (i = 0;i < this.length; i++) {
          var newCarry = this.words[i] & carryMask;
          var c = (this.words[i] | 0) - newCarry << r;
          this.words[i] = c | carry;
          carry = newCarry >>> 26 - r;
        }
        if (carry) {
          this.words[i] = carry;
          this.length++;
        }
      }
      if (s !== 0) {
        for (i = this.length - 1;i >= 0; i--) {
          this.words[i + s] = this.words[i];
        }
        for (i = 0;i < s; i++) {
          this.words[i] = 0;
        }
        this.length += s;
      }
      return this._strip();
    };
    BN.prototype.ishln = function ishln(bits) {
      assert(this.negative === 0);
      return this.iushln(bits);
    };
    BN.prototype.iushrn = function iushrn(bits, hint, extended) {
      assert(typeof bits === "number" && bits >= 0);
      var h;
      if (hint) {
        h = (hint - hint % 26) / 26;
      } else {
        h = 0;
      }
      var r = bits % 26;
      var s = Math.min((bits - r) / 26, this.length);
      var mask = 67108863 ^ 67108863 >>> r << r;
      var maskedWords = extended;
      h -= s;
      h = Math.max(0, h);
      if (maskedWords) {
        for (var i = 0;i < s; i++) {
          maskedWords.words[i] = this.words[i];
        }
        maskedWords.length = s;
      }
      if (s === 0) {
      } else if (this.length > s) {
        this.length -= s;
        for (i = 0;i < this.length; i++) {
          this.words[i] = this.words[i + s];
        }
      } else {
        this.words[0] = 0;
        this.length = 1;
      }
      var carry = 0;
      for (i = this.length - 1;i >= 0 && (carry !== 0 || i >= h); i--) {
        var word = this.words[i] | 0;
        this.words[i] = carry << 26 - r | word >>> r;
        carry = word & mask;
      }
      if (maskedWords && carry !== 0) {
        maskedWords.words[maskedWords.length++] = carry;
      }
      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }
      return this._strip();
    };
    BN.prototype.ishrn = function ishrn(bits, hint, extended) {
      assert(this.negative === 0);
      return this.iushrn(bits, hint, extended);
    };
    BN.prototype.shln = function shln(bits) {
      return this.clone().ishln(bits);
    };
    BN.prototype.ushln = function ushln(bits) {
      return this.clone().iushln(bits);
    };
    BN.prototype.shrn = function shrn(bits) {
      return this.clone().ishrn(bits);
    };
    BN.prototype.ushrn = function ushrn(bits) {
      return this.clone().iushrn(bits);
    };
    BN.prototype.testn = function testn(bit) {
      assert(typeof bit === "number" && bit >= 0);
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;
      if (this.length <= s)
        return false;
      var w = this.words[s];
      return !!(w & q);
    };
    BN.prototype.imaskn = function imaskn(bits) {
      assert(typeof bits === "number" && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;
      assert(this.negative === 0, "imaskn works only with positive numbers");
      if (this.length <= s) {
        return this;
      }
      if (r !== 0) {
        s++;
      }
      this.length = Math.min(s, this.length);
      if (r !== 0) {
        var mask = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= mask;
      }
      return this._strip();
    };
    BN.prototype.maskn = function maskn(bits) {
      return this.clone().imaskn(bits);
    };
    BN.prototype.iaddn = function iaddn(num) {
      assert(typeof num === "number");
      assert(num < 67108864);
      if (num < 0)
        return this.isubn(-num);
      if (this.negative !== 0) {
        if (this.length === 1 && (this.words[0] | 0) <= num) {
          this.words[0] = num - (this.words[0] | 0);
          this.negative = 0;
          return this;
        }
        this.negative = 0;
        this.isubn(num);
        this.negative = 1;
        return this;
      }
      return this._iaddn(num);
    };
    BN.prototype._iaddn = function _iaddn(num) {
      this.words[0] += num;
      for (var i = 0;i < this.length && this.words[i] >= 67108864; i++) {
        this.words[i] -= 67108864;
        if (i === this.length - 1) {
          this.words[i + 1] = 1;
        } else {
          this.words[i + 1]++;
        }
      }
      this.length = Math.max(this.length, i + 1);
      return this;
    };
    BN.prototype.isubn = function isubn(num) {
      assert(typeof num === "number");
      assert(num < 67108864);
      if (num < 0)
        return this.iaddn(-num);
      if (this.negative !== 0) {
        this.negative = 0;
        this.iaddn(num);
        this.negative = 1;
        return this;
      }
      this.words[0] -= num;
      if (this.length === 1 && this.words[0] < 0) {
        this.words[0] = -this.words[0];
        this.negative = 1;
      } else {
        for (var i = 0;i < this.length && this.words[i] < 0; i++) {
          this.words[i] += 67108864;
          this.words[i + 1] -= 1;
        }
      }
      return this._strip();
    };
    BN.prototype.addn = function addn(num) {
      return this.clone().iaddn(num);
    };
    BN.prototype.subn = function subn(num) {
      return this.clone().isubn(num);
    };
    BN.prototype.iabs = function iabs() {
      this.negative = 0;
      return this;
    };
    BN.prototype.abs = function abs() {
      return this.clone().iabs();
    };
    BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
      var len = num.length + shift;
      var i;
      this._expand(len);
      var w;
      var carry = 0;
      for (i = 0;i < num.length; i++) {
        w = (this.words[i + shift] | 0) + carry;
        var right = (num.words[i] | 0) * mul;
        w -= right & 67108863;
        carry = (w >> 26) - (right / 67108864 | 0);
        this.words[i + shift] = w & 67108863;
      }
      for (;i < this.length - shift; i++) {
        w = (this.words[i + shift] | 0) + carry;
        carry = w >> 26;
        this.words[i + shift] = w & 67108863;
      }
      if (carry === 0)
        return this._strip();
      assert(carry === -1);
      carry = 0;
      for (i = 0;i < this.length; i++) {
        w = -(this.words[i] | 0) + carry;
        carry = w >> 26;
        this.words[i] = w & 67108863;
      }
      this.negative = 1;
      return this._strip();
    };
    BN.prototype._wordDiv = function _wordDiv(num, mode) {
      var shift = this.length - num.length;
      var a = this.clone();
      var b = num;
      var bhi = b.words[b.length - 1] | 0;
      var bhiBits = this._countBits(bhi);
      shift = 26 - bhiBits;
      if (shift !== 0) {
        b = b.ushln(shift);
        a.iushln(shift);
        bhi = b.words[b.length - 1] | 0;
      }
      var m = a.length - b.length;
      var q;
      if (mode !== "mod") {
        q = new BN(null);
        q.length = m + 1;
        q.words = new Array(q.length);
        for (var i = 0;i < q.length; i++) {
          q.words[i] = 0;
        }
      }
      var diff = a.clone()._ishlnsubmul(b, 1, m);
      if (diff.negative === 0) {
        a = diff;
        if (q) {
          q.words[m] = 1;
        }
      }
      for (var j = m - 1;j >= 0; j--) {
        var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
        qj = Math.min(qj / bhi | 0, 67108863);
        a._ishlnsubmul(b, qj, j);
        while (a.negative !== 0) {
          qj--;
          a.negative = 0;
          a._ishlnsubmul(b, 1, j);
          if (!a.isZero()) {
            a.negative ^= 1;
          }
        }
        if (q) {
          q.words[j] = qj;
        }
      }
      if (q) {
        q._strip();
      }
      a._strip();
      if (mode !== "div" && shift !== 0) {
        a.iushrn(shift);
      }
      return {
        div: q || null,
        mod: a
      };
    };
    BN.prototype.divmod = function divmod(num, mode, positive) {
      assert(!num.isZero());
      if (this.isZero()) {
        return {
          div: new BN(0),
          mod: new BN(0)
        };
      }
      var div, mod2, res;
      if (this.negative !== 0 && num.negative === 0) {
        res = this.neg().divmod(num, mode);
        if (mode !== "mod") {
          div = res.div.neg();
        }
        if (mode !== "div") {
          mod2 = res.mod.neg();
          if (positive && mod2.negative !== 0) {
            mod2.iadd(num);
          }
        }
        return {
          div,
          mod: mod2
        };
      }
      if (this.negative === 0 && num.negative !== 0) {
        res = this.divmod(num.neg(), mode);
        if (mode !== "mod") {
          div = res.div.neg();
        }
        return {
          div,
          mod: res.mod
        };
      }
      if ((this.negative & num.negative) !== 0) {
        res = this.neg().divmod(num.neg(), mode);
        if (mode !== "div") {
          mod2 = res.mod.neg();
          if (positive && mod2.negative !== 0) {
            mod2.isub(num);
          }
        }
        return {
          div: res.div,
          mod: mod2
        };
      }
      if (num.length > this.length || this.cmp(num) < 0) {
        return {
          div: new BN(0),
          mod: this
        };
      }
      if (num.length === 1) {
        if (mode === "div") {
          return {
            div: this.divn(num.words[0]),
            mod: null
          };
        }
        if (mode === "mod") {
          return {
            div: null,
            mod: new BN(this.modrn(num.words[0]))
          };
        }
        return {
          div: this.divn(num.words[0]),
          mod: new BN(this.modrn(num.words[0]))
        };
      }
      return this._wordDiv(num, mode);
    };
    BN.prototype.div = function div(num) {
      return this.divmod(num, "div", false).div;
    };
    BN.prototype.mod = function mod(num) {
      return this.divmod(num, "mod", false).mod;
    };
    BN.prototype.umod = function umod(num) {
      return this.divmod(num, "mod", true).mod;
    };
    BN.prototype.divRound = function divRound(num) {
      var dm = this.divmod(num);
      if (dm.mod.isZero())
        return dm.div;
      var mod2 = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
      var half = num.ushrn(1);
      var r2 = num.andln(1);
      var cmp = mod2.cmp(half);
      if (cmp < 0 || r2 === 1 && cmp === 0)
        return dm.div;
      return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
    };
    BN.prototype.modrn = function modrn(num) {
      var isNegNum = num < 0;
      if (isNegNum)
        num = -num;
      assert(num <= 67108863);
      var p = (1 << 26) % num;
      var acc = 0;
      for (var i = this.length - 1;i >= 0; i--) {
        acc = (p * acc + (this.words[i] | 0)) % num;
      }
      return isNegNum ? -acc : acc;
    };
    BN.prototype.modn = function modn(num) {
      return this.modrn(num);
    };
    BN.prototype.idivn = function idivn(num) {
      var isNegNum = num < 0;
      if (isNegNum)
        num = -num;
      assert(num <= 67108863);
      var carry = 0;
      for (var i = this.length - 1;i >= 0; i--) {
        var w = (this.words[i] | 0) + carry * 67108864;
        this.words[i] = w / num | 0;
        carry = w % num;
      }
      this._strip();
      return isNegNum ? this.ineg() : this;
    };
    BN.prototype.divn = function divn(num) {
      return this.clone().idivn(num);
    };
    BN.prototype.egcd = function egcd(p) {
      assert(p.negative === 0);
      assert(!p.isZero());
      var x = this;
      var y = p.clone();
      if (x.negative !== 0) {
        x = x.umod(p);
      } else {
        x = x.clone();
      }
      var A = new BN(1);
      var B = new BN(0);
      var C = new BN(0);
      var D = new BN(1);
      var g = 0;
      while (x.isEven() && y.isEven()) {
        x.iushrn(1);
        y.iushrn(1);
        ++g;
      }
      var yp = y.clone();
      var xp = x.clone();
      while (!x.isZero()) {
        for (var i = 0, im = 1;(x.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
          ;
        if (i > 0) {
          x.iushrn(i);
          while (i-- > 0) {
            if (A.isOdd() || B.isOdd()) {
              A.iadd(yp);
              B.isub(xp);
            }
            A.iushrn(1);
            B.iushrn(1);
          }
        }
        for (var j = 0, jm = 1;(y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
          ;
        if (j > 0) {
          y.iushrn(j);
          while (j-- > 0) {
            if (C.isOdd() || D.isOdd()) {
              C.iadd(yp);
              D.isub(xp);
            }
            C.iushrn(1);
            D.iushrn(1);
          }
        }
        if (x.cmp(y) >= 0) {
          x.isub(y);
          A.isub(C);
          B.isub(D);
        } else {
          y.isub(x);
          C.isub(A);
          D.isub(B);
        }
      }
      return {
        a: C,
        b: D,
        gcd: y.iushln(g)
      };
    };
    BN.prototype._invmp = function _invmp(p) {
      assert(p.negative === 0);
      assert(!p.isZero());
      var a = this;
      var b = p.clone();
      if (a.negative !== 0) {
        a = a.umod(p);
      } else {
        a = a.clone();
      }
      var x1 = new BN(1);
      var x2 = new BN(0);
      var delta = b.clone();
      while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
        for (var i = 0, im = 1;(a.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
          ;
        if (i > 0) {
          a.iushrn(i);
          while (i-- > 0) {
            if (x1.isOdd()) {
              x1.iadd(delta);
            }
            x1.iushrn(1);
          }
        }
        for (var j = 0, jm = 1;(b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
          ;
        if (j > 0) {
          b.iushrn(j);
          while (j-- > 0) {
            if (x2.isOdd()) {
              x2.iadd(delta);
            }
            x2.iushrn(1);
          }
        }
        if (a.cmp(b) >= 0) {
          a.isub(b);
          x1.isub(x2);
        } else {
          b.isub(a);
          x2.isub(x1);
        }
      }
      var res;
      if (a.cmpn(1) === 0) {
        res = x1;
      } else {
        res = x2;
      }
      if (res.cmpn(0) < 0) {
        res.iadd(p);
      }
      return res;
    };
    BN.prototype.gcd = function gcd(num) {
      if (this.isZero())
        return num.abs();
      if (num.isZero())
        return this.abs();
      var a = this.clone();
      var b = num.clone();
      a.negative = 0;
      b.negative = 0;
      for (var shift = 0;a.isEven() && b.isEven(); shift++) {
        a.iushrn(1);
        b.iushrn(1);
      }
      do {
        while (a.isEven()) {
          a.iushrn(1);
        }
        while (b.isEven()) {
          b.iushrn(1);
        }
        var r = a.cmp(b);
        if (r < 0) {
          var t = a;
          a = b;
          b = t;
        } else if (r === 0 || b.cmpn(1) === 0) {
          break;
        }
        a.isub(b);
      } while (true);
      return b.iushln(shift);
    };
    BN.prototype.invm = function invm(num) {
      return this.egcd(num).a.umod(num);
    };
    BN.prototype.isEven = function isEven() {
      return (this.words[0] & 1) === 0;
    };
    BN.prototype.isOdd = function isOdd() {
      return (this.words[0] & 1) === 1;
    };
    BN.prototype.andln = function andln(num) {
      return this.words[0] & num;
    };
    BN.prototype.bincn = function bincn(bit) {
      assert(typeof bit === "number");
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;
      if (this.length <= s) {
        this._expand(s + 1);
        this.words[s] |= q;
        return this;
      }
      var carry = q;
      for (var i = s;carry !== 0 && i < this.length; i++) {
        var w = this.words[i] | 0;
        w += carry;
        carry = w >>> 26;
        w &= 67108863;
        this.words[i] = w;
      }
      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }
      return this;
    };
    BN.prototype.isZero = function isZero() {
      return this.length === 1 && this.words[0] === 0;
    };
    BN.prototype.cmpn = function cmpn(num) {
      var negative = num < 0;
      if (this.negative !== 0 && !negative)
        return -1;
      if (this.negative === 0 && negative)
        return 1;
      this._strip();
      var res;
      if (this.length > 1) {
        res = 1;
      } else {
        if (negative) {
          num = -num;
        }
        assert(num <= 67108863, "Number is too big");
        var w = this.words[0] | 0;
        res = w === num ? 0 : w < num ? -1 : 1;
      }
      if (this.negative !== 0)
        return -res | 0;
      return res;
    };
    BN.prototype.cmp = function cmp(num) {
      if (this.negative !== 0 && num.negative === 0)
        return -1;
      if (this.negative === 0 && num.negative !== 0)
        return 1;
      var res = this.ucmp(num);
      if (this.negative !== 0)
        return -res | 0;
      return res;
    };
    BN.prototype.ucmp = function ucmp(num) {
      if (this.length > num.length)
        return 1;
      if (this.length < num.length)
        return -1;
      var res = 0;
      for (var i = this.length - 1;i >= 0; i--) {
        var a = this.words[i] | 0;
        var b = num.words[i] | 0;
        if (a === b)
          continue;
        if (a < b) {
          res = -1;
        } else if (a > b) {
          res = 1;
        }
        break;
      }
      return res;
    };
    BN.prototype.gtn = function gtn(num) {
      return this.cmpn(num) === 1;
    };
    BN.prototype.gt = function gt(num) {
      return this.cmp(num) === 1;
    };
    BN.prototype.gten = function gten(num) {
      return this.cmpn(num) >= 0;
    };
    BN.prototype.gte = function gte(num) {
      return this.cmp(num) >= 0;
    };
    BN.prototype.ltn = function ltn(num) {
      return this.cmpn(num) === -1;
    };
    BN.prototype.lt = function lt(num) {
      return this.cmp(num) === -1;
    };
    BN.prototype.lten = function lten(num) {
      return this.cmpn(num) <= 0;
    };
    BN.prototype.lte = function lte(num) {
      return this.cmp(num) <= 0;
    };
    BN.prototype.eqn = function eqn(num) {
      return this.cmpn(num) === 0;
    };
    BN.prototype.eq = function eq(num) {
      return this.cmp(num) === 0;
    };
    BN.red = function red(num) {
      return new Red(num);
    };
    BN.prototype.toRed = function toRed(ctx) {
      assert(!this.red, "Already a number in reduction context");
      assert(this.negative === 0, "red works only with positives");
      return ctx.convertTo(this)._forceRed(ctx);
    };
    BN.prototype.fromRed = function fromRed() {
      assert(this.red, "fromRed works only with numbers in reduction context");
      return this.red.convertFrom(this);
    };
    BN.prototype._forceRed = function _forceRed(ctx) {
      this.red = ctx;
      return this;
    };
    BN.prototype.forceRed = function forceRed(ctx) {
      assert(!this.red, "Already a number in reduction context");
      return this._forceRed(ctx);
    };
    BN.prototype.redAdd = function redAdd(num) {
      assert(this.red, "redAdd works only with red numbers");
      return this.red.add(this, num);
    };
    BN.prototype.redIAdd = function redIAdd(num) {
      assert(this.red, "redIAdd works only with red numbers");
      return this.red.iadd(this, num);
    };
    BN.prototype.redSub = function redSub(num) {
      assert(this.red, "redSub works only with red numbers");
      return this.red.sub(this, num);
    };
    BN.prototype.redISub = function redISub(num) {
      assert(this.red, "redISub works only with red numbers");
      return this.red.isub(this, num);
    };
    BN.prototype.redShl = function redShl(num) {
      assert(this.red, "redShl works only with red numbers");
      return this.red.shl(this, num);
    };
    BN.prototype.redMul = function redMul(num) {
      assert(this.red, "redMul works only with red numbers");
      this.red._verify2(this, num);
      return this.red.mul(this, num);
    };
    BN.prototype.redIMul = function redIMul(num) {
      assert(this.red, "redMul works only with red numbers");
      this.red._verify2(this, num);
      return this.red.imul(this, num);
    };
    BN.prototype.redSqr = function redSqr() {
      assert(this.red, "redSqr works only with red numbers");
      this.red._verify1(this);
      return this.red.sqr(this);
    };
    BN.prototype.redISqr = function redISqr() {
      assert(this.red, "redISqr works only with red numbers");
      this.red._verify1(this);
      return this.red.isqr(this);
    };
    BN.prototype.redSqrt = function redSqrt() {
      assert(this.red, "redSqrt works only with red numbers");
      this.red._verify1(this);
      return this.red.sqrt(this);
    };
    BN.prototype.redInvm = function redInvm() {
      assert(this.red, "redInvm works only with red numbers");
      this.red._verify1(this);
      return this.red.invm(this);
    };
    BN.prototype.redNeg = function redNeg() {
      assert(this.red, "redNeg works only with red numbers");
      this.red._verify1(this);
      return this.red.neg(this);
    };
    BN.prototype.redPow = function redPow(num) {
      assert(this.red && !num.red, "redPow(normalNum)");
      this.red._verify1(this);
      return this.red.pow(this, num);
    };
    var primes = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function MPrime(name, p) {
      this.name = name;
      this.p = new BN(p, 16);
      this.n = this.p.bitLength();
      this.k = new BN(1).iushln(this.n).isub(this.p);
      this.tmp = this._tmp();
    }
    MPrime.prototype._tmp = function _tmp() {
      var tmp = new BN(null);
      tmp.words = new Array(Math.ceil(this.n / 13));
      return tmp;
    };
    MPrime.prototype.ireduce = function ireduce(num) {
      var r = num;
      var rlen;
      do {
        this.split(r, this.tmp);
        r = this.imulK(r);
        r = r.iadd(this.tmp);
        rlen = r.bitLength();
      } while (rlen > this.n);
      var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
      if (cmp === 0) {
        r.words[0] = 0;
        r.length = 1;
      } else if (cmp > 0) {
        r.isub(this.p);
      } else {
        if (r.strip !== undefined) {
          r.strip();
        } else {
          r._strip();
        }
      }
      return r;
    };
    MPrime.prototype.split = function split(input, out) {
      input.iushrn(this.n, 0, out);
    };
    MPrime.prototype.imulK = function imulK(num) {
      return num.imul(this.k);
    };
    function K256() {
      MPrime.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
    }
    inherits(K256, MPrime);
    K256.prototype.split = function split(input, output2) {
      var mask = 4194303;
      var outLen = Math.min(input.length, 9);
      for (var i = 0;i < outLen; i++) {
        output2.words[i] = input.words[i];
      }
      output2.length = outLen;
      if (input.length <= 9) {
        input.words[0] = 0;
        input.length = 1;
        return;
      }
      var prev = input.words[9];
      output2.words[output2.length++] = prev & mask;
      for (i = 10;i < input.length; i++) {
        var next = input.words[i] | 0;
        input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
        prev = next;
      }
      prev >>>= 22;
      input.words[i - 10] = prev;
      if (prev === 0 && input.length > 10) {
        input.length -= 10;
      } else {
        input.length -= 9;
      }
    };
    K256.prototype.imulK = function imulK(num) {
      num.words[num.length] = 0;
      num.words[num.length + 1] = 0;
      num.length += 2;
      var lo = 0;
      for (var i = 0;i < num.length; i++) {
        var w = num.words[i] | 0;
        lo += w * 977;
        num.words[i] = lo & 67108863;
        lo = w * 64 + (lo / 67108864 | 0);
      }
      if (num.words[num.length - 1] === 0) {
        num.length--;
        if (num.words[num.length - 1] === 0) {
          num.length--;
        }
      }
      return num;
    };
    function P224() {
      MPrime.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
    }
    inherits(P224, MPrime);
    function P192() {
      MPrime.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
    }
    inherits(P192, MPrime);
    function P25519() {
      MPrime.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
    }
    inherits(P25519, MPrime);
    P25519.prototype.imulK = function imulK(num) {
      var carry = 0;
      for (var i = 0;i < num.length; i++) {
        var hi = (num.words[i] | 0) * 19 + carry;
        var lo = hi & 67108863;
        hi >>>= 26;
        num.words[i] = lo;
        carry = hi;
      }
      if (carry !== 0) {
        num.words[num.length++] = carry;
      }
      return num;
    };
    BN._prime = function prime(name) {
      if (primes[name])
        return primes[name];
      var prime;
      if (name === "k256") {
        prime = new K256;
      } else if (name === "p224") {
        prime = new P224;
      } else if (name === "p192") {
        prime = new P192;
      } else if (name === "p25519") {
        prime = new P25519;
      } else {
        throw new Error("Unknown prime " + name);
      }
      primes[name] = prime;
      return prime;
    };
    function Red(m) {
      if (typeof m === "string") {
        var prime = BN._prime(m);
        this.m = prime.p;
        this.prime = prime;
      } else {
        assert(m.gtn(1), "modulus must be greater than 1");
        this.m = m;
        this.prime = null;
      }
    }
    Red.prototype._verify1 = function _verify1(a) {
      assert(a.negative === 0, "red works only with positives");
      assert(a.red, "red works only with red numbers");
    };
    Red.prototype._verify2 = function _verify2(a, b) {
      assert((a.negative | b.negative) === 0, "red works only with positives");
      assert(a.red && a.red === b.red, "red works only with red numbers");
    };
    Red.prototype.imod = function imod(a) {
      if (this.prime)
        return this.prime.ireduce(a)._forceRed(this);
      move(a, a.umod(this.m)._forceRed(this));
      return a;
    };
    Red.prototype.neg = function neg(a) {
      if (a.isZero()) {
        return a.clone();
      }
      return this.m.sub(a)._forceRed(this);
    };
    Red.prototype.add = function add(a, b) {
      this._verify2(a, b);
      var res = a.add(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res._forceRed(this);
    };
    Red.prototype.iadd = function iadd(a, b) {
      this._verify2(a, b);
      var res = a.iadd(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res;
    };
    Red.prototype.sub = function sub(a, b) {
      this._verify2(a, b);
      var res = a.sub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Red.prototype.isub = function isub(a, b) {
      this._verify2(a, b);
      var res = a.isub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res;
    };
    Red.prototype.shl = function shl(a, num) {
      this._verify1(a);
      return this.imod(a.ushln(num));
    };
    Red.prototype.imul = function imul(a, b) {
      this._verify2(a, b);
      return this.imod(a.imul(b));
    };
    Red.prototype.mul = function mul(a, b) {
      this._verify2(a, b);
      return this.imod(a.mul(b));
    };
    Red.prototype.isqr = function isqr(a) {
      return this.imul(a, a.clone());
    };
    Red.prototype.sqr = function sqr(a) {
      return this.mul(a, a);
    };
    Red.prototype.sqrt = function sqrt(a) {
      if (a.isZero())
        return a.clone();
      var mod3 = this.m.andln(3);
      assert(mod3 % 2 === 1);
      if (mod3 === 3) {
        var pow3 = this.m.add(new BN(1)).iushrn(2);
        return this.pow(a, pow3);
      }
      var q = this.m.subn(1);
      var s = 0;
      while (!q.isZero() && q.andln(1) === 0) {
        s++;
        q.iushrn(1);
      }
      assert(!q.isZero());
      var one = new BN(1).toRed(this);
      var nOne = one.redNeg();
      var lpow = this.m.subn(1).iushrn(1);
      var z = this.m.bitLength();
      z = new BN(2 * z * z).toRed(this);
      while (this.pow(z, lpow).cmp(nOne) !== 0) {
        z.redIAdd(nOne);
      }
      var c = this.pow(z, q);
      var r = this.pow(a, q.addn(1).iushrn(1));
      var t = this.pow(a, q);
      var m = s;
      while (t.cmp(one) !== 0) {
        var tmp = t;
        for (var i = 0;tmp.cmp(one) !== 0; i++) {
          tmp = tmp.redSqr();
        }
        assert(i < m);
        var b = this.pow(c, new BN(1).iushln(m - i - 1));
        r = r.redMul(b);
        c = b.redSqr();
        t = t.redMul(c);
        m = i;
      }
      return r;
    };
    Red.prototype.invm = function invm(a) {
      var inv = a._invmp(this.m);
      if (inv.negative !== 0) {
        inv.negative = 0;
        return this.imod(inv).redNeg();
      } else {
        return this.imod(inv);
      }
    };
    Red.prototype.pow = function pow(a, num) {
      if (num.isZero())
        return new BN(1).toRed(this);
      if (num.cmpn(1) === 0)
        return a.clone();
      var windowSize = 4;
      var wnd = new Array(1 << windowSize);
      wnd[0] = new BN(1).toRed(this);
      wnd[1] = a;
      for (var i = 2;i < wnd.length; i++) {
        wnd[i] = this.mul(wnd[i - 1], a);
      }
      var res = wnd[0];
      var current = 0;
      var currentLen = 0;
      var start = num.bitLength() % 26;
      if (start === 0) {
        start = 26;
      }
      for (i = num.length - 1;i >= 0; i--) {
        var word = num.words[i];
        for (var j = start - 1;j >= 0; j--) {
          var bit = word >> j & 1;
          if (res !== wnd[0]) {
            res = this.sqr(res);
          }
          if (bit === 0 && current === 0) {
            currentLen = 0;
            continue;
          }
          current <<= 1;
          current |= bit;
          currentLen++;
          if (currentLen !== windowSize && (i !== 0 || j !== 0))
            continue;
          res = this.mul(res, wnd[current]);
          currentLen = 0;
          current = 0;
        }
        start = 26;
      }
      return res;
    };
    Red.prototype.convertTo = function convertTo(num) {
      var r = num.umod(this.m);
      return r === num ? r.clone() : r;
    };
    Red.prototype.convertFrom = function convertFrom(num) {
      var res = num.clone();
      res.red = null;
      return res;
    };
    BN.mont = function mont(num) {
      return new Mont(num);
    };
    function Mont(m) {
      Red.call(this, m);
      this.shift = this.m.bitLength();
      if (this.shift % 26 !== 0) {
        this.shift += 26 - this.shift % 26;
      }
      this.r = new BN(1).iushln(this.shift);
      this.r2 = this.imod(this.r.sqr());
      this.rinv = this.r._invmp(this.m);
      this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
      this.minv = this.minv.umod(this.r);
      this.minv = this.r.sub(this.minv);
    }
    inherits(Mont, Red);
    Mont.prototype.convertTo = function convertTo(num) {
      return this.imod(num.ushln(this.shift));
    };
    Mont.prototype.convertFrom = function convertFrom(num) {
      var r = this.imod(num.mul(this.rinv));
      r.red = null;
      return r;
    };
    Mont.prototype.imul = function imul(a, b) {
      if (a.isZero() || b.isZero()) {
        a.words[0] = 0;
        a.length = 1;
        return a;
      }
      var t = a.imul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;
      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Mont.prototype.mul = function mul(a, b) {
      if (a.isZero() || b.isZero())
        return new BN(0)._forceRed(this);
      var t = a.mul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;
      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }
      return res._forceRed(this);
    };
    Mont.prototype.invm = function invm(a) {
      var res = this.imod(a._invmp(this.m).mul(this.r2));
      return res._forceRed(this);
    };
  })(typeof module === "undefined" || module, exports);
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS((exports, module) => {
  var copyProps = function(src, dst) {
    for (var key in src) {
      dst[key] = src[key];
    }
  };
  var SafeBuffer = function(arg, encodingOrOffset, length) {
    return Buffer2(arg, encodingOrOffset, length);
  };
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  var buffer = import.meta.require("buffer");
  var Buffer2 = buffer.Buffer;
  if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
    module.exports = buffer;
  } else {
    copyProps(buffer, exports);
    exports.Buffer = SafeBuffer;
  }
  SafeBuffer.prototype = Object.create(Buffer2.prototype);
  copyProps(Buffer2, SafeBuffer);
  SafeBuffer.from = function(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      throw new TypeError("Argument must not be a number");
    }
    return Buffer2(arg, encodingOrOffset, length);
  };
  SafeBuffer.alloc = function(size, fill, encoding) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    var buf = Buffer2(size);
    if (fill !== undefined) {
      if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
    } else {
      buf.fill(0);
    }
    return buf;
  };
  SafeBuffer.allocUnsafe = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return Buffer2(size);
  };
  SafeBuffer.allocUnsafeSlow = function(size) {
    if (typeof size !== "number") {
      throw new TypeError("Argument must be a number");
    }
    return buffer.SlowBuffer(size);
  };
});

// node_modules/base-x/src/index.js
var require_src = __commonJS((exports, module) => {
  var base = function(ALPHABET) {
    if (ALPHABET.length >= 255) {
      throw new TypeError("Alphabet too long");
    }
    var BASE_MAP = new Uint8Array(256);
    for (var j = 0;j < BASE_MAP.length; j++) {
      BASE_MAP[j] = 255;
    }
    for (var i = 0;i < ALPHABET.length; i++) {
      var x = ALPHABET.charAt(i);
      var xc = x.charCodeAt(0);
      if (BASE_MAP[xc] !== 255) {
        throw new TypeError(x + " is ambiguous");
      }
      BASE_MAP[xc] = i;
    }
    var BASE = ALPHABET.length;
    var LEADER = ALPHABET.charAt(0);
    var FACTOR = Math.log(BASE) / Math.log(256);
    var iFACTOR = Math.log(256) / Math.log(BASE);
    function encode(source) {
      if (Array.isArray(source) || source instanceof Uint8Array) {
        source = _Buffer.from(source);
      }
      if (!_Buffer.isBuffer(source)) {
        throw new TypeError("Expected Buffer");
      }
      if (source.length === 0) {
        return "";
      }
      var zeroes = 0;
      var length = 0;
      var pbegin = 0;
      var pend = source.length;
      while (pbegin !== pend && source[pbegin] === 0) {
        pbegin++;
        zeroes++;
      }
      var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
      var b58 = new Uint8Array(size);
      while (pbegin !== pend) {
        var carry = source[pbegin];
        var i2 = 0;
        for (var it1 = size - 1;(carry !== 0 || i2 < length) && it1 !== -1; it1--, i2++) {
          carry += 256 * b58[it1] >>> 0;
          b58[it1] = carry % BASE >>> 0;
          carry = carry / BASE >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length = i2;
        pbegin++;
      }
      var it2 = size - length;
      while (it2 !== size && b58[it2] === 0) {
        it2++;
      }
      var str = LEADER.repeat(zeroes);
      for (;it2 < size; ++it2) {
        str += ALPHABET.charAt(b58[it2]);
      }
      return str;
    }
    function decodeUnsafe(source) {
      if (typeof source !== "string") {
        throw new TypeError("Expected String");
      }
      if (source.length === 0) {
        return _Buffer.alloc(0);
      }
      var psz = 0;
      var zeroes = 0;
      var length = 0;
      while (source[psz] === LEADER) {
        zeroes++;
        psz++;
      }
      var size = (source.length - psz) * FACTOR + 1 >>> 0;
      var b256 = new Uint8Array(size);
      while (source[psz]) {
        var carry = BASE_MAP[source.charCodeAt(psz)];
        if (carry === 255) {
          return;
        }
        var i2 = 0;
        for (var it3 = size - 1;(carry !== 0 || i2 < length) && it3 !== -1; it3--, i2++) {
          carry += BASE * b256[it3] >>> 0;
          b256[it3] = carry % 256 >>> 0;
          carry = carry / 256 >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length = i2;
        psz++;
      }
      var it4 = size - length;
      while (it4 !== size && b256[it4] === 0) {
        it4++;
      }
      var vch = _Buffer.allocUnsafe(zeroes + (size - it4));
      vch.fill(0, 0, zeroes);
      var j2 = zeroes;
      while (it4 !== size) {
        vch[j2++] = b256[it4++];
      }
      return vch;
    }
    function decode(string) {
      var buffer = decodeUnsafe(string);
      if (buffer) {
        return buffer;
      }
      throw new Error("Non-base" + BASE + " character");
    }
    return {
      encode,
      decodeUnsafe,
      decode
    };
  };
  var _Buffer = require_safe_buffer().Buffer;
  module.exports = base;
});

// node_modules/bs58/index.js
var require_bs58 = __commonJS((exports, module) => {
  var basex = require_src();
  var ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  module.exports = basex(ALPHABET);
});

// node_modules/text-encoding-utf-8/lib/encoding.lib.js
var require_encoding_lib = __commonJS((exports) => {
  var inRange = function(a, min, max) {
    return min <= a && a <= max;
  };
  var ToDictionary = function(o) {
    if (o === undefined)
      return {};
    if (o === Object(o))
      return o;
    throw TypeError("Could not convert argument to dictionary");
  };
  var stringToCodePoints = function(string) {
    var s = String(string);
    var n = s.length;
    var i = 0;
    var u = [];
    while (i < n) {
      var c = s.charCodeAt(i);
      if (c < 55296 || c > 57343) {
        u.push(c);
      } else if (56320 <= c && c <= 57343) {
        u.push(65533);
      } else if (55296 <= c && c <= 56319) {
        if (i === n - 1) {
          u.push(65533);
        } else {
          var d = string.charCodeAt(i + 1);
          if (56320 <= d && d <= 57343) {
            var a = c & 1023;
            var b = d & 1023;
            u.push(65536 + (a << 10) + b);
            i += 1;
          } else {
            u.push(65533);
          }
        }
      }
      i += 1;
    }
    return u;
  };
  var codePointsToString = function(code_points) {
    var s = "";
    for (var i = 0;i < code_points.length; ++i) {
      var cp = code_points[i];
      if (cp <= 65535) {
        s += String.fromCharCode(cp);
      } else {
        cp -= 65536;
        s += String.fromCharCode((cp >> 10) + 55296, (cp & 1023) + 56320);
      }
    }
    return s;
  };
  var Stream = function(tokens) {
    this.tokens = [].slice.call(tokens);
  };
  var decoderError = function(fatal, opt_code_point) {
    if (fatal)
      throw TypeError("Decoder error");
    return opt_code_point || 65533;
  };
  var TextDecoder2 = function(encoding, options) {
    if (!(this instanceof TextDecoder2)) {
      return new TextDecoder2(encoding, options);
    }
    encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
    if (encoding !== DEFAULT_ENCODING) {
      throw new Error("Encoding not supported. Only utf-8 is supported");
    }
    options = ToDictionary(options);
    this._streaming = false;
    this._BOMseen = false;
    this._decoder = null;
    this._fatal = Boolean(options["fatal"]);
    this._ignoreBOM = Boolean(options["ignoreBOM"]);
    Object.defineProperty(this, "encoding", { value: "utf-8" });
    Object.defineProperty(this, "fatal", { value: this._fatal });
    Object.defineProperty(this, "ignoreBOM", { value: this._ignoreBOM });
  };
  var TextEncoder2 = function(encoding, options) {
    if (!(this instanceof TextEncoder2))
      return new TextEncoder2(encoding, options);
    encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
    if (encoding !== DEFAULT_ENCODING) {
      throw new Error("Encoding not supported. Only utf-8 is supported");
    }
    options = ToDictionary(options);
    this._streaming = false;
    this._encoder = null;
    this._options = { fatal: Boolean(options["fatal"]) };
    Object.defineProperty(this, "encoding", { value: "utf-8" });
  };
  var UTF8Decoder = function(options) {
    var fatal = options.fatal;
    var utf8_code_point = 0, utf8_bytes_seen = 0, utf8_bytes_needed = 0, utf8_lower_boundary = 128, utf8_upper_boundary = 191;
    this.handler = function(stream, bite) {
      if (bite === end_of_stream && utf8_bytes_needed !== 0) {
        utf8_bytes_needed = 0;
        return decoderError(fatal);
      }
      if (bite === end_of_stream)
        return finished;
      if (utf8_bytes_needed === 0) {
        if (inRange(bite, 0, 127)) {
          return bite;
        }
        if (inRange(bite, 194, 223)) {
          utf8_bytes_needed = 1;
          utf8_code_point = bite - 192;
        } else if (inRange(bite, 224, 239)) {
          if (bite === 224)
            utf8_lower_boundary = 160;
          if (bite === 237)
            utf8_upper_boundary = 159;
          utf8_bytes_needed = 2;
          utf8_code_point = bite - 224;
        } else if (inRange(bite, 240, 244)) {
          if (bite === 240)
            utf8_lower_boundary = 144;
          if (bite === 244)
            utf8_upper_boundary = 143;
          utf8_bytes_needed = 3;
          utf8_code_point = bite - 240;
        } else {
          return decoderError(fatal);
        }
        utf8_code_point = utf8_code_point << 6 * utf8_bytes_needed;
        return null;
      }
      if (!inRange(bite, utf8_lower_boundary, utf8_upper_boundary)) {
        utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
        utf8_lower_boundary = 128;
        utf8_upper_boundary = 191;
        stream.prepend(bite);
        return decoderError(fatal);
      }
      utf8_lower_boundary = 128;
      utf8_upper_boundary = 191;
      utf8_bytes_seen += 1;
      utf8_code_point += bite - 128 << 6 * (utf8_bytes_needed - utf8_bytes_seen);
      if (utf8_bytes_seen !== utf8_bytes_needed)
        return null;
      var code_point = utf8_code_point;
      utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
      return code_point;
    };
  };
  var UTF8Encoder = function(options) {
    var fatal = options.fatal;
    this.handler = function(stream, code_point) {
      if (code_point === end_of_stream)
        return finished;
      if (inRange(code_point, 0, 127))
        return code_point;
      var count, offset;
      if (inRange(code_point, 128, 2047)) {
        count = 1;
        offset = 192;
      } else if (inRange(code_point, 2048, 65535)) {
        count = 2;
        offset = 224;
      } else if (inRange(code_point, 65536, 1114111)) {
        count = 3;
        offset = 240;
      }
      var bytes2 = [(code_point >> 6 * count) + offset];
      while (count > 0) {
        var temp = code_point >> 6 * (count - 1);
        bytes2.push(128 | temp & 63);
        count -= 1;
      }
      return bytes2;
    };
  };
  var end_of_stream = -1;
  Stream.prototype = {
    endOfStream: function() {
      return !this.tokens.length;
    },
    read: function() {
      if (!this.tokens.length)
        return end_of_stream;
      return this.tokens.shift();
    },
    prepend: function(token) {
      if (Array.isArray(token)) {
        var tokens = token;
        while (tokens.length)
          this.tokens.unshift(tokens.pop());
      } else {
        this.tokens.unshift(token);
      }
    },
    push: function(token) {
      if (Array.isArray(token)) {
        var tokens = token;
        while (tokens.length)
          this.tokens.push(tokens.shift());
      } else {
        this.tokens.push(token);
      }
    }
  };
  var finished = -1;
  var DEFAULT_ENCODING = "utf-8";
  TextDecoder2.prototype = {
    decode: function decode(input, options) {
      var bytes2;
      if (typeof input === "object" && input instanceof ArrayBuffer) {
        bytes2 = new Uint8Array(input);
      } else if (typeof input === "object" && "buffer" in input && input.buffer instanceof ArrayBuffer) {
        bytes2 = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
      } else {
        bytes2 = new Uint8Array(0);
      }
      options = ToDictionary(options);
      if (!this._streaming) {
        this._decoder = new UTF8Decoder({ fatal: this._fatal });
        this._BOMseen = false;
      }
      this._streaming = Boolean(options["stream"]);
      var input_stream = new Stream(bytes2);
      var code_points = [];
      var result;
      while (!input_stream.endOfStream()) {
        result = this._decoder.handler(input_stream, input_stream.read());
        if (result === finished)
          break;
        if (result === null)
          continue;
        if (Array.isArray(result))
          code_points.push.apply(code_points, result);
        else
          code_points.push(result);
      }
      if (!this._streaming) {
        do {
          result = this._decoder.handler(input_stream, input_stream.read());
          if (result === finished)
            break;
          if (result === null)
            continue;
          if (Array.isArray(result))
            code_points.push.apply(code_points, result);
          else
            code_points.push(result);
        } while (!input_stream.endOfStream());
        this._decoder = null;
      }
      if (code_points.length) {
        if (["utf-8"].indexOf(this.encoding) !== -1 && !this._ignoreBOM && !this._BOMseen) {
          if (code_points[0] === 65279) {
            this._BOMseen = true;
            code_points.shift();
          } else {
            this._BOMseen = true;
          }
        }
      }
      return codePointsToString(code_points);
    }
  };
  TextEncoder2.prototype = {
    encode: function encode(opt_string, options) {
      opt_string = opt_string ? String(opt_string) : "";
      options = ToDictionary(options);
      if (!this._streaming)
        this._encoder = new UTF8Encoder(this._options);
      this._streaming = Boolean(options["stream"]);
      var bytes2 = [];
      var input_stream = new Stream(stringToCodePoints(opt_string));
      var result;
      while (!input_stream.endOfStream()) {
        result = this._encoder.handler(input_stream, input_stream.read());
        if (result === finished)
          break;
        if (Array.isArray(result))
          bytes2.push.apply(bytes2, result);
        else
          bytes2.push(result);
      }
      if (!this._streaming) {
        while (true) {
          result = this._encoder.handler(input_stream, input_stream.read());
          if (result === finished)
            break;
          if (Array.isArray(result))
            bytes2.push.apply(bytes2, result);
          else
            bytes2.push(result);
        }
        this._encoder = null;
      }
      return new Uint8Array(bytes2);
    }
  };
  exports.TextEncoder = TextEncoder2;
  exports.TextDecoder = TextDecoder2;
});

// node_modules/borsh/lib/index.js
var require_lib = __commonJS((exports) => {
  var baseEncode = function(value) {
    if (typeof value === "string") {
      value = Buffer.from(value, "utf8");
    }
    return bs58_1.default.encode(Buffer.from(value));
  };
  var baseDecode = function(value) {
    return Buffer.from(bs58_1.default.decode(value));
  };
  var handlingRangeError = function(target, propertyKey, propertyDescriptor) {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function(...args) {
      try {
        return originalMethod.apply(this, args);
      } catch (e) {
        if (e instanceof RangeError) {
          const code = e.code;
          if (["ERR_BUFFER_OUT_OF_BOUNDS", "ERR_OUT_OF_RANGE"].indexOf(code) >= 0) {
            throw new BorshError("Reached the end of buffer when deserializing");
          }
        }
        throw e;
      }
    };
  };
  var capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  var serializeField = function(schema, fieldName, value, fieldType, writer) {
    try {
      if (typeof fieldType === "string") {
        writer[`write${capitalizeFirstLetter(fieldType)}`](value);
      } else if (fieldType instanceof Array) {
        if (typeof fieldType[0] === "number") {
          if (value.length !== fieldType[0]) {
            throw new BorshError(`Expecting byte array of length ${fieldType[0]}, but got ${value.length} bytes`);
          }
          writer.writeFixedArray(value);
        } else if (fieldType.length === 2 && typeof fieldType[1] === "number") {
          if (value.length !== fieldType[1]) {
            throw new BorshError(`Expecting byte array of length ${fieldType[1]}, but got ${value.length} bytes`);
          }
          for (let i = 0;i < fieldType[1]; i++) {
            serializeField(schema, null, value[i], fieldType[0], writer);
          }
        } else {
          writer.writeArray(value, (item) => {
            serializeField(schema, fieldName, item, fieldType[0], writer);
          });
        }
      } else if (fieldType.kind !== undefined) {
        switch (fieldType.kind) {
          case "option": {
            if (value === null || value === undefined) {
              writer.writeU8(0);
            } else {
              writer.writeU8(1);
              serializeField(schema, fieldName, value, fieldType.type, writer);
            }
            break;
          }
          case "map": {
            writer.writeU32(value.size);
            value.forEach((val, key) => {
              serializeField(schema, fieldName, key, fieldType.key, writer);
              serializeField(schema, fieldName, val, fieldType.value, writer);
            });
            break;
          }
          default:
            throw new BorshError(`FieldType ${fieldType} unrecognized`);
        }
      } else {
        serializeStruct(schema, value, writer);
      }
    } catch (error) {
      if (error instanceof BorshError) {
        error.addToFieldPath(fieldName);
      }
      throw error;
    }
  };
  var serializeStruct = function(schema, obj, writer) {
    if (typeof obj.borshSerialize === "function") {
      obj.borshSerialize(writer);
      return;
    }
    const structSchema = schema.get(obj.constructor);
    if (!structSchema) {
      throw new BorshError(`Class ${obj.constructor.name} is missing in schema`);
    }
    if (structSchema.kind === "struct") {
      structSchema.fields.map(([fieldName, fieldType]) => {
        serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
      });
    } else if (structSchema.kind === "enum") {
      const name = obj[structSchema.field];
      for (let idx = 0;idx < structSchema.values.length; ++idx) {
        const [fieldName, fieldType] = structSchema.values[idx];
        if (fieldName === name) {
          writer.writeU8(idx);
          serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
          break;
        }
      }
    } else {
      throw new BorshError(`Unexpected schema kind: ${structSchema.kind} for ${obj.constructor.name}`);
    }
  };
  var serialize = function(schema, obj, Writer = BinaryWriter) {
    const writer = new Writer;
    serializeStruct(schema, obj, writer);
    return writer.toArray();
  };
  var deserializeField = function(schema, fieldName, fieldType, reader) {
    try {
      if (typeof fieldType === "string") {
        return reader[`read${capitalizeFirstLetter(fieldType)}`]();
      }
      if (fieldType instanceof Array) {
        if (typeof fieldType[0] === "number") {
          return reader.readFixedArray(fieldType[0]);
        } else if (typeof fieldType[1] === "number") {
          const arr = [];
          for (let i = 0;i < fieldType[1]; i++) {
            arr.push(deserializeField(schema, null, fieldType[0], reader));
          }
          return arr;
        } else {
          return reader.readArray(() => deserializeField(schema, fieldName, fieldType[0], reader));
        }
      }
      if (fieldType.kind === "option") {
        const option = reader.readU8();
        if (option) {
          return deserializeField(schema, fieldName, fieldType.type, reader);
        }
        return;
      }
      if (fieldType.kind === "map") {
        let map = new Map;
        const length = reader.readU32();
        for (let i = 0;i < length; i++) {
          const key = deserializeField(schema, fieldName, fieldType.key, reader);
          const val = deserializeField(schema, fieldName, fieldType.value, reader);
          map.set(key, val);
        }
        return map;
      }
      return deserializeStruct(schema, fieldType, reader);
    } catch (error) {
      if (error instanceof BorshError) {
        error.addToFieldPath(fieldName);
      }
      throw error;
    }
  };
  var deserializeStruct = function(schema, classType, reader) {
    if (typeof classType.borshDeserialize === "function") {
      return classType.borshDeserialize(reader);
    }
    const structSchema = schema.get(classType);
    if (!structSchema) {
      throw new BorshError(`Class ${classType.name} is missing in schema`);
    }
    if (structSchema.kind === "struct") {
      const result = {};
      for (const [fieldName, fieldType] of schema.get(classType).fields) {
        result[fieldName] = deserializeField(schema, fieldName, fieldType, reader);
      }
      return new classType(result);
    }
    if (structSchema.kind === "enum") {
      const idx = reader.readU8();
      if (idx >= structSchema.values.length) {
        throw new BorshError(`Enum index: ${idx} is out of range`);
      }
      const [fieldName, fieldType] = structSchema.values[idx];
      const fieldValue = deserializeField(schema, fieldName, fieldType, reader);
      return new classType({ [fieldName]: fieldValue });
    }
    throw new BorshError(`Unexpected schema kind: ${structSchema.kind} for ${classType.constructor.name}`);
  };
  var deserialize = function(schema, classType, buffer, Reader = BinaryReader) {
    const reader = new Reader(buffer);
    const result = deserializeStruct(schema, classType, reader);
    if (reader.offset < buffer.length) {
      throw new BorshError(`Unexpected ${buffer.length - reader.offset} bytes after deserialized data`);
    }
    return result;
  };
  var deserializeUnchecked = function(schema, classType, buffer, Reader = BinaryReader) {
    const reader = new Reader(buffer);
    return deserializeStruct(schema, classType, reader);
  };
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() {
      return m[k];
    } });
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __decorate = exports && exports.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1;i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __importStar = exports && exports.__importStar || function(mod2) {
    if (mod2 && mod2.__esModule)
      return mod2;
    var result = {};
    if (mod2 != null) {
      for (var k in mod2)
        if (k !== "default" && Object.hasOwnProperty.call(mod2, k))
          __createBinding(result, mod2, k);
    }
    __setModuleDefault(result, mod2);
    return result;
  };
  var __importDefault = exports && exports.__importDefault || function(mod2) {
    return mod2 && mod2.__esModule ? mod2 : { default: mod2 };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.deserializeUnchecked = exports.deserialize = exports.serialize = exports.BinaryReader = exports.BinaryWriter = exports.BorshError = exports.baseDecode = exports.baseEncode = undefined;
  var bn_js_1 = __importDefault(require_bn());
  var bs58_1 = __importDefault(require_bs58());
  var encoding = __importStar(require_encoding_lib());
  var ResolvedTextDecoder = typeof TextDecoder !== "function" ? encoding.TextDecoder : TextDecoder;
  var textDecoder = new ResolvedTextDecoder("utf-8", { fatal: true });
  exports.baseEncode = baseEncode;
  exports.baseDecode = baseDecode;
  var INITIAL_LENGTH = 1024;

  class BorshError extends Error {
    constructor(message) {
      super(message);
      this.fieldPath = [];
      this.originalMessage = message;
    }
    addToFieldPath(fieldName) {
      this.fieldPath.splice(0, 0, fieldName);
      this.message = this.originalMessage + ": " + this.fieldPath.join(".");
    }
  }
  exports.BorshError = BorshError;

  class BinaryWriter {
    constructor() {
      this.buf = Buffer.alloc(INITIAL_LENGTH);
      this.length = 0;
    }
    maybeResize() {
      if (this.buf.length < 16 + this.length) {
        this.buf = Buffer.concat([this.buf, Buffer.alloc(INITIAL_LENGTH)]);
      }
    }
    writeU8(value) {
      this.maybeResize();
      this.buf.writeUInt8(value, this.length);
      this.length += 1;
    }
    writeU16(value) {
      this.maybeResize();
      this.buf.writeUInt16LE(value, this.length);
      this.length += 2;
    }
    writeU32(value) {
      this.maybeResize();
      this.buf.writeUInt32LE(value, this.length);
      this.length += 4;
    }
    writeU64(value) {
      this.maybeResize();
      this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray("le", 8)));
    }
    writeU128(value) {
      this.maybeResize();
      this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray("le", 16)));
    }
    writeU256(value) {
      this.maybeResize();
      this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray("le", 32)));
    }
    writeU512(value) {
      this.maybeResize();
      this.writeBuffer(Buffer.from(new bn_js_1.default(value).toArray("le", 64)));
    }
    writeBuffer(buffer) {
      this.buf = Buffer.concat([
        Buffer.from(this.buf.subarray(0, this.length)),
        buffer,
        Buffer.alloc(INITIAL_LENGTH)
      ]);
      this.length += buffer.length;
    }
    writeString(str) {
      this.maybeResize();
      const b = Buffer.from(str, "utf8");
      this.writeU32(b.length);
      this.writeBuffer(b);
    }
    writeFixedArray(array) {
      this.writeBuffer(Buffer.from(array));
    }
    writeArray(array, fn) {
      this.maybeResize();
      this.writeU32(array.length);
      for (const elem of array) {
        this.maybeResize();
        fn(elem);
      }
    }
    toArray() {
      return this.buf.subarray(0, this.length);
    }
  }
  exports.BinaryWriter = BinaryWriter;

  class BinaryReader {
    constructor(buf) {
      this.buf = buf;
      this.offset = 0;
    }
    readU8() {
      const value = this.buf.readUInt8(this.offset);
      this.offset += 1;
      return value;
    }
    readU16() {
      const value = this.buf.readUInt16LE(this.offset);
      this.offset += 2;
      return value;
    }
    readU32() {
      const value = this.buf.readUInt32LE(this.offset);
      this.offset += 4;
      return value;
    }
    readU64() {
      const buf = this.readBuffer(8);
      return new bn_js_1.default(buf, "le");
    }
    readU128() {
      const buf = this.readBuffer(16);
      return new bn_js_1.default(buf, "le");
    }
    readU256() {
      const buf = this.readBuffer(32);
      return new bn_js_1.default(buf, "le");
    }
    readU512() {
      const buf = this.readBuffer(64);
      return new bn_js_1.default(buf, "le");
    }
    readBuffer(len) {
      if (this.offset + len > this.buf.length) {
        throw new BorshError(`Expected buffer length ${len} isn't within bounds`);
      }
      const result = this.buf.slice(this.offset, this.offset + len);
      this.offset += len;
      return result;
    }
    readString() {
      const len = this.readU32();
      const buf = this.readBuffer(len);
      try {
        return textDecoder.decode(buf);
      } catch (e) {
        throw new BorshError(`Error decoding UTF-8 string: ${e}`);
      }
    }
    readFixedArray(len) {
      return new Uint8Array(this.readBuffer(len));
    }
    readArray(fn) {
      const len = this.readU32();
      const result = Array();
      for (let i = 0;i < len; ++i) {
        result.push(fn());
      }
      return result;
    }
  }
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readU8", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readU16", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readU32", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readU64", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readU128", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readU256", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readU512", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readString", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readFixedArray", null);
  __decorate([
    handlingRangeError
  ], BinaryReader.prototype, "readArray", null);
  exports.BinaryReader = BinaryReader;
  exports.serialize = serialize;
  exports.deserialize = deserialize;
  exports.deserializeUnchecked = deserializeUnchecked;
});

// node_modules/@solana/buffer-layout/lib/Layout.js
var require_Layout = __commonJS((exports) => {
  var checkUint8Array = function(b) {
    if (!(b instanceof Uint8Array)) {
      throw new TypeError("b must be a Uint8Array");
    }
  };
  var uint8ArrayToBuffer = function(b) {
    checkUint8Array(b);
    return buffer_1.Buffer.from(b.buffer, b.byteOffset, b.length);
  };
  var nameWithProperty = function(name, lo) {
    if (lo.property) {
      return name + "[" + lo.property + "]";
    }
    return name;
  };
  var bindConstructorLayout = function(Class, layout) {
    if (typeof Class !== "function") {
      throw new TypeError("Class must be constructor");
    }
    if (Object.prototype.hasOwnProperty.call(Class, "layout_")) {
      throw new Error("Class is already bound to a layout");
    }
    if (!(layout && layout instanceof Layout)) {
      throw new TypeError("layout must be a Layout");
    }
    if (Object.prototype.hasOwnProperty.call(layout, "boundConstructor_")) {
      throw new Error("layout is already bound to a constructor");
    }
    Class.layout_ = layout;
    layout.boundConstructor_ = Class;
    layout.makeDestinationObject = () => new Class;
    Object.defineProperty(Class.prototype, "encode", {
      value(b, offset) {
        return layout.encode(this, b, offset);
      },
      writable: true
    });
    Object.defineProperty(Class, "decode", {
      value(b, offset) {
        return layout.decode(b, offset);
      },
      writable: true
    });
  };
  var divmodInt64 = function(src) {
    const hi32 = Math.floor(src / V2E32);
    const lo32 = src - hi32 * V2E32;
    return { hi32, lo32 };
  };
  var roundedInt64 = function(hi32, lo32) {
    return hi32 * V2E32 + lo32;
  };
  var fixBitwiseResult = function(v) {
    if (0 > v) {
      v += 4294967296;
    }
    return v;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.s16 = exports.s8 = exports.nu64be = exports.u48be = exports.u40be = exports.u32be = exports.u24be = exports.u16be = exports.nu64 = exports.u48 = exports.u40 = exports.u32 = exports.u24 = exports.u16 = exports.u8 = exports.offset = exports.greedy = exports.Constant = exports.UTF8 = exports.CString = exports.Blob = exports.Boolean = exports.BitField = exports.BitStructure = exports.VariantLayout = exports.Union = exports.UnionLayoutDiscriminator = exports.UnionDiscriminator = exports.Structure = exports.Sequence = exports.DoubleBE = exports.Double = exports.FloatBE = exports.Float = exports.NearInt64BE = exports.NearInt64 = exports.NearUInt64BE = exports.NearUInt64 = exports.IntBE = exports.Int = exports.UIntBE = exports.UInt = exports.OffsetLayout = exports.GreedyCount = exports.ExternalLayout = exports.bindConstructorLayout = exports.nameWithProperty = exports.Layout = exports.uint8ArrayToBuffer = exports.checkUint8Array = undefined;
  exports.constant = exports.utf8 = exports.cstr = exports.blob = exports.unionLayoutDiscriminator = exports.union = exports.seq = exports.bits = exports.struct = exports.f64be = exports.f64 = exports.f32be = exports.f32 = exports.ns64be = exports.s48be = exports.s40be = exports.s32be = exports.s24be = exports.s16be = exports.ns64 = exports.s48 = exports.s40 = exports.s32 = exports.s24 = undefined;
  var buffer_1 = import.meta.require("buffer");
  exports.checkUint8Array = checkUint8Array;
  exports.uint8ArrayToBuffer = uint8ArrayToBuffer;

  class Layout {
    constructor(span, property) {
      if (!Number.isInteger(span)) {
        throw new TypeError("span must be an integer");
      }
      this.span = span;
      this.property = property;
    }
    makeDestinationObject() {
      return {};
    }
    getSpan(b, offset) {
      if (0 > this.span) {
        throw new RangeError("indeterminate span");
      }
      return this.span;
    }
    replicate(property) {
      const rv = Object.create(this.constructor.prototype);
      Object.assign(rv, this);
      rv.property = property;
      return rv;
    }
    fromArray(values) {
      return;
    }
  }
  exports.Layout = Layout;
  exports.nameWithProperty = nameWithProperty;
  exports.bindConstructorLayout = bindConstructorLayout;

  class ExternalLayout extends Layout {
    isCount() {
      throw new Error("ExternalLayout is abstract");
    }
  }
  exports.ExternalLayout = ExternalLayout;

  class GreedyCount extends ExternalLayout {
    constructor(elementSpan = 1, property) {
      if (!Number.isInteger(elementSpan) || 0 >= elementSpan) {
        throw new TypeError("elementSpan must be a (positive) integer");
      }
      super(-1, property);
      this.elementSpan = elementSpan;
    }
    isCount() {
      return true;
    }
    decode(b, offset = 0) {
      checkUint8Array(b);
      const rem = b.length - offset;
      return Math.floor(rem / this.elementSpan);
    }
    encode(src, b, offset) {
      return 0;
    }
  }
  exports.GreedyCount = GreedyCount;

  class OffsetLayout extends ExternalLayout {
    constructor(layout, offset = 0, property) {
      if (!(layout instanceof Layout)) {
        throw new TypeError("layout must be a Layout");
      }
      if (!Number.isInteger(offset)) {
        throw new TypeError("offset must be integer or undefined");
      }
      super(layout.span, property || layout.property);
      this.layout = layout;
      this.offset = offset;
    }
    isCount() {
      return this.layout instanceof UInt || this.layout instanceof UIntBE;
    }
    decode(b, offset = 0) {
      return this.layout.decode(b, offset + this.offset);
    }
    encode(src, b, offset = 0) {
      return this.layout.encode(src, b, offset + this.offset);
    }
  }
  exports.OffsetLayout = OffsetLayout;

  class UInt extends Layout {
    constructor(span, property) {
      super(span, property);
      if (6 < this.span) {
        throw new RangeError("span must not exceed 6 bytes");
      }
    }
    decode(b, offset = 0) {
      return uint8ArrayToBuffer(b).readUIntLE(offset, this.span);
    }
    encode(src, b, offset = 0) {
      uint8ArrayToBuffer(b).writeUIntLE(src, offset, this.span);
      return this.span;
    }
  }
  exports.UInt = UInt;

  class UIntBE extends Layout {
    constructor(span, property) {
      super(span, property);
      if (6 < this.span) {
        throw new RangeError("span must not exceed 6 bytes");
      }
    }
    decode(b, offset = 0) {
      return uint8ArrayToBuffer(b).readUIntBE(offset, this.span);
    }
    encode(src, b, offset = 0) {
      uint8ArrayToBuffer(b).writeUIntBE(src, offset, this.span);
      return this.span;
    }
  }
  exports.UIntBE = UIntBE;

  class Int extends Layout {
    constructor(span, property) {
      super(span, property);
      if (6 < this.span) {
        throw new RangeError("span must not exceed 6 bytes");
      }
    }
    decode(b, offset = 0) {
      return uint8ArrayToBuffer(b).readIntLE(offset, this.span);
    }
    encode(src, b, offset = 0) {
      uint8ArrayToBuffer(b).writeIntLE(src, offset, this.span);
      return this.span;
    }
  }
  exports.Int = Int;

  class IntBE extends Layout {
    constructor(span, property) {
      super(span, property);
      if (6 < this.span) {
        throw new RangeError("span must not exceed 6 bytes");
      }
    }
    decode(b, offset = 0) {
      return uint8ArrayToBuffer(b).readIntBE(offset, this.span);
    }
    encode(src, b, offset = 0) {
      uint8ArrayToBuffer(b).writeIntBE(src, offset, this.span);
      return this.span;
    }
  }
  exports.IntBE = IntBE;
  var V2E32 = Math.pow(2, 32);

  class NearUInt64 extends Layout {
    constructor(property) {
      super(8, property);
    }
    decode(b, offset = 0) {
      const buffer = uint8ArrayToBuffer(b);
      const lo32 = buffer.readUInt32LE(offset);
      const hi32 = buffer.readUInt32LE(offset + 4);
      return roundedInt64(hi32, lo32);
    }
    encode(src, b, offset = 0) {
      const split2 = divmodInt64(src);
      const buffer = uint8ArrayToBuffer(b);
      buffer.writeUInt32LE(split2.lo32, offset);
      buffer.writeUInt32LE(split2.hi32, offset + 4);
      return 8;
    }
  }
  exports.NearUInt64 = NearUInt64;

  class NearUInt64BE extends Layout {
    constructor(property) {
      super(8, property);
    }
    decode(b, offset = 0) {
      const buffer = uint8ArrayToBuffer(b);
      const hi32 = buffer.readUInt32BE(offset);
      const lo32 = buffer.readUInt32BE(offset + 4);
      return roundedInt64(hi32, lo32);
    }
    encode(src, b, offset = 0) {
      const split2 = divmodInt64(src);
      const buffer = uint8ArrayToBuffer(b);
      buffer.writeUInt32BE(split2.hi32, offset);
      buffer.writeUInt32BE(split2.lo32, offset + 4);
      return 8;
    }
  }
  exports.NearUInt64BE = NearUInt64BE;

  class NearInt64 extends Layout {
    constructor(property) {
      super(8, property);
    }
    decode(b, offset = 0) {
      const buffer = uint8ArrayToBuffer(b);
      const lo32 = buffer.readUInt32LE(offset);
      const hi32 = buffer.readInt32LE(offset + 4);
      return roundedInt64(hi32, lo32);
    }
    encode(src, b, offset = 0) {
      const split2 = divmodInt64(src);
      const buffer = uint8ArrayToBuffer(b);
      buffer.writeUInt32LE(split2.lo32, offset);
      buffer.writeInt32LE(split2.hi32, offset + 4);
      return 8;
    }
  }
  exports.NearInt64 = NearInt64;

  class NearInt64BE extends Layout {
    constructor(property) {
      super(8, property);
    }
    decode(b, offset = 0) {
      const buffer = uint8ArrayToBuffer(b);
      const hi32 = buffer.readInt32BE(offset);
      const lo32 = buffer.readUInt32BE(offset + 4);
      return roundedInt64(hi32, lo32);
    }
    encode(src, b, offset = 0) {
      const split2 = divmodInt64(src);
      const buffer = uint8ArrayToBuffer(b);
      buffer.writeInt32BE(split2.hi32, offset);
      buffer.writeUInt32BE(split2.lo32, offset + 4);
      return 8;
    }
  }
  exports.NearInt64BE = NearInt64BE;

  class Float extends Layout {
    constructor(property) {
      super(4, property);
    }
    decode(b, offset = 0) {
      return uint8ArrayToBuffer(b).readFloatLE(offset);
    }
    encode(src, b, offset = 0) {
      uint8ArrayToBuffer(b).writeFloatLE(src, offset);
      return 4;
    }
  }
  exports.Float = Float;

  class FloatBE extends Layout {
    constructor(property) {
      super(4, property);
    }
    decode(b, offset = 0) {
      return uint8ArrayToBuffer(b).readFloatBE(offset);
    }
    encode(src, b, offset = 0) {
      uint8ArrayToBuffer(b).writeFloatBE(src, offset);
      return 4;
    }
  }
  exports.FloatBE = FloatBE;

  class Double extends Layout {
    constructor(property) {
      super(8, property);
    }
    decode(b, offset = 0) {
      return uint8ArrayToBuffer(b).readDoubleLE(offset);
    }
    encode(src, b, offset = 0) {
      uint8ArrayToBuffer(b).writeDoubleLE(src, offset);
      return 8;
    }
  }
  exports.Double = Double;

  class DoubleBE extends Layout {
    constructor(property) {
      super(8, property);
    }
    decode(b, offset = 0) {
      return uint8ArrayToBuffer(b).readDoubleBE(offset);
    }
    encode(src, b, offset = 0) {
      uint8ArrayToBuffer(b).writeDoubleBE(src, offset);
      return 8;
    }
  }
  exports.DoubleBE = DoubleBE;

  class Sequence extends Layout {
    constructor(elementLayout, count, property) {
      if (!(elementLayout instanceof Layout)) {
        throw new TypeError("elementLayout must be a Layout");
      }
      if (!(count instanceof ExternalLayout && count.isCount() || Number.isInteger(count) && 0 <= count)) {
        throw new TypeError("count must be non-negative integer or an unsigned integer ExternalLayout");
      }
      let span = -1;
      if (!(count instanceof ExternalLayout) && 0 < elementLayout.span) {
        span = count * elementLayout.span;
      }
      super(span, property);
      this.elementLayout = elementLayout;
      this.count = count;
    }
    getSpan(b, offset = 0) {
      if (0 <= this.span) {
        return this.span;
      }
      let span = 0;
      let count = this.count;
      if (count instanceof ExternalLayout) {
        count = count.decode(b, offset);
      }
      if (0 < this.elementLayout.span) {
        span = count * this.elementLayout.span;
      } else {
        let idx = 0;
        while (idx < count) {
          span += this.elementLayout.getSpan(b, offset + span);
          ++idx;
        }
      }
      return span;
    }
    decode(b, offset = 0) {
      const rv = [];
      let i = 0;
      let count = this.count;
      if (count instanceof ExternalLayout) {
        count = count.decode(b, offset);
      }
      while (i < count) {
        rv.push(this.elementLayout.decode(b, offset));
        offset += this.elementLayout.getSpan(b, offset);
        i += 1;
      }
      return rv;
    }
    encode(src, b, offset = 0) {
      const elo = this.elementLayout;
      const span = src.reduce((span2, v) => {
        return span2 + elo.encode(v, b, offset + span2);
      }, 0);
      if (this.count instanceof ExternalLayout) {
        this.count.encode(src.length, b, offset);
      }
      return span;
    }
  }
  exports.Sequence = Sequence;

  class Structure extends Layout {
    constructor(fields, property, decodePrefixes) {
      if (!(Array.isArray(fields) && fields.reduce((acc, v) => acc && v instanceof Layout, true))) {
        throw new TypeError("fields must be array of Layout instances");
      }
      if (typeof property === "boolean" && decodePrefixes === undefined) {
        decodePrefixes = property;
        property = undefined;
      }
      for (const fd of fields) {
        if (0 > fd.span && fd.property === undefined) {
          throw new Error("fields cannot contain unnamed variable-length layout");
        }
      }
      let span = -1;
      try {
        span = fields.reduce((span2, fd) => span2 + fd.getSpan(), 0);
      } catch (e) {
      }
      super(span, property);
      this.fields = fields;
      this.decodePrefixes = !!decodePrefixes;
    }
    getSpan(b, offset = 0) {
      if (0 <= this.span) {
        return this.span;
      }
      let span = 0;
      try {
        span = this.fields.reduce((span2, fd) => {
          const fsp = fd.getSpan(b, offset);
          offset += fsp;
          return span2 + fsp;
        }, 0);
      } catch (e) {
        throw new RangeError("indeterminate span");
      }
      return span;
    }
    decode(b, offset = 0) {
      checkUint8Array(b);
      const dest = this.makeDestinationObject();
      for (const fd of this.fields) {
        if (fd.property !== undefined) {
          dest[fd.property] = fd.decode(b, offset);
        }
        offset += fd.getSpan(b, offset);
        if (this.decodePrefixes && b.length === offset) {
          break;
        }
      }
      return dest;
    }
    encode(src, b, offset = 0) {
      const firstOffset = offset;
      let lastOffset = 0;
      let lastWrote = 0;
      for (const fd of this.fields) {
        let span = fd.span;
        lastWrote = 0 < span ? span : 0;
        if (fd.property !== undefined) {
          const fv = src[fd.property];
          if (fv !== undefined) {
            lastWrote = fd.encode(fv, b, offset);
            if (0 > span) {
              span = fd.getSpan(b, offset);
            }
          }
        }
        lastOffset = offset;
        offset += span;
      }
      return lastOffset + lastWrote - firstOffset;
    }
    fromArray(values) {
      const dest = this.makeDestinationObject();
      for (const fd of this.fields) {
        if (fd.property !== undefined && 0 < values.length) {
          dest[fd.property] = values.shift();
        }
      }
      return dest;
    }
    layoutFor(property) {
      if (typeof property !== "string") {
        throw new TypeError("property must be string");
      }
      for (const fd of this.fields) {
        if (fd.property === property) {
          return fd;
        }
      }
      return;
    }
    offsetOf(property) {
      if (typeof property !== "string") {
        throw new TypeError("property must be string");
      }
      let offset = 0;
      for (const fd of this.fields) {
        if (fd.property === property) {
          return offset;
        }
        if (0 > fd.span) {
          offset = -1;
        } else if (0 <= offset) {
          offset += fd.span;
        }
      }
      return;
    }
  }
  exports.Structure = Structure;

  class UnionDiscriminator {
    constructor(property) {
      this.property = property;
    }
    decode(b, offset) {
      throw new Error("UnionDiscriminator is abstract");
    }
    encode(src, b, offset) {
      throw new Error("UnionDiscriminator is abstract");
    }
  }
  exports.UnionDiscriminator = UnionDiscriminator;

  class UnionLayoutDiscriminator extends UnionDiscriminator {
    constructor(layout, property) {
      if (!(layout instanceof ExternalLayout && layout.isCount())) {
        throw new TypeError("layout must be an unsigned integer ExternalLayout");
      }
      super(property || layout.property || "variant");
      this.layout = layout;
    }
    decode(b, offset) {
      return this.layout.decode(b, offset);
    }
    encode(src, b, offset) {
      return this.layout.encode(src, b, offset);
    }
  }
  exports.UnionLayoutDiscriminator = UnionLayoutDiscriminator;

  class Union extends Layout {
    constructor(discr, defaultLayout, property) {
      let discriminator;
      if (discr instanceof UInt || discr instanceof UIntBE) {
        discriminator = new UnionLayoutDiscriminator(new OffsetLayout(discr));
      } else if (discr instanceof ExternalLayout && discr.isCount()) {
        discriminator = new UnionLayoutDiscriminator(discr);
      } else if (!(discr instanceof UnionDiscriminator)) {
        throw new TypeError("discr must be a UnionDiscriminator or an unsigned integer layout");
      } else {
        discriminator = discr;
      }
      if (defaultLayout === undefined) {
        defaultLayout = null;
      }
      if (!(defaultLayout === null || defaultLayout instanceof Layout)) {
        throw new TypeError("defaultLayout must be null or a Layout");
      }
      if (defaultLayout !== null) {
        if (0 > defaultLayout.span) {
          throw new Error("defaultLayout must have constant span");
        }
        if (defaultLayout.property === undefined) {
          defaultLayout = defaultLayout.replicate("content");
        }
      }
      let span = -1;
      if (defaultLayout) {
        span = defaultLayout.span;
        if (0 <= span && (discr instanceof UInt || discr instanceof UIntBE)) {
          span += discriminator.layout.span;
        }
      }
      super(span, property);
      this.discriminator = discriminator;
      this.usesPrefixDiscriminator = discr instanceof UInt || discr instanceof UIntBE;
      this.defaultLayout = defaultLayout;
      this.registry = {};
      let boundGetSourceVariant = this.defaultGetSourceVariant.bind(this);
      this.getSourceVariant = function(src) {
        return boundGetSourceVariant(src);
      };
      this.configGetSourceVariant = function(gsv) {
        boundGetSourceVariant = gsv.bind(this);
      };
    }
    getSpan(b, offset = 0) {
      if (0 <= this.span) {
        return this.span;
      }
      const vlo = this.getVariant(b, offset);
      if (!vlo) {
        throw new Error("unable to determine span for unrecognized variant");
      }
      return vlo.getSpan(b, offset);
    }
    defaultGetSourceVariant(src) {
      if (Object.prototype.hasOwnProperty.call(src, this.discriminator.property)) {
        if (this.defaultLayout && this.defaultLayout.property && Object.prototype.hasOwnProperty.call(src, this.defaultLayout.property)) {
          return;
        }
        const vlo = this.registry[src[this.discriminator.property]];
        if (vlo && (!vlo.layout || vlo.property && Object.prototype.hasOwnProperty.call(src, vlo.property))) {
          return vlo;
        }
      } else {
        for (const tag in this.registry) {
          const vlo = this.registry[tag];
          if (vlo.property && Object.prototype.hasOwnProperty.call(src, vlo.property)) {
            return vlo;
          }
        }
      }
      throw new Error("unable to infer src variant");
    }
    decode(b, offset = 0) {
      let dest;
      const dlo = this.discriminator;
      const discr = dlo.decode(b, offset);
      const clo = this.registry[discr];
      if (clo === undefined) {
        const defaultLayout = this.defaultLayout;
        let contentOffset = 0;
        if (this.usesPrefixDiscriminator) {
          contentOffset = dlo.layout.span;
        }
        dest = this.makeDestinationObject();
        dest[dlo.property] = discr;
        dest[defaultLayout.property] = defaultLayout.decode(b, offset + contentOffset);
      } else {
        dest = clo.decode(b, offset);
      }
      return dest;
    }
    encode(src, b, offset = 0) {
      const vlo = this.getSourceVariant(src);
      if (vlo === undefined) {
        const dlo = this.discriminator;
        const clo = this.defaultLayout;
        let contentOffset = 0;
        if (this.usesPrefixDiscriminator) {
          contentOffset = dlo.layout.span;
        }
        dlo.encode(src[dlo.property], b, offset);
        return contentOffset + clo.encode(src[clo.property], b, offset + contentOffset);
      }
      return vlo.encode(src, b, offset);
    }
    addVariant(variant, layout, property) {
      const rv = new VariantLayout(this, variant, layout, property);
      this.registry[variant] = rv;
      return rv;
    }
    getVariant(vb, offset = 0) {
      let variant;
      if (vb instanceof Uint8Array) {
        variant = this.discriminator.decode(vb, offset);
      } else {
        variant = vb;
      }
      return this.registry[variant];
    }
  }
  exports.Union = Union;

  class VariantLayout extends Layout {
    constructor(union, variant, layout, property) {
      if (!(union instanceof Union)) {
        throw new TypeError("union must be a Union");
      }
      if (!Number.isInteger(variant) || 0 > variant) {
        throw new TypeError("variant must be a (non-negative) integer");
      }
      if (typeof layout === "string" && property === undefined) {
        property = layout;
        layout = null;
      }
      if (layout) {
        if (!(layout instanceof Layout)) {
          throw new TypeError("layout must be a Layout");
        }
        if (union.defaultLayout !== null && 0 <= layout.span && layout.span > union.defaultLayout.span) {
          throw new Error("variant span exceeds span of containing union");
        }
        if (typeof property !== "string") {
          throw new TypeError("variant must have a String property");
        }
      }
      let span = union.span;
      if (0 > union.span) {
        span = layout ? layout.span : 0;
        if (0 <= span && union.usesPrefixDiscriminator) {
          span += union.discriminator.layout.span;
        }
      }
      super(span, property);
      this.union = union;
      this.variant = variant;
      this.layout = layout || null;
    }
    getSpan(b, offset = 0) {
      if (0 <= this.span) {
        return this.span;
      }
      let contentOffset = 0;
      if (this.union.usesPrefixDiscriminator) {
        contentOffset = this.union.discriminator.layout.span;
      }
      let span = 0;
      if (this.layout) {
        span = this.layout.getSpan(b, offset + contentOffset);
      }
      return contentOffset + span;
    }
    decode(b, offset = 0) {
      const dest = this.makeDestinationObject();
      if (this !== this.union.getVariant(b, offset)) {
        throw new Error("variant mismatch");
      }
      let contentOffset = 0;
      if (this.union.usesPrefixDiscriminator) {
        contentOffset = this.union.discriminator.layout.span;
      }
      if (this.layout) {
        dest[this.property] = this.layout.decode(b, offset + contentOffset);
      } else if (this.property) {
        dest[this.property] = true;
      } else if (this.union.usesPrefixDiscriminator) {
        dest[this.union.discriminator.property] = this.variant;
      }
      return dest;
    }
    encode(src, b, offset = 0) {
      let contentOffset = 0;
      if (this.union.usesPrefixDiscriminator) {
        contentOffset = this.union.discriminator.layout.span;
      }
      if (this.layout && !Object.prototype.hasOwnProperty.call(src, this.property)) {
        throw new TypeError("variant lacks property " + this.property);
      }
      this.union.discriminator.encode(this.variant, b, offset);
      let span = contentOffset;
      if (this.layout) {
        this.layout.encode(src[this.property], b, offset + contentOffset);
        span += this.layout.getSpan(b, offset + contentOffset);
        if (0 <= this.union.span && span > this.union.span) {
          throw new Error("encoded variant overruns containing union");
        }
      }
      return span;
    }
    fromArray(values) {
      if (this.layout) {
        return this.layout.fromArray(values);
      }
      return;
    }
  }
  exports.VariantLayout = VariantLayout;

  class BitStructure extends Layout {
    constructor(word, msb, property) {
      if (!(word instanceof UInt || word instanceof UIntBE)) {
        throw new TypeError("word must be a UInt or UIntBE layout");
      }
      if (typeof msb === "string" && property === undefined) {
        property = msb;
        msb = false;
      }
      if (4 < word.span) {
        throw new RangeError("word cannot exceed 32 bits");
      }
      super(word.span, property);
      this.word = word;
      this.msb = !!msb;
      this.fields = [];
      let value = 0;
      this._packedSetValue = function(v) {
        value = fixBitwiseResult(v);
        return this;
      };
      this._packedGetValue = function() {
        return value;
      };
    }
    decode(b, offset = 0) {
      const dest = this.makeDestinationObject();
      const value = this.word.decode(b, offset);
      this._packedSetValue(value);
      for (const fd of this.fields) {
        if (fd.property !== undefined) {
          dest[fd.property] = fd.decode(b);
        }
      }
      return dest;
    }
    encode(src, b, offset = 0) {
      const value = this.word.decode(b, offset);
      this._packedSetValue(value);
      for (const fd of this.fields) {
        if (fd.property !== undefined) {
          const fv = src[fd.property];
          if (fv !== undefined) {
            fd.encode(fv);
          }
        }
      }
      return this.word.encode(this._packedGetValue(), b, offset);
    }
    addField(bits, property) {
      const bf = new BitField(this, bits, property);
      this.fields.push(bf);
      return bf;
    }
    addBoolean(property) {
      const bf = new Boolean2(this, property);
      this.fields.push(bf);
      return bf;
    }
    fieldFor(property) {
      if (typeof property !== "string") {
        throw new TypeError("property must be string");
      }
      for (const fd of this.fields) {
        if (fd.property === property) {
          return fd;
        }
      }
      return;
    }
  }
  exports.BitStructure = BitStructure;

  class BitField {
    constructor(container, bits, property) {
      if (!(container instanceof BitStructure)) {
        throw new TypeError("container must be a BitStructure");
      }
      if (!Number.isInteger(bits) || 0 >= bits) {
        throw new TypeError("bits must be positive integer");
      }
      const totalBits = 8 * container.span;
      const usedBits = container.fields.reduce((sum, fd) => sum + fd.bits, 0);
      if (bits + usedBits > totalBits) {
        throw new Error("bits too long for span remainder (" + (totalBits - usedBits) + " of " + totalBits + " remain)");
      }
      this.container = container;
      this.bits = bits;
      this.valueMask = (1 << bits) - 1;
      if (bits === 32) {
        this.valueMask = 4294967295;
      }
      this.start = usedBits;
      if (this.container.msb) {
        this.start = totalBits - usedBits - bits;
      }
      this.wordMask = fixBitwiseResult(this.valueMask << this.start);
      this.property = property;
    }
    decode(b, offset) {
      const word = this.container._packedGetValue();
      const wordValue = fixBitwiseResult(word & this.wordMask);
      const value = wordValue >>> this.start;
      return value;
    }
    encode(value) {
      if (typeof value !== "number" || !Number.isInteger(value) || value !== fixBitwiseResult(value & this.valueMask)) {
        throw new TypeError(nameWithProperty("BitField.encode", this) + " value must be integer not exceeding " + this.valueMask);
      }
      const word = this.container._packedGetValue();
      const wordValue = fixBitwiseResult(value << this.start);
      this.container._packedSetValue(fixBitwiseResult(word & ~this.wordMask) | wordValue);
    }
  }
  exports.BitField = BitField;

  class Boolean2 extends BitField {
    constructor(container, property) {
      super(container, 1, property);
    }
    decode(b, offset) {
      return !!super.decode(b, offset);
    }
    encode(value) {
      if (typeof value === "boolean") {
        value = +value;
      }
      super.encode(value);
    }
  }
  exports.Boolean = Boolean2;

  class Blob extends Layout {
    constructor(length, property) {
      if (!(length instanceof ExternalLayout && length.isCount() || Number.isInteger(length) && 0 <= length)) {
        throw new TypeError("length must be positive integer or an unsigned integer ExternalLayout");
      }
      let span = -1;
      if (!(length instanceof ExternalLayout)) {
        span = length;
      }
      super(span, property);
      this.length = length;
    }
    getSpan(b, offset) {
      let span = this.span;
      if (0 > span) {
        span = this.length.decode(b, offset);
      }
      return span;
    }
    decode(b, offset = 0) {
      let span = this.span;
      if (0 > span) {
        span = this.length.decode(b, offset);
      }
      return uint8ArrayToBuffer(b).slice(offset, offset + span);
    }
    encode(src, b, offset) {
      let span = this.length;
      if (this.length instanceof ExternalLayout) {
        span = src.length;
      }
      if (!(src instanceof Uint8Array && span === src.length)) {
        throw new TypeError(nameWithProperty("Blob.encode", this) + " requires (length " + span + ") Uint8Array as src");
      }
      if (offset + span > b.length) {
        throw new RangeError("encoding overruns Uint8Array");
      }
      const srcBuffer = uint8ArrayToBuffer(src);
      uint8ArrayToBuffer(b).write(srcBuffer.toString("hex"), offset, span, "hex");
      if (this.length instanceof ExternalLayout) {
        this.length.encode(span, b, offset);
      }
      return span;
    }
  }
  exports.Blob = Blob;

  class CString extends Layout {
    constructor(property) {
      super(-1, property);
    }
    getSpan(b, offset = 0) {
      checkUint8Array(b);
      let idx = offset;
      while (idx < b.length && b[idx] !== 0) {
        idx += 1;
      }
      return 1 + idx - offset;
    }
    decode(b, offset = 0) {
      const span = this.getSpan(b, offset);
      return uint8ArrayToBuffer(b).slice(offset, offset + span - 1).toString("utf-8");
    }
    encode(src, b, offset = 0) {
      if (typeof src !== "string") {
        src = String(src);
      }
      const srcb = buffer_1.Buffer.from(src, "utf8");
      const span = srcb.length;
      if (offset + span > b.length) {
        throw new RangeError("encoding overruns Buffer");
      }
      const buffer = uint8ArrayToBuffer(b);
      srcb.copy(buffer, offset);
      buffer[offset + span] = 0;
      return span + 1;
    }
  }
  exports.CString = CString;

  class UTF8 extends Layout {
    constructor(maxSpan, property) {
      if (typeof maxSpan === "string" && property === undefined) {
        property = maxSpan;
        maxSpan = undefined;
      }
      if (maxSpan === undefined) {
        maxSpan = -1;
      } else if (!Number.isInteger(maxSpan)) {
        throw new TypeError("maxSpan must be an integer");
      }
      super(-1, property);
      this.maxSpan = maxSpan;
    }
    getSpan(b, offset = 0) {
      checkUint8Array(b);
      return b.length - offset;
    }
    decode(b, offset = 0) {
      const span = this.getSpan(b, offset);
      if (0 <= this.maxSpan && this.maxSpan < span) {
        throw new RangeError("text length exceeds maxSpan");
      }
      return uint8ArrayToBuffer(b).slice(offset, offset + span).toString("utf-8");
    }
    encode(src, b, offset = 0) {
      if (typeof src !== "string") {
        src = String(src);
      }
      const srcb = buffer_1.Buffer.from(src, "utf8");
      const span = srcb.length;
      if (0 <= this.maxSpan && this.maxSpan < span) {
        throw new RangeError("text length exceeds maxSpan");
      }
      if (offset + span > b.length) {
        throw new RangeError("encoding overruns Buffer");
      }
      srcb.copy(uint8ArrayToBuffer(b), offset);
      return span;
    }
  }
  exports.UTF8 = UTF8;

  class Constant extends Layout {
    constructor(value, property) {
      super(0, property);
      this.value = value;
    }
    decode(b, offset) {
      return this.value;
    }
    encode(src, b, offset) {
      return 0;
    }
  }
  exports.Constant = Constant;
  exports.greedy = (elementSpan, property) => new GreedyCount(elementSpan, property);
  exports.offset = (layout, offset, property) => new OffsetLayout(layout, offset, property);
  exports.u8 = (property) => new UInt(1, property);
  exports.u16 = (property) => new UInt(2, property);
  exports.u24 = (property) => new UInt(3, property);
  exports.u32 = (property) => new UInt(4, property);
  exports.u40 = (property) => new UInt(5, property);
  exports.u48 = (property) => new UInt(6, property);
  exports.nu64 = (property) => new NearUInt64(property);
  exports.u16be = (property) => new UIntBE(2, property);
  exports.u24be = (property) => new UIntBE(3, property);
  exports.u32be = (property) => new UIntBE(4, property);
  exports.u40be = (property) => new UIntBE(5, property);
  exports.u48be = (property) => new UIntBE(6, property);
  exports.nu64be = (property) => new NearUInt64BE(property);
  exports.s8 = (property) => new Int(1, property);
  exports.s16 = (property) => new Int(2, property);
  exports.s24 = (property) => new Int(3, property);
  exports.s32 = (property) => new Int(4, property);
  exports.s40 = (property) => new Int(5, property);
  exports.s48 = (property) => new Int(6, property);
  exports.ns64 = (property) => new NearInt64(property);
  exports.s16be = (property) => new IntBE(2, property);
  exports.s24be = (property) => new IntBE(3, property);
  exports.s32be = (property) => new IntBE(4, property);
  exports.s40be = (property) => new IntBE(5, property);
  exports.s48be = (property) => new IntBE(6, property);
  exports.ns64be = (property) => new NearInt64BE(property);
  exports.f32 = (property) => new Float(property);
  exports.f32be = (property) => new FloatBE(property);
  exports.f64 = (property) => new Double(property);
  exports.f64be = (property) => new DoubleBE(property);
  exports.struct = (fields, property, decodePrefixes) => new Structure(fields, property, decodePrefixes);
  exports.bits = (word, msb, property) => new BitStructure(word, msb, property);
  exports.seq = (elementLayout, count, property) => new Sequence(elementLayout, count, property);
  exports.union = (discr, defaultLayout, property) => new Union(discr, defaultLayout, property);
  exports.unionLayoutDiscriminator = (layout, property) => new UnionLayoutDiscriminator(layout, property);
  exports.blob = (length, property) => new Blob(length, property);
  exports.cstr = (property) => new CString(property);
  exports.utf8 = (maxSpan, property) => new UTF8(maxSpan, property);
  exports.constant = (value, property) => new Constant(value, property);
});

// node_modules/file-uri-to-path/index.js
var require_file_uri_to_path = __commonJS((exports, module) => {
  var fileUriToPath = function(uri) {
    if (typeof uri != "string" || uri.length <= 7 || uri.substring(0, 7) != "file://") {
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    }
    var rest = decodeURI(uri.substring(7));
    var firstSlash = rest.indexOf("/");
    var host = rest.substring(0, firstSlash);
    var path = rest.substring(firstSlash + 1);
    if (host == "localhost")
      host = "";
    if (host) {
      host = sep + sep + host;
    }
    path = path.replace(/^(.+)\|/, "$1:");
    if (sep == "\\") {
      path = path.replace(/\//g, "\\");
    }
    if (/^.+\:/.test(path)) {
    } else {
      path = sep + path;
    }
    return host + path;
  };
  var sep = import.meta.require("path").sep || "/";
  module.exports = fileUriToPath;
});

// node_modules/bindings/bindings.js
var require_bindings = __commonJS((exports, module) => {
  var bindings = function(opts) {
    if (typeof opts == "string") {
      opts = { bindings: opts };
    } else if (!opts) {
      opts = {};
    }
    Object.keys(defaults).map(function(i2) {
      if (!(i2 in opts))
        opts[i2] = defaults[i2];
    });
    if (!opts.module_root) {
      opts.module_root = exports.getRoot(exports.getFileName());
    }
    if (path.extname(opts.bindings) != ".node") {
      opts.bindings += ".node";
    }
    var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : import.meta.require;
    var tries = [], i = 0, l = opts.try.length, n, b, err;
    for (;i < l; i++) {
      n = join.apply(null, opts.try[i].map(function(p) {
        return opts[p] || p;
      }));
      tries.push(n);
      try {
        b = opts.path ? requireFunc.resolve(n) : requireFunc(n);
        if (!opts.path) {
          b.path = n;
        }
        return b;
      } catch (e) {
        if (e.code !== "MODULE_NOT_FOUND" && e.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(e.message)) {
          throw e;
        }
      }
    }
    err = new Error("Could not locate the bindings file. Tried:\n" + tries.map(function(a) {
      return opts.arrow + a;
    }).join("\n"));
    err.tries = tries;
    throw err;
  };
  var __filename = "/home/laurens/nosana/test/node_modules/bindings/bindings.js";
  var fs = import.meta.require("fs");
  var path = import.meta.require("path");
  var fileURLToPath = require_file_uri_to_path();
  var join = path.join;
  var dirname = path.dirname;
  var exists2 = fs.accessSync && function(path2) {
    try {
      fs.accessSync(path2);
    } catch (e) {
      return false;
    }
    return true;
  } || fs.existsSync || path.existsSync;
  var defaults = {
    arrow: process.env.NODE_BINDINGS_ARROW || " \u2192 ",
    compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
    platform: process.platform,
    arch: process.arch,
    nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
    version: process.versions.node,
    bindings: "bindings.node",
    try: [
      ["module_root", "build", "bindings"],
      ["module_root", "build", "Debug", "bindings"],
      ["module_root", "build", "Release", "bindings"],
      ["module_root", "out", "Debug", "bindings"],
      ["module_root", "Debug", "bindings"],
      ["module_root", "out", "Release", "bindings"],
      ["module_root", "Release", "bindings"],
      ["module_root", "build", "default", "bindings"],
      ["module_root", "compiled", "version", "platform", "arch", "bindings"],
      ["module_root", "addon-build", "release", "install-root", "bindings"],
      ["module_root", "addon-build", "debug", "install-root", "bindings"],
      ["module_root", "addon-build", "default", "install-root", "bindings"],
      ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
    ]
  };
  module.exports = exports = bindings;
  exports.getFileName = function getFileName(calling_file) {
    var { prepareStackTrace: origPST, stackTraceLimit: origSTL } = Error, dummy = {}, fileName;
    Error.stackTraceLimit = 10;
    Error.prepareStackTrace = function(e, st) {
      for (var i = 0, l = st.length;i < l; i++) {
        fileName = st[i].getFileName();
        if (fileName !== __filename) {
          if (calling_file) {
            if (fileName !== calling_file) {
              return;
            }
          } else {
            return;
          }
        }
      }
    };
    Error.captureStackTrace(dummy);
    dummy.stack;
    Error.prepareStackTrace = origPST;
    Error.stackTraceLimit = origSTL;
    var fileSchema = "file://";
    if (fileName.indexOf(fileSchema) === 0) {
      fileName = fileURLToPath(fileName);
    }
    return fileName;
  };
  exports.getRoot = function getRoot(file) {
    var dir = dirname(file), prev;
    while (true) {
      if (dir === ".") {
        dir = process.cwd();
      }
      if (exists2(join(dir, "package.json")) || exists2(join(dir, "node_modules"))) {
        return dir;
      }
      if (prev === dir) {
        throw new Error('Could not find module root given file: "' + file + '". Do you have a `package.json` file? ');
      }
      prev = dir;
      dir = join(dir, "..");
    }
  };
});

// node_modules/bigint-buffer/dist/node.js
var require_node = __commonJS((exports) => {
  var toBigIntLE = function(buf) {
    if (converter === undefined) {
      const reversed = Buffer.from(buf);
      reversed.reverse();
      const hex = reversed.toString("hex");
      if (hex.length === 0) {
        return BigInt(0);
      }
      return BigInt(`0x${hex}`);
    }
    return converter.toBigInt(buf, false);
  };
  var toBigIntBE = function(buf) {
    if (converter === undefined) {
      const hex = buf.toString("hex");
      if (hex.length === 0) {
        return BigInt(0);
      }
      return BigInt(`0x${hex}`);
    }
    return converter.toBigInt(buf, true);
  };
  var toBufferLE = function(num, width) {
    if (converter === undefined) {
      const hex = num.toString(16);
      const buffer = Buffer.from(hex.padStart(width * 2, "0").slice(0, width * 2), "hex");
      buffer.reverse();
      return buffer;
    }
    return converter.fromBigInt(num, Buffer.allocUnsafe(width), false);
  };
  var toBufferBE = function(num, width) {
    if (converter === undefined) {
      const hex = num.toString(16);
      return Buffer.from(hex.padStart(width * 2, "0").slice(0, width * 2), "hex");
    }
    return converter.fromBigInt(num, Buffer.allocUnsafe(width), true);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var converter;
  {
    try {
      converter = require_bindings()("bigint_buffer");
    } catch (e) {
      console.warn("bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)");
    }
  }
  exports.toBigIntLE = toBigIntLE;
  exports.toBigIntBE = toBigIntBE;
  exports.toBufferLE = toBufferLE;
  exports.toBufferBE = toBufferBE;
});

// node_modules/uuid/dist/rng.js
var require_rng = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var rng = function() {
    if (poolPtr > rnds8Pool.length - 16) {
      _crypto.default.randomFillSync(rnds8Pool);
      poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = rng;
  var _crypto = _interopRequireDefault(import.meta.require("crypto"));
  var rnds8Pool = new Uint8Array(256);
  var poolPtr = rnds8Pool.length;
});

// node_modules/uuid/dist/regex.js
var require_regex = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  exports.default = _default;
});

// node_modules/uuid/dist/validate.js
var require_validate = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var validate2 = function(uuid) {
    return typeof uuid === "string" && _regex.default.test(uuid);
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _regex = _interopRequireDefault(require_regex());
  var _default = validate2;
  exports.default = _default;
});

// node_modules/uuid/dist/stringify.js
var require_stringify = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var stringify = function(arr, offset = 0) {
    const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _validate = _interopRequireDefault(require_validate());
  var byteToHex = [];
  for (let i = 0;i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).substr(1));
  }
  var _default = stringify;
  exports.default = _default;
});

// node_modules/uuid/dist/v1.js
var require_v1 = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var v1 = function(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node || _nodeId;
    let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
    if (node == null || clockseq == null) {
      const seedBytes = options.random || (options.rng || _rng.default)();
      if (node == null) {
        node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
      }
      if (clockseq == null) {
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
      }
    }
    let msecs = options.msecs !== undefined ? options.msecs : Date.now();
    let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
    if (dt < 0 && options.clockseq === undefined) {
      clockseq = clockseq + 1 & 16383;
    }
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
      nsecs = 0;
    }
    if (nsecs >= 1e4) {
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;
    msecs += 12219292800000;
    const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
    b[i++] = tl >>> 24 & 255;
    b[i++] = tl >>> 16 & 255;
    b[i++] = tl >>> 8 & 255;
    b[i++] = tl & 255;
    const tmh = msecs / 4294967296 * 1e4 & 268435455;
    b[i++] = tmh >>> 8 & 255;
    b[i++] = tmh & 255;
    b[i++] = tmh >>> 24 & 15 | 16;
    b[i++] = tmh >>> 16 & 255;
    b[i++] = clockseq >>> 8 | 128;
    b[i++] = clockseq & 255;
    for (let n = 0;n < 6; ++n) {
      b[i + n] = node[n];
    }
    return buf || (0, _stringify.default)(b);
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _rng = _interopRequireDefault(require_rng());
  var _stringify = _interopRequireDefault(require_stringify());
  var _nodeId;
  var _clockseq;
  var _lastMSecs = 0;
  var _lastNSecs = 0;
  var _default = v1;
  exports.default = _default;
});

// node_modules/uuid/dist/parse.js
var require_parse = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var parse = function(uuid) {
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Invalid UUID");
    }
    let v;
    const arr = new Uint8Array(16);
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 255;
    arr[2] = v >>> 8 & 255;
    arr[3] = v & 255;
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 255;
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 255;
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 255;
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
    arr[11] = v / 4294967296 & 255;
    arr[12] = v >>> 24 & 255;
    arr[13] = v >>> 16 & 255;
    arr[14] = v >>> 8 & 255;
    arr[15] = v & 255;
    return arr;
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _validate = _interopRequireDefault(require_validate());
  var _default = parse;
  exports.default = _default;
});

// node_modules/uuid/dist/v35.js
var require_v35 = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var stringToBytes = function(str) {
    str = unescape(encodeURIComponent(str));
    const bytes2 = [];
    for (let i = 0;i < str.length; ++i) {
      bytes2.push(str.charCodeAt(i));
    }
    return bytes2;
  };
  var _default = function(name, version, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
      if (typeof value === "string") {
        value = stringToBytes(value);
      }
      if (typeof namespace === "string") {
        namespace = (0, _parse.default)(namespace);
      }
      if (namespace.length !== 16) {
        throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      }
      let bytes2 = new Uint8Array(16 + value.length);
      bytes2.set(namespace);
      bytes2.set(value, namespace.length);
      bytes2 = hashfunc(bytes2);
      bytes2[6] = bytes2[6] & 15 | version;
      bytes2[8] = bytes2[8] & 63 | 128;
      if (buf) {
        offset = offset || 0;
        for (let i = 0;i < 16; ++i) {
          buf[offset + i] = bytes2[i];
        }
        return buf;
      }
      return (0, _stringify.default)(bytes2);
    }
    try {
      generateUUID.name = name;
    } catch (err) {
    }
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _default;
  exports.URL = exports.DNS = undefined;
  var _stringify = _interopRequireDefault(require_stringify());
  var _parse = _interopRequireDefault(require_parse());
  var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  exports.DNS = DNS;
  var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  exports.URL = URL;
});

// node_modules/uuid/dist/md5.js
var require_md5 = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var md5 = function(bytes2) {
    if (Array.isArray(bytes2)) {
      bytes2 = Buffer.from(bytes2);
    } else if (typeof bytes2 === "string") {
      bytes2 = Buffer.from(bytes2, "utf8");
    }
    return _crypto.default.createHash("md5").update(bytes2).digest();
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _crypto = _interopRequireDefault(import.meta.require("crypto"));
  var _default = md5;
  exports.default = _default;
});

// node_modules/uuid/dist/v3.js
var require_v3 = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _v = _interopRequireDefault(require_v35());
  var _md = _interopRequireDefault(require_md5());
  var v3 = (0, _v.default)("v3", 48, _md.default);
  var _default = v3;
  exports.default = _default;
});

// node_modules/uuid/dist/v4.js
var require_v4 = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var v4 = function(options, buf, offset) {
    options = options || {};
    const rnds = options.random || (options.rng || _rng.default)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0;i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return (0, _stringify.default)(rnds);
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _rng = _interopRequireDefault(require_rng());
  var _stringify = _interopRequireDefault(require_stringify());
  var _default = v4;
  exports.default = _default;
});

// node_modules/uuid/dist/sha1.js
var require_sha1 = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var sha1 = function(bytes2) {
    if (Array.isArray(bytes2)) {
      bytes2 = Buffer.from(bytes2);
    } else if (typeof bytes2 === "string") {
      bytes2 = Buffer.from(bytes2, "utf8");
    }
    return _crypto.default.createHash("sha1").update(bytes2).digest();
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _crypto = _interopRequireDefault(import.meta.require("crypto"));
  var _default = sha1;
  exports.default = _default;
});

// node_modules/uuid/dist/v5.js
var require_v5 = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _v = _interopRequireDefault(require_v35());
  var _sha = _interopRequireDefault(require_sha1());
  var v5 = (0, _v.default)("v5", 80, _sha.default);
  var _default = v5;
  exports.default = _default;
});

// node_modules/uuid/dist/nil.js
var require_nil = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _default = "00000000-0000-0000-0000-000000000000";
  exports.default = _default;
});

// node_modules/uuid/dist/version.js
var require_version = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  var version = function(uuid) {
    if (!(0, _validate.default)(uuid)) {
      throw TypeError("Invalid UUID");
    }
    return parseInt(uuid.substr(14, 1), 16);
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _validate = _interopRequireDefault(require_validate());
  var _default = version;
  exports.default = _default;
});

// node_modules/uuid/dist/index.js
var require_dist = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "v1", {
    enumerable: true,
    get: function() {
      return _v.default;
    }
  });
  Object.defineProperty(exports, "v3", {
    enumerable: true,
    get: function() {
      return _v2.default;
    }
  });
  Object.defineProperty(exports, "v4", {
    enumerable: true,
    get: function() {
      return _v3.default;
    }
  });
  Object.defineProperty(exports, "v5", {
    enumerable: true,
    get: function() {
      return _v4.default;
    }
  });
  Object.defineProperty(exports, "NIL", {
    enumerable: true,
    get: function() {
      return _nil.default;
    }
  });
  Object.defineProperty(exports, "version", {
    enumerable: true,
    get: function() {
      return _version.default;
    }
  });
  Object.defineProperty(exports, "validate", {
    enumerable: true,
    get: function() {
      return _validate.default;
    }
  });
  Object.defineProperty(exports, "stringify", {
    enumerable: true,
    get: function() {
      return _stringify.default;
    }
  });
  Object.defineProperty(exports, "parse", {
    enumerable: true,
    get: function() {
      return _parse.default;
    }
  });
  var _v = _interopRequireDefault(require_v1());
  var _v2 = _interopRequireDefault(require_v3());
  var _v3 = _interopRequireDefault(require_v4());
  var _v4 = _interopRequireDefault(require_v5());
  var _nil = _interopRequireDefault(require_nil());
  var _version = _interopRequireDefault(require_version());
  var _validate = _interopRequireDefault(require_validate());
  var _stringify = _interopRequireDefault(require_stringify());
  var _parse = _interopRequireDefault(require_parse());
});

// node_modules/jayson/lib/generateRequest.js
var require_generateRequest = __commonJS((exports, module) => {
  var uuid = require_dist().v4;
  var generateRequest = function(method, params, id, options) {
    if (typeof method !== "string") {
      throw new TypeError(method + " must be a string");
    }
    options = options || {};
    const version = typeof options.version === "number" ? options.version : 2;
    if (version !== 1 && version !== 2) {
      throw new TypeError(version + " must be 1 or 2");
    }
    const request = {
      method
    };
    if (version === 2) {
      request.jsonrpc = "2.0";
    }
    if (params) {
      if (typeof params !== "object" && !Array.isArray(params)) {
        throw new TypeError(params + " must be an object, array or omitted");
      }
      request.params = params;
    }
    if (typeof id === "undefined") {
      const generator = typeof options.generator === "function" ? options.generator : function() {
        return uuid();
      };
      request.id = generator(request, options);
    } else if (version === 2 && id === null) {
      if (options.notificationIdNull) {
        request.id = null;
      }
    } else {
      request.id = id;
    }
    return request;
  };
  module.exports = generateRequest;
});

// node_modules/jayson/lib/client/browser/index.js
var require_browser = __commonJS((exports, module) => {
  var uuid = require_dist().v4;
  var generateRequest = require_generateRequest();
  var ClientBrowser = function(callServer, options) {
    if (!(this instanceof ClientBrowser)) {
      return new ClientBrowser(callServer, options);
    }
    if (!options) {
      options = {};
    }
    this.options = {
      reviver: typeof options.reviver !== "undefined" ? options.reviver : null,
      replacer: typeof options.replacer !== "undefined" ? options.replacer : null,
      generator: typeof options.generator !== "undefined" ? options.generator : function() {
        return uuid();
      },
      version: typeof options.version !== "undefined" ? options.version : 2,
      notificationIdNull: typeof options.notificationIdNull === "boolean" ? options.notificationIdNull : false
    };
    this.callServer = callServer;
  };
  module.exports = ClientBrowser;
  ClientBrowser.prototype.request = function(method, params, id, callback) {
    const self = this;
    let request = null;
    const isBatch = Array.isArray(method) && typeof params === "function";
    if (this.options.version === 1 && isBatch) {
      throw new TypeError("JSON-RPC 1.0 does not support batching");
    }
    const isRaw = !isBatch && method && typeof method === "object" && typeof params === "function";
    if (isBatch || isRaw) {
      callback = params;
      request = method;
    } else {
      if (typeof id === "function") {
        callback = id;
        id = undefined;
      }
      const hasCallback = typeof callback === "function";
      try {
        request = generateRequest(method, params, id, {
          generator: this.options.generator,
          version: this.options.version,
          notificationIdNull: this.options.notificationIdNull
        });
      } catch (err) {
        if (hasCallback) {
          return callback(err);
        }
        throw err;
      }
      if (!hasCallback) {
        return request;
      }
    }
    let message;
    try {
      message = JSON.stringify(request, this.options.replacer);
    } catch (err) {
      return callback(err);
    }
    this.callServer(message, function(err, response) {
      self._parseResponse(err, response, callback);
    });
    return request;
  };
  ClientBrowser.prototype._parseResponse = function(err, responseText, callback) {
    if (err) {
      callback(err);
      return;
    }
    if (!responseText) {
      return callback();
    }
    let response;
    try {
      response = JSON.parse(responseText, this.options.reviver);
    } catch (err2) {
      return callback(err2);
    }
    if (callback.length === 3) {
      if (Array.isArray(response)) {
        const isError = function(res) {
          return typeof res.error !== "undefined";
        };
        const isNotError = function(res) {
          return !isError(res);
        };
        return callback(null, response.filter(isError), response.filter(isNotError));
      } else {
        return callback(null, response.error, response.result);
      }
    }
    callback(null, response);
  };
});

// node_modules/@babel/runtime/helpers/interopRequireDefault.js
var require_interopRequireDefault = __commonJS((exports, module) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  };
  module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/typeof.js
var require_typeof = __commonJS((exports, module) => {
  var _typeof = function(o) {
    "@babel/helpers - typeof";
    return module.exports = _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && typeof Symbol == "function" && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
  };
  module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/regeneratorRuntime.js
var require_regeneratorRuntime = __commonJS((exports, module) => {
  var _regeneratorRuntime = function() {
    /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
    module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
      return e;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function(t2, e2, r2) {
      t2[e2] = r2.value;
    }, i = typeof Symbol == "function" ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag";
    function define2(t2, e2, r2) {
      return Object.defineProperty(t2, e2, {
        value: r2,
        enumerable: true,
        configurable: true,
        writable: true
      }), t2[e2];
    }
    try {
      define2({}, "");
    } catch (t2) {
      define2 = function define(t3, e2, r2) {
        return t3[e2] = r2;
      };
    }
    function wrap(t2, e2, r2, n2) {
      var i2 = e2 && e2.prototype instanceof Generator ? e2 : Generator, a2 = Object.create(i2.prototype), c2 = new Context(n2 || []);
      return o(a2, "_invoke", {
        value: makeInvokeMethod(t2, r2, c2)
      }), a2;
    }
    function tryCatch(t2, e2, r2) {
      try {
        return {
          type: "normal",
          arg: t2.call(e2, r2)
        };
      } catch (t3) {
        return {
          type: "throw",
          arg: t3
        };
      }
    }
    e.wrap = wrap;
    var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {};
    function Generator() {
    }
    function GeneratorFunction() {
    }
    function GeneratorFunctionPrototype() {
    }
    var p = {};
    define2(p, a, function() {
      return this;
    });
    var d = Object.getPrototypeOf, v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t2) {
      ["next", "throw", "return"].forEach(function(e2) {
        define2(t2, e2, function(t3) {
          return this._invoke(e2, t3);
        });
      });
    }
    function AsyncIterator(t2, e2) {
      function invoke(r3, o2, i2, a2) {
        var c2 = tryCatch(t2[r3], t2, o2);
        if (c2.type !== "throw") {
          var u2 = c2.arg, h2 = u2.value;
          return h2 && _typeof(h2) == "object" && n.call(h2, "__await") ? e2.resolve(h2.__await).then(function(t3) {
            invoke("next", t3, i2, a2);
          }, function(t3) {
            invoke("throw", t3, i2, a2);
          }) : e2.resolve(h2).then(function(t3) {
            u2.value = t3, i2(u2);
          }, function(t3) {
            return invoke("throw", t3, i2, a2);
          });
        }
        a2(c2.arg);
      }
      var r2;
      o(this, "_invoke", {
        value: function value(t3, n2) {
          function callInvokeWithMethodAndArg() {
            return new e2(function(e3, r3) {
              invoke(t3, n2, e3, r3);
            });
          }
          return r2 = r2 ? r2.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(e2, r2, n2) {
      var o2 = h;
      return function(i2, a2) {
        if (o2 === f)
          throw new Error("Generator is already running");
        if (o2 === s) {
          if (i2 === "throw")
            throw a2;
          return {
            value: t,
            done: true
          };
        }
        for (n2.method = i2, n2.arg = a2;; ) {
          var c2 = n2.delegate;
          if (c2) {
            var u2 = maybeInvokeDelegate(c2, n2);
            if (u2) {
              if (u2 === y)
                continue;
              return u2;
            }
          }
          if (n2.method === "next")
            n2.sent = n2._sent = n2.arg;
          else if (n2.method === "throw") {
            if (o2 === h)
              throw o2 = s, n2.arg;
            n2.dispatchException(n2.arg);
          } else
            n2.method === "return" && n2.abrupt("return", n2.arg);
          o2 = f;
          var p2 = tryCatch(e2, r2, n2);
          if (p2.type === "normal") {
            if (o2 = n2.done ? s : l, p2.arg === y)
              continue;
            return {
              value: p2.arg,
              done: n2.done
            };
          }
          p2.type === "throw" && (o2 = s, n2.method = "throw", n2.arg = p2.arg);
        }
      };
    }
    function maybeInvokeDelegate(e2, r2) {
      var n2 = r2.method, o2 = e2.iterator[n2];
      if (o2 === t)
        return r2.delegate = null, n2 === "throw" && e2.iterator["return"] && (r2.method = "return", r2.arg = t, maybeInvokeDelegate(e2, r2), r2.method === "throw") || n2 !== "return" && (r2.method = "throw", r2.arg = new TypeError("The iterator does not provide a '" + n2 + "' method")), y;
      var i2 = tryCatch(o2, e2.iterator, r2.arg);
      if (i2.type === "throw")
        return r2.method = "throw", r2.arg = i2.arg, r2.delegate = null, y;
      var a2 = i2.arg;
      return a2 ? a2.done ? (r2[e2.resultName] = a2.value, r2.next = e2.nextLoc, r2.method !== "return" && (r2.method = "next", r2.arg = t), r2.delegate = null, y) : a2 : (r2.method = "throw", r2.arg = new TypeError("iterator result is not an object"), r2.delegate = null, y);
    }
    function pushTryEntry(t2) {
      var e2 = {
        tryLoc: t2[0]
      };
      1 in t2 && (e2.catchLoc = t2[1]), 2 in t2 && (e2.finallyLoc = t2[2], e2.afterLoc = t2[3]), this.tryEntries.push(e2);
    }
    function resetTryEntry(t2) {
      var e2 = t2.completion || {};
      e2.type = "normal", delete e2.arg, t2.completion = e2;
    }
    function Context(t2) {
      this.tryEntries = [{
        tryLoc: "root"
      }], t2.forEach(pushTryEntry, this), this.reset(true);
    }
    function values(e2) {
      if (e2 || e2 === "") {
        var r2 = e2[a];
        if (r2)
          return r2.call(e2);
        if (typeof e2.next == "function")
          return e2;
        if (!isNaN(e2.length)) {
          var o2 = -1, i2 = function next() {
            for (;++o2 < e2.length; )
              if (n.call(e2, o2))
                return next.value = e2[o2], next.done = false, next;
            return next.value = t, next.done = true, next;
          };
          return i2.next = i2;
        }
      }
      throw new TypeError(_typeof(e2) + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: true
    }), o(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: true
    }), GeneratorFunction.displayName = define2(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function(t2) {
      var e2 = typeof t2 == "function" && t2.constructor;
      return !!e2 && (e2 === GeneratorFunction || (e2.displayName || e2.name) === "GeneratorFunction");
    }, e.mark = function(t2) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t2, GeneratorFunctionPrototype) : (t2.__proto__ = GeneratorFunctionPrototype, define2(t2, u, "GeneratorFunction")), t2.prototype = Object.create(g), t2;
    }, e.awrap = function(t2) {
      return {
        __await: t2
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define2(AsyncIterator.prototype, c, function() {
      return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function(t2, r2, n2, o2, i2) {
      i2 === undefined && (i2 = Promise);
      var a2 = new AsyncIterator(wrap(t2, r2, n2, o2), i2);
      return e.isGeneratorFunction(r2) ? a2 : a2.next().then(function(t3) {
        return t3.done ? t3.value : a2.next();
      });
    }, defineIteratorMethods(g), define2(g, u, "Generator"), define2(g, a, function() {
      return this;
    }), define2(g, "toString", function() {
      return "[object Generator]";
    }), e.keys = function(t2) {
      var e2 = Object(t2), r2 = [];
      for (var n2 in e2)
        r2.push(n2);
      return r2.reverse(), function next() {
        for (;r2.length; ) {
          var t3 = r2.pop();
          if (t3 in e2)
            return next.value = t3, next.done = false, next;
        }
        return next.done = true, next;
      };
    }, e.values = values, Context.prototype = {
      constructor: Context,
      reset: function reset(e2) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = false, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e2)
          for (var r2 in this)
            r2.charAt(0) === "t" && n.call(this, r2) && !isNaN(+r2.slice(1)) && (this[r2] = t);
      },
      stop: function stop() {
        this.done = true;
        var t2 = this.tryEntries[0].completion;
        if (t2.type === "throw")
          throw t2.arg;
        return this.rval;
      },
      dispatchException: function dispatchException(e2) {
        if (this.done)
          throw e2;
        var r2 = this;
        function handle(n2, o3) {
          return a2.type = "throw", a2.arg = e2, r2.next = n2, o3 && (r2.method = "next", r2.arg = t), !!o3;
        }
        for (var o2 = this.tryEntries.length - 1;o2 >= 0; --o2) {
          var i2 = this.tryEntries[o2], a2 = i2.completion;
          if (i2.tryLoc === "root")
            return handle("end");
          if (i2.tryLoc <= this.prev) {
            var c2 = n.call(i2, "catchLoc"), u2 = n.call(i2, "finallyLoc");
            if (c2 && u2) {
              if (this.prev < i2.catchLoc)
                return handle(i2.catchLoc, true);
              if (this.prev < i2.finallyLoc)
                return handle(i2.finallyLoc);
            } else if (c2) {
              if (this.prev < i2.catchLoc)
                return handle(i2.catchLoc, true);
            } else {
              if (!u2)
                throw new Error("try statement without catch or finally");
              if (this.prev < i2.finallyLoc)
                return handle(i2.finallyLoc);
            }
          }
        }
      },
      abrupt: function abrupt(t2, e2) {
        for (var r2 = this.tryEntries.length - 1;r2 >= 0; --r2) {
          var o2 = this.tryEntries[r2];
          if (o2.tryLoc <= this.prev && n.call(o2, "finallyLoc") && this.prev < o2.finallyLoc) {
            var i2 = o2;
            break;
          }
        }
        i2 && (t2 === "break" || t2 === "continue") && i2.tryLoc <= e2 && e2 <= i2.finallyLoc && (i2 = null);
        var a2 = i2 ? i2.completion : {};
        return a2.type = t2, a2.arg = e2, i2 ? (this.method = "next", this.next = i2.finallyLoc, y) : this.complete(a2);
      },
      complete: function complete(t2, e2) {
        if (t2.type === "throw")
          throw t2.arg;
        return t2.type === "break" || t2.type === "continue" ? this.next = t2.arg : t2.type === "return" ? (this.rval = this.arg = t2.arg, this.method = "return", this.next = "end") : t2.type === "normal" && e2 && (this.next = e2), y;
      },
      finish: function finish(t2) {
        for (var e2 = this.tryEntries.length - 1;e2 >= 0; --e2) {
          var r2 = this.tryEntries[e2];
          if (r2.finallyLoc === t2)
            return this.complete(r2.completion, r2.afterLoc), resetTryEntry(r2), y;
        }
      },
      catch: function _catch(t2) {
        for (var e2 = this.tryEntries.length - 1;e2 >= 0; --e2) {
          var r2 = this.tryEntries[e2];
          if (r2.tryLoc === t2) {
            var n2 = r2.completion;
            if (n2.type === "throw") {
              var o2 = n2.arg;
              resetTryEntry(r2);
            }
            return o2;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(e2, r2, n2) {
        return this.delegate = {
          iterator: values(e2),
          resultName: r2,
          nextLoc: n2
        }, this.method === "next" && (this.arg = t), y;
      }
    }, e;
  };
  var _typeof = require_typeof()["default"];
  module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/regenerator/index.js
var require_regenerator = __commonJS((exports, module) => {
  var runtime = require_regeneratorRuntime()();
  module.exports = runtime;
  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }
});

// node_modules/@babel/runtime/helpers/asyncToGenerator.js
var require_asyncToGenerator = __commonJS((exports, module) => {
  var asyncGeneratorStep = function(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  };
  var _asyncToGenerator = function(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  };
  module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/classCallCheck.js
var require_classCallCheck = __commonJS((exports, module) => {
  var _classCallCheck = function(instance2, Constructor) {
    if (!(instance2 instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/toPrimitive.js
var require_toPrimitive = __commonJS((exports, module) => {
  var toPrimitive = function(t, r) {
    if (_typeof(t) != "object" || !t)
      return t;
    var e = t[Symbol.toPrimitive];
    if (e !== undefined) {
      var i = e.call(t, r || "default");
      if (_typeof(i) != "object")
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (r === "string" ? String : Number)(t);
  };
  var _typeof = require_typeof()["default"];
  module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/toPropertyKey.js
var require_toPropertyKey = __commonJS((exports, module) => {
  var toPropertyKey = function(t) {
    var i = toPrimitive(t, "string");
    return _typeof(i) == "symbol" ? i : String(i);
  };
  var _typeof = require_typeof()["default"];
  var toPrimitive = require_toPrimitive();
  module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/createClass.js
var require_createClass = __commonJS((exports, module) => {
  var _defineProperties = function(target, props) {
    for (var i = 0;i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
    }
  };
  var _createClass = function(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  };
  var toPropertyKey = require_toPropertyKey();
  module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/setPrototypeOf.js
var require_setPrototypeOf = __commonJS((exports, module) => {
  var _setPrototypeOf = function(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _setPrototypeOf(o, p);
  };
  module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/inherits.js
var require_inherits = __commonJS((exports, module) => {
  var _inherits = function(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass)
      setPrototypeOf(subClass, superClass);
  };
  var setPrototypeOf = require_setPrototypeOf();
  module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/assertThisInitialized.js
var require_assertThisInitialized = __commonJS((exports, module) => {
  var _assertThisInitialized = function(self) {
    if (self === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  };
  module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/possibleConstructorReturn.js
var require_possibleConstructorReturn = __commonJS((exports, module) => {
  var _possibleConstructorReturn = function(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== undefined) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return assertThisInitialized(self);
  };
  var _typeof = require_typeof()["default"];
  var assertThisInitialized = require_assertThisInitialized();
  module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/@babel/runtime/helpers/getPrototypeOf.js
var require_getPrototypeOf = __commonJS((exports, module) => {
  var _getPrototypeOf = function(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _getPrototypeOf(o);
  };
  module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS((exports, module) => {
  var Events = function() {
  };
  var EE = function(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  };
  var addListener = function(emitter, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt])
      emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
      emitter._events[evt].push(listener);
    else
      emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  };
  var clearEvent = function(emitter, evt) {
    if (--emitter._eventsCount === 0)
      emitter._events = new Events;
    else
      delete emitter._events[evt];
  };
  var EventEmitter = function() {
    this._events = new Events;
    this._eventsCount = 0;
  };
  var has = Object.prototype.hasOwnProperty;
  var prefix = "~";
  if (Object.create) {
    Events.prototype = Object.create(null);
    if (!new Events().__proto__)
      prefix = false;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
      return names;
    for (name in events = this._events) {
      if (has.call(events, name))
        names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers)
      return [];
    if (handlers.fn)
      return [handlers.fn];
    for (var i = 0, l = handlers.length, ee = new Array(l);i < l; i++) {
      ee[i] = handlers[i].fn;
    }
    return ee;
  };
  EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners)
      return 0;
    if (listeners.fn)
      return 1;
    return listeners.length;
  };
  EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
      if (listeners.once)
        this.removeListener(event, listeners.fn, undefined, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1);i < len; i++) {
        args[i - 1] = arguments[i];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j;
      for (i = 0;i < length; i++) {
        if (listeners[i].once)
          this.removeListener(event, listeners[i].fn, undefined, true);
        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);
            break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);
            break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);
            break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
            break;
          default:
            if (!args)
              for (j = 1, args = new Array(len - 1);j < len; j++) {
                args[j - 1] = arguments[j];
              }
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events = [], length = listeners.length;i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
          events.push(listeners[i]);
        }
      }
      if (events.length)
        this._events[evt] = events.length === 1 ? events[0] : events;
      else
        clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt])
        clearEvent(this, evt);
    } else {
      this._events = new Events;
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  EventEmitter.prefixed = prefix;
  EventEmitter.EventEmitter = EventEmitter;
  if (typeof module !== "undefined") {
    module.exports = EventEmitter;
  }
});

// node_modules/rpc-websockets/dist/lib/utils.js
var require_utils = __commonJS((exports) => {
  var createError = function(code, details) {
    var error = {
      code,
      message: errors.get(code) || "Internal Server Error"
    };
    if (details)
      error["data"] = details;
    return error;
  };
  var _interopRequireDefault = require_interopRequireDefault();
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DefaultDataPack = undefined;
  exports.createError = createError;
  var _classCallCheck2 = _interopRequireDefault(require_classCallCheck());
  var _createClass2 = _interopRequireDefault(require_createClass());
  var errors = new Map([[-32000, "Event not provided"], [-32600, "Invalid Request"], [-32601, "Method not found"], [-32602, "Invalid params"], [-32603, "Internal error"], [-32604, "Params not found"], [-32605, "Method forbidden"], [-32606, "Event forbidden"], [-32700, "Parse error"]]);
  var DefaultDataPack = function() {
    function DefaultDataPack2() {
      (0, _classCallCheck2["default"])(this, DefaultDataPack2);
    }
    (0, _createClass2["default"])(DefaultDataPack2, [{
      key: "encode",
      value: function encode(value) {
        return JSON.stringify(value);
      }
    }, {
      key: "decode",
      value: function decode(value) {
        return JSON.parse(value);
      }
    }]);
    return DefaultDataPack2;
  }();
  exports.DefaultDataPack = DefaultDataPack;
});

// node_modules/rpc-websockets/dist/lib/client.js
var require_client = __commonJS((exports) => {
  var _createSuper = function(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = (0, _getPrototypeOf2["default"])(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return (0, _possibleConstructorReturn2["default"])(this, result);
    };
  };
  var _isNativeReflectConstruct = function() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  };
  var _interopRequireDefault = require_interopRequireDefault();
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _regenerator = _interopRequireDefault(require_regenerator());
  var _asyncToGenerator2 = _interopRequireDefault(require_asyncToGenerator());
  var _typeof2 = _interopRequireDefault(require_typeof());
  var _classCallCheck2 = _interopRequireDefault(require_classCallCheck());
  var _createClass2 = _interopRequireDefault(require_createClass());
  var _inherits2 = _interopRequireDefault(require_inherits());
  var _possibleConstructorReturn2 = _interopRequireDefault(require_possibleConstructorReturn());
  var _getPrototypeOf2 = _interopRequireDefault(require_getPrototypeOf());
  var _eventemitter = require_eventemitter3();
  var _utils = require_utils();
  var __rest = function(s, e) {
    var t = {};
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s);i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var CommonClient = function(_EventEmitter) {
    (0, _inherits2["default"])(CommonClient2, _EventEmitter);
    var _super = _createSuper(CommonClient2);
    function CommonClient2(webSocketFactory) {
      var _this;
      var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "ws://localhost:8080";
      var _a = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var generate_request_id = arguments.length > 3 ? arguments[3] : undefined;
      var dataPack = arguments.length > 4 ? arguments[4] : undefined;
      (0, _classCallCheck2["default"])(this, CommonClient2);
      var _a$autoconnect = _a.autoconnect, autoconnect = _a$autoconnect === undefined ? true : _a$autoconnect, _a$reconnect = _a.reconnect, reconnect = _a$reconnect === undefined ? true : _a$reconnect, _a$reconnect_interval = _a.reconnect_interval, reconnect_interval = _a$reconnect_interval === undefined ? 1000 : _a$reconnect_interval, _a$max_reconnects = _a.max_reconnects, max_reconnects = _a$max_reconnects === undefined ? 5 : _a$max_reconnects, rest_options = __rest(_a, ["autoconnect", "reconnect", "reconnect_interval", "max_reconnects"]);
      _this = _super.call(this);
      _this.webSocketFactory = webSocketFactory;
      _this.queue = {};
      _this.rpc_id = 0;
      _this.address = address;
      _this.autoconnect = autoconnect;
      _this.ready = false;
      _this.reconnect = reconnect;
      _this.reconnect_timer_id = undefined;
      _this.reconnect_interval = reconnect_interval;
      _this.max_reconnects = max_reconnects;
      _this.rest_options = rest_options;
      _this.current_reconnects = 0;
      _this.generate_request_id = generate_request_id || function() {
        return ++_this.rpc_id;
      };
      if (!dataPack)
        _this.dataPack = new _utils.DefaultDataPack;
      else
        _this.dataPack = dataPack;
      if (_this.autoconnect)
        _this._connect(_this.address, Object.assign({
          autoconnect: _this.autoconnect,
          reconnect: _this.reconnect,
          reconnect_interval: _this.reconnect_interval,
          max_reconnects: _this.max_reconnects
        }, _this.rest_options));
      return _this;
    }
    (0, _createClass2["default"])(CommonClient2, [{
      key: "connect",
      value: function connect() {
        if (this.socket)
          return;
        this._connect(this.address, Object.assign({
          autoconnect: this.autoconnect,
          reconnect: this.reconnect,
          reconnect_interval: this.reconnect_interval,
          max_reconnects: this.max_reconnects
        }, this.rest_options));
      }
    }, {
      key: "call",
      value: function call(method, params, timeout, ws_opts) {
        var _this2 = this;
        if (!ws_opts && (0, _typeof2["default"])(timeout) === "object") {
          ws_opts = timeout;
          timeout = null;
        }
        return new Promise(function(resolve, reject) {
          if (!_this2.ready)
            return reject(new Error("socket not ready"));
          var rpc_id = _this2.generate_request_id(method, params);
          var message = {
            jsonrpc: "2.0",
            method,
            params: params || undefined,
            id: rpc_id
          };
          _this2.socket.send(_this2.dataPack.encode(message), ws_opts, function(error) {
            if (error)
              return reject(error);
            _this2.queue[rpc_id] = {
              promise: [resolve, reject]
            };
            if (timeout) {
              _this2.queue[rpc_id].timeout = setTimeout(function() {
                delete _this2.queue[rpc_id];
                reject(new Error("reply timeout"));
              }, timeout);
            }
          });
        });
      }
    }, {
      key: "login",
      value: function() {
        var _login = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee(params) {
          var resp;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (true) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.call("rpc.login", params);
                case 2:
                  resp = _context.sent;
                  if (resp) {
                    _context.next = 5;
                    break;
                  }
                  throw new Error("authentication failed");
                case 5:
                  return _context.abrupt("return", resp);
                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
        function login(_x) {
          return _login.apply(this, arguments);
        }
        return login;
      }()
    }, {
      key: "listMethods",
      value: function() {
        var _listMethods = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee2() {
          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (true) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this.call("__listMethods");
                case 2:
                  return _context2.abrupt("return", _context2.sent);
                case 3:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));
        function listMethods() {
          return _listMethods.apply(this, arguments);
        }
        return listMethods;
      }()
    }, {
      key: "notify",
      value: function notify(method, params) {
        var _this3 = this;
        return new Promise(function(resolve, reject) {
          if (!_this3.ready)
            return reject(new Error("socket not ready"));
          var message = {
            jsonrpc: "2.0",
            method,
            params
          };
          _this3.socket.send(_this3.dataPack.encode(message), function(error) {
            if (error)
              return reject(error);
            resolve();
          });
        });
      }
    }, {
      key: "subscribe",
      value: function() {
        var _subscribe = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee3(event) {
          var result;
          return _regenerator["default"].wrap(function _callee3$(_context3) {
            while (true) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (typeof event === "string")
                    event = [event];
                  _context3.next = 3;
                  return this.call("rpc.on", event);
                case 3:
                  result = _context3.sent;
                  if (!(typeof event === "string" && result[event] !== "ok")) {
                    _context3.next = 6;
                    break;
                  }
                  throw new Error("Failed subscribing to an event '" + event + "' with: " + result[event]);
                case 6:
                  return _context3.abrupt("return", result);
                case 7:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));
        function subscribe(_x2) {
          return _subscribe.apply(this, arguments);
        }
        return subscribe;
      }()
    }, {
      key: "unsubscribe",
      value: function() {
        var _unsubscribe = (0, _asyncToGenerator2["default"])(_regenerator["default"].mark(function _callee4(event) {
          var result;
          return _regenerator["default"].wrap(function _callee4$(_context4) {
            while (true) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (typeof event === "string")
                    event = [event];
                  _context4.next = 3;
                  return this.call("rpc.off", event);
                case 3:
                  result = _context4.sent;
                  if (!(typeof event === "string" && result[event] !== "ok")) {
                    _context4.next = 6;
                    break;
                  }
                  throw new Error("Failed unsubscribing from an event with: " + result);
                case 6:
                  return _context4.abrupt("return", result);
                case 7:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));
        function unsubscribe(_x3) {
          return _unsubscribe.apply(this, arguments);
        }
        return unsubscribe;
      }()
    }, {
      key: "close",
      value: function close(code, data) {
        this.socket.close(code || 1000, data);
      }
    }, {
      key: "_connect",
      value: function _connect(address, options) {
        var _this4 = this;
        clearTimeout(this.reconnect_timer_id);
        this.socket = this.webSocketFactory(address, options);
        this.socket.addEventListener("open", function() {
          _this4.ready = true;
          _this4.emit("open");
          _this4.current_reconnects = 0;
        });
        this.socket.addEventListener("message", function(_ref) {
          var message = _ref.data;
          if (message instanceof ArrayBuffer)
            message = Buffer.from(message).toString();
          try {
            message = _this4.dataPack.decode(message);
          } catch (error) {
            return;
          }
          if (message.notification && _this4.listeners(message.notification).length) {
            if (!Object.keys(message.params).length)
              return _this4.emit(message.notification);
            var args = [message.notification];
            if (message.params.constructor === Object)
              args.push(message.params);
            else
              for (var i = 0;i < message.params.length; i++) {
                args.push(message.params[i]);
              }
            return Promise.resolve().then(function() {
              _this4.emit.apply(_this4, args);
            });
          }
          if (!_this4.queue[message.id]) {
            if (message.method) {
              return Promise.resolve().then(function() {
                _this4.emit(message.method, message === null || message === undefined ? undefined : message.params);
              });
            }
            return;
          }
          if ("error" in message === "result" in message)
            _this4.queue[message.id].promise[1](new Error("Server response malformed. Response must include either \"result\" or \"error\", but not both."));
          if (_this4.queue[message.id].timeout)
            clearTimeout(_this4.queue[message.id].timeout);
          if (message.error)
            _this4.queue[message.id].promise[1](message.error);
          else
            _this4.queue[message.id].promise[0](message.result);
          delete _this4.queue[message.id];
        });
        this.socket.addEventListener("error", function(error) {
          return _this4.emit("error", error);
        });
        this.socket.addEventListener("close", function(_ref2) {
          var { code, reason } = _ref2;
          if (_this4.ready)
            setTimeout(function() {
              return _this4.emit("close", code, reason);
            }, 0);
          _this4.ready = false;
          _this4.socket = undefined;
          if (code === 1000)
            return;
          _this4.current_reconnects++;
          if (_this4.reconnect && (_this4.max_reconnects > _this4.current_reconnects || _this4.max_reconnects === 0))
            _this4.reconnect_timer_id = setTimeout(function() {
              return _this4._connect(address, options);
            }, _this4.reconnect_interval);
        });
      }
    }]);
    return CommonClient2;
  }(_eventemitter.EventEmitter);
  exports.default = CommonClient;
});

// node_modules/rpc-websockets/dist/lib/client/websocket.js
var require_websocket = __commonJS((exports) => {
  var _default = function(address, options) {
    return new _ws["default"](address, options);
  };
  var _interopRequireDefault = require_interopRequireDefault();
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _default;
  var _ws = _interopRequireDefault(import.meta.require("ws"));
});

// node_modules/@solana/web3.js/lib/index.esm.js
var exports_index_esm = {};
__export(exports_index_esm, {
  sendAndConfirmTransaction: () => {
    {
      return sendAndConfirmTransaction;
    }
  },
  sendAndConfirmRawTransaction: () => {
    {
      return sendAndConfirmRawTransaction;
    }
  },
  clusterApiUrl: () => {
    {
      return clusterApiUrl;
    }
  },
  VoteProgram: () => {
    {
      return VoteProgram;
    }
  },
  VoteInstruction: () => {
    {
      return VoteInstruction;
    }
  },
  VoteInit: () => {
    {
      return VoteInit;
    }
  },
  VoteAuthorizationLayout: () => {
    {
      return VoteAuthorizationLayout;
    }
  },
  VoteAccount: () => {
    {
      return VoteAccount;
    }
  },
  VersionedTransaction: () => {
    {
      return VersionedTransaction;
    }
  },
  VersionedMessage: () => {
    {
      return VersionedMessage;
    }
  },
  ValidatorInfo: () => {
    {
      return ValidatorInfo;
    }
  },
  VOTE_PROGRAM_ID: () => {
    {
      return VOTE_PROGRAM_ID;
    }
  },
  VERSION_PREFIX_MASK: () => {
    {
      return VERSION_PREFIX_MASK;
    }
  },
  VALIDATOR_INFO_KEY: () => {
    {
      return VALIDATOR_INFO_KEY;
    }
  },
  TransactionStatus: () => {
    {
      return TransactionStatus;
    }
  },
  TransactionMessage: () => {
    {
      return TransactionMessage;
    }
  },
  TransactionInstruction: () => {
    {
      return TransactionInstruction;
    }
  },
  TransactionExpiredTimeoutError: () => {
    {
      return TransactionExpiredTimeoutError;
    }
  },
  TransactionExpiredNonceInvalidError: () => {
    {
      return TransactionExpiredNonceInvalidError;
    }
  },
  TransactionExpiredBlockheightExceededError: () => {
    {
      return TransactionExpiredBlockheightExceededError;
    }
  },
  Transaction: () => {
    {
      return Transaction;
    }
  },
  SystemProgram: () => {
    {
      return SystemProgram;
    }
  },
  SystemInstruction: () => {
    {
      return SystemInstruction;
    }
  },
  Struct: () => {
    {
      return Struct2;
    }
  },
  StakeProgram: () => {
    {
      return StakeProgram;
    }
  },
  StakeInstruction: () => {
    {
      return StakeInstruction;
    }
  },
  StakeAuthorizationLayout: () => {
    {
      return StakeAuthorizationLayout;
    }
  },
  SolanaJSONRPCErrorCode: () => {
    {
      return SolanaJSONRPCErrorCode;
    }
  },
  SolanaJSONRPCError: () => {
    {
      return SolanaJSONRPCError;
    }
  },
  SendTransactionError: () => {
    {
      return SendTransactionError;
    }
  },
  Secp256k1Program: () => {
    {
      return Secp256k1Program;
    }
  },
  SYSVAR_STAKE_HISTORY_PUBKEY: () => {
    {
      return SYSVAR_STAKE_HISTORY_PUBKEY;
    }
  },
  SYSVAR_SLOT_HISTORY_PUBKEY: () => {
    {
      return SYSVAR_SLOT_HISTORY_PUBKEY;
    }
  },
  SYSVAR_SLOT_HASHES_PUBKEY: () => {
    {
      return SYSVAR_SLOT_HASHES_PUBKEY;
    }
  },
  SYSVAR_REWARDS_PUBKEY: () => {
    {
      return SYSVAR_REWARDS_PUBKEY;
    }
  },
  SYSVAR_RENT_PUBKEY: () => {
    {
      return SYSVAR_RENT_PUBKEY;
    }
  },
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY: () => {
    {
      return SYSVAR_RECENT_BLOCKHASHES_PUBKEY;
    }
  },
  SYSVAR_INSTRUCTIONS_PUBKEY: () => {
    {
      return SYSVAR_INSTRUCTIONS_PUBKEY;
    }
  },
  SYSVAR_EPOCH_SCHEDULE_PUBKEY: () => {
    {
      return SYSVAR_EPOCH_SCHEDULE_PUBKEY;
    }
  },
  SYSVAR_CLOCK_PUBKEY: () => {
    {
      return SYSVAR_CLOCK_PUBKEY;
    }
  },
  SYSTEM_INSTRUCTION_LAYOUTS: () => {
    {
      return SYSTEM_INSTRUCTION_LAYOUTS;
    }
  },
  STAKE_INSTRUCTION_LAYOUTS: () => {
    {
      return STAKE_INSTRUCTION_LAYOUTS;
    }
  },
  STAKE_CONFIG_ID: () => {
    {
      return STAKE_CONFIG_ID;
    }
  },
  SOLANA_SCHEMA: () => {
    {
      return SOLANA_SCHEMA;
    }
  },
  SIGNATURE_LENGTH_IN_BYTES: () => {
    {
      return SIGNATURE_LENGTH_IN_BYTES;
    }
  },
  PublicKey: () => {
    {
      return PublicKey;
    }
  },
  PUBLIC_KEY_LENGTH: () => {
    {
      return PUBLIC_KEY_LENGTH;
    }
  },
  PACKET_DATA_SIZE: () => {
    {
      return PACKET_DATA_SIZE;
    }
  },
  NonceAccount: () => {
    {
      return NonceAccount;
    }
  },
  NONCE_ACCOUNT_LENGTH: () => {
    {
      return NONCE_ACCOUNT_LENGTH;
    }
  },
  MessageV0: () => {
    {
      return MessageV0;
    }
  },
  MessageAccountKeys: () => {
    {
      return MessageAccountKeys;
    }
  },
  Message: () => {
    {
      return Message;
    }
  },
  MAX_SEED_LENGTH: () => {
    {
      return MAX_SEED_LENGTH;
    }
  },
  Lockup: () => {
    {
      return Lockup;
    }
  },
  Loader: () => {
    {
      return Loader;
    }
  },
  LOOKUP_TABLE_INSTRUCTION_LAYOUTS: () => {
    {
      return LOOKUP_TABLE_INSTRUCTION_LAYOUTS;
    }
  },
  LAMPORTS_PER_SOL: () => {
    {
      return LAMPORTS_PER_SOL;
    }
  },
  Keypair: () => {
    {
      return Keypair;
    }
  },
  FeeCalculatorLayout: () => {
    {
      return FeeCalculatorLayout;
    }
  },
  EpochSchedule: () => {
    {
      return EpochSchedule;
    }
  },
  Enum: () => {
    {
      return Enum;
    }
  },
  Ed25519Program: () => {
    {
      return Ed25519Program;
    }
  },
  Connection: () => {
    {
      return Connection;
    }
  },
  ComputeBudgetProgram: () => {
    {
      return ComputeBudgetProgram;
    }
  },
  ComputeBudgetInstruction: () => {
    {
      return ComputeBudgetInstruction;
    }
  },
  COMPUTE_BUDGET_INSTRUCTION_LAYOUTS: () => {
    {
      return COMPUTE_BUDGET_INSTRUCTION_LAYOUTS;
    }
  },
  BpfLoader: () => {
    {
      return BpfLoader;
    }
  },
  BPF_LOADER_PROGRAM_ID: () => {
    {
      return BPF_LOADER_PROGRAM_ID;
    }
  },
  BPF_LOADER_DEPRECATED_PROGRAM_ID: () => {
    {
      return BPF_LOADER_DEPRECATED_PROGRAM_ID;
    }
  },
  BLOCKHASH_CACHE_TIMEOUT_MS: () => {
    {
      return BLOCKHASH_CACHE_TIMEOUT_MS;
    }
  },
  Authorized: () => {
    {
      return Authorized;
    }
  },
  AddressLookupTableProgram: () => {
    {
      return AddressLookupTableProgram;
    }
  },
  AddressLookupTableInstruction: () => {
    {
      return AddressLookupTableInstruction;
    }
  },
  AddressLookupTableAccount: () => {
    {
      return AddressLookupTableAccount;
    }
  },
  Account: () => {
    {
      return Account;
    }
  }
});
import {Buffer as Buffer2} from "buffer";

// node_modules/@noble/hashes/esm/_assert.js
var number = function(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
};
var isBytes = function(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
};
var bytes = function(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
};
var hash = function(hash2) {
  if (typeof hash2 !== "function" || typeof hash2.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number(hash2.outputLen);
  number(hash2.blockLen);
};
var exists = function(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
};
var output = function(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
};

// node_modules/@noble/hashes/esm/cryptoNode.js
import * as nc from "crypto";
var crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : undefined;

// node_modules/@noble/hashes/esm/utils.js
var isBytes2 = function(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
};
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  if (!isBytes2(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0;i < arrays.length; i++) {
    const a = arrays[i];
    if (!isBytes2(a))
      throw new Error("Uint8Array expected");
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0;i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function wrapXOFConstructorWithOpts(hashCons) {
  const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
  const tmp = hashCons({});
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr = (word, shift) => word << 32 - shift | word >>> shift;
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE)
  throw new Error("Non little-endian hardware is not supported");
class Hash {
  clone() {
    return this._cloneInto();
  }
}
var toStr = {}.toString;

// node_modules/@noble/hashes/esm/_sha2.js
var setBigUint64 = function(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
};

class SHA2 extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0;pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (;blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists(this);
    output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos;i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0;i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor);
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
}

// node_modules/@noble/hashes/esm/_u64.js
var fromBig = function(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
};
var split = function(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0;i < lst.length; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
};
var add = function(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
};
var U32_MASK64 = BigInt(2 ** 32 - 1);
var _32n = BigInt(32);
var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (_h, l) => l;
var rotr32L = (h, _l) => h;
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
var u64 = {
  fromBig,
  split,
  toBig,
  shrSH,
  shrSL,
  rotrSH,
  rotrSL,
  rotrBH,
  rotrBL,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add,
  add3L,
  add3H,
  add4L,
  add4H,
  add5H,
  add5L
};
var _u64_default = u64;

// node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh, SHA512_Kl] = (() => _u64_default.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_W_H = new Uint32Array(80);
var SHA512_W_L = new Uint32Array(80);

class SHA512 extends SHA2 {
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0;i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16;i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = _u64_default.rotrSH(W15h, W15l, 1) ^ _u64_default.rotrSH(W15h, W15l, 8) ^ _u64_default.shrSH(W15h, W15l, 7);
      const s0l = _u64_default.rotrSL(W15h, W15l, 1) ^ _u64_default.rotrSL(W15h, W15l, 8) ^ _u64_default.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = _u64_default.rotrSH(W2h, W2l, 19) ^ _u64_default.rotrBH(W2h, W2l, 61) ^ _u64_default.shrSH(W2h, W2l, 6);
      const s1l = _u64_default.rotrSL(W2h, W2l, 19) ^ _u64_default.rotrBL(W2h, W2l, 61) ^ _u64_default.shrSL(W2h, W2l, 6);
      const SUMl = _u64_default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = _u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0;i < 80; i++) {
      const sigma1h = _u64_default.rotrSH(Eh, El, 14) ^ _u64_default.rotrSH(Eh, El, 18) ^ _u64_default.rotrBH(Eh, El, 41);
      const sigma1l = _u64_default.rotrSL(Eh, El, 14) ^ _u64_default.rotrSL(Eh, El, 18) ^ _u64_default.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = _u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = _u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = _u64_default.rotrSH(Ah, Al, 28) ^ _u64_default.rotrBH(Ah, Al, 34) ^ _u64_default.rotrBH(Ah, Al, 39);
      const sigma0l = _u64_default.rotrSL(Ah, Al, 28) ^ _u64_default.rotrBL(Ah, Al, 34) ^ _u64_default.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = _u64_default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = _u64_default.add3L(T1l, sigma0l, MAJl);
      Ah = _u64_default.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = _u64_default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = _u64_default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = _u64_default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = _u64_default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = _u64_default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = _u64_default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = _u64_default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = _u64_default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
var sha512 = wrapConstructor(() => new SHA512);

// node_modules/@noble/curves/esm/abstract/utils.js
var exports_utils = {};
__export(exports_utils, {
  validateObject: () => {
    {
      return validateObject;
    }
  },
  utf8ToBytes: () => {
    {
      return utf8ToBytes2;
    }
  },
  numberToVarBytesBE: () => {
    {
      return numberToVarBytesBE;
    }
  },
  numberToHexUnpadded: () => {
    {
      return numberToHexUnpadded;
    }
  },
  numberToBytesLE: () => {
    {
      return numberToBytesLE;
    }
  },
  numberToBytesBE: () => {
    {
      return numberToBytesBE;
    }
  },
  isBytes: () => {
    {
      return isBytes3;
    }
  },
  hexToNumber: () => {
    {
      return hexToNumber;
    }
  },
  hexToBytes: () => {
    {
      return hexToBytes;
    }
  },
  equalBytes: () => {
    {
      return equalBytes;
    }
  },
  ensureBytes: () => {
    {
      return ensureBytes;
    }
  },
  createHmacDrbg: () => {
    {
      return createHmacDrbg;
    }
  },
  concatBytes: () => {
    {
      return concatBytes2;
    }
  },
  bytesToNumberLE: () => {
    {
      return bytesToNumberLE;
    }
  },
  bytesToNumberBE: () => {
    {
      return bytesToNumberBE;
    }
  },
  bytesToHex: () => {
    {
      return bytesToHex;
    }
  },
  bitSet: () => {
    {
      return bitSet;
    }
  },
  bitMask: () => {
    {
      return bitMask;
    }
  },
  bitLen: () => {
    {
      return bitLen;
    }
  },
  bitGet: () => {
    {
      return bitGet;
    }
  }
});
function isBytes3(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytesToHex(bytes2) {
  if (!isBytes3(bytes2))
    throw new Error("Uint8Array expected");
  let hex = "";
  for (let i = 0;i < bytes2.length; i++) {
    hex += hexes[bytes2[i]];
  }
  return hex;
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return BigInt(hex === "" ? "0" : `0x${hex}`);
}
var asciiToBase16 = function(char) {
  if (char >= asciis._0 && char <= asciis._9)
    return char - asciis._0;
  if (char >= asciis._A && char <= asciis._F)
    return char - (asciis._A - 10);
  if (char >= asciis._a && char <= asciis._f)
    return char - (asciis._a - 10);
  return;
};
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0;ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === undefined || n2 === undefined) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function bytesToNumberBE(bytes2) {
  return hexToNumber(bytesToHex(bytes2));
}
function bytesToNumberLE(bytes2) {
  if (!isBytes3(bytes2))
    throw new Error("Uint8Array expected");
  return hexToNumber(bytesToHex(Uint8Array.from(bytes2).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function numberToVarBytesBE(n) {
  return hexToBytes(numberToHexUnpadded(n));
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
    }
  } else if (isBytes3(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
function concatBytes2(...arrays) {
  let sum = 0;
  for (let i = 0;i < arrays.length; i++) {
    const a = arrays[i];
    if (!isBytes3(a))
      throw new Error("Uint8Array expected");
    sum += a.length;
  }
  let res = new Uint8Array(sum);
  let pad = 0;
  for (let i = 0;i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0;i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function bitLen(n) {
  let len;
  for (len = 0;n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n;
}
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n()) => {
    k = h(u8fr([0]), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8fr([1]), seed);
    v = h();
  };
  const gen = () => {
    if (i++ >= 1000)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = undefined;
    while (!(res = pred(gen())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error(`Invalid validator "${type}", expected function`);
    const val = object[fieldName];
    if (isOptional && val === undefined)
      return;
    if (!checkVal(val, object)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var hexes = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
var asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
var bitSet = (n, pos, value) => {
  return n | (value ? _1n : _0n) << BigInt(pos);
};
var bitMask = (n) => (_2n << BigInt(n - 1)) - _1n;
var u8n = (data) => new Uint8Array(data);
var u8fr = (arr) => Uint8Array.from(arr);
var validatorFns = {
  bigint: (val) => typeof val === "bigint",
  function: (val) => typeof val === "function",
  boolean: (val) => typeof val === "boolean",
  string: (val) => typeof val === "string",
  stringOrUint8Array: (val) => typeof val === "string" || isBytes3(val),
  isSafeInteger: (val) => Number.isSafeInteger(val),
  array: (val) => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
};

// node_modules/@noble/curves/esm/abstract/modular.js
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow(num, power, modulo) {
  if (modulo <= _0n2 || power < _0n2)
    throw new Error("Expected power/modulo > 0");
  if (modulo === _1n2)
    return _0n2;
  let res = _1n2;
  while (power > _0n2) {
    if (power & _1n2)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n2;
  }
  return res;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number2, modulo) {
  if (number2 === _0n2 || modulo <= _0n2) {
    throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
  }
  let a = mod(number2, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function tonelliShanks(P) {
  const legendreC = (P - _1n2) / _2n2;
  let Q, S, Z;
  for (Q = P - _1n2, S = 0;Q % _2n2 === _0n2; Q /= _2n2, S++)
    ;
  for (Z = _2n2;Z < P && pow(Z, legendreC, P) !== P - _1n2; Z++)
    ;
  if (S === 1) {
    const p1div4 = (P + _1n2) / _4n;
    return function tonelliFast(Fp, n) {
      const root = Fp.pow(n, p1div4);
      if (!Fp.eql(Fp.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  const Q1div2 = (Q + _1n2) / _2n2;
  return function tonelliSlow(Fp, n) {
    if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
    let x = Fp.pow(n, Q1div2);
    let b = Fp.pow(n, Q);
    while (!Fp.eql(b, Fp.ONE)) {
      if (Fp.eql(b, Fp.ZERO))
        return Fp.ZERO;
      let m = 1;
      for (let t2 = Fp.sqr(b);m < r; m++) {
        if (Fp.eql(t2, Fp.ONE))
          break;
        t2 = Fp.sqr(t2);
      }
      const ge = Fp.pow(g, _1n2 << BigInt(r - m - 1));
      g = Fp.sqr(ge);
      x = Fp.mul(x, ge);
      b = Fp.mul(b, g);
      r = m;
    }
    return x;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n) {
    const p1div4 = (P + _1n2) / _4n;
    return function sqrt3mod4(Fp, n) {
      const root = Fp.pow(n, p1div4);
      if (!Fp.eql(Fp.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _8n === _5n) {
    const c1 = (P - _5n) / _8n;
    return function sqrt5mod8(Fp, n) {
      const n2 = Fp.mul(n, _2n2);
      const v = Fp.pow(n2, c1);
      const nv = Fp.mul(n, v);
      const i = Fp.mul(Fp.mul(nv, _2n2), v);
      const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
      if (!Fp.eql(Fp.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _16n === _9n) {
  }
  return tonelliShanks(P);
}
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(f, num, power) {
  if (power < _0n2)
    throw new Error("Expected power > 0");
  if (power === _0n2)
    return f.ONE;
  if (power === _1n2)
    return num;
  let p = f.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = f.mul(p, d);
    d = f.sqr(d);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(f, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = acc;
    return f.mul(acc, num);
  }, f.ONE);
  const inverted = f.inv(lastMultiplied);
  nums.reduceRight((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = f.mul(acc, tmp[i]);
    return f.mul(acc, num);
  }, inverted);
  return tmp;
}
function nLength(n, nBitLength) {
  const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
  if (ORDER <= _0n2)
    throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("Field lengths over 2048 bytes are not supported");
  const sqrtP = FpSqrt(ORDER);
  const f = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n2 <= num && num < ORDER;
    },
    is0: (num) => num === _0n2,
    isOdd: (num) => (num & _1n2) === _1n2,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
    invertBatch: (lst) => FpInvertBatch(f, lst),
    cmov: (a, b, c) => c ? b : a,
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes2) => {
      if (bytes2.length !== BYTES)
        throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes2.length}`);
      return isLE2 ? bytesToNumberLE(bytes2) : bytesToNumberBE(bytes2);
    }
  });
  return Object.freeze(f);
}
function FpSqrtEven(Fp, elm) {
  if (!Fp.isOdd)
    throw new Error(`Field doesn't have isOdd`);
  const root = Fp.sqrt(elm);
  return Fp.isOdd(root) ? Fp.neg(root) : root;
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
  const num = isLE2 ? bytesToNumberBE(key) : bytesToNumberLE(key);
  const reduced = mod(num, fieldOrder - _1n2) + _1n2;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n2 = BigInt(2);
var _3n = BigInt(3);
var _4n = BigInt(4);
var _5n = BigInt(5);
var _8n = BigInt(8);
var _9n = BigInt(9);
var _16n = BigInt(16);
var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n2) === _1n2;
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];

// node_modules/@noble/curves/esm/abstract/curve.js
function wNAF(c, bits) {
  const constTimeNegate = (condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  };
  const opts = (W) => {
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  };
  return {
    constTimeNegate,
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d);
        d = d.double();
        n >>= _1n3;
      }
      return p;
    },
    precomputeWindow(elm, W) {
      const { windows, windowSize } = opts(W);
      const points = [];
      let p = elm;
      let base = p;
      for (let window2 = 0;window2 < windows; window2++) {
        base = p;
        points.push(base);
        for (let i = 1;i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = opts(W);
      let p = c.ZERO;
      let f = c.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window2 = 0;window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n3;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window2 % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f = f.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f };
    },
    wNAFCached(P, precomputesMap, n, transform) {
      const W = P._WINDOW_SIZE || 1;
      let comp = precomputesMap.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1) {
          precomputesMap.set(P, transform(comp));
        }
      }
      return this.wNAF(W, comp, n);
    }
  };
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);

// node_modules/@noble/curves/esm/abstract/edwards.js
var validateOpts = function(curve2) {
  const opts = validateBasic(curve2);
  validateObject(curve2, {
    hash: "function",
    a: "bigint",
    d: "bigint",
    randomBytes: "function"
  }, {
    adjustScalarBytes: "function",
    domain: "function",
    uvRatio: "function",
    mapToCurve: "function"
  });
  return Object.freeze({ ...opts });
};
function twistedEdwards(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp, n: CURVE_ORDER, prehash, hash: cHash, randomBytes: randomBytes2, nByteLength, h: cofactor } = CURVE;
  const MASK = _2n3 << BigInt(nByteLength * 8) - _1n4;
  const modP = Fp.create;
  const uvRatio = CURVE.uvRatio || ((u, v) => {
    try {
      return { isValid: true, value: Fp.sqrt(u * Fp.inv(v)) };
    } catch (e) {
      return { isValid: false, value: _0n4 };
    }
  });
  const adjustScalarBytes = CURVE.adjustScalarBytes || ((bytes2) => bytes2);
  const domain = CURVE.domain || ((data, ctx, phflag) => {
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  });
  const inBig = (n) => typeof n === "bigint" && _0n4 < n;
  const inRange = (n, max) => inBig(n) && inBig(max) && n < max;
  const in0MaskRange = (n) => n === _0n4 || inRange(n, MASK);
  function assertInRange(n, max) {
    if (inRange(n, max))
      return n;
    throw new Error(`Expected valid scalar < ${max}, got ${typeof n} ${n}`);
  }
  function assertGE0(n) {
    return n === _0n4 ? n : assertInRange(n, CURVE_ORDER);
  }
  const pointPrecomputes = new Map;
  function isPoint(other) {
    if (!(other instanceof Point))
      throw new Error("ExtendedPoint expected");
  }

  class Point {
    constructor(ex, ey, ez, et) {
      this.ex = ex;
      this.ey = ey;
      this.ez = ez;
      this.et = et;
      if (!in0MaskRange(ex))
        throw new Error("x required");
      if (!in0MaskRange(ey))
        throw new Error("y required");
      if (!in0MaskRange(ez))
        throw new Error("z required");
      if (!in0MaskRange(et))
        throw new Error("t required");
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static fromAffine(p) {
      if (p instanceof Point)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      if (!in0MaskRange(x) || !in0MaskRange(y))
        throw new Error("invalid affine point");
      return new Point(x, y, _1n4, modP(x * y));
    }
    static normalizeZ(points) {
      const toInv = Fp.invertBatch(points.map((p) => p.ez));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes.delete(this);
    }
    assertValidity() {
      const { a, d } = CURVE;
      if (this.is0())
        throw new Error("bad point: ZERO");
      const { ex: X, ey: Y, ez: Z, et: T } = this;
      const X2 = modP(X * X);
      const Y2 = modP(Y * Y);
      const Z2 = modP(Z * Z);
      const Z4 = modP(Z2 * Z2);
      const aX2 = modP(X2 * a);
      const left = modP(Z2 * modP(aX2 + Y2));
      const right = modP(Z4 + modP(d * modP(X2 * Y2)));
      if (left !== right)
        throw new Error("bad point: equation left != right (1)");
      const XY = modP(X * Y);
      const ZT = modP(Z * T);
      if (XY !== ZT)
        throw new Error("bad point: equation left != right (2)");
    }
    equals(other) {
      isPoint(other);
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const { ex: X2, ey: Y2, ez: Z2 } = other;
      const X1Z2 = modP(X1 * Z2);
      const X2Z1 = modP(X2 * Z1);
      const Y1Z2 = modP(Y1 * Z2);
      const Y2Z1 = modP(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(modP(-this.ex), this.ey, this.ez, modP(-this.et));
    }
    double() {
      const { a } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const A = modP(X1 * X1);
      const B = modP(Y1 * Y1);
      const C = modP(_2n3 * modP(Z1 * Z1));
      const D = modP(a * A);
      const x1y1 = X1 + Y1;
      const E = modP(modP(x1y1 * x1y1) - A - B);
      const G2 = D + B;
      const F = G2 - C;
      const H = D - B;
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    add(other) {
      isPoint(other);
      const { a, d } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
      const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
      if (a === BigInt(-1)) {
        const A2 = modP((Y1 - X1) * (Y2 + X2));
        const B2 = modP((Y1 + X1) * (Y2 - X2));
        const F2 = modP(B2 - A2);
        if (F2 === _0n4)
          return this.double();
        const C2 = modP(Z1 * _2n3 * T2);
        const D2 = modP(T1 * _2n3 * Z2);
        const E2 = D2 + C2;
        const G3 = B2 + A2;
        const H2 = D2 - C2;
        const X32 = modP(E2 * F2);
        const Y32 = modP(G3 * H2);
        const T32 = modP(E2 * H2);
        const Z32 = modP(F2 * G3);
        return new Point(X32, Y32, Z32, T32);
      }
      const A = modP(X1 * X2);
      const B = modP(Y1 * Y2);
      const C = modP(T1 * d * T2);
      const D = modP(Z1 * Z2);
      const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
      const F = D - C;
      const G2 = D + C;
      const H = modP(B - a * A);
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, pointPrecomputes, n, Point.normalizeZ);
    }
    multiply(scalar) {
      const { p, f } = this.wNAF(assertInRange(scalar, CURVE_ORDER));
      return Point.normalizeZ([p, f])[0];
    }
    multiplyUnsafe(scalar) {
      let n = assertGE0(scalar);
      if (n === _0n4)
        return I;
      if (this.equals(I) || n === _1n4)
        return this;
      if (this.equals(G))
        return this.wNAF(n).p;
      return wnaf.unsafeLadder(this, n);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    isTorsionFree() {
      return wnaf.unsafeLadder(this, CURVE_ORDER).is0();
    }
    toAffine(iz) {
      const { ex: x, ey: y, ez: z } = this;
      const is0 = this.is0();
      if (iz == null)
        iz = is0 ? _8n2 : Fp.inv(z);
      const ax = modP(x * iz);
      const ay = modP(y * iz);
      const zz = modP(z * iz);
      if (is0)
        return { x: _0n4, y: _1n4 };
      if (zz !== _1n4)
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    }
    clearCofactor() {
      const { h: cofactor2 } = CURVE;
      if (cofactor2 === _1n4)
        return this;
      return this.multiplyUnsafe(cofactor2);
    }
    static fromHex(hex, zip215 = false) {
      const { d, a } = CURVE;
      const len = Fp.BYTES;
      hex = ensureBytes("pointHex", hex, len);
      const normed = hex.slice();
      const lastByte = hex[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      if (y === _0n4) {
      } else {
        if (zip215)
          assertInRange(y, MASK);
        else
          assertInRange(y, Fp.ORDER);
      }
      const y2 = modP(y * y);
      const u = modP(y2 - _1n4);
      const v = modP(d * y2 - a);
      let { isValid, value: x } = uvRatio(u, v);
      if (!isValid)
        throw new Error("Point.fromHex: invalid y coordinate");
      const isXOdd = (x & _1n4) === _1n4;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === _0n4 && isLastByteOdd)
        throw new Error("Point.fromHex: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = modP(-x);
      return Point.fromAffine({ x, y });
    }
    static fromPrivateKey(privKey) {
      return getExtendedPublicKey(privKey).point;
    }
    toRawBytes() {
      const { x, y } = this.toAffine();
      const bytes2 = numberToBytesLE(y, Fp.BYTES);
      bytes2[bytes2.length - 1] |= x & _1n4 ? 128 : 0;
      return bytes2;
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n4, modP(CURVE.Gx * CURVE.Gy));
  Point.ZERO = new Point(_0n4, _1n4, _1n4, _0n4);
  const { BASE: G, ZERO: I } = Point;
  const wnaf = wNAF(Point, nByteLength * 8);
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function modN_LE(hash2) {
    return modN(bytesToNumberLE(hash2));
  }
  function getExtendedPublicKey(key) {
    const len = nByteLength;
    key = ensureBytes("private key", key, len);
    const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
    const head = adjustScalarBytes(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    const point = G.multiply(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  function getPublicKey(privKey) {
    return getExtendedPublicKey(privKey).pointBytes;
  }
  function hashDomainToScalar(context = new Uint8Array, ...msgs) {
    const msg = concatBytes2(...msgs);
    return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
  }
  function sign(msg, privKey, options = {}) {
    msg = ensureBytes("message", msg);
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
    const r = hashDomainToScalar(options.context, prefix, msg);
    const R = G.multiply(r).toRawBytes();
    const k = hashDomainToScalar(options.context, R, pointBytes, msg);
    const s = modN(r + k * scalar);
    assertGE0(s);
    const res = concatBytes2(R, numberToBytesLE(s, Fp.BYTES));
    return ensureBytes("result", res, nByteLength * 2);
  }
  const verifyOpts = VERIFY_DEFAULT;
  function verify(sig, msg, publicKey, options = verifyOpts) {
    const { context, zip215 } = options;
    const len = Fp.BYTES;
    sig = ensureBytes("signature", sig, 2 * len);
    msg = ensureBytes("message", msg);
    if (prehash)
      msg = prehash(msg);
    const s = bytesToNumberLE(sig.slice(len, 2 * len));
    let A, R, SB;
    try {
      A = Point.fromHex(publicKey, zip215);
      R = Point.fromHex(sig.slice(0, len), zip215);
      SB = G.multiplyUnsafe(s);
    } catch (error) {
      return false;
    }
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = hashDomainToScalar(context, R.toRawBytes(), A.toRawBytes(), msg);
    const RkA = R.add(A.multiplyUnsafe(k));
    return RkA.subtract(SB).clearCofactor().equals(Point.ZERO);
  }
  G._setWindowSize(8);
  const utils6 = {
    getExtendedPublicKey,
    randomPrivateKey: () => randomBytes2(Fp.BYTES),
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  return {
    CURVE,
    getPublicKey,
    sign,
    verify,
    ExtendedPoint: Point,
    utils: utils6
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n3 = BigInt(2);
var _8n2 = BigInt(8);
var VERIFY_DEFAULT = { zip215: true };

// node_modules/@noble/curves/esm/ed25519.js
var ed25519_pow_2_252_3 = function(x) {
  const P = ED25519_P;
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n4, P) * b2 % P;
  const b5 = pow2(b4, _1n5, P) * x % P;
  const b10 = pow2(b5, _5n2, P) * b5 % P;
  const b20 = pow2(b10, _10n, P) * b10 % P;
  const b40 = pow2(b20, _20n, P) * b20 % P;
  const b80 = pow2(b40, _40n, P) * b40 % P;
  const b160 = pow2(b80, _80n, P) * b80 % P;
  const b240 = pow2(b160, _80n, P) * b80 % P;
  const b250 = pow2(b240, _10n, P) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n4, P) * x % P;
  return { pow_p_5_8, b2 };
};
var adjustScalarBytes = function(bytes2) {
  bytes2[0] &= 248;
  bytes2[31] &= 127;
  bytes2[31] |= 64;
  return bytes2;
};
var uvRatio = function(u, v) {
  const P = ED25519_P;
  const v3 = mod(v * v * v, P);
  const v7 = mod(v3 * v3 * v, P);
  const pow3 = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow3, P);
  const vx2 = mod(v * x * x, P);
  const root1 = x;
  const root2 = mod(x * ED25519_SQRT_M1, P);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (isNegativeLE(x, P))
    x = mod(-x, P);
  return { isValid: useRoot1 || useRoot2, value: x };
};
var ed25519_domain = function(data, ctx, phflag) {
  if (ctx.length > 255)
    throw new Error("Context is too big");
  return concatBytes(utf8ToBytes("SigEd25519 no Ed25519 collisions"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
};
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var ED25519_P = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
var ED25519_SQRT_M1 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
var _0n5 = BigInt(0);
var _1n5 = BigInt(1);
var _2n4 = BigInt(2);
var _5n2 = BigInt(5);
var _10n = BigInt(10);
var _20n = BigInt(20);
var _40n = BigInt(40);
var _80n = BigInt(80);
var Fp = Field(ED25519_P, undefined, true);
var ed25519Defaults = {
  a: BigInt(-1),
  d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
  Fp,
  n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
  h: BigInt(8),
  Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
  Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
  hash: sha512,
  randomBytes,
  adjustScalarBytes,
  uvRatio
};
var ed25519 = twistedEdwards(ed25519Defaults);
var ed25519ctx = twistedEdwards({
  ...ed25519Defaults,
  domain: ed25519_domain
});
var ed25519ph = twistedEdwards({
  ...ed25519Defaults,
  domain: ed25519_domain,
  prehash: sha512
});
var ELL2_C1 = (Fp.ORDER + BigInt(3)) / BigInt(8);
var ELL2_C2 = Fp.pow(_2n4, ELL2_C1);
var ELL2_C3 = Fp.sqrt(Fp.neg(Fp.ONE));
var ELL2_C4 = (Fp.ORDER - BigInt(5)) / BigInt(8);
var ELL2_J = BigInt(486662);
var ELL2_C1_EDWARDS = FpSqrtEven(Fp, Fp.neg(BigInt(486664)));
var SQRT_AD_MINUS_ONE = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
var INVSQRT_A_MINUS_D = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
var ONE_MINUS_D_SQ = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
var D_MINUS_ONE_SQ = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
var MAX_255B = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

// node_modules/@solana/web3.js/lib/index.esm.js
var import_bn = __toESM(require_bn(), 1);
var import_bs58 = __toESM(require_bs58(), 1);

// node_modules/@noble/hashes/esm/sha256.js
var Chi = (a, b, c) => a & b ^ ~a & c;
var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var IV = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W = new Uint32Array(64);

class SHA256 extends SHA2 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0;i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16;i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0;i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
}
var sha256 = wrapConstructor(() => new SHA256);

// node_modules/@solana/web3.js/lib/index.esm.js
var import_borsh = __toESM(require_lib(), 1);
var BufferLayout = __toESM(require_Layout(), 1);
var buffer_layout = __toESM(require_Layout(), 1);
var import_bigint_buffer = __toESM(require_node(), 1);
import require$$0 from "util";
import require$$0$1 from "http";
import require$$0$2, {Agent as Agent$1} from "https";

// node_modules/superstruct/lib/index.es.js
var isIterable = function(x) {
  return isObject(x) && typeof x[Symbol.iterator] === "function";
};
var isObject = function(x) {
  return typeof x === "object" && x != null;
};
var print = function(value) {
  return typeof value === "string" ? JSON.stringify(value) : "" + value;
};
var shiftIterator = function(input) {
  const {
    done,
    value
  } = input.next();
  return done ? undefined : value;
};
var toFailure = function(result, context, struct, value) {
  if (result === true) {
    return;
  } else if (result === false) {
    result = {};
  } else if (typeof result === "string") {
    result = {
      message: result
    };
  }
  const {
    path,
    branch
  } = context;
  const {
    type
  } = struct;
  const {
    refinement,
    message = "Expected a value of type `" + type + "`" + (refinement ? " with refinement `" + refinement + "`" : "") + ", but received: `" + print(value) + "`"
  } = result;
  return {
    value,
    type,
    refinement,
    key: path[path.length - 1],
    path,
    branch,
    ...result,
    message
  };
};
function* toFailures(result, context, struct, value) {
  if (!isIterable(result)) {
    result = [result];
  }
  for (const r of result) {
    const failure = toFailure(r, context, struct, value);
    if (failure) {
      yield failure;
    }
  }
}
function* run(value, struct, options = {}) {
  const {
    path = [],
    branch = [value],
    coerce = false,
    mask = false
  } = options;
  const ctx = {
    path,
    branch
  };
  if (coerce) {
    value = struct.coercer(value, ctx);
    if (mask && struct.type !== "type" && isObject(struct.schema) && isObject(value) && !Array.isArray(value)) {
      for (const key in value) {
        if (struct.schema[key] === undefined) {
          delete value[key];
        }
      }
    }
  }
  let valid = true;
  for (const failure of struct.validator(value, ctx)) {
    valid = false;
    yield [failure, undefined];
  }
  for (let [k, v, s] of struct.entries(value, ctx)) {
    const ts = run(v, s, {
      path: k === undefined ? path : [...path, k],
      branch: k === undefined ? branch : [...branch, v],
      coerce,
      mask
    });
    for (const t of ts) {
      if (t[0]) {
        valid = false;
        yield [t[0], undefined];
      } else if (coerce) {
        v = t[1];
        if (k === undefined) {
          value = v;
        } else if (value instanceof Map) {
          value.set(k, v);
        } else if (value instanceof Set) {
          value.add(v);
        } else if (isObject(value)) {
          value[k] = v;
        }
      }
    }
  }
  if (valid) {
    for (const failure of struct.refiner(value, ctx)) {
      valid = false;
      yield [failure, undefined];
    }
  }
  if (valid) {
    yield [undefined, value];
  }
}
var assert = function(value, struct) {
  const result = validate(value, struct);
  if (result[0]) {
    throw result[0];
  }
};
var create = function(value, struct) {
  const result = validate(value, struct, {
    coerce: true
  });
  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
};
var mask = function(value, struct) {
  const result = validate(value, struct, {
    coerce: true,
    mask: true
  });
  if (result[0]) {
    throw result[0];
  } else {
    return result[1];
  }
};
var is = function(value, struct) {
  const result = validate(value, struct);
  return !result[0];
};
var validate = function(value, struct, options = {}) {
  const tuples = run(value, struct, options);
  const tuple = shiftIterator(tuples);
  if (tuple[0]) {
    const error = new StructError(tuple[0], function* () {
      for (const t of tuples) {
        if (t[0]) {
          yield t[0];
        }
      }
    });
    return [error, undefined];
  } else {
    const v = tuple[1];
    return [undefined, v];
  }
};
var define = function(name, validator) {
  return new Struct({
    type: name,
    schema: null,
    validator
  });
};
var any = function() {
  return define("any", () => true);
};
var array = function(Element) {
  return new Struct({
    type: "array",
    schema: Element,
    *entries(value) {
      if (Element && Array.isArray(value)) {
        for (const [i, v] of value.entries()) {
          yield [i, v, Element];
        }
      }
    },
    coercer(value) {
      return Array.isArray(value) ? value.slice() : value;
    },
    validator(value) {
      return Array.isArray(value) || "Expected an array value, but received: " + print(value);
    }
  });
};
var boolean = function() {
  return define("boolean", (value) => {
    return typeof value === "boolean";
  });
};
var instance = function(Class) {
  return define("instance", (value) => {
    return value instanceof Class || "Expected a `" + Class.name + "` instance, but received: " + print(value);
  });
};
var literal = function(constant) {
  const description = print(constant);
  const t = typeof constant;
  return new Struct({
    type: "literal",
    schema: t === "string" || t === "number" || t === "boolean" ? constant : null,
    validator(value) {
      return value === constant || "Expected the literal `" + description + "`, but received: " + print(value);
    }
  });
};
var never = function() {
  return define("never", () => false);
};
var nullable = function(struct) {
  return new Struct({
    ...struct,
    validator: (value, ctx) => value === null || struct.validator(value, ctx),
    refiner: (value, ctx) => value === null || struct.refiner(value, ctx)
  });
};
var number2 = function() {
  return define("number", (value) => {
    return typeof value === "number" && !isNaN(value) || "Expected a number, but received: " + print(value);
  });
};
var optional = function(struct) {
  return new Struct({
    ...struct,
    validator: (value, ctx) => value === undefined || struct.validator(value, ctx),
    refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx)
  });
};
var record = function(Key, Value) {
  return new Struct({
    type: "record",
    schema: null,
    *entries(value) {
      if (isObject(value)) {
        for (const k in value) {
          const v = value[k];
          yield [k, k, Key];
          yield [k, v, Value];
        }
      }
    },
    validator(value) {
      return isObject(value) || "Expected an object, but received: " + print(value);
    }
  });
};
var string = function() {
  return define("string", (value) => {
    return typeof value === "string" || "Expected a string, but received: " + print(value);
  });
};
var tuple = function(Elements) {
  const Never = never();
  return new Struct({
    type: "tuple",
    schema: null,
    *entries(value) {
      if (Array.isArray(value)) {
        const length = Math.max(Elements.length, value.length);
        for (let i = 0;i < length; i++) {
          yield [i, value[i], Elements[i] || Never];
        }
      }
    },
    validator(value) {
      return Array.isArray(value) || "Expected an array, but received: " + print(value);
    }
  });
};
var type = function(schema) {
  const keys = Object.keys(schema);
  return new Struct({
    type: "type",
    schema,
    *entries(value) {
      if (isObject(value)) {
        for (const k of keys) {
          yield [k, value[k], schema[k]];
        }
      }
    },
    validator(value) {
      return isObject(value) || "Expected an object, but received: " + print(value);
    }
  });
};
var union = function(Structs) {
  const description = Structs.map((s) => s.type).join(" | ");
  return new Struct({
    type: "union",
    schema: null,
    validator(value, ctx) {
      const failures = [];
      for (const S of Structs) {
        const [...tuples] = run(value, S, ctx);
        const [first] = tuples;
        if (!first[0]) {
          return [];
        } else {
          for (const [failure] of tuples) {
            if (failure) {
              failures.push(failure);
            }
          }
        }
      }
      return ["Expected the value to satisfy a union of `" + description + "`, but received: " + print(value), ...failures];
    }
  });
};
var unknown = function() {
  return define("unknown", () => true);
};
var coerce = function(struct, condition, coercer) {
  return new Struct({
    ...struct,
    coercer: (value, ctx) => {
      return is(value, condition) ? struct.coercer(coercer(value, ctx), ctx) : struct.coercer(value, ctx);
    }
  });
};
class StructError extends TypeError {
  constructor(failure, failures) {
    let cached;
    const {
      message,
      ...rest
    } = failure;
    const {
      path
    } = failure;
    const msg = path.length === 0 ? message : "At path: " + path.join(".") + " -- " + message;
    super(msg);
    Object.assign(this, rest);
    this.name = this.constructor.name;
    this.failures = () => {
      var _cached;
      return (_cached = cached) != null ? _cached : cached = [failure, ...failures()];
    };
  }
}

class Struct {
  constructor(props) {
    const {
      type: type2,
      schema,
      validator,
      refiner,
      coercer = (value) => value,
      entries = function* () {
      }
    } = props;
    this.type = type2;
    this.schema = schema;
    this.entries = entries;
    this.coercer = coercer;
    if (validator) {
      this.validator = (value, context) => {
        const result = validator(value, context);
        return toFailures(result, context, this, value);
      };
    } else {
      this.validator = () => [];
    }
    if (refiner) {
      this.refiner = (value, context) => {
        const result = refiner(value, context);
        return toFailures(result, context, this, value);
      };
    } else {
      this.refiner = () => [];
    }
  }
  assert(value) {
    return assert(value, this);
  }
  create(value) {
    return create(value, this);
  }
  is(value) {
    return is(value, this);
  }
  mask(value) {
    return mask(value, this);
  }
  validate(value, options = {}) {
    return validate(value, this, options);
  }
}

// node_modules/@solana/web3.js/lib/index.esm.js
var browser = __toESM(require_browser(), 1);
var client = __toESM(require_client(), 1);
var websocket = __toESM(require_websocket(), 1);
import * as nodeFetch from "node-fetch";

// node_modules/@noble/hashes/esm/sha3.js
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds;round < 24; round++) {
    for (let x = 0;x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0;x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0;y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0;t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0;y < 50; y += 10) {
      for (let x = 0;x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0;x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  B.fill(0);
}
var [SHA3_PI, SHA3_ROTL, _SHA3_IOTA] = [[], [], []];
var _0n6 = BigInt(0);
var _1n6 = BigInt(1);
var _2n5 = BigInt(2);
var _7n = BigInt(7);
var _256n = BigInt(256);
var _0x71n = BigInt(113);
for (let round = 0, R = _1n6, x = 1, y = 0;round < 24; round++) {
  [x, y] = [y, (2 * x + 3 * y) % 5];
  SHA3_PI.push(2 * (5 * y + x));
  SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
  let t = _0n6;
  for (let j = 0;j < 7; j++) {
    R = (R << _1n6 ^ (R >> _7n) * _0x71n) % _256n;
    if (R & _2n5)
      t ^= _1n6 << (_1n6 << BigInt(j)) - _1n6;
  }
  _SHA3_IOTA.push(t);
}
var [SHA3_IOTA_H, SHA3_IOTA_L] = split(_SHA3_IOTA, true);
var rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
var rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);

class Keccak extends Hash {
  constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
    super();
    this.blockLen = blockLen;
    this.suffix = suffix;
    this.outputLen = outputLen;
    this.enableXOF = enableXOF;
    this.rounds = rounds;
    this.pos = 0;
    this.posOut = 0;
    this.finished = false;
    this.destroyed = false;
    number(outputLen);
    if (0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200);
    this.state32 = u32(this.state);
  }
  keccak() {
    keccakP(this.state32, this.rounds);
    this.posOut = 0;
    this.pos = 0;
  }
  update(data) {
    exists(this);
    const { blockLen, state } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0;pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      for (let i = 0;i < take; i++)
        state[this.pos++] ^= data[pos++];
      if (this.pos === blockLen)
        this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = true;
    const { state, suffix, pos, blockLen } = this;
    state[pos] ^= suffix;
    if ((suffix & 128) !== 0 && pos === blockLen - 1)
      this.keccak();
    state[blockLen - 1] ^= 128;
    this.keccak();
  }
  writeInto(out) {
    exists(this, false);
    bytes(out);
    this.finish();
    const bufferOut = this.state;
    const { blockLen } = this;
    for (let pos = 0, len = out.length;pos < len; ) {
      if (this.posOut >= blockLen)
        this.keccak();
      const take = Math.min(blockLen - this.posOut, len - pos);
      out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
      this.posOut += take;
      pos += take;
    }
    return out;
  }
  xofInto(out) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(out);
  }
  xof(bytes2) {
    number(bytes2);
    return this.xofInto(new Uint8Array(bytes2));
  }
  digestInto(out) {
    output(out, this);
    if (this.finished)
      throw new Error("digest() was already called");
    this.writeInto(out);
    this.destroy();
    return out;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true;
    this.state.fill(0);
  }
  _cloneInto(to) {
    const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
    to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
    to.state32.set(this.state32);
    to.pos = this.pos;
    to.posOut = this.posOut;
    to.finished = this.finished;
    to.rounds = rounds;
    to.suffix = suffix;
    to.outputLen = outputLen;
    to.enableXOF = enableXOF;
    to.destroyed = this.destroyed;
    return to;
  }
}
var gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
var sha3_224 = gen(6, 144, 224 / 8);
var sha3_256 = gen(6, 136, 256 / 8);
var sha3_384 = gen(6, 104, 384 / 8);
var sha3_512 = gen(6, 72, 512 / 8);
var keccak_224 = gen(1, 144, 224 / 8);
var keccak_256 = gen(1, 136, 256 / 8);
var keccak_384 = gen(1, 104, 384 / 8);
var keccak_512 = gen(1, 72, 512 / 8);
var genShake = (suffix, blockLen, outputLen) => wrapXOFConstructorWithOpts((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === undefined ? outputLen : opts.dkLen, true));
var shake128 = genShake(31, 168, 128 / 8);
var shake256 = genShake(31, 136, 256 / 8);

// node_modules/@noble/curves/esm/abstract/weierstrass.js
var validatePointOpts = function(curve3) {
  const opts = validateBasic(curve3);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowedPrivateKeyLengths: "array",
    wrapPrivateKey: "boolean",
    isTorsionFree: "function",
    clearCofactor: "function",
    allowInfinityPoint: "boolean",
    fromBytes: "function",
    toBytes: "function"
  });
  const { endo, Fp: Fp2, a } = opts;
  if (endo) {
    if (!Fp2.eql(a, Fp2.ZERO)) {
      throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
    }
  }
  return Object.freeze({ ...opts });
};
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp: Fp2 } = CURVE;
  const toBytes2 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes2(Uint8Array.from([4]), Fp2.toBytes(a.x), Fp2.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || ((bytes2) => {
    const tail = bytes2.subarray(1);
    const x = Fp2.fromBytes(tail.subarray(0, Fp2.BYTES));
    const y = Fp2.fromBytes(tail.subarray(Fp2.BYTES, 2 * Fp2.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp2.sqr(x);
    const x3 = Fp2.mul(x2, x);
    return Fp2.add(Fp2.add(x3, Fp2.mul(x, a)), b);
  }
  if (!Fp2.eql(Fp2.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
    throw new Error("bad generator point: equation left != right");
  function isWithinCurveOrder(num) {
    return typeof num === "bigint" && _0n7 < num && num < CURVE.n;
  }
  function assertGE(num) {
    if (!isWithinCurveOrder(num))
      throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes3(key))
        key = bytesToHex(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("Invalid key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
    }
    if (wrapPrivateKey)
      num = mod(num, n);
    assertGE(num);
    return num;
  }
  const pointPrecomputes = new Map;
  function assertPrjPoint(other) {
    if (!(other instanceof Point))
      throw new Error("ProjectivePoint expected");
  }

  class Point {
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp2.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp2.isValid(py))
        throw new Error("y required");
      if (pz == null || !Fp2.isValid(pz))
        throw new Error("z required");
    }
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp2.isValid(x) || !Fp2.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point)
        throw new Error("projective point not allowed");
      const is0 = (i) => Fp2.eql(i, Fp2.ZERO);
      if (is0(x) && is0(y))
        return Point.ZERO;
      return new Point(x, y, Fp2.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static normalizeZ(points) {
      const toInv = Fp2.invertBatch(points.map((p) => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    static fromHex(hex) {
      const P = Point.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
      P.assertValidity();
      return P;
    }
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes.delete(this);
    }
    assertValidity() {
      if (this.is0()) {
        if (CURVE.allowInfinityPoint && !Fp2.is0(this.py))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = this.toAffine();
      if (!Fp2.isValid(x) || !Fp2.isValid(y))
        throw new Error("bad point: x or y not FE");
      const left = Fp2.sqr(y);
      const right = weierstrassEquation(x);
      if (!Fp2.eql(left, right))
        throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp2.isOdd)
        return !Fp2.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    equals(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp2.eql(Fp2.mul(X1, Z2), Fp2.mul(X2, Z1));
      const U2 = Fp2.eql(Fp2.mul(Y1, Z2), Fp2.mul(Y2, Z1));
      return U1 && U2;
    }
    negate() {
      return new Point(this.px, Fp2.neg(this.py), this.pz);
    }
    double() {
      const { a, b } = CURVE;
      const b3 = Fp2.mul(b, _3n2);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let { ZERO: X3, ZERO: Y3, ZERO: Z3 } = Fp2;
      let t0 = Fp2.mul(X1, X1);
      let t1 = Fp2.mul(Y1, Y1);
      let t2 = Fp2.mul(Z1, Z1);
      let t3 = Fp2.mul(X1, Y1);
      t3 = Fp2.add(t3, t3);
      Z3 = Fp2.mul(X1, Z1);
      Z3 = Fp2.add(Z3, Z3);
      X3 = Fp2.mul(a, Z3);
      Y3 = Fp2.mul(b3, t2);
      Y3 = Fp2.add(X3, Y3);
      X3 = Fp2.sub(t1, Y3);
      Y3 = Fp2.add(t1, Y3);
      Y3 = Fp2.mul(X3, Y3);
      X3 = Fp2.mul(t3, X3);
      Z3 = Fp2.mul(b3, Z3);
      t2 = Fp2.mul(a, t2);
      t3 = Fp2.sub(t0, t2);
      t3 = Fp2.mul(a, t3);
      t3 = Fp2.add(t3, Z3);
      Z3 = Fp2.add(t0, t0);
      t0 = Fp2.add(Z3, t0);
      t0 = Fp2.add(t0, t2);
      t0 = Fp2.mul(t0, t3);
      Y3 = Fp2.add(Y3, t0);
      t2 = Fp2.mul(Y1, Z1);
      t2 = Fp2.add(t2, t2);
      t0 = Fp2.mul(t2, t3);
      X3 = Fp2.sub(X3, t0);
      Z3 = Fp2.mul(t2, t1);
      Z3 = Fp2.add(Z3, Z3);
      Z3 = Fp2.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    add(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let { ZERO: X3, ZERO: Y3, ZERO: Z3 } = Fp2;
      const a = CURVE.a;
      const b3 = Fp2.mul(CURVE.b, _3n2);
      let t0 = Fp2.mul(X1, X2);
      let t1 = Fp2.mul(Y1, Y2);
      let t2 = Fp2.mul(Z1, Z2);
      let t3 = Fp2.add(X1, Y1);
      let t4 = Fp2.add(X2, Y2);
      t3 = Fp2.mul(t3, t4);
      t4 = Fp2.add(t0, t1);
      t3 = Fp2.sub(t3, t4);
      t4 = Fp2.add(X1, Z1);
      let t5 = Fp2.add(X2, Z2);
      t4 = Fp2.mul(t4, t5);
      t5 = Fp2.add(t0, t2);
      t4 = Fp2.sub(t4, t5);
      t5 = Fp2.add(Y1, Z1);
      X3 = Fp2.add(Y2, Z2);
      t5 = Fp2.mul(t5, X3);
      X3 = Fp2.add(t1, t2);
      t5 = Fp2.sub(t5, X3);
      Z3 = Fp2.mul(a, t4);
      X3 = Fp2.mul(b3, t2);
      Z3 = Fp2.add(X3, Z3);
      X3 = Fp2.sub(t1, Z3);
      Z3 = Fp2.add(t1, Z3);
      Y3 = Fp2.mul(X3, Z3);
      t1 = Fp2.add(t0, t0);
      t1 = Fp2.add(t1, t0);
      t2 = Fp2.mul(a, t2);
      t4 = Fp2.mul(b3, t4);
      t1 = Fp2.add(t1, t2);
      t2 = Fp2.sub(t0, t2);
      t2 = Fp2.mul(a, t2);
      t4 = Fp2.add(t4, t2);
      t0 = Fp2.mul(t1, t4);
      Y3 = Fp2.add(Y3, t0);
      t0 = Fp2.mul(t5, t4);
      X3 = Fp2.mul(t3, X3);
      X3 = Fp2.sub(X3, t0);
      t0 = Fp2.mul(t3, t1);
      Z3 = Fp2.mul(t5, Z3);
      Z3 = Fp2.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
        const toInv = Fp2.invertBatch(comp.map((p) => p.pz));
        return comp.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
      });
    }
    multiplyUnsafe(n) {
      const I = Point.ZERO;
      if (n === _0n7)
        return I;
      assertGE(n);
      if (n === _1n7)
        return this;
      const { endo } = CURVE;
      if (!endo)
        return wnaf.unsafeLadder(this, n);
      let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n7 || k2 > _0n7) {
        if (k1 & _1n7)
          k1p = k1p.add(d);
        if (k2 & _1n7)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n7;
        k2 >>= _1n7;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point(Fp2.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    multiply(scalar) {
      assertGE(scalar);
      let n = scalar;
      let point, fake;
      const { endo } = CURVE;
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point(Fp2.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(n);
        point = p;
        fake = f;
      }
      return Point.normalizeZ([point, fake])[0];
    }
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point.BASE;
      const mul = (P, a2) => a2 === _0n7 || a2 === _1n7 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? undefined : sum;
    }
    toAffine(iz) {
      const { px: x, py: y, pz: z } = this;
      const is0 = this.is0();
      if (iz == null)
        iz = is0 ? Fp2.ONE : Fp2.inv(z);
      const ax = Fp2.mul(x, iz);
      const ay = Fp2.mul(y, iz);
      const zz = Fp2.mul(z, iz);
      if (is0)
        return { x: Fp2.ZERO, y: Fp2.ZERO };
      if (!Fp2.eql(zz, Fp2.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n7)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n7)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      this.assertValidity();
      return toBytes2(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex(this.toRawBytes(isCompressed));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp2.ONE);
  Point.ZERO = new Point(Fp2.ZERO, Fp2.ONE, Fp2.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  return {
    CURVE,
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
var validateOpts2 = function(curve3) {
  const opts = validateBasic(curve3);
  validateObject(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
};
function weierstrass(curveDef) {
  const CURVE = validateOpts2(curveDef);
  const { Fp: Fp2, n: CURVE_ORDER } = CURVE;
  const compressedLen = Fp2.BYTES + 1;
  const uncompressedLen = 2 * Fp2.BYTES + 1;
  function isValidFieldElement(num) {
    return _0n7 < num && num < Fp2.ORDER;
  }
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp2.toBytes(a.x);
      const cat = concatBytes2;
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp2.toBytes(a.y));
      }
    },
    fromBytes(bytes2) {
      const len = bytes2.length;
      const head = bytes2[0];
      const tail = bytes2.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE(tail);
        if (!isValidFieldElement(x))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y = Fp2.sqrt(y2);
        const isYOdd = (y & _1n7) === _1n7;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp2.neg(y);
        return { x, y };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp2.fromBytes(tail.subarray(0, Fp2.BYTES));
        const y = Fp2.fromBytes(tail.subarray(Fp2.BYTES, 2 * Fp2.BYTES));
        return { x, y };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = (num) => bytesToHex(numberToBytesBE(num, CURVE.nByteLength));
  function isBiggerThanHalfOrder(number3) {
    const HALF = CURVE_ORDER >> _1n7;
    return number3 > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN(-s) : s;
  }
  const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));

  class Signature {
    constructor(r, s, recovery) {
      this.r = r;
      this.s = s;
      this.recovery = recovery;
      this.assertValidity();
    }
    static fromCompact(hex) {
      const l = CURVE.nByteLength;
      hex = ensureBytes("compactSignature", hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    static fromDER(hex) {
      const { r, s } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r, s);
    }
    assertValidity() {
      if (!isWithinCurveOrder(this.r))
        throw new Error("r must be 0 < r < CURVE.n");
      if (!isWithinCurveOrder(this.s))
        throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s, recovery: rec } = this;
      const h = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp2.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj);
      const u1 = modN(-h * ir);
      const u2 = modN(s * ir);
      const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    toDERRawBytes() {
      return hexToBytes(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig({ r: this.r, s: this.s });
    }
    toCompactRawBytes() {
      return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
      return numToNByteStr(this.r) + numToNByteStr(this.s);
    }
  }
  const utils10 = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    randomPrivateKey: () => {
      const length = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length), CURVE.n);
    },
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey(privateKey, isCompressed = true) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    const arr = isBytes3(item);
    const str = typeof item === "string";
    const len = (arr || str) && item.length;
    if (arr)
      return len === compressedLen || len === uncompressedLen;
    if (str)
      return len === 2 * compressedLen || len === 2 * uncompressedLen;
    if (item instanceof Point)
      return true;
    return false;
  }
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA))
      throw new Error("first arg must be private key");
    if (!isProbPub(publicB))
      throw new Error("second arg must be public key");
    const b = Point.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes2) {
    const num = bytesToNumberBE(bytes2);
    const delta = bytes2.length * 8 - CURVE.nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes2) {
    return modN(bits2int(bytes2));
  };
  const ORDER_MASK = bitMask(CURVE.nBitLength);
  function int2octets(num) {
    if (typeof num !== "bigint")
      throw new Error("bigint expected");
    if (!(_0n7 <= num && num < ORDER_MASK))
      throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
    return numberToBytesBE(num, CURVE.nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => (k in opts)))
      throw new Error("sign() legacy options not supported");
    const { hash: hash2, randomBytes: randomBytes2 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash2(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null) {
      const e = ent === true ? randomBytes2(Fp2.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point.BASE.multiply(k).toAffine();
      const r = modN(q.x);
      if (r === _0n7)
        return;
      const s = modN(ik * modN(m + r * d));
      if (s === _0n7)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n7);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig);
  }
  Point.BASE._setWindowSize(8);
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    const { lowS, prehash } = opts;
    let _sig = undefined;
    let P;
    try {
      if (typeof sg === "string" || isBytes3(sg)) {
        try {
          _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
          _sig = Signature.fromCompact(sg);
        }
      } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
        const { r: r2, s: s2 } = sg;
        _sig = new Signature(r2, s2);
      } else {
        throw new Error("PARSE");
      }
      P = Point.fromHex(publicKey);
    } catch (error) {
      if (error.message === "PARSE")
        throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
      return false;
    }
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is2 = invN(s);
    const u1 = modN(h * is2);
    const u2 = modN(r * is2);
    const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
    if (!R)
      return false;
    const v = modN(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point,
    Signature,
    utils: utils10
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var { bytesToNumberBE: b2n, hexToBytes: h2b } = exports_utils;
var DER = {
  Err: class DERErr extends Error {
    constructor(m = "") {
      super(m);
    }
  },
  _parseInt(data) {
    const { Err: E } = DER;
    if (data.length < 2 || data[0] !== 2)
      throw new E("Invalid signature integer tag");
    const len = data[1];
    const res = data.subarray(2, len + 2);
    if (!len || res.length !== len)
      throw new E("Invalid signature integer: wrong length");
    if (res[0] & 128)
      throw new E("Invalid signature integer: negative");
    if (res[0] === 0 && !(res[1] & 128))
      throw new E("Invalid signature integer: unnecessary leading zero");
    return { d: b2n(res), l: data.subarray(len + 2) };
  },
  toSig(hex) {
    const { Err: E } = DER;
    const data = typeof hex === "string" ? h2b(hex) : hex;
    if (!isBytes3(data))
      throw new Error("ui8a expected");
    let l = data.length;
    if (l < 2 || data[0] != 48)
      throw new E("Invalid signature tag");
    if (data[1] !== l - 2)
      throw new E("Invalid signature: incorrect length");
    const { d: r, l: sBytes } = DER._parseInt(data.subarray(2));
    const { d: s, l: rBytesLeft } = DER._parseInt(sBytes);
    if (rBytesLeft.length)
      throw new E("Invalid signature: left bytes after parsing");
    return { r, s };
  },
  hexFromSig(sig) {
    const slice = (s2) => Number.parseInt(s2[0], 16) & 8 ? "00" + s2 : s2;
    const h = (num) => {
      const hex = num.toString(16);
      return hex.length & 1 ? `0${hex}` : hex;
    };
    const s = slice(h(sig.s));
    const r = slice(h(sig.r));
    const shl = s.length / 2;
    const rhl = r.length / 2;
    const sl = h(shl);
    const rl = h(rhl);
    return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
  }
};
var _0n7 = BigInt(0);
var _1n7 = BigInt(1);
var _2n6 = BigInt(2);
var _3n2 = BigInt(3);
var _4n2 = BigInt(4);

// node_modules/@noble/hashes/esm/hmac.js
class HMAC extends Hash {
  constructor(hash2, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash(hash2);
    const key = toBytes(_key);
    this.iHash = hash2.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
    for (let i = 0;i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash2.create();
    for (let i = 0;i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists(this);
    bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
}
var hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
hmac.create = (hash2, key) => new HMAC(hash2, key);

// node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash2) {
  return {
    hash: hash2,
    hmac: (key, ...msgs) => hmac(hash2, key, concatBytes(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create2 = (hash2) => weierstrass({ ...curveDef, ...getHash(hash2) });
  return Object.freeze({ ...create2(defHash), create: create2 });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */

// node_modules/@noble/curves/esm/secp256k1.js
var sqrtMod = function(y) {
  const P = secp256k1P;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n3, P) * b3 % P;
  const b9 = pow2(b6, _3n3, P) * b3 % P;
  const b11 = pow2(b9, _2n7, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n3, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n7, P);
  if (!Fp2.eql(Fp2.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
};
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _1n8 = BigInt(1);
var _2n7 = BigInt(2);
var divNearest = (a, b) => (a + b / _2n7) / b;
var Fp2 = Field(secp256k1P, undefined, undefined, { sqrt: sqrtMod });
var secp256k1 = createCurve({
  a: BigInt(0),
  b: BigInt(7),
  Fp: Fp2,
  n: secp256k1N,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  lowS: true,
  endo: {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: (k) => {
      const n = secp256k1N;
      const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
      const b1 = -_1n8 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
      const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
      const b2 = a1;
      const POW_2_128 = BigInt("0x100000000000000000000000000000000");
      const c1 = divNearest(b2 * k, n);
      const c2 = divNearest(-b1 * k, n);
      let k1 = mod(k - c1 * a1 - c2 * a2, n);
      let k2 = mod(-c1 * b1 - c2 * b2, n);
      const k1neg = k1 > POW_2_128;
      const k2neg = k2 > POW_2_128;
      if (k1neg)
        k1 = n - k1;
      if (k2neg)
        k2 = n - k2;
      if (k1 > POW_2_128 || k2 > POW_2_128) {
        throw new Error("splitScalar: Endomorphism failed, k=" + k);
      }
      return { k1neg, k1, k2neg, k2 };
    }
  }
}, sha256);
var _0n8 = BigInt(0);
var Point = secp256k1.ProjectivePoint;

// node_modules/@solana/web3.js/lib/index.esm.js
var isOnCurve = function(publicKey) {
  try {
    ed25519.ExtendedPoint.fromHex(publicKey);
    return true;
  } catch {
    return false;
  }
};
var isPublicKeyData = function(value) {
  return value._bn !== undefined;
};
var getAlloc = function(type2, fields) {
  const getItemAlloc = (item) => {
    if (item.span >= 0) {
      return item.span;
    } else if (typeof item.alloc === "function") {
      return item.alloc(fields[item.property]);
    } else if ("count" in item && "elementLayout" in item) {
      const field = fields[item.property];
      if (Array.isArray(field)) {
        return field.length * getItemAlloc(item.elementLayout);
      }
    } else if ("fields" in item) {
      return getAlloc({
        layout: item
      }, fields[item.property]);
    }
    return 0;
  };
  let alloc = 0;
  type2.layout.fields.forEach((item) => {
    alloc += getItemAlloc(item);
  });
  return alloc;
};
var decodeLength = function(bytes2) {
  let len = 0;
  let size = 0;
  for (;; ) {
    let elem = bytes2.shift();
    len |= (elem & 127) << size * 7;
    size += 1;
    if ((elem & 128) === 0) {
      break;
    }
  }
  return len;
};
var encodeLength = function(bytes2, len) {
  let rem_len = len;
  for (;; ) {
    let elem = rem_len & 127;
    rem_len >>= 7;
    if (rem_len == 0) {
      bytes2.push(elem);
      break;
    } else {
      elem |= 128;
      bytes2.push(elem);
    }
  }
};
var assert2 = function(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
};
async function sendAndConfirmTransaction(connection, transaction, signers, options) {
  const sendOptions = options && {
    skipPreflight: options.skipPreflight,
    preflightCommitment: options.preflightCommitment || options.commitment,
    maxRetries: options.maxRetries,
    minContextSlot: options.minContextSlot
  };
  const signature = await connection.sendTransaction(transaction, signers, sendOptions);
  let status;
  if (transaction.recentBlockhash != null && transaction.lastValidBlockHeight != null) {
    status = (await connection.confirmTransaction({
      abortSignal: options?.abortSignal,
      signature,
      blockhash: transaction.recentBlockhash,
      lastValidBlockHeight: transaction.lastValidBlockHeight
    }, options && options.commitment)).value;
  } else if (transaction.minNonceContextSlot != null && transaction.nonceInfo != null) {
    const {
      nonceInstruction
    } = transaction.nonceInfo;
    const nonceAccountPubkey = nonceInstruction.keys[0].pubkey;
    status = (await connection.confirmTransaction({
      abortSignal: options?.abortSignal,
      minContextSlot: transaction.minNonceContextSlot,
      nonceAccountPubkey,
      nonceValue: transaction.nonceInfo.nonce,
      signature
    }, options && options.commitment)).value;
  } else {
    if (options?.abortSignal != null) {
      console.warn("sendAndConfirmTransaction(): A transaction with a deprecated confirmation strategy was supplied along with an `abortSignal`. Only transactions having `lastValidBlockHeight` or a combination of `nonceInfo` and `minNonceContextSlot` are abortable.");
    }
    status = (await connection.confirmTransaction(signature, options && options.commitment)).value;
  }
  if (status.err) {
    throw new Error(`Transaction ${signature} failed (${JSON.stringify(status)})`);
  }
  return signature;
}
var sleep = function(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
var encodeData = function(type2, fields) {
  const allocLength = type2.layout.span >= 0 ? type2.layout.span : getAlloc(type2, fields);
  const data = Buffer2.alloc(allocLength);
  const layoutFields = Object.assign({
    instruction: type2.index
  }, fields);
  type2.layout.encode(layoutFields, data);
  return data;
};
var decodeData$1 = function(type2, buffer) {
  let data;
  try {
    data = type2.layout.decode(buffer);
  } catch (err) {
    throw new Error("invalid instruction; " + err);
  }
  if (data.instruction !== type2.index) {
    throw new Error(`invalid instruction; instruction index mismatch ${data.instruction} != ${type2.index}`);
  }
  return data;
};
var getDefaultExportFromCjs = function(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
};
var parse = function(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type2 = (match[2] || "ms").toLowerCase();
  switch (type2) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "weeks":
    case "week":
    case "w":
      return n * w;
    case "days":
    case "day":
    case "d":
      return n * d;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      return;
  }
};
var fmtShort = function(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + "d";
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + "h";
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + "m";
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + "s";
  }
  return ms + "ms";
};
var fmtLong = function(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, "day");
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, "hour");
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, "minute");
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, "second");
  }
  return ms + " ms";
};
var plural = function(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
};
var deprecate = function(message) {
  console.log("[agentkeepalive:deprecated] %s", message);
};
var getSocketTimeout = function(socket) {
  return socket.timeout || socket._idleTimeout;
};
var installListeners = function(agent, socket, options) {
  debug("%s create, timeout %sms", socket[SOCKET_NAME], getSocketTimeout(socket));
  function onFree() {
    if (!socket._httpMessage && socket[SOCKET_REQUEST_COUNT] === 1)
      return;
    socket[SOCKET_REQUEST_FINISHED_COUNT]++;
    agent.requestCount++;
    debug("%s(requests: %s, finished: %s) free", socket[SOCKET_NAME], socket[SOCKET_REQUEST_COUNT], socket[SOCKET_REQUEST_FINISHED_COUNT]);
    const name = agent.getName(options);
    if (socket.writable && agent.requests[name] && agent.requests[name].length) {
      socket[SOCKET_REQUEST_COUNT]++;
      debug("%s(requests: %s, finished: %s) will be reuse on agent free event", socket[SOCKET_NAME], socket[SOCKET_REQUEST_COUNT], socket[SOCKET_REQUEST_FINISHED_COUNT]);
    }
  }
  socket.on("free", onFree);
  function onClose(isError) {
    debug("%s(requests: %s, finished: %s) close, isError: %s", socket[SOCKET_NAME], socket[SOCKET_REQUEST_COUNT], socket[SOCKET_REQUEST_FINISHED_COUNT], isError);
    agent.closeSocketCount++;
  }
  socket.on("close", onClose);
  function onTimeout() {
    const listenerCount = socket.listeners("timeout").length;
    const timeout = getSocketTimeout(socket);
    const req = socket._httpMessage;
    const reqTimeoutListenerCount = req && req.listeners("timeout").length || 0;
    debug("%s(requests: %s, finished: %s) timeout after %sms, listeners %s, defaultTimeoutListenerCount %s, hasHttpRequest %s, HttpRequest timeoutListenerCount %s", socket[SOCKET_NAME], socket[SOCKET_REQUEST_COUNT], socket[SOCKET_REQUEST_FINISHED_COUNT], timeout, listenerCount, defaultTimeoutListenerCount, !!req, reqTimeoutListenerCount);
    if (debug.enabled) {
      debug("timeout listeners: %s", socket.listeners("timeout").map((f) => f.name).join(", "));
    }
    agent.timeoutSocketCount++;
    const name = agent.getName(options);
    if (agent.freeSockets[name] && agent.freeSockets[name].indexOf(socket) !== -1) {
      socket.destroy();
      agent.removeSocket(socket, options);
      debug("%s is free, destroy quietly", socket[SOCKET_NAME]);
    } else {
      if (reqTimeoutListenerCount === 0) {
        const error = new Error("Socket timeout");
        error.code = "ERR_SOCKET_TIMEOUT";
        error.timeout = timeout;
        socket.destroy(error);
        agent.removeSocket(socket, options);
        debug("%s destroy with timeout error", socket[SOCKET_NAME]);
      }
    }
  }
  socket.on("timeout", onTimeout);
  function onError(err) {
    const listenerCount = socket.listeners("error").length;
    debug("%s(requests: %s, finished: %s) error: %s, listenerCount: %s", socket[SOCKET_NAME], socket[SOCKET_REQUEST_COUNT], socket[SOCKET_REQUEST_FINISHED_COUNT], err, listenerCount);
    agent.errorSocketCount++;
    if (listenerCount === 1) {
      debug("%s emit uncaught error event", socket[SOCKET_NAME]);
      socket.removeListener("error", onError);
      socket.emit("error", err);
    }
  }
  socket.on("error", onError);
  function onRemove() {
    debug("%s(requests: %s, finished: %s) agentRemove", socket[SOCKET_NAME], socket[SOCKET_REQUEST_COUNT], socket[SOCKET_REQUEST_FINISHED_COUNT]);
    socket.removeListener("close", onClose);
    socket.removeListener("error", onError);
    socket.removeListener("free", onFree);
    socket.removeListener("timeout", onTimeout);
    socket.removeListener("agentRemove", onRemove);
  }
  socket.on("agentRemove", onRemove);
};
var inspect = function(obj) {
  const res = {};
  for (const key in obj) {
    res[key] = obj[key].length;
  }
  return res;
};
var stringify = function(val, isArrayProp) {
  var i, max, str, keys, key, propVal, toStr2;
  if (val === true) {
    return "true";
  }
  if (val === false) {
    return "false";
  }
  switch (typeof val) {
    case "object":
      if (val === null) {
        return null;
      } else if (val.toJSON && typeof val.toJSON === "function") {
        return stringify(val.toJSON(), isArrayProp);
      } else {
        toStr2 = objToString.call(val);
        if (toStr2 === "[object Array]") {
          str = "[";
          max = val.length - 1;
          for (i = 0;i < max; i++) {
            str += stringify(val[i], true) + ",";
          }
          if (max > -1) {
            str += stringify(val[i], true);
          }
          return str + "]";
        } else if (toStr2 === "[object Object]") {
          keys = objKeys(val).sort();
          max = keys.length;
          str = "";
          i = 0;
          while (i < max) {
            key = keys[i];
            propVal = stringify(val[key], false);
            if (propVal !== undefined) {
              if (str) {
                str += ",";
              }
              str += JSON.stringify(key) + ":" + propVal;
            }
            i++;
          }
          return "{" + str + "}";
        } else {
          return JSON.stringify(val);
        }
      }
    case "function":
    case "undefined":
      return isArrayProp ? null : undefined;
    case "string":
      return JSON.stringify(val);
    default:
      return isFinite(val) ? val : null;
  }
};
var trailingZeros = function(n) {
  let trailingZeros2 = 0;
  while (n > 1) {
    n /= 2;
    trailingZeros2++;
  }
  return trailingZeros2;
};
var nextPowerOfTwo = function(n) {
  if (n === 0)
    return 1;
  n--;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  n |= n >> 32;
  return n + 1;
};
var decodeData = function(type2, data) {
  let decoded;
  try {
    decoded = type2.layout.decode(data);
  } catch (err) {
    throw new Error("invalid instruction; " + err);
  }
  if (decoded.typeIndex !== type2.index) {
    throw new Error(`invalid account data; account type mismatch ${decoded.typeIndex} != ${type2.index}`);
  }
  return decoded;
};
var makeWebsocketUrl = function(endpoint) {
  const matches = endpoint.match(URL_RE);
  if (matches == null) {
    throw TypeError(`Failed to validate endpoint URL \`${endpoint}\``);
  }
  const [
    _,
    hostish,
    portWithColon,
    rest
  ] = matches;
  const protocol = endpoint.startsWith("https:") ? "wss:" : "ws:";
  const startPort = portWithColon == null ? null : parseInt(portWithColon.slice(1), 10);
  const websocketPort = startPort == null ? "" : `:${startPort + 1}`;
  return `${protocol}//${hostish}${websocketPort}${rest}`;
};
var assertEndpointUrl = function(putativeUrl) {
  if (/^https?:/.test(putativeUrl) === false) {
    throw new TypeError("Endpoint URL must start with `http:` or `https:`.");
  }
  return putativeUrl;
};
var extractCommitmentFromConfig = function(commitmentOrConfig) {
  let commitment;
  let config;
  if (typeof commitmentOrConfig === "string") {
    commitment = commitmentOrConfig;
  } else if (commitmentOrConfig) {
    const {
      commitment: specifiedCommitment,
      ...specifiedConfig
    } = commitmentOrConfig;
    commitment = specifiedCommitment;
    config = specifiedConfig;
  }
  return {
    commitment,
    config
  };
};
var createRpcResult = function(result) {
  return union([type({
    jsonrpc: literal("2.0"),
    id: string(),
    result
  }), type({
    jsonrpc: literal("2.0"),
    id: string(),
    error: type({
      code: unknown(),
      message: string(),
      data: optional(any())
    })
  })]);
};
var jsonRpcResult = function(schema) {
  return coerce(createRpcResult(schema), UnknownRpcResult, (value) => {
    if ("error" in value) {
      return value;
    } else {
      return {
        ...value,
        result: create(value.result, schema)
      };
    }
  });
};
var jsonRpcResultAndContext = function(value) {
  return jsonRpcResult(type({
    context: type({
      slot: number2()
    }),
    value
  }));
};
var notificationResultAndContext = function(value) {
  return type({
    context: type({
      slot: number2()
    }),
    value
  });
};
var versionedMessageFromResponse = function(version, response) {
  if (version === 0) {
    return new MessageV0({
      header: response.header,
      staticAccountKeys: response.accountKeys.map((accountKey) => new PublicKey(accountKey)),
      recentBlockhash: response.recentBlockhash,
      compiledInstructions: response.instructions.map((ix) => ({
        programIdIndex: ix.programIdIndex,
        accountKeyIndexes: ix.accounts,
        data: import_bs58.default.decode(ix.data)
      })),
      addressTableLookups: response.addressTableLookups
    });
  } else {
    return new Message(response);
  }
};
var createRpcClient = function(url, httpHeaders, customFetch, fetchMiddleware, disableRetryOnRateLimit, httpAgent) {
  const fetch = customFetch ? customFetch : fetchImpl;
  let agent;
  {
    if (httpAgent == null) {
      {
        const agentOptions = {
          freeSocketTimeout: 19000,
          keepAlive: true,
          maxSockets: 25
        };
        if (url.startsWith("https:")) {
          agent = new HttpsAgent2(agentOptions);
        } else {
          agent = new HttpKeepAliveAgent(agentOptions);
        }
      }
    } else {
      if (httpAgent !== false) {
        const isHttps = url.startsWith("https:");
        if (isHttps && !(httpAgent instanceof Agent$1)) {
          throw new Error("The endpoint `" + url + "` can only be paired with an `https.Agent`. You have, instead, supplied an `http.Agent` through `httpAgent`.");
        } else if (!isHttps && httpAgent instanceof Agent$1) {
          throw new Error("The endpoint `" + url + "` can only be paired with an `http.Agent`. You have, instead, supplied an `https.Agent` through `httpAgent`.");
        }
        agent = httpAgent;
      }
    }
  }
  let fetchWithMiddleware;
  if (fetchMiddleware) {
    fetchWithMiddleware = async (info, init) => {
      const modifiedFetchArgs = await new Promise((resolve, reject) => {
        try {
          fetchMiddleware(info, init, (modifiedInfo, modifiedInit) => resolve([modifiedInfo, modifiedInit]));
        } catch (error) {
          reject(error);
        }
      });
      return await fetch(...modifiedFetchArgs);
    };
  }
  const clientBrowser = new browser.default(async (request, callback) => {
    const options = {
      method: "POST",
      body: request,
      agent,
      headers: Object.assign({
        "Content-Type": "application/json"
      }, httpHeaders || {}, COMMON_HTTP_HEADERS)
    };
    try {
      let too_many_requests_retries = 5;
      let res;
      let waitTime = 500;
      for (;; ) {
        if (fetchWithMiddleware) {
          res = await fetchWithMiddleware(url, options);
        } else {
          res = await fetch(url, options);
        }
        if (res.status !== 429) {
          break;
        }
        if (disableRetryOnRateLimit === true) {
          break;
        }
        too_many_requests_retries -= 1;
        if (too_many_requests_retries === 0) {
          break;
        }
        console.error(`Server responded with ${res.status} ${res.statusText}.  Retrying after ${waitTime}ms delay...`);
        await sleep(waitTime);
        waitTime *= 2;
      }
      const text = await res.text();
      if (res.ok) {
        callback(null, text);
      } else {
        callback(new Error(`${res.status} ${res.statusText}: ${text}`));
      }
    } catch (err) {
      if (err instanceof Error)
        callback(err);
    }
  }, {});
  return clientBrowser;
};
var createRpcRequest = function(client2) {
  return (method, args) => {
    return new Promise((resolve, reject) => {
      client2.request(method, args, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  };
};
var createRpcBatchRequest = function(client2) {
  return (requests) => {
    return new Promise((resolve, reject) => {
      if (requests.length === 0)
        resolve([]);
      const batch = requests.map((params) => {
        return client2.request(params.methodName, params.args);
      });
      client2.request(batch, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  };
};
var parseAuthorizedVoter = function({
  authorizedVoter,
  epoch
}) {
  return {
    epoch,
    authorizedVoter: new PublicKey(authorizedVoter)
  };
};
var parsePriorVoters = function({
  authorizedPubkey,
  epochOfLastAuthorizedSwitch,
  targetEpoch
}) {
  return {
    authorizedPubkey: new PublicKey(authorizedPubkey),
    epochOfLastAuthorizedSwitch,
    targetEpoch
  };
};
var getPriorVoters = function({
  buf,
  idx,
  isEmpty
}) {
  if (isEmpty) {
    return [];
  }
  return [...buf.slice(idx + 1).map(parsePriorVoters), ...buf.slice(0, idx).map(parsePriorVoters)];
};
var clusterApiUrl = function(cluster, tls) {
  const key = tls === false ? "http" : "https";
  if (!cluster) {
    return endpoint[key]["devnet"];
  }
  const url = endpoint[key][cluster];
  if (!url) {
    throw new Error(`Unknown ${key} cluster: ${cluster}`);
  }
  return url;
};
async function sendAndConfirmRawTransaction(connection, rawTransaction, confirmationStrategyOrConfirmOptions, maybeConfirmOptions) {
  let confirmationStrategy;
  let options;
  if (confirmationStrategyOrConfirmOptions && Object.prototype.hasOwnProperty.call(confirmationStrategyOrConfirmOptions, "lastValidBlockHeight")) {
    confirmationStrategy = confirmationStrategyOrConfirmOptions;
    options = maybeConfirmOptions;
  } else if (confirmationStrategyOrConfirmOptions && Object.prototype.hasOwnProperty.call(confirmationStrategyOrConfirmOptions, "nonceValue")) {
    confirmationStrategy = confirmationStrategyOrConfirmOptions;
    options = maybeConfirmOptions;
  } else {
    options = confirmationStrategyOrConfirmOptions;
  }
  const sendOptions = options && {
    skipPreflight: options.skipPreflight,
    preflightCommitment: options.preflightCommitment || options.commitment,
    minContextSlot: options.minContextSlot
  };
  const signature = await connection.sendRawTransaction(rawTransaction, sendOptions);
  const commitment = options && options.commitment;
  const confirmationPromise = confirmationStrategy ? connection.confirmTransaction(confirmationStrategy, commitment) : connection.confirmTransaction(signature, commitment);
  const status = (await confirmationPromise).value;
  if (status.err) {
    throw new Error(`Raw transaction ${signature} failed (${JSON.stringify(status)})`);
  }
  return signature;
}
var generatePrivateKey = ed25519.utils.randomPrivateKey;
var generateKeypair = () => {
  const privateScalar = ed25519.utils.randomPrivateKey();
  const publicKey = getPublicKey(privateScalar);
  const secretKey = new Uint8Array(64);
  secretKey.set(privateScalar);
  secretKey.set(publicKey, 32);
  return {
    publicKey,
    secretKey
  };
};
var getPublicKey = ed25519.getPublicKey;
var sign = (message, secretKey) => ed25519.sign(message, secretKey.slice(0, 32));
var verify = ed25519.verify;
var toBuffer = (arr) => {
  if (Buffer2.isBuffer(arr)) {
    return arr;
  } else if (arr instanceof Uint8Array) {
    return Buffer2.from(arr.buffer, arr.byteOffset, arr.byteLength);
  } else {
    return Buffer2.from(arr);
  }
};

class Struct2 {
  constructor(properties) {
    Object.assign(this, properties);
  }
  encode() {
    return Buffer2.from(import_borsh.serialize(SOLANA_SCHEMA, this));
  }
  static decode(data) {
    return import_borsh.deserialize(SOLANA_SCHEMA, this, data);
  }
  static decodeUnchecked(data) {
    return import_borsh.deserializeUnchecked(SOLANA_SCHEMA, this, data);
  }
}

class Enum extends Struct2 {
  constructor(properties) {
    super(properties);
    this.enum = "";
    if (Object.keys(properties).length !== 1) {
      throw new Error("Enum can only take single value");
    }
    Object.keys(properties).map((key) => {
      this.enum = key;
    });
  }
}
var SOLANA_SCHEMA = new Map;
var _class;
var _Symbol$toStringTag;
var MAX_SEED_LENGTH = 32;
var PUBLIC_KEY_LENGTH = 32;
var uniquePublicKeyCounter = 1;
_Symbol$toStringTag = Symbol.toStringTag;

class PublicKey extends Struct2 {
  constructor(value) {
    super({});
    this._bn = undefined;
    if (isPublicKeyData(value)) {
      this._bn = value._bn;
    } else {
      if (typeof value === "string") {
        const decoded = import_bs58.default.decode(value);
        if (decoded.length != PUBLIC_KEY_LENGTH) {
          throw new Error(`Invalid public key input`);
        }
        this._bn = new import_bn.default(decoded);
      } else {
        this._bn = new import_bn.default(value);
      }
      if (this._bn.byteLength() > PUBLIC_KEY_LENGTH) {
        throw new Error(`Invalid public key input`);
      }
    }
  }
  static unique() {
    const key = new PublicKey(uniquePublicKeyCounter);
    uniquePublicKeyCounter += 1;
    return new PublicKey(key.toBuffer());
  }
  equals(publicKey) {
    return this._bn.eq(publicKey._bn);
  }
  toBase58() {
    return import_bs58.default.encode(this.toBytes());
  }
  toJSON() {
    return this.toBase58();
  }
  toBytes() {
    const buf = this.toBuffer();
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  toBuffer() {
    const b = this._bn.toArrayLike(Buffer2);
    if (b.length === PUBLIC_KEY_LENGTH) {
      return b;
    }
    const zeroPad = Buffer2.alloc(32);
    b.copy(zeroPad, 32 - b.length);
    return zeroPad;
  }
  get [_Symbol$toStringTag]() {
    return `PublicKey(${this.toString()})`;
  }
  toString() {
    return this.toBase58();
  }
  static async createWithSeed(fromPublicKey, seed, programId) {
    const buffer = Buffer2.concat([fromPublicKey.toBuffer(), Buffer2.from(seed), programId.toBuffer()]);
    const publicKeyBytes = sha256(buffer);
    return new PublicKey(publicKeyBytes);
  }
  static createProgramAddressSync(seeds, programId) {
    let buffer = Buffer2.alloc(0);
    seeds.forEach(function(seed) {
      if (seed.length > MAX_SEED_LENGTH) {
        throw new TypeError(`Max seed length exceeded`);
      }
      buffer = Buffer2.concat([buffer, toBuffer(seed)]);
    });
    buffer = Buffer2.concat([buffer, programId.toBuffer(), Buffer2.from("ProgramDerivedAddress")]);
    const publicKeyBytes = sha256(buffer);
    if (isOnCurve(publicKeyBytes)) {
      throw new Error(`Invalid seeds, address must fall off the curve`);
    }
    return new PublicKey(publicKeyBytes);
  }
  static async createProgramAddress(seeds, programId) {
    return this.createProgramAddressSync(seeds, programId);
  }
  static findProgramAddressSync(seeds, programId) {
    let nonce = 255;
    let address;
    while (nonce != 0) {
      try {
        const seedsWithNonce = seeds.concat(Buffer2.from([nonce]));
        address = this.createProgramAddressSync(seedsWithNonce, programId);
      } catch (err) {
        if (err instanceof TypeError) {
          throw err;
        }
        nonce--;
        continue;
      }
      return [address, nonce];
    }
    throw new Error(`Unable to find a viable program address nonce`);
  }
  static async findProgramAddress(seeds, programId) {
    return this.findProgramAddressSync(seeds, programId);
  }
  static isOnCurve(pubkeyData) {
    const pubkey = new PublicKey(pubkeyData);
    return isOnCurve(pubkey.toBytes());
  }
}
_class = PublicKey;
PublicKey.default = new _class("11111111111111111111111111111111");
SOLANA_SCHEMA.set(PublicKey, {
  kind: "struct",
  fields: [["_bn", "u256"]]
});

class Account {
  constructor(secretKey) {
    this._publicKey = undefined;
    this._secretKey = undefined;
    if (secretKey) {
      const secretKeyBuffer = toBuffer(secretKey);
      if (secretKey.length !== 64) {
        throw new Error("bad secret key size");
      }
      this._publicKey = secretKeyBuffer.slice(32, 64);
      this._secretKey = secretKeyBuffer.slice(0, 32);
    } else {
      this._secretKey = toBuffer(generatePrivateKey());
      this._publicKey = toBuffer(getPublicKey(this._secretKey));
    }
  }
  get publicKey() {
    return new PublicKey(this._publicKey);
  }
  get secretKey() {
    return Buffer2.concat([this._secretKey, this._publicKey], 64);
  }
}
var BPF_LOADER_DEPRECATED_PROGRAM_ID = new PublicKey("BPFLoader1111111111111111111111111111111111");
var PACKET_DATA_SIZE = 1280 - 40 - 8;
var VERSION_PREFIX_MASK = 127;
var SIGNATURE_LENGTH_IN_BYTES = 64;

class TransactionExpiredBlockheightExceededError extends Error {
  constructor(signature) {
    super(`Signature ${signature} has expired: block height exceeded.`);
    this.signature = undefined;
    this.signature = signature;
  }
}
Object.defineProperty(TransactionExpiredBlockheightExceededError.prototype, "name", {
  value: "TransactionExpiredBlockheightExceededError"
});

class TransactionExpiredTimeoutError extends Error {
  constructor(signature, timeoutSeconds) {
    super(`Transaction was not confirmed in ${timeoutSeconds.toFixed(2)} seconds. It is ` + "unknown if it succeeded or failed. Check signature " + `${signature} using the Solana Explorer or CLI tools.`);
    this.signature = undefined;
    this.signature = signature;
  }
}
Object.defineProperty(TransactionExpiredTimeoutError.prototype, "name", {
  value: "TransactionExpiredTimeoutError"
});

class TransactionExpiredNonceInvalidError extends Error {
  constructor(signature) {
    super(`Signature ${signature} has expired: the nonce is no longer valid.`);
    this.signature = undefined;
    this.signature = signature;
  }
}
Object.defineProperty(TransactionExpiredNonceInvalidError.prototype, "name", {
  value: "TransactionExpiredNonceInvalidError"
});

class MessageAccountKeys {
  constructor(staticAccountKeys, accountKeysFromLookups) {
    this.staticAccountKeys = undefined;
    this.accountKeysFromLookups = undefined;
    this.staticAccountKeys = staticAccountKeys;
    this.accountKeysFromLookups = accountKeysFromLookups;
  }
  keySegments() {
    const keySegments = [this.staticAccountKeys];
    if (this.accountKeysFromLookups) {
      keySegments.push(this.accountKeysFromLookups.writable);
      keySegments.push(this.accountKeysFromLookups.readonly);
    }
    return keySegments;
  }
  get(index) {
    for (const keySegment of this.keySegments()) {
      if (index < keySegment.length) {
        return keySegment[index];
      } else {
        index -= keySegment.length;
      }
    }
    return;
  }
  get length() {
    return this.keySegments().flat().length;
  }
  compileInstructions(instructions) {
    const U8_MAX = 255;
    if (this.length > U8_MAX + 1) {
      throw new Error("Account index overflow encountered during compilation");
    }
    const keyIndexMap = new Map;
    this.keySegments().flat().forEach((key, index) => {
      keyIndexMap.set(key.toBase58(), index);
    });
    const findKeyIndex = (key) => {
      const keyIndex = keyIndexMap.get(key.toBase58());
      if (keyIndex === undefined)
        throw new Error("Encountered an unknown instruction account key during compilation");
      return keyIndex;
    };
    return instructions.map((instruction) => {
      return {
        programIdIndex: findKeyIndex(instruction.programId),
        accountKeyIndexes: instruction.keys.map((meta) => findKeyIndex(meta.pubkey)),
        data: instruction.data
      };
    });
  }
}
var publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};
var signature = (property = "signature") => {
  return BufferLayout.blob(64, property);
};
var rustString = (property = "string") => {
  const rsl = BufferLayout.struct([BufferLayout.u32("length"), BufferLayout.u32("lengthPadding"), BufferLayout.blob(BufferLayout.offset(BufferLayout.u32(), -8), "chars")], property);
  const _decode = rsl.decode.bind(rsl);
  const _encode = rsl.encode.bind(rsl);
  const rslShim = rsl;
  rslShim.decode = (b, offset2) => {
    const data = _decode(b, offset2);
    return data["chars"].toString();
  };
  rslShim.encode = (str, b, offset2) => {
    const data = {
      chars: Buffer2.from(str, "utf8")
    };
    return _encode(data, b, offset2);
  };
  rslShim.alloc = (str) => {
    return BufferLayout.u32().span + BufferLayout.u32().span + Buffer2.from(str, "utf8").length;
  };
  return rslShim;
};
var authorized = (property = "authorized") => {
  return BufferLayout.struct([publicKey("staker"), publicKey("withdrawer")], property);
};
var lockup = (property = "lockup") => {
  return BufferLayout.struct([BufferLayout.ns64("unixTimestamp"), BufferLayout.ns64("epoch"), publicKey("custodian")], property);
};
var voteInit = (property = "voteInit") => {
  return BufferLayout.struct([publicKey("nodePubkey"), publicKey("authorizedVoter"), publicKey("authorizedWithdrawer"), BufferLayout.u8("commission")], property);
};
var voteAuthorizeWithSeedArgs = (property = "voteAuthorizeWithSeedArgs") => {
  return BufferLayout.struct([BufferLayout.u32("voteAuthorizationType"), publicKey("currentAuthorityDerivedKeyOwnerPubkey"), rustString("currentAuthorityDerivedKeySeed"), publicKey("newAuthorized")], property);
};

class CompiledKeys {
  constructor(payer, keyMetaMap) {
    this.payer = undefined;
    this.keyMetaMap = undefined;
    this.payer = payer;
    this.keyMetaMap = keyMetaMap;
  }
  static compile(instructions, payer) {
    const keyMetaMap = new Map;
    const getOrInsertDefault = (pubkey) => {
      const address = pubkey.toBase58();
      let keyMeta = keyMetaMap.get(address);
      if (keyMeta === undefined) {
        keyMeta = {
          isSigner: false,
          isWritable: false,
          isInvoked: false
        };
        keyMetaMap.set(address, keyMeta);
      }
      return keyMeta;
    };
    const payerKeyMeta = getOrInsertDefault(payer);
    payerKeyMeta.isSigner = true;
    payerKeyMeta.isWritable = true;
    for (const ix of instructions) {
      getOrInsertDefault(ix.programId).isInvoked = true;
      for (const accountMeta of ix.keys) {
        const keyMeta = getOrInsertDefault(accountMeta.pubkey);
        keyMeta.isSigner ||= accountMeta.isSigner;
        keyMeta.isWritable ||= accountMeta.isWritable;
      }
    }
    return new CompiledKeys(payer, keyMetaMap);
  }
  getMessageComponents() {
    const mapEntries = [...this.keyMetaMap.entries()];
    assert2(mapEntries.length <= 256, "Max static account keys length exceeded");
    const writableSigners = mapEntries.filter(([, meta]) => meta.isSigner && meta.isWritable);
    const readonlySigners = mapEntries.filter(([, meta]) => meta.isSigner && !meta.isWritable);
    const writableNonSigners = mapEntries.filter(([, meta]) => !meta.isSigner && meta.isWritable);
    const readonlyNonSigners = mapEntries.filter(([, meta]) => !meta.isSigner && !meta.isWritable);
    const header = {
      numRequiredSignatures: writableSigners.length + readonlySigners.length,
      numReadonlySignedAccounts: readonlySigners.length,
      numReadonlyUnsignedAccounts: readonlyNonSigners.length
    };
    {
      assert2(writableSigners.length > 0, "Expected at least one writable signer key");
      const [payerAddress] = writableSigners[0];
      assert2(payerAddress === this.payer.toBase58(), "Expected first writable signer key to be the fee payer");
    }
    const staticAccountKeys = [...writableSigners.map(([address]) => new PublicKey(address)), ...readonlySigners.map(([address]) => new PublicKey(address)), ...writableNonSigners.map(([address]) => new PublicKey(address)), ...readonlyNonSigners.map(([address]) => new PublicKey(address))];
    return [header, staticAccountKeys];
  }
  extractTableLookup(lookupTable) {
    const [writableIndexes, drainedWritableKeys] = this.drainKeysFoundInLookupTable(lookupTable.state.addresses, (keyMeta) => !keyMeta.isSigner && !keyMeta.isInvoked && keyMeta.isWritable);
    const [readonlyIndexes, drainedReadonlyKeys] = this.drainKeysFoundInLookupTable(lookupTable.state.addresses, (keyMeta) => !keyMeta.isSigner && !keyMeta.isInvoked && !keyMeta.isWritable);
    if (writableIndexes.length === 0 && readonlyIndexes.length === 0) {
      return;
    }
    return [{
      accountKey: lookupTable.key,
      writableIndexes,
      readonlyIndexes
    }, {
      writable: drainedWritableKeys,
      readonly: drainedReadonlyKeys
    }];
  }
  drainKeysFoundInLookupTable(lookupTableEntries, keyMetaFilter) {
    const lookupTableIndexes = new Array;
    const drainedKeys = new Array;
    for (const [address, keyMeta] of this.keyMetaMap.entries()) {
      if (keyMetaFilter(keyMeta)) {
        const key = new PublicKey(address);
        const lookupTableIndex = lookupTableEntries.findIndex((entry) => entry.equals(key));
        if (lookupTableIndex >= 0) {
          assert2(lookupTableIndex < 256, "Max lookup table index exceeded");
          lookupTableIndexes.push(lookupTableIndex);
          drainedKeys.push(key);
          this.keyMetaMap.delete(address);
        }
      }
    }
    return [lookupTableIndexes, drainedKeys];
  }
}

class Message {
  constructor(args) {
    this.header = undefined;
    this.accountKeys = undefined;
    this.recentBlockhash = undefined;
    this.instructions = undefined;
    this.indexToProgramIds = new Map;
    this.header = args.header;
    this.accountKeys = args.accountKeys.map((account) => new PublicKey(account));
    this.recentBlockhash = args.recentBlockhash;
    this.instructions = args.instructions;
    this.instructions.forEach((ix) => this.indexToProgramIds.set(ix.programIdIndex, this.accountKeys[ix.programIdIndex]));
  }
  get version() {
    return "legacy";
  }
  get staticAccountKeys() {
    return this.accountKeys;
  }
  get compiledInstructions() {
    return this.instructions.map((ix) => ({
      programIdIndex: ix.programIdIndex,
      accountKeyIndexes: ix.accounts,
      data: import_bs58.default.decode(ix.data)
    }));
  }
  get addressTableLookups() {
    return [];
  }
  getAccountKeys() {
    return new MessageAccountKeys(this.staticAccountKeys);
  }
  static compile(args) {
    const compiledKeys = CompiledKeys.compile(args.instructions, args.payerKey);
    const [header, staticAccountKeys] = compiledKeys.getMessageComponents();
    const accountKeys = new MessageAccountKeys(staticAccountKeys);
    const instructions = accountKeys.compileInstructions(args.instructions).map((ix) => ({
      programIdIndex: ix.programIdIndex,
      accounts: ix.accountKeyIndexes,
      data: import_bs58.default.encode(ix.data)
    }));
    return new Message({
      header,
      accountKeys: staticAccountKeys,
      recentBlockhash: args.recentBlockhash,
      instructions
    });
  }
  isAccountSigner(index) {
    return index < this.header.numRequiredSignatures;
  }
  isAccountWritable(index) {
    const numSignedAccounts = this.header.numRequiredSignatures;
    if (index >= this.header.numRequiredSignatures) {
      const unsignedAccountIndex = index - numSignedAccounts;
      const numUnsignedAccounts = this.accountKeys.length - numSignedAccounts;
      const numWritableUnsignedAccounts = numUnsignedAccounts - this.header.numReadonlyUnsignedAccounts;
      return unsignedAccountIndex < numWritableUnsignedAccounts;
    } else {
      const numWritableSignedAccounts = numSignedAccounts - this.header.numReadonlySignedAccounts;
      return index < numWritableSignedAccounts;
    }
  }
  isProgramId(index) {
    return this.indexToProgramIds.has(index);
  }
  programIds() {
    return [...this.indexToProgramIds.values()];
  }
  nonProgramIds() {
    return this.accountKeys.filter((_, index) => !this.isProgramId(index));
  }
  serialize() {
    const numKeys = this.accountKeys.length;
    let keyCount = [];
    encodeLength(keyCount, numKeys);
    const instructions = this.instructions.map((instruction) => {
      const {
        accounts,
        programIdIndex
      } = instruction;
      const data = Array.from(import_bs58.default.decode(instruction.data));
      let keyIndicesCount = [];
      encodeLength(keyIndicesCount, accounts.length);
      let dataCount = [];
      encodeLength(dataCount, data.length);
      return {
        programIdIndex,
        keyIndicesCount: Buffer2.from(keyIndicesCount),
        keyIndices: accounts,
        dataLength: Buffer2.from(dataCount),
        data
      };
    });
    let instructionCount = [];
    encodeLength(instructionCount, instructions.length);
    let instructionBuffer = Buffer2.alloc(PACKET_DATA_SIZE);
    Buffer2.from(instructionCount).copy(instructionBuffer);
    let instructionBufferLength = instructionCount.length;
    instructions.forEach((instruction) => {
      const instructionLayout = BufferLayout.struct([BufferLayout.u8("programIdIndex"), BufferLayout.blob(instruction.keyIndicesCount.length, "keyIndicesCount"), BufferLayout.seq(BufferLayout.u8("keyIndex"), instruction.keyIndices.length, "keyIndices"), BufferLayout.blob(instruction.dataLength.length, "dataLength"), BufferLayout.seq(BufferLayout.u8("userdatum"), instruction.data.length, "data")]);
      const length2 = instructionLayout.encode(instruction, instructionBuffer, instructionBufferLength);
      instructionBufferLength += length2;
    });
    instructionBuffer = instructionBuffer.slice(0, instructionBufferLength);
    const signDataLayout = BufferLayout.struct([BufferLayout.blob(1, "numRequiredSignatures"), BufferLayout.blob(1, "numReadonlySignedAccounts"), BufferLayout.blob(1, "numReadonlyUnsignedAccounts"), BufferLayout.blob(keyCount.length, "keyCount"), BufferLayout.seq(publicKey("key"), numKeys, "keys"), publicKey("recentBlockhash")]);
    const transaction = {
      numRequiredSignatures: Buffer2.from([this.header.numRequiredSignatures]),
      numReadonlySignedAccounts: Buffer2.from([this.header.numReadonlySignedAccounts]),
      numReadonlyUnsignedAccounts: Buffer2.from([this.header.numReadonlyUnsignedAccounts]),
      keyCount: Buffer2.from(keyCount),
      keys: this.accountKeys.map((key) => toBuffer(key.toBytes())),
      recentBlockhash: import_bs58.default.decode(this.recentBlockhash)
    };
    let signData = Buffer2.alloc(2048);
    const length = signDataLayout.encode(transaction, signData);
    instructionBuffer.copy(signData, length);
    return signData.slice(0, length + instructionBuffer.length);
  }
  static from(buffer) {
    let byteArray = [...buffer];
    const numRequiredSignatures = byteArray.shift();
    if (numRequiredSignatures !== (numRequiredSignatures & VERSION_PREFIX_MASK)) {
      throw new Error("Versioned messages must be deserialized with VersionedMessage.deserialize()");
    }
    const numReadonlySignedAccounts = byteArray.shift();
    const numReadonlyUnsignedAccounts = byteArray.shift();
    const accountCount = decodeLength(byteArray);
    let accountKeys = [];
    for (let i = 0;i < accountCount; i++) {
      const account = byteArray.slice(0, PUBLIC_KEY_LENGTH);
      byteArray = byteArray.slice(PUBLIC_KEY_LENGTH);
      accountKeys.push(new PublicKey(Buffer2.from(account)));
    }
    const recentBlockhash = byteArray.slice(0, PUBLIC_KEY_LENGTH);
    byteArray = byteArray.slice(PUBLIC_KEY_LENGTH);
    const instructionCount = decodeLength(byteArray);
    let instructions = [];
    for (let i = 0;i < instructionCount; i++) {
      const programIdIndex = byteArray.shift();
      const accountCount2 = decodeLength(byteArray);
      const accounts = byteArray.slice(0, accountCount2);
      byteArray = byteArray.slice(accountCount2);
      const dataLength = decodeLength(byteArray);
      const dataSlice = byteArray.slice(0, dataLength);
      const data = import_bs58.default.encode(Buffer2.from(dataSlice));
      byteArray = byteArray.slice(dataLength);
      instructions.push({
        programIdIndex,
        accounts,
        data
      });
    }
    const messageArgs = {
      header: {
        numRequiredSignatures,
        numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts
      },
      recentBlockhash: import_bs58.default.encode(Buffer2.from(recentBlockhash)),
      accountKeys,
      instructions
    };
    return new Message(messageArgs);
  }
}

class MessageV0 {
  constructor(args) {
    this.header = undefined;
    this.staticAccountKeys = undefined;
    this.recentBlockhash = undefined;
    this.compiledInstructions = undefined;
    this.addressTableLookups = undefined;
    this.header = args.header;
    this.staticAccountKeys = args.staticAccountKeys;
    this.recentBlockhash = args.recentBlockhash;
    this.compiledInstructions = args.compiledInstructions;
    this.addressTableLookups = args.addressTableLookups;
  }
  get version() {
    return 0;
  }
  get numAccountKeysFromLookups() {
    let count = 0;
    for (const lookup of this.addressTableLookups) {
      count += lookup.readonlyIndexes.length + lookup.writableIndexes.length;
    }
    return count;
  }
  getAccountKeys(args) {
    let accountKeysFromLookups;
    if (args && "accountKeysFromLookups" in args && args.accountKeysFromLookups) {
      if (this.numAccountKeysFromLookups != args.accountKeysFromLookups.writable.length + args.accountKeysFromLookups.readonly.length) {
        throw new Error("Failed to get account keys because of a mismatch in the number of account keys from lookups");
      }
      accountKeysFromLookups = args.accountKeysFromLookups;
    } else if (args && "addressLookupTableAccounts" in args && args.addressLookupTableAccounts) {
      accountKeysFromLookups = this.resolveAddressTableLookups(args.addressLookupTableAccounts);
    } else if (this.addressTableLookups.length > 0) {
      throw new Error("Failed to get account keys because address table lookups were not resolved");
    }
    return new MessageAccountKeys(this.staticAccountKeys, accountKeysFromLookups);
  }
  isAccountSigner(index) {
    return index < this.header.numRequiredSignatures;
  }
  isAccountWritable(index) {
    const numSignedAccounts = this.header.numRequiredSignatures;
    const numStaticAccountKeys = this.staticAccountKeys.length;
    if (index >= numStaticAccountKeys) {
      const lookupAccountKeysIndex = index - numStaticAccountKeys;
      const numWritableLookupAccountKeys = this.addressTableLookups.reduce((count, lookup) => count + lookup.writableIndexes.length, 0);
      return lookupAccountKeysIndex < numWritableLookupAccountKeys;
    } else if (index >= this.header.numRequiredSignatures) {
      const unsignedAccountIndex = index - numSignedAccounts;
      const numUnsignedAccounts = numStaticAccountKeys - numSignedAccounts;
      const numWritableUnsignedAccounts = numUnsignedAccounts - this.header.numReadonlyUnsignedAccounts;
      return unsignedAccountIndex < numWritableUnsignedAccounts;
    } else {
      const numWritableSignedAccounts = numSignedAccounts - this.header.numReadonlySignedAccounts;
      return index < numWritableSignedAccounts;
    }
  }
  resolveAddressTableLookups(addressLookupTableAccounts) {
    const accountKeysFromLookups = {
      writable: [],
      readonly: []
    };
    for (const tableLookup of this.addressTableLookups) {
      const tableAccount = addressLookupTableAccounts.find((account) => account.key.equals(tableLookup.accountKey));
      if (!tableAccount) {
        throw new Error(`Failed to find address lookup table account for table key ${tableLookup.accountKey.toBase58()}`);
      }
      for (const index of tableLookup.writableIndexes) {
        if (index < tableAccount.state.addresses.length) {
          accountKeysFromLookups.writable.push(tableAccount.state.addresses[index]);
        } else {
          throw new Error(`Failed to find address for index ${index} in address lookup table ${tableLookup.accountKey.toBase58()}`);
        }
      }
      for (const index of tableLookup.readonlyIndexes) {
        if (index < tableAccount.state.addresses.length) {
          accountKeysFromLookups.readonly.push(tableAccount.state.addresses[index]);
        } else {
          throw new Error(`Failed to find address for index ${index} in address lookup table ${tableLookup.accountKey.toBase58()}`);
        }
      }
    }
    return accountKeysFromLookups;
  }
  static compile(args) {
    const compiledKeys = CompiledKeys.compile(args.instructions, args.payerKey);
    const addressTableLookups = new Array;
    const accountKeysFromLookups = {
      writable: new Array,
      readonly: new Array
    };
    const lookupTableAccounts = args.addressLookupTableAccounts || [];
    for (const lookupTable of lookupTableAccounts) {
      const extractResult = compiledKeys.extractTableLookup(lookupTable);
      if (extractResult !== undefined) {
        const [addressTableLookup, {
          writable,
          readonly
        }] = extractResult;
        addressTableLookups.push(addressTableLookup);
        accountKeysFromLookups.writable.push(...writable);
        accountKeysFromLookups.readonly.push(...readonly);
      }
    }
    const [header, staticAccountKeys] = compiledKeys.getMessageComponents();
    const accountKeys = new MessageAccountKeys(staticAccountKeys, accountKeysFromLookups);
    const compiledInstructions = accountKeys.compileInstructions(args.instructions);
    return new MessageV0({
      header,
      staticAccountKeys,
      recentBlockhash: args.recentBlockhash,
      compiledInstructions,
      addressTableLookups
    });
  }
  serialize() {
    const encodedStaticAccountKeysLength = Array();
    encodeLength(encodedStaticAccountKeysLength, this.staticAccountKeys.length);
    const serializedInstructions = this.serializeInstructions();
    const encodedInstructionsLength = Array();
    encodeLength(encodedInstructionsLength, this.compiledInstructions.length);
    const serializedAddressTableLookups = this.serializeAddressTableLookups();
    const encodedAddressTableLookupsLength = Array();
    encodeLength(encodedAddressTableLookupsLength, this.addressTableLookups.length);
    const messageLayout = BufferLayout.struct([BufferLayout.u8("prefix"), BufferLayout.struct([BufferLayout.u8("numRequiredSignatures"), BufferLayout.u8("numReadonlySignedAccounts"), BufferLayout.u8("numReadonlyUnsignedAccounts")], "header"), BufferLayout.blob(encodedStaticAccountKeysLength.length, "staticAccountKeysLength"), BufferLayout.seq(publicKey(), this.staticAccountKeys.length, "staticAccountKeys"), publicKey("recentBlockhash"), BufferLayout.blob(encodedInstructionsLength.length, "instructionsLength"), BufferLayout.blob(serializedInstructions.length, "serializedInstructions"), BufferLayout.blob(encodedAddressTableLookupsLength.length, "addressTableLookupsLength"), BufferLayout.blob(serializedAddressTableLookups.length, "serializedAddressTableLookups")]);
    const serializedMessage = new Uint8Array(PACKET_DATA_SIZE);
    const MESSAGE_VERSION_0_PREFIX = 1 << 7;
    const serializedMessageLength = messageLayout.encode({
      prefix: MESSAGE_VERSION_0_PREFIX,
      header: this.header,
      staticAccountKeysLength: new Uint8Array(encodedStaticAccountKeysLength),
      staticAccountKeys: this.staticAccountKeys.map((key) => key.toBytes()),
      recentBlockhash: import_bs58.default.decode(this.recentBlockhash),
      instructionsLength: new Uint8Array(encodedInstructionsLength),
      serializedInstructions,
      addressTableLookupsLength: new Uint8Array(encodedAddressTableLookupsLength),
      serializedAddressTableLookups
    }, serializedMessage);
    return serializedMessage.slice(0, serializedMessageLength);
  }
  serializeInstructions() {
    let serializedLength = 0;
    const serializedInstructions = new Uint8Array(PACKET_DATA_SIZE);
    for (const instruction of this.compiledInstructions) {
      const encodedAccountKeyIndexesLength = Array();
      encodeLength(encodedAccountKeyIndexesLength, instruction.accountKeyIndexes.length);
      const encodedDataLength = Array();
      encodeLength(encodedDataLength, instruction.data.length);
      const instructionLayout = BufferLayout.struct([BufferLayout.u8("programIdIndex"), BufferLayout.blob(encodedAccountKeyIndexesLength.length, "encodedAccountKeyIndexesLength"), BufferLayout.seq(BufferLayout.u8(), instruction.accountKeyIndexes.length, "accountKeyIndexes"), BufferLayout.blob(encodedDataLength.length, "encodedDataLength"), BufferLayout.blob(instruction.data.length, "data")]);
      serializedLength += instructionLayout.encode({
        programIdIndex: instruction.programIdIndex,
        encodedAccountKeyIndexesLength: new Uint8Array(encodedAccountKeyIndexesLength),
        accountKeyIndexes: instruction.accountKeyIndexes,
        encodedDataLength: new Uint8Array(encodedDataLength),
        data: instruction.data
      }, serializedInstructions, serializedLength);
    }
    return serializedInstructions.slice(0, serializedLength);
  }
  serializeAddressTableLookups() {
    let serializedLength = 0;
    const serializedAddressTableLookups = new Uint8Array(PACKET_DATA_SIZE);
    for (const lookup of this.addressTableLookups) {
      const encodedWritableIndexesLength = Array();
      encodeLength(encodedWritableIndexesLength, lookup.writableIndexes.length);
      const encodedReadonlyIndexesLength = Array();
      encodeLength(encodedReadonlyIndexesLength, lookup.readonlyIndexes.length);
      const addressTableLookupLayout = BufferLayout.struct([publicKey("accountKey"), BufferLayout.blob(encodedWritableIndexesLength.length, "encodedWritableIndexesLength"), BufferLayout.seq(BufferLayout.u8(), lookup.writableIndexes.length, "writableIndexes"), BufferLayout.blob(encodedReadonlyIndexesLength.length, "encodedReadonlyIndexesLength"), BufferLayout.seq(BufferLayout.u8(), lookup.readonlyIndexes.length, "readonlyIndexes")]);
      serializedLength += addressTableLookupLayout.encode({
        accountKey: lookup.accountKey.toBytes(),
        encodedWritableIndexesLength: new Uint8Array(encodedWritableIndexesLength),
        writableIndexes: lookup.writableIndexes,
        encodedReadonlyIndexesLength: new Uint8Array(encodedReadonlyIndexesLength),
        readonlyIndexes: lookup.readonlyIndexes
      }, serializedAddressTableLookups, serializedLength);
    }
    return serializedAddressTableLookups.slice(0, serializedLength);
  }
  static deserialize(serializedMessage) {
    let byteArray = [...serializedMessage];
    const prefix = byteArray.shift();
    const maskedPrefix = prefix & VERSION_PREFIX_MASK;
    assert2(prefix !== maskedPrefix, `Expected versioned message but received legacy message`);
    const version = maskedPrefix;
    assert2(version === 0, `Expected versioned message with version 0 but found version ${version}`);
    const header = {
      numRequiredSignatures: byteArray.shift(),
      numReadonlySignedAccounts: byteArray.shift(),
      numReadonlyUnsignedAccounts: byteArray.shift()
    };
    const staticAccountKeys = [];
    const staticAccountKeysLength = decodeLength(byteArray);
    for (let i = 0;i < staticAccountKeysLength; i++) {
      staticAccountKeys.push(new PublicKey(byteArray.splice(0, PUBLIC_KEY_LENGTH)));
    }
    const recentBlockhash = import_bs58.default.encode(byteArray.splice(0, PUBLIC_KEY_LENGTH));
    const instructionCount = decodeLength(byteArray);
    const compiledInstructions = [];
    for (let i = 0;i < instructionCount; i++) {
      const programIdIndex = byteArray.shift();
      const accountKeyIndexesLength = decodeLength(byteArray);
      const accountKeyIndexes = byteArray.splice(0, accountKeyIndexesLength);
      const dataLength = decodeLength(byteArray);
      const data = new Uint8Array(byteArray.splice(0, dataLength));
      compiledInstructions.push({
        programIdIndex,
        accountKeyIndexes,
        data
      });
    }
    const addressTableLookupsCount = decodeLength(byteArray);
    const addressTableLookups = [];
    for (let i = 0;i < addressTableLookupsCount; i++) {
      const accountKey = new PublicKey(byteArray.splice(0, PUBLIC_KEY_LENGTH));
      const writableIndexesLength = decodeLength(byteArray);
      const writableIndexes = byteArray.splice(0, writableIndexesLength);
      const readonlyIndexesLength = decodeLength(byteArray);
      const readonlyIndexes = byteArray.splice(0, readonlyIndexesLength);
      addressTableLookups.push({
        accountKey,
        writableIndexes,
        readonlyIndexes
      });
    }
    return new MessageV0({
      header,
      staticAccountKeys,
      recentBlockhash,
      compiledInstructions,
      addressTableLookups
    });
  }
}
var VersionedMessage = {
  deserializeMessageVersion(serializedMessage) {
    const prefix = serializedMessage[0];
    const maskedPrefix = prefix & VERSION_PREFIX_MASK;
    if (maskedPrefix === prefix) {
      return "legacy";
    }
    return maskedPrefix;
  },
  deserialize: (serializedMessage) => {
    const version = VersionedMessage.deserializeMessageVersion(serializedMessage);
    if (version === "legacy") {
      return Message.from(serializedMessage);
    }
    if (version === 0) {
      return MessageV0.deserialize(serializedMessage);
    } else {
      throw new Error(`Transaction message version ${version} deserialization is not supported`);
    }
  }
};
var TransactionStatus = function(TransactionStatus2) {
  TransactionStatus2[TransactionStatus2["BLOCKHEIGHT_EXCEEDED"] = 0] = "BLOCKHEIGHT_EXCEEDED";
  TransactionStatus2[TransactionStatus2["PROCESSED"] = 1] = "PROCESSED";
  TransactionStatus2[TransactionStatus2["TIMED_OUT"] = 2] = "TIMED_OUT";
  TransactionStatus2[TransactionStatus2["NONCE_INVALID"] = 3] = "NONCE_INVALID";
  return TransactionStatus2;
}({});
var DEFAULT_SIGNATURE = Buffer2.alloc(SIGNATURE_LENGTH_IN_BYTES).fill(0);

class TransactionInstruction {
  constructor(opts) {
    this.keys = undefined;
    this.programId = undefined;
    this.data = Buffer2.alloc(0);
    this.programId = opts.programId;
    this.keys = opts.keys;
    if (opts.data) {
      this.data = opts.data;
    }
  }
  toJSON() {
    return {
      keys: this.keys.map(({
        pubkey,
        isSigner,
        isWritable
      }) => ({
        pubkey: pubkey.toJSON(),
        isSigner,
        isWritable
      })),
      programId: this.programId.toJSON(),
      data: [...this.data]
    };
  }
}

class Transaction {
  get signature() {
    if (this.signatures.length > 0) {
      return this.signatures[0].signature;
    }
    return null;
  }
  constructor(opts) {
    this.signatures = [];
    this.feePayer = undefined;
    this.instructions = [];
    this.recentBlockhash = undefined;
    this.lastValidBlockHeight = undefined;
    this.nonceInfo = undefined;
    this.minNonceContextSlot = undefined;
    this._message = undefined;
    this._json = undefined;
    if (!opts) {
      return;
    }
    if (opts.feePayer) {
      this.feePayer = opts.feePayer;
    }
    if (opts.signatures) {
      this.signatures = opts.signatures;
    }
    if (Object.prototype.hasOwnProperty.call(opts, "nonceInfo")) {
      const {
        minContextSlot,
        nonceInfo
      } = opts;
      this.minNonceContextSlot = minContextSlot;
      this.nonceInfo = nonceInfo;
    } else if (Object.prototype.hasOwnProperty.call(opts, "lastValidBlockHeight")) {
      const {
        blockhash,
        lastValidBlockHeight
      } = opts;
      this.recentBlockhash = blockhash;
      this.lastValidBlockHeight = lastValidBlockHeight;
    } else {
      const {
        recentBlockhash,
        nonceInfo
      } = opts;
      if (nonceInfo) {
        this.nonceInfo = nonceInfo;
      }
      this.recentBlockhash = recentBlockhash;
    }
  }
  toJSON() {
    return {
      recentBlockhash: this.recentBlockhash || null,
      feePayer: this.feePayer ? this.feePayer.toJSON() : null,
      nonceInfo: this.nonceInfo ? {
        nonce: this.nonceInfo.nonce,
        nonceInstruction: this.nonceInfo.nonceInstruction.toJSON()
      } : null,
      instructions: this.instructions.map((instruction) => instruction.toJSON()),
      signers: this.signatures.map(({
        publicKey: publicKey2
      }) => {
        return publicKey2.toJSON();
      })
    };
  }
  add(...items) {
    if (items.length === 0) {
      throw new Error("No instructions");
    }
    items.forEach((item) => {
      if ("instructions" in item) {
        this.instructions = this.instructions.concat(item.instructions);
      } else if ("data" in item && "programId" in item && "keys" in item) {
        this.instructions.push(item);
      } else {
        this.instructions.push(new TransactionInstruction(item));
      }
    });
    return this;
  }
  compileMessage() {
    if (this._message && JSON.stringify(this.toJSON()) === JSON.stringify(this._json)) {
      return this._message;
    }
    let recentBlockhash;
    let instructions;
    if (this.nonceInfo) {
      recentBlockhash = this.nonceInfo.nonce;
      if (this.instructions[0] != this.nonceInfo.nonceInstruction) {
        instructions = [this.nonceInfo.nonceInstruction, ...this.instructions];
      } else {
        instructions = this.instructions;
      }
    } else {
      recentBlockhash = this.recentBlockhash;
      instructions = this.instructions;
    }
    if (!recentBlockhash) {
      throw new Error("Transaction recentBlockhash required");
    }
    if (instructions.length < 1) {
      console.warn("No instructions provided");
    }
    let feePayer;
    if (this.feePayer) {
      feePayer = this.feePayer;
    } else if (this.signatures.length > 0 && this.signatures[0].publicKey) {
      feePayer = this.signatures[0].publicKey;
    } else {
      throw new Error("Transaction fee payer required");
    }
    for (let i = 0;i < instructions.length; i++) {
      if (instructions[i].programId === undefined) {
        throw new Error(`Transaction instruction index ${i} has undefined program id`);
      }
    }
    const programIds = [];
    const accountMetas = [];
    instructions.forEach((instruction) => {
      instruction.keys.forEach((accountMeta) => {
        accountMetas.push({
          ...accountMeta
        });
      });
      const programId = instruction.programId.toString();
      if (!programIds.includes(programId)) {
        programIds.push(programId);
      }
    });
    programIds.forEach((programId) => {
      accountMetas.push({
        pubkey: new PublicKey(programId),
        isSigner: false,
        isWritable: false
      });
    });
    const uniqueMetas = [];
    accountMetas.forEach((accountMeta) => {
      const pubkeyString = accountMeta.pubkey.toString();
      const uniqueIndex = uniqueMetas.findIndex((x) => {
        return x.pubkey.toString() === pubkeyString;
      });
      if (uniqueIndex > -1) {
        uniqueMetas[uniqueIndex].isWritable = uniqueMetas[uniqueIndex].isWritable || accountMeta.isWritable;
        uniqueMetas[uniqueIndex].isSigner = uniqueMetas[uniqueIndex].isSigner || accountMeta.isSigner;
      } else {
        uniqueMetas.push(accountMeta);
      }
    });
    uniqueMetas.sort(function(x, y) {
      if (x.isSigner !== y.isSigner) {
        return x.isSigner ? -1 : 1;
      }
      if (x.isWritable !== y.isWritable) {
        return x.isWritable ? -1 : 1;
      }
      const options = {
        localeMatcher: "best fit",
        usage: "sort",
        sensitivity: "variant",
        ignorePunctuation: false,
        numeric: false,
        caseFirst: "lower"
      };
      return x.pubkey.toBase58().localeCompare(y.pubkey.toBase58(), "en", options);
    });
    const feePayerIndex = uniqueMetas.findIndex((x) => {
      return x.pubkey.equals(feePayer);
    });
    if (feePayerIndex > -1) {
      const [payerMeta] = uniqueMetas.splice(feePayerIndex, 1);
      payerMeta.isSigner = true;
      payerMeta.isWritable = true;
      uniqueMetas.unshift(payerMeta);
    } else {
      uniqueMetas.unshift({
        pubkey: feePayer,
        isSigner: true,
        isWritable: true
      });
    }
    for (const signature2 of this.signatures) {
      const uniqueIndex = uniqueMetas.findIndex((x) => {
        return x.pubkey.equals(signature2.publicKey);
      });
      if (uniqueIndex > -1) {
        if (!uniqueMetas[uniqueIndex].isSigner) {
          uniqueMetas[uniqueIndex].isSigner = true;
          console.warn("Transaction references a signature that is unnecessary, only the fee payer and instruction signer accounts should sign a transaction. This behavior is deprecated and will throw an error in the next major version release.");
        }
      } else {
        throw new Error(`unknown signer: ${signature2.publicKey.toString()}`);
      }
    }
    let numRequiredSignatures = 0;
    let numReadonlySignedAccounts = 0;
    let numReadonlyUnsignedAccounts = 0;
    const signedKeys = [];
    const unsignedKeys = [];
    uniqueMetas.forEach(({
      pubkey,
      isSigner,
      isWritable
    }) => {
      if (isSigner) {
        signedKeys.push(pubkey.toString());
        numRequiredSignatures += 1;
        if (!isWritable) {
          numReadonlySignedAccounts += 1;
        }
      } else {
        unsignedKeys.push(pubkey.toString());
        if (!isWritable) {
          numReadonlyUnsignedAccounts += 1;
        }
      }
    });
    const accountKeys = signedKeys.concat(unsignedKeys);
    const compiledInstructions = instructions.map((instruction) => {
      const {
        data,
        programId
      } = instruction;
      return {
        programIdIndex: accountKeys.indexOf(programId.toString()),
        accounts: instruction.keys.map((meta) => accountKeys.indexOf(meta.pubkey.toString())),
        data: import_bs58.default.encode(data)
      };
    });
    compiledInstructions.forEach((instruction) => {
      assert2(instruction.programIdIndex >= 0);
      instruction.accounts.forEach((keyIndex) => assert2(keyIndex >= 0));
    });
    return new Message({
      header: {
        numRequiredSignatures,
        numReadonlySignedAccounts,
        numReadonlyUnsignedAccounts
      },
      accountKeys,
      recentBlockhash,
      instructions: compiledInstructions
    });
  }
  _compile() {
    const message = this.compileMessage();
    const signedKeys = message.accountKeys.slice(0, message.header.numRequiredSignatures);
    if (this.signatures.length === signedKeys.length) {
      const valid = this.signatures.every((pair, index) => {
        return signedKeys[index].equals(pair.publicKey);
      });
      if (valid)
        return message;
    }
    this.signatures = signedKeys.map((publicKey2) => ({
      signature: null,
      publicKey: publicKey2
    }));
    return message;
  }
  serializeMessage() {
    return this._compile().serialize();
  }
  async getEstimatedFee(connection) {
    return (await connection.getFeeForMessage(this.compileMessage())).value;
  }
  setSigners(...signers) {
    if (signers.length === 0) {
      throw new Error("No signers");
    }
    const seen = new Set;
    this.signatures = signers.filter((publicKey2) => {
      const key = publicKey2.toString();
      if (seen.has(key)) {
        return false;
      } else {
        seen.add(key);
        return true;
      }
    }).map((publicKey2) => ({
      signature: null,
      publicKey: publicKey2
    }));
  }
  sign(...signers) {
    if (signers.length === 0) {
      throw new Error("No signers");
    }
    const seen = new Set;
    const uniqueSigners = [];
    for (const signer of signers) {
      const key = signer.publicKey.toString();
      if (seen.has(key)) {
        continue;
      } else {
        seen.add(key);
        uniqueSigners.push(signer);
      }
    }
    this.signatures = uniqueSigners.map((signer) => ({
      signature: null,
      publicKey: signer.publicKey
    }));
    const message = this._compile();
    this._partialSign(message, ...uniqueSigners);
  }
  partialSign(...signers) {
    if (signers.length === 0) {
      throw new Error("No signers");
    }
    const seen = new Set;
    const uniqueSigners = [];
    for (const signer of signers) {
      const key = signer.publicKey.toString();
      if (seen.has(key)) {
        continue;
      } else {
        seen.add(key);
        uniqueSigners.push(signer);
      }
    }
    const message = this._compile();
    this._partialSign(message, ...uniqueSigners);
  }
  _partialSign(message, ...signers) {
    const signData = message.serialize();
    signers.forEach((signer) => {
      const signature2 = sign(signData, signer.secretKey);
      this._addSignature(signer.publicKey, toBuffer(signature2));
    });
  }
  addSignature(pubkey, signature2) {
    this._compile();
    this._addSignature(pubkey, signature2);
  }
  _addSignature(pubkey, signature2) {
    assert2(signature2.length === 64);
    const index = this.signatures.findIndex((sigpair) => pubkey.equals(sigpair.publicKey));
    if (index < 0) {
      throw new Error(`unknown signer: ${pubkey.toString()}`);
    }
    this.signatures[index].signature = Buffer2.from(signature2);
  }
  verifySignatures(requireAllSignatures = true) {
    const signatureErrors = this._getMessageSignednessErrors(this.serializeMessage(), requireAllSignatures);
    return !signatureErrors;
  }
  _getMessageSignednessErrors(message, requireAllSignatures) {
    const errors = {};
    for (const {
      signature: signature2,
      publicKey: publicKey2
    } of this.signatures) {
      if (signature2 === null) {
        if (requireAllSignatures) {
          (errors.missing ||= []).push(publicKey2);
        }
      } else {
        if (!verify(signature2, message, publicKey2.toBytes())) {
          (errors.invalid ||= []).push(publicKey2);
        }
      }
    }
    return errors.invalid || errors.missing ? errors : undefined;
  }
  serialize(config) {
    const {
      requireAllSignatures,
      verifySignatures
    } = Object.assign({
      requireAllSignatures: true,
      verifySignatures: true
    }, config);
    const signData = this.serializeMessage();
    if (verifySignatures) {
      const sigErrors = this._getMessageSignednessErrors(signData, requireAllSignatures);
      if (sigErrors) {
        let errorMessage = "Signature verification failed.";
        if (sigErrors.invalid) {
          errorMessage += `\nInvalid signature for public key${sigErrors.invalid.length === 1 ? "" : "(s)"} [\`${sigErrors.invalid.map((p) => p.toBase58()).join("`, `")}\`].`;
        }
        if (sigErrors.missing) {
          errorMessage += `\nMissing signature for public key${sigErrors.missing.length === 1 ? "" : "(s)"} [\`${sigErrors.missing.map((p) => p.toBase58()).join("`, `")}\`].`;
        }
        throw new Error(errorMessage);
      }
    }
    return this._serialize(signData);
  }
  _serialize(signData) {
    const {
      signatures
    } = this;
    const signatureCount = [];
    encodeLength(signatureCount, signatures.length);
    const transactionLength = signatureCount.length + signatures.length * 64 + signData.length;
    const wireTransaction = Buffer2.alloc(transactionLength);
    assert2(signatures.length < 256);
    Buffer2.from(signatureCount).copy(wireTransaction, 0);
    signatures.forEach(({
      signature: signature2
    }, index) => {
      if (signature2 !== null) {
        assert2(signature2.length === 64, `signature has invalid length`);
        Buffer2.from(signature2).copy(wireTransaction, signatureCount.length + index * 64);
      }
    });
    signData.copy(wireTransaction, signatureCount.length + signatures.length * 64);
    assert2(wireTransaction.length <= PACKET_DATA_SIZE, `Transaction too large: ${wireTransaction.length} > ${PACKET_DATA_SIZE}`);
    return wireTransaction;
  }
  get keys() {
    assert2(this.instructions.length === 1);
    return this.instructions[0].keys.map((keyObj) => keyObj.pubkey);
  }
  get programId() {
    assert2(this.instructions.length === 1);
    return this.instructions[0].programId;
  }
  get data() {
    assert2(this.instructions.length === 1);
    return this.instructions[0].data;
  }
  static from(buffer) {
    let byteArray = [...buffer];
    const signatureCount = decodeLength(byteArray);
    let signatures = [];
    for (let i = 0;i < signatureCount; i++) {
      const signature2 = byteArray.slice(0, SIGNATURE_LENGTH_IN_BYTES);
      byteArray = byteArray.slice(SIGNATURE_LENGTH_IN_BYTES);
      signatures.push(import_bs58.default.encode(Buffer2.from(signature2)));
    }
    return Transaction.populate(Message.from(byteArray), signatures);
  }
  static populate(message, signatures = []) {
    const transaction = new Transaction;
    transaction.recentBlockhash = message.recentBlockhash;
    if (message.header.numRequiredSignatures > 0) {
      transaction.feePayer = message.accountKeys[0];
    }
    signatures.forEach((signature2, index) => {
      const sigPubkeyPair = {
        signature: signature2 == import_bs58.default.encode(DEFAULT_SIGNATURE) ? null : import_bs58.default.decode(signature2),
        publicKey: message.accountKeys[index]
      };
      transaction.signatures.push(sigPubkeyPair);
    });
    message.instructions.forEach((instruction) => {
      const keys = instruction.accounts.map((account) => {
        const pubkey = message.accountKeys[account];
        return {
          pubkey,
          isSigner: transaction.signatures.some((keyObj) => keyObj.publicKey.toString() === pubkey.toString()) || message.isAccountSigner(account),
          isWritable: message.isAccountWritable(account)
        };
      });
      transaction.instructions.push(new TransactionInstruction({
        keys,
        programId: message.accountKeys[instruction.programIdIndex],
        data: import_bs58.default.decode(instruction.data)
      }));
    });
    transaction._message = message;
    transaction._json = transaction.toJSON();
    return transaction;
  }
}

class TransactionMessage {
  constructor(args) {
    this.payerKey = undefined;
    this.instructions = undefined;
    this.recentBlockhash = undefined;
    this.payerKey = args.payerKey;
    this.instructions = args.instructions;
    this.recentBlockhash = args.recentBlockhash;
  }
  static decompile(message, args) {
    const {
      header,
      compiledInstructions,
      recentBlockhash
    } = message;
    const {
      numRequiredSignatures,
      numReadonlySignedAccounts,
      numReadonlyUnsignedAccounts
    } = header;
    const numWritableSignedAccounts = numRequiredSignatures - numReadonlySignedAccounts;
    assert2(numWritableSignedAccounts > 0, "Message header is invalid");
    const numWritableUnsignedAccounts = message.staticAccountKeys.length - numRequiredSignatures - numReadonlyUnsignedAccounts;
    assert2(numWritableUnsignedAccounts >= 0, "Message header is invalid");
    const accountKeys = message.getAccountKeys(args);
    const payerKey = accountKeys.get(0);
    if (payerKey === undefined) {
      throw new Error("Failed to decompile message because no account keys were found");
    }
    const instructions = [];
    for (const compiledIx of compiledInstructions) {
      const keys = [];
      for (const keyIndex of compiledIx.accountKeyIndexes) {
        const pubkey = accountKeys.get(keyIndex);
        if (pubkey === undefined) {
          throw new Error(`Failed to find key for account key index ${keyIndex}`);
        }
        const isSigner = keyIndex < numRequiredSignatures;
        let isWritable;
        if (isSigner) {
          isWritable = keyIndex < numWritableSignedAccounts;
        } else if (keyIndex < accountKeys.staticAccountKeys.length) {
          isWritable = keyIndex - numRequiredSignatures < numWritableUnsignedAccounts;
        } else {
          isWritable = keyIndex - accountKeys.staticAccountKeys.length < accountKeys.accountKeysFromLookups.writable.length;
        }
        keys.push({
          pubkey,
          isSigner: keyIndex < header.numRequiredSignatures,
          isWritable
        });
      }
      const programId = accountKeys.get(compiledIx.programIdIndex);
      if (programId === undefined) {
        throw new Error(`Failed to find program id for program id index ${compiledIx.programIdIndex}`);
      }
      instructions.push(new TransactionInstruction({
        programId,
        data: toBuffer(compiledIx.data),
        keys
      }));
    }
    return new TransactionMessage({
      payerKey,
      instructions,
      recentBlockhash
    });
  }
  compileToLegacyMessage() {
    return Message.compile({
      payerKey: this.payerKey,
      recentBlockhash: this.recentBlockhash,
      instructions: this.instructions
    });
  }
  compileToV0Message(addressLookupTableAccounts) {
    return MessageV0.compile({
      payerKey: this.payerKey,
      recentBlockhash: this.recentBlockhash,
      instructions: this.instructions,
      addressLookupTableAccounts
    });
  }
}

class VersionedTransaction {
  get version() {
    return this.message.version;
  }
  constructor(message, signatures) {
    this.signatures = undefined;
    this.message = undefined;
    if (signatures !== undefined) {
      assert2(signatures.length === message.header.numRequiredSignatures, "Expected signatures length to be equal to the number of required signatures");
      this.signatures = signatures;
    } else {
      const defaultSignatures = [];
      for (let i = 0;i < message.header.numRequiredSignatures; i++) {
        defaultSignatures.push(new Uint8Array(SIGNATURE_LENGTH_IN_BYTES));
      }
      this.signatures = defaultSignatures;
    }
    this.message = message;
  }
  serialize() {
    const serializedMessage = this.message.serialize();
    const encodedSignaturesLength = Array();
    encodeLength(encodedSignaturesLength, this.signatures.length);
    const transactionLayout = BufferLayout.struct([BufferLayout.blob(encodedSignaturesLength.length, "encodedSignaturesLength"), BufferLayout.seq(signature(), this.signatures.length, "signatures"), BufferLayout.blob(serializedMessage.length, "serializedMessage")]);
    const serializedTransaction = new Uint8Array(2048);
    const serializedTransactionLength = transactionLayout.encode({
      encodedSignaturesLength: new Uint8Array(encodedSignaturesLength),
      signatures: this.signatures,
      serializedMessage
    }, serializedTransaction);
    return serializedTransaction.slice(0, serializedTransactionLength);
  }
  static deserialize(serializedTransaction) {
    let byteArray = [...serializedTransaction];
    const signatures = [];
    const signaturesLength = decodeLength(byteArray);
    for (let i = 0;i < signaturesLength; i++) {
      signatures.push(new Uint8Array(byteArray.splice(0, SIGNATURE_LENGTH_IN_BYTES)));
    }
    const message = VersionedMessage.deserialize(new Uint8Array(byteArray));
    return new VersionedTransaction(message, signatures);
  }
  sign(signers) {
    const messageData = this.message.serialize();
    const signerPubkeys = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures);
    for (const signer of signers) {
      const signerIndex = signerPubkeys.findIndex((pubkey) => pubkey.equals(signer.publicKey));
      assert2(signerIndex >= 0, `Cannot sign with non signer key ${signer.publicKey.toBase58()}`);
      this.signatures[signerIndex] = sign(messageData, signer.secretKey);
    }
  }
  addSignature(publicKey2, signature2) {
    assert2(signature2.byteLength === 64, "Signature must be 64 bytes long");
    const signerPubkeys = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures);
    const signerIndex = signerPubkeys.findIndex((pubkey) => pubkey.equals(publicKey2));
    assert2(signerIndex >= 0, `Can not add signature; \`${publicKey2.toBase58()}\` is not required to sign this transaction`);
    this.signatures[signerIndex] = signature2;
  }
}
var NUM_TICKS_PER_SECOND = 160;
var DEFAULT_TICKS_PER_SLOT = 64;
var NUM_SLOTS_PER_SECOND = NUM_TICKS_PER_SECOND / DEFAULT_TICKS_PER_SLOT;
var MS_PER_SLOT = 1000 / NUM_SLOTS_PER_SECOND;
var SYSVAR_CLOCK_PUBKEY = new PublicKey("SysvarC1ock11111111111111111111111111111111");
var SYSVAR_EPOCH_SCHEDULE_PUBKEY = new PublicKey("SysvarEpochSchedu1e111111111111111111111111");
var SYSVAR_INSTRUCTIONS_PUBKEY = new PublicKey("Sysvar1nstructions1111111111111111111111111");
var SYSVAR_RECENT_BLOCKHASHES_PUBKEY = new PublicKey("SysvarRecentB1ockHashes11111111111111111111");
var SYSVAR_RENT_PUBKEY = new PublicKey("SysvarRent111111111111111111111111111111111");
var SYSVAR_REWARDS_PUBKEY = new PublicKey("SysvarRewards111111111111111111111111111111");
var SYSVAR_SLOT_HASHES_PUBKEY = new PublicKey("SysvarS1otHashes111111111111111111111111111");
var SYSVAR_SLOT_HISTORY_PUBKEY = new PublicKey("SysvarS1otHistory11111111111111111111111111");
var SYSVAR_STAKE_HISTORY_PUBKEY = new PublicKey("SysvarStakeHistory1111111111111111111111111");
var FeeCalculatorLayout = BufferLayout.nu64("lamportsPerSignature");
var NonceAccountLayout = BufferLayout.struct([BufferLayout.u32("version"), BufferLayout.u32("state"), publicKey("authorizedPubkey"), publicKey("nonce"), BufferLayout.struct([FeeCalculatorLayout], "feeCalculator")]);
var NONCE_ACCOUNT_LENGTH = NonceAccountLayout.span;

class NonceAccount {
  constructor(args) {
    this.authorizedPubkey = undefined;
    this.nonce = undefined;
    this.feeCalculator = undefined;
    this.authorizedPubkey = args.authorizedPubkey;
    this.nonce = args.nonce;
    this.feeCalculator = args.feeCalculator;
  }
  static fromAccountData(buffer) {
    const nonceAccount = NonceAccountLayout.decode(toBuffer(buffer), 0);
    return new NonceAccount({
      authorizedPubkey: new PublicKey(nonceAccount.authorizedPubkey),
      nonce: new PublicKey(nonceAccount.nonce).toString(),
      feeCalculator: nonceAccount.feeCalculator
    });
  }
}
var encodeDecode = (layout) => {
  const decode = layout.decode.bind(layout);
  const encode = layout.encode.bind(layout);
  return {
    decode,
    encode
  };
};
var bigInt = (length) => (property) => {
  const layout = buffer_layout.blob(length, property);
  const {
    encode,
    decode
  } = encodeDecode(layout);
  const bigIntLayout = layout;
  bigIntLayout.decode = (buffer, offset2) => {
    const src = decode(buffer, offset2);
    return import_bigint_buffer.toBigIntLE(Buffer2.from(src));
  };
  bigIntLayout.encode = (bigInt2, buffer, offset2) => {
    const src = import_bigint_buffer.toBufferLE(bigInt2, length);
    return encode(src, buffer, offset2);
  };
  return bigIntLayout;
};
var u642 = bigInt(8);

class SystemInstruction {
  constructor() {
  }
  static decodeInstructionType(instruction) {
    this.checkProgramId(instruction.programId);
    const instructionTypeLayout = BufferLayout.u32("instruction");
    const typeIndex = instructionTypeLayout.decode(instruction.data);
    let type2;
    for (const [ixType, layout] of Object.entries(SYSTEM_INSTRUCTION_LAYOUTS)) {
      if (layout.index == typeIndex) {
        type2 = ixType;
        break;
      }
    }
    if (!type2) {
      throw new Error("Instruction type incorrect; not a SystemInstruction");
    }
    return type2;
  }
  static decodeCreateAccount(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);
    const {
      lamports,
      space,
      programId
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.Create, instruction.data);
    return {
      fromPubkey: instruction.keys[0].pubkey,
      newAccountPubkey: instruction.keys[1].pubkey,
      lamports,
      space,
      programId: new PublicKey(programId)
    };
  }
  static decodeTransfer(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);
    const {
      lamports
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.Transfer, instruction.data);
    return {
      fromPubkey: instruction.keys[0].pubkey,
      toPubkey: instruction.keys[1].pubkey,
      lamports
    };
  }
  static decodeTransferWithSeed(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    const {
      lamports,
      seed,
      programId
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.TransferWithSeed, instruction.data);
    return {
      fromPubkey: instruction.keys[0].pubkey,
      basePubkey: instruction.keys[1].pubkey,
      toPubkey: instruction.keys[2].pubkey,
      lamports,
      seed,
      programId: new PublicKey(programId)
    };
  }
  static decodeAllocate(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 1);
    const {
      space
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.Allocate, instruction.data);
    return {
      accountPubkey: instruction.keys[0].pubkey,
      space
    };
  }
  static decodeAllocateWithSeed(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 1);
    const {
      base,
      seed,
      space,
      programId
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.AllocateWithSeed, instruction.data);
    return {
      accountPubkey: instruction.keys[0].pubkey,
      basePubkey: new PublicKey(base),
      seed,
      space,
      programId: new PublicKey(programId)
    };
  }
  static decodeAssign(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 1);
    const {
      programId
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.Assign, instruction.data);
    return {
      accountPubkey: instruction.keys[0].pubkey,
      programId: new PublicKey(programId)
    };
  }
  static decodeAssignWithSeed(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 1);
    const {
      base,
      seed,
      programId
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.AssignWithSeed, instruction.data);
    return {
      accountPubkey: instruction.keys[0].pubkey,
      basePubkey: new PublicKey(base),
      seed,
      programId: new PublicKey(programId)
    };
  }
  static decodeCreateWithSeed(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);
    const {
      base,
      seed,
      lamports,
      space,
      programId
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.CreateWithSeed, instruction.data);
    return {
      fromPubkey: instruction.keys[0].pubkey,
      newAccountPubkey: instruction.keys[1].pubkey,
      basePubkey: new PublicKey(base),
      seed,
      lamports,
      space,
      programId: new PublicKey(programId)
    };
  }
  static decodeNonceInitialize(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    const {
      authorized: authorized2
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.InitializeNonceAccount, instruction.data);
    return {
      noncePubkey: instruction.keys[0].pubkey,
      authorizedPubkey: new PublicKey(authorized2)
    };
  }
  static decodeNonceAdvance(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.AdvanceNonceAccount, instruction.data);
    return {
      noncePubkey: instruction.keys[0].pubkey,
      authorizedPubkey: instruction.keys[2].pubkey
    };
  }
  static decodeNonceWithdraw(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 5);
    const {
      lamports
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.WithdrawNonceAccount, instruction.data);
    return {
      noncePubkey: instruction.keys[0].pubkey,
      toPubkey: instruction.keys[1].pubkey,
      authorizedPubkey: instruction.keys[4].pubkey,
      lamports
    };
  }
  static decodeNonceAuthorize(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);
    const {
      authorized: authorized2
    } = decodeData$1(SYSTEM_INSTRUCTION_LAYOUTS.AuthorizeNonceAccount, instruction.data);
    return {
      noncePubkey: instruction.keys[0].pubkey,
      authorizedPubkey: instruction.keys[1].pubkey,
      newAuthorizedPubkey: new PublicKey(authorized2)
    };
  }
  static checkProgramId(programId) {
    if (!programId.equals(SystemProgram.programId)) {
      throw new Error("invalid instruction; programId is not SystemProgram");
    }
  }
  static checkKeyLength(keys, expectedLength) {
    if (keys.length < expectedLength) {
      throw new Error(`invalid instruction; found ${keys.length} keys, expected at least ${expectedLength}`);
    }
  }
}
var SYSTEM_INSTRUCTION_LAYOUTS = Object.freeze({
  Create: {
    index: 0,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), BufferLayout.ns64("lamports"), BufferLayout.ns64("space"), publicKey("programId")])
  },
  Assign: {
    index: 1,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("programId")])
  },
  Transfer: {
    index: 2,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), u642("lamports")])
  },
  CreateWithSeed: {
    index: 3,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("base"), rustString("seed"), BufferLayout.ns64("lamports"), BufferLayout.ns64("space"), publicKey("programId")])
  },
  AdvanceNonceAccount: {
    index: 4,
    layout: BufferLayout.struct([BufferLayout.u32("instruction")])
  },
  WithdrawNonceAccount: {
    index: 5,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), BufferLayout.ns64("lamports")])
  },
  InitializeNonceAccount: {
    index: 6,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("authorized")])
  },
  AuthorizeNonceAccount: {
    index: 7,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("authorized")])
  },
  Allocate: {
    index: 8,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), BufferLayout.ns64("space")])
  },
  AllocateWithSeed: {
    index: 9,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("base"), rustString("seed"), BufferLayout.ns64("space"), publicKey("programId")])
  },
  AssignWithSeed: {
    index: 10,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("base"), rustString("seed"), publicKey("programId")])
  },
  TransferWithSeed: {
    index: 11,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), u642("lamports"), rustString("seed"), publicKey("programId")])
  },
  UpgradeNonceAccount: {
    index: 12,
    layout: BufferLayout.struct([BufferLayout.u32("instruction")])
  }
});

class SystemProgram {
  constructor() {
  }
  static createAccount(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.Create;
    const data = encodeData(type2, {
      lamports: params.lamports,
      space: params.space,
      programId: toBuffer(params.programId.toBuffer())
    });
    return new TransactionInstruction({
      keys: [{
        pubkey: params.fromPubkey,
        isSigner: true,
        isWritable: true
      }, {
        pubkey: params.newAccountPubkey,
        isSigner: true,
        isWritable: true
      }],
      programId: this.programId,
      data
    });
  }
  static transfer(params) {
    let data;
    let keys;
    if ("basePubkey" in params) {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.TransferWithSeed;
      data = encodeData(type2, {
        lamports: BigInt(params.lamports),
        seed: params.seed,
        programId: toBuffer(params.programId.toBuffer())
      });
      keys = [{
        pubkey: params.fromPubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.basePubkey,
        isSigner: true,
        isWritable: false
      }, {
        pubkey: params.toPubkey,
        isSigner: false,
        isWritable: true
      }];
    } else {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.Transfer;
      data = encodeData(type2, {
        lamports: BigInt(params.lamports)
      });
      keys = [{
        pubkey: params.fromPubkey,
        isSigner: true,
        isWritable: true
      }, {
        pubkey: params.toPubkey,
        isSigner: false,
        isWritable: true
      }];
    }
    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data
    });
  }
  static assign(params) {
    let data;
    let keys;
    if ("basePubkey" in params) {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.AssignWithSeed;
      data = encodeData(type2, {
        base: toBuffer(params.basePubkey.toBuffer()),
        seed: params.seed,
        programId: toBuffer(params.programId.toBuffer())
      });
      keys = [{
        pubkey: params.accountPubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.basePubkey,
        isSigner: true,
        isWritable: false
      }];
    } else {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.Assign;
      data = encodeData(type2, {
        programId: toBuffer(params.programId.toBuffer())
      });
      keys = [{
        pubkey: params.accountPubkey,
        isSigner: true,
        isWritable: true
      }];
    }
    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data
    });
  }
  static createAccountWithSeed(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.CreateWithSeed;
    const data = encodeData(type2, {
      base: toBuffer(params.basePubkey.toBuffer()),
      seed: params.seed,
      lamports: params.lamports,
      space: params.space,
      programId: toBuffer(params.programId.toBuffer())
    });
    let keys = [{
      pubkey: params.fromPubkey,
      isSigner: true,
      isWritable: true
    }, {
      pubkey: params.newAccountPubkey,
      isSigner: false,
      isWritable: true
    }];
    if (params.basePubkey != params.fromPubkey) {
      keys.push({
        pubkey: params.basePubkey,
        isSigner: true,
        isWritable: false
      });
    }
    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data
    });
  }
  static createNonceAccount(params) {
    const transaction = new Transaction;
    if ("basePubkey" in params && "seed" in params) {
      transaction.add(SystemProgram.createAccountWithSeed({
        fromPubkey: params.fromPubkey,
        newAccountPubkey: params.noncePubkey,
        basePubkey: params.basePubkey,
        seed: params.seed,
        lamports: params.lamports,
        space: NONCE_ACCOUNT_LENGTH,
        programId: this.programId
      }));
    } else {
      transaction.add(SystemProgram.createAccount({
        fromPubkey: params.fromPubkey,
        newAccountPubkey: params.noncePubkey,
        lamports: params.lamports,
        space: NONCE_ACCOUNT_LENGTH,
        programId: this.programId
      }));
    }
    const initParams = {
      noncePubkey: params.noncePubkey,
      authorizedPubkey: params.authorizedPubkey
    };
    transaction.add(this.nonceInitialize(initParams));
    return transaction;
  }
  static nonceInitialize(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.InitializeNonceAccount;
    const data = encodeData(type2, {
      authorized: toBuffer(params.authorizedPubkey.toBuffer())
    });
    const instructionData = {
      keys: [{
        pubkey: params.noncePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false
      }],
      programId: this.programId,
      data
    };
    return new TransactionInstruction(instructionData);
  }
  static nonceAdvance(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.AdvanceNonceAccount;
    const data = encodeData(type2);
    const instructionData = {
      keys: [{
        pubkey: params.noncePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: params.authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    };
    return new TransactionInstruction(instructionData);
  }
  static nonceWithdraw(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.WithdrawNonceAccount;
    const data = encodeData(type2, {
      lamports: params.lamports
    });
    return new TransactionInstruction({
      keys: [{
        pubkey: params.noncePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.toPubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: params.authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    });
  }
  static nonceAuthorize(params) {
    const type2 = SYSTEM_INSTRUCTION_LAYOUTS.AuthorizeNonceAccount;
    const data = encodeData(type2, {
      authorized: toBuffer(params.newAuthorizedPubkey.toBuffer())
    });
    return new TransactionInstruction({
      keys: [{
        pubkey: params.noncePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    });
  }
  static allocate(params) {
    let data;
    let keys;
    if ("basePubkey" in params) {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.AllocateWithSeed;
      data = encodeData(type2, {
        base: toBuffer(params.basePubkey.toBuffer()),
        seed: params.seed,
        space: params.space,
        programId: toBuffer(params.programId.toBuffer())
      });
      keys = [{
        pubkey: params.accountPubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: params.basePubkey,
        isSigner: true,
        isWritable: false
      }];
    } else {
      const type2 = SYSTEM_INSTRUCTION_LAYOUTS.Allocate;
      data = encodeData(type2, {
        space: params.space
      });
      keys = [{
        pubkey: params.accountPubkey,
        isSigner: true,
        isWritable: true
      }];
    }
    return new TransactionInstruction({
      keys,
      programId: this.programId,
      data
    });
  }
}
SystemProgram.programId = new PublicKey("11111111111111111111111111111111");
var CHUNK_SIZE = PACKET_DATA_SIZE - 300;

class Loader {
  constructor() {
  }
  static getMinNumSignatures(dataLength) {
    return 2 * (Math.ceil(dataLength / Loader.chunkSize) + 1 + 1);
  }
  static async load(connection, payer, program, programId, data) {
    {
      const balanceNeeded = await connection.getMinimumBalanceForRentExemption(data.length);
      const programInfo = await connection.getAccountInfo(program.publicKey, "confirmed");
      let transaction = null;
      if (programInfo !== null) {
        if (programInfo.executable) {
          console.error("Program load failed, account is already executable");
          return false;
        }
        if (programInfo.data.length !== data.length) {
          transaction = transaction || new Transaction;
          transaction.add(SystemProgram.allocate({
            accountPubkey: program.publicKey,
            space: data.length
          }));
        }
        if (!programInfo.owner.equals(programId)) {
          transaction = transaction || new Transaction;
          transaction.add(SystemProgram.assign({
            accountPubkey: program.publicKey,
            programId
          }));
        }
        if (programInfo.lamports < balanceNeeded) {
          transaction = transaction || new Transaction;
          transaction.add(SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: program.publicKey,
            lamports: balanceNeeded - programInfo.lamports
          }));
        }
      } else {
        transaction = new Transaction().add(SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: program.publicKey,
          lamports: balanceNeeded > 0 ? balanceNeeded : 1,
          space: data.length,
          programId
        }));
      }
      if (transaction !== null) {
        await sendAndConfirmTransaction(connection, transaction, [payer, program], {
          commitment: "confirmed"
        });
      }
    }
    const dataLayout = BufferLayout.struct([BufferLayout.u32("instruction"), BufferLayout.u32("offset"), BufferLayout.u32("bytesLength"), BufferLayout.u32("bytesLengthPadding"), BufferLayout.seq(BufferLayout.u8("byte"), BufferLayout.offset(BufferLayout.u32(), -8), "bytes")]);
    const chunkSize = Loader.chunkSize;
    let offset2 = 0;
    let array2 = data;
    let transactions = [];
    while (array2.length > 0) {
      const bytes2 = array2.slice(0, chunkSize);
      const data2 = Buffer2.alloc(chunkSize + 16);
      dataLayout.encode({
        instruction: 0,
        offset: offset2,
        bytes: bytes2,
        bytesLength: 0,
        bytesLengthPadding: 0
      }, data2);
      const transaction = new Transaction().add({
        keys: [{
          pubkey: program.publicKey,
          isSigner: true,
          isWritable: true
        }],
        programId,
        data: data2
      });
      transactions.push(sendAndConfirmTransaction(connection, transaction, [payer, program], {
        commitment: "confirmed"
      }));
      if (connection._rpcEndpoint.includes("solana.com")) {
        const REQUESTS_PER_SECOND = 4;
        await sleep(1000 / REQUESTS_PER_SECOND);
      }
      offset2 += chunkSize;
      array2 = array2.slice(chunkSize);
    }
    await Promise.all(transactions);
    {
      const dataLayout2 = BufferLayout.struct([BufferLayout.u32("instruction")]);
      const data2 = Buffer2.alloc(dataLayout2.span);
      dataLayout2.encode({
        instruction: 1
      }, data2);
      const transaction = new Transaction().add({
        keys: [{
          pubkey: program.publicKey,
          isSigner: true,
          isWritable: true
        }, {
          pubkey: SYSVAR_RENT_PUBKEY,
          isSigner: false,
          isWritable: false
        }],
        programId,
        data: data2
      });
      const deployCommitment = "processed";
      const finalizeSignature = await connection.sendTransaction(transaction, [payer, program], {
        preflightCommitment: deployCommitment
      });
      const {
        context,
        value
      } = await connection.confirmTransaction({
        signature: finalizeSignature,
        lastValidBlockHeight: transaction.lastValidBlockHeight,
        blockhash: transaction.recentBlockhash
      }, deployCommitment);
      if (value.err) {
        throw new Error(`Transaction ${finalizeSignature} failed (${JSON.stringify(value)})`);
      }
      while (true) {
        try {
          const currentSlot = await connection.getSlot({
            commitment: deployCommitment
          });
          if (currentSlot > context.slot) {
            break;
          }
        } catch {
        }
        await new Promise((resolve) => setTimeout(resolve, Math.round(MS_PER_SLOT / 2)));
      }
    }
    return true;
  }
}
Loader.chunkSize = CHUNK_SIZE;
var BPF_LOADER_PROGRAM_ID = new PublicKey("BPFLoader2111111111111111111111111111111111");

class BpfLoader {
  static getMinNumSignatures(dataLength) {
    return Loader.getMinNumSignatures(dataLength);
  }
  static load(connection, payer, program, elf, loaderProgramId) {
    return Loader.load(connection, payer, program, loaderProgramId, elf);
  }
}
var agentkeepalive = { exports: {} };
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
var ms$2 = function(val, options) {
  options = options || {};
  var type2 = typeof val;
  if (type2 === "string" && val.length > 0) {
    return parse(val);
  } else if (type2 === "number" && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
};
/*!
 * humanize-ms - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */
var util = require$$0;
var ms$1 = ms$2;
var humanizeMs = function(t) {
  if (typeof t === "number")
    return t;
  var r = ms$1(t);
  if (r === undefined) {
    var err = new Error(util.format("humanize-ms(%j) result undefined", t));
    console.warn(err.stack);
  }
  return r;
};
var constants = {
  CURRENT_ID: Symbol("agentkeepalive#currentId"),
  CREATE_ID: Symbol("agentkeepalive#createId"),
  INIT_SOCKET: Symbol("agentkeepalive#initSocket"),
  CREATE_HTTPS_CONNECTION: Symbol("agentkeepalive#createHttpsConnection"),
  SOCKET_CREATED_TIME: Symbol("agentkeepalive#socketCreatedTime"),
  SOCKET_NAME: Symbol("agentkeepalive#socketName"),
  SOCKET_REQUEST_COUNT: Symbol("agentkeepalive#socketRequestCount"),
  SOCKET_REQUEST_FINISHED_COUNT: Symbol("agentkeepalive#socketRequestFinishedCount")
};
var OriginalAgent = require$$0$1.Agent;
var ms = humanizeMs;
var debug = require$$0.debuglog("agentkeepalive");
var {
  INIT_SOCKET: INIT_SOCKET$1,
  CURRENT_ID,
  CREATE_ID,
  SOCKET_CREATED_TIME,
  SOCKET_NAME,
  SOCKET_REQUEST_COUNT,
  SOCKET_REQUEST_FINISHED_COUNT
} = constants;
var defaultTimeoutListenerCount = 1;
var majorVersion = parseInt(process.version.split(".", 1)[0].substring(1));
if (majorVersion >= 11 && majorVersion <= 12) {
  defaultTimeoutListenerCount = 2;
} else if (majorVersion >= 13) {
  defaultTimeoutListenerCount = 3;
}

class Agent extends OriginalAgent {
  constructor(options) {
    options = options || {};
    options.keepAlive = options.keepAlive !== false;
    if (options.freeSocketTimeout === undefined) {
      options.freeSocketTimeout = 4000;
    }
    if (options.keepAliveTimeout) {
      deprecate("options.keepAliveTimeout is deprecated, please use options.freeSocketTimeout instead");
      options.freeSocketTimeout = options.keepAliveTimeout;
      delete options.keepAliveTimeout;
    }
    if (options.freeSocketKeepAliveTimeout) {
      deprecate("options.freeSocketKeepAliveTimeout is deprecated, please use options.freeSocketTimeout instead");
      options.freeSocketTimeout = options.freeSocketKeepAliveTimeout;
      delete options.freeSocketKeepAliveTimeout;
    }
    if (options.timeout === undefined) {
      options.timeout = Math.max(options.freeSocketTimeout * 2, 8000);
    }
    options.timeout = ms(options.timeout);
    options.freeSocketTimeout = ms(options.freeSocketTimeout);
    options.socketActiveTTL = options.socketActiveTTL ? ms(options.socketActiveTTL) : 0;
    super(options);
    this[CURRENT_ID] = 0;
    this.createSocketCount = 0;
    this.createSocketCountLastCheck = 0;
    this.createSocketErrorCount = 0;
    this.createSocketErrorCountLastCheck = 0;
    this.closeSocketCount = 0;
    this.closeSocketCountLastCheck = 0;
    this.errorSocketCount = 0;
    this.errorSocketCountLastCheck = 0;
    this.requestCount = 0;
    this.requestCountLastCheck = 0;
    this.timeoutSocketCount = 0;
    this.timeoutSocketCountLastCheck = 0;
    this.on("free", (socket) => {
      const timeout = this.calcSocketTimeout(socket);
      if (timeout > 0 && socket.timeout !== timeout) {
        socket.setTimeout(timeout);
      }
    });
  }
  get freeSocketKeepAliveTimeout() {
    deprecate("agent.freeSocketKeepAliveTimeout is deprecated, please use agent.options.freeSocketTimeout instead");
    return this.options.freeSocketTimeout;
  }
  get timeout() {
    deprecate("agent.timeout is deprecated, please use agent.options.timeout instead");
    return this.options.timeout;
  }
  get socketActiveTTL() {
    deprecate("agent.socketActiveTTL is deprecated, please use agent.options.socketActiveTTL instead");
    return this.options.socketActiveTTL;
  }
  calcSocketTimeout(socket) {
    let freeSocketTimeout = this.options.freeSocketTimeout;
    const socketActiveTTL = this.options.socketActiveTTL;
    if (socketActiveTTL) {
      const aliveTime = Date.now() - socket[SOCKET_CREATED_TIME];
      const diff = socketActiveTTL - aliveTime;
      if (diff <= 0) {
        return diff;
      }
      if (freeSocketTimeout && diff < freeSocketTimeout) {
        freeSocketTimeout = diff;
      }
    }
    if (freeSocketTimeout) {
      const customFreeSocketTimeout = socket.freeSocketTimeout || socket.freeSocketKeepAliveTimeout;
      return customFreeSocketTimeout || freeSocketTimeout;
    }
  }
  keepSocketAlive(socket) {
    const result = super.keepSocketAlive(socket);
    if (!result)
      return result;
    const customTimeout = this.calcSocketTimeout(socket);
    if (typeof customTimeout === "undefined") {
      return true;
    }
    if (customTimeout <= 0) {
      debug("%s(requests: %s, finished: %s) free but need to destroy by TTL, request count %s, diff is %s", socket[SOCKET_NAME], socket[SOCKET_REQUEST_COUNT], socket[SOCKET_REQUEST_FINISHED_COUNT], customTimeout);
      return false;
    }
    if (socket.timeout !== customTimeout) {
      socket.setTimeout(customTimeout);
    }
    return true;
  }
  reuseSocket(...args) {
    super.reuseSocket(...args);
    const socket = args[0];
    const req = args[1];
    req.reusedSocket = true;
    const agentTimeout = this.options.timeout;
    if (getSocketTimeout(socket) !== agentTimeout) {
      socket.setTimeout(agentTimeout);
      debug("%s reset timeout to %sms", socket[SOCKET_NAME], agentTimeout);
    }
    socket[SOCKET_REQUEST_COUNT]++;
    debug("%s(requests: %s, finished: %s) reuse on addRequest, timeout %sms", socket[SOCKET_NAME], socket[SOCKET_REQUEST_COUNT], socket[SOCKET_REQUEST_FINISHED_COUNT], getSocketTimeout(socket));
  }
  [CREATE_ID]() {
    const id = this[CURRENT_ID]++;
    if (this[CURRENT_ID] === Number.MAX_SAFE_INTEGER)
      this[CURRENT_ID] = 0;
    return id;
  }
  [INIT_SOCKET$1](socket, options) {
    if (options.timeout) {
      const timeout = getSocketTimeout(socket);
      if (!timeout) {
        socket.setTimeout(options.timeout);
      }
    }
    if (this.options.keepAlive) {
      socket.setNoDelay(true);
    }
    this.createSocketCount++;
    if (this.options.socketActiveTTL) {
      socket[SOCKET_CREATED_TIME] = Date.now();
    }
    socket[SOCKET_NAME] = `sock[${this[CREATE_ID]()}#${options._agentKey}]`.split("-----BEGIN", 1)[0];
    socket[SOCKET_REQUEST_COUNT] = 1;
    socket[SOCKET_REQUEST_FINISHED_COUNT] = 0;
    installListeners(this, socket, options);
  }
  createConnection(options, oncreate) {
    let called = false;
    const onNewCreate = (err, socket) => {
      if (called)
        return;
      called = true;
      if (err) {
        this.createSocketErrorCount++;
        return oncreate(err);
      }
      this[INIT_SOCKET$1](socket, options);
      oncreate(err, socket);
    };
    const newSocket = super.createConnection(options, onNewCreate);
    if (newSocket)
      onNewCreate(null, newSocket);
    return newSocket;
  }
  get statusChanged() {
    const changed = this.createSocketCount !== this.createSocketCountLastCheck || this.createSocketErrorCount !== this.createSocketErrorCountLastCheck || this.closeSocketCount !== this.closeSocketCountLastCheck || this.errorSocketCount !== this.errorSocketCountLastCheck || this.timeoutSocketCount !== this.timeoutSocketCountLastCheck || this.requestCount !== this.requestCountLastCheck;
    if (changed) {
      this.createSocketCountLastCheck = this.createSocketCount;
      this.createSocketErrorCountLastCheck = this.createSocketErrorCount;
      this.closeSocketCountLastCheck = this.closeSocketCount;
      this.errorSocketCountLastCheck = this.errorSocketCount;
      this.timeoutSocketCountLastCheck = this.timeoutSocketCount;
      this.requestCountLastCheck = this.requestCount;
    }
    return changed;
  }
  getCurrentStatus() {
    return {
      createSocketCount: this.createSocketCount,
      createSocketErrorCount: this.createSocketErrorCount,
      closeSocketCount: this.closeSocketCount,
      errorSocketCount: this.errorSocketCount,
      timeoutSocketCount: this.timeoutSocketCount,
      requestCount: this.requestCount,
      freeSockets: inspect(this.freeSockets),
      sockets: inspect(this.sockets),
      requests: inspect(this.requests)
    };
  }
}
var agent = Agent;
var OriginalHttpsAgent = require$$0$2.Agent;
var HttpAgent = agent;
var {
  INIT_SOCKET,
  CREATE_HTTPS_CONNECTION
} = constants;
var HttpsAgent$1 = class HttpsAgent extends HttpAgent {
  constructor(options) {
    super(options);
    this.defaultPort = 443;
    this.protocol = "https:";
    this.maxCachedSessions = this.options.maxCachedSessions;
    if (this.maxCachedSessions === undefined) {
      this.maxCachedSessions = 100;
    }
    this._sessionCache = {
      map: {},
      list: []
    };
  }
  createConnection(options, oncreate) {
    const socket = this[CREATE_HTTPS_CONNECTION](options, oncreate);
    this[INIT_SOCKET](socket, options);
    return socket;
  }
};
HttpsAgent$1.prototype[CREATE_HTTPS_CONNECTION] = OriginalHttpsAgent.prototype.createConnection;
[
  "getName",
  "_getSession",
  "_cacheSession",
  "_evictSession"
].forEach(function(method) {
  if (typeof OriginalHttpsAgent.prototype[method] === "function") {
    HttpsAgent$1.prototype[method] = OriginalHttpsAgent.prototype[method];
  }
});
var https_agent = HttpsAgent$1;
agentkeepalive.exports = agent;
var HttpsAgent2 = agentkeepalive.exports.HttpsAgent = https_agent;
agentkeepalive.exports.constants = constants;
var agentkeepaliveExports = agentkeepalive.exports;
var HttpKeepAliveAgent = getDefaultExportFromCjs(agentkeepaliveExports);
var objToString = Object.prototype.toString;
var objKeys = Object.keys || function(obj) {
  var keys = [];
  for (var name in obj) {
    keys.push(name);
  }
  return keys;
};
var fastStableStringify = function(val) {
  var returnVal = stringify(val, false);
  if (returnVal !== undefined) {
    return "" + returnVal;
  }
};
var fastStableStringify$1 = getDefaultExportFromCjs(fastStableStringify);
var MINIMUM_SLOT_PER_EPOCH = 32;

class EpochSchedule {
  constructor(slotsPerEpoch, leaderScheduleSlotOffset, warmup, firstNormalEpoch, firstNormalSlot) {
    this.slotsPerEpoch = undefined;
    this.leaderScheduleSlotOffset = undefined;
    this.warmup = undefined;
    this.firstNormalEpoch = undefined;
    this.firstNormalSlot = undefined;
    this.slotsPerEpoch = slotsPerEpoch;
    this.leaderScheduleSlotOffset = leaderScheduleSlotOffset;
    this.warmup = warmup;
    this.firstNormalEpoch = firstNormalEpoch;
    this.firstNormalSlot = firstNormalSlot;
  }
  getEpoch(slot) {
    return this.getEpochAndSlotIndex(slot)[0];
  }
  getEpochAndSlotIndex(slot) {
    if (slot < this.firstNormalSlot) {
      const epoch = trailingZeros(nextPowerOfTwo(slot + MINIMUM_SLOT_PER_EPOCH + 1)) - trailingZeros(MINIMUM_SLOT_PER_EPOCH) - 1;
      const epochLen = this.getSlotsInEpoch(epoch);
      const slotIndex = slot - (epochLen - MINIMUM_SLOT_PER_EPOCH);
      return [epoch, slotIndex];
    } else {
      const normalSlotIndex = slot - this.firstNormalSlot;
      const normalEpochIndex = Math.floor(normalSlotIndex / this.slotsPerEpoch);
      const epoch = this.firstNormalEpoch + normalEpochIndex;
      const slotIndex = normalSlotIndex % this.slotsPerEpoch;
      return [epoch, slotIndex];
    }
  }
  getFirstSlotInEpoch(epoch) {
    if (epoch <= this.firstNormalEpoch) {
      return (Math.pow(2, epoch) - 1) * MINIMUM_SLOT_PER_EPOCH;
    } else {
      return (epoch - this.firstNormalEpoch) * this.slotsPerEpoch + this.firstNormalSlot;
    }
  }
  getLastSlotInEpoch(epoch) {
    return this.getFirstSlotInEpoch(epoch) + this.getSlotsInEpoch(epoch) - 1;
  }
  getSlotsInEpoch(epoch) {
    if (epoch < this.firstNormalEpoch) {
      return Math.pow(2, epoch + trailingZeros(MINIMUM_SLOT_PER_EPOCH));
    } else {
      return this.slotsPerEpoch;
    }
  }
}

class SendTransactionError extends Error {
  constructor(message, logs) {
    super(message);
    this.logs = undefined;
    this.logs = logs;
  }
}
var SolanaJSONRPCErrorCode = {
  JSON_RPC_SERVER_ERROR_BLOCK_CLEANED_UP: -32001,
  JSON_RPC_SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE: -32002,
  JSON_RPC_SERVER_ERROR_TRANSACTION_SIGNATURE_VERIFICATION_FAILURE: -32003,
  JSON_RPC_SERVER_ERROR_BLOCK_NOT_AVAILABLE: -32004,
  JSON_RPC_SERVER_ERROR_NODE_UNHEALTHY: -32005,
  JSON_RPC_SERVER_ERROR_TRANSACTION_PRECOMPILE_VERIFICATION_FAILURE: -32006,
  JSON_RPC_SERVER_ERROR_SLOT_SKIPPED: -32007,
  JSON_RPC_SERVER_ERROR_NO_SNAPSHOT: -32008,
  JSON_RPC_SERVER_ERROR_LONG_TERM_STORAGE_SLOT_SKIPPED: -32009,
  JSON_RPC_SERVER_ERROR_KEY_EXCLUDED_FROM_SECONDARY_INDEX: -32010,
  JSON_RPC_SERVER_ERROR_TRANSACTION_HISTORY_NOT_AVAILABLE: -32011,
  JSON_RPC_SCAN_ERROR: -32012,
  JSON_RPC_SERVER_ERROR_TRANSACTION_SIGNATURE_LEN_MISMATCH: -32013,
  JSON_RPC_SERVER_ERROR_BLOCK_STATUS_NOT_AVAILABLE_YET: -32014,
  JSON_RPC_SERVER_ERROR_UNSUPPORTED_TRANSACTION_VERSION: -32015,
  JSON_RPC_SERVER_ERROR_MIN_CONTEXT_SLOT_NOT_REACHED: -32016
};

class SolanaJSONRPCError extends Error {
  constructor({
    code,
    message,
    data
  }, customMessage) {
    super(customMessage != null ? `${customMessage}: ${message}` : message);
    this.code = undefined;
    this.data = undefined;
    this.code = code;
    this.data = data;
    this.name = "SolanaJSONRPCError";
  }
}
var fetchImpl = typeof globalThis.fetch === "function" ? globalThis.fetch : async function(input, init) {
  const processedInput = typeof input === "string" && input.slice(0, 2) === "//" ? "https:" + input : input;
  return await nodeFetch.default(processedInput, init);
};

class RpcWebSocketClient extends client.default {
  constructor(address, options, generate_request_id) {
    const webSocketFactory = (url) => {
      const rpc = websocket.default(url, {
        autoconnect: true,
        max_reconnects: 5,
        reconnect: true,
        reconnect_interval: 1000,
        ...options
      });
      if ("socket" in rpc) {
        this.underlyingSocket = rpc.socket;
      } else {
        this.underlyingSocket = rpc;
      }
      return rpc;
    };
    super(webSocketFactory, address, options, generate_request_id);
    this.underlyingSocket = undefined;
  }
  call(...args) {
    const readyState = this.underlyingSocket?.readyState;
    if (readyState === 1) {
      return super.call(...args);
    }
    return Promise.reject(new Error("Tried to call a JSON-RPC method `" + args[0] + "` but the socket was not `CONNECTING` or `OPEN` (`readyState` was " + readyState + ")"));
  }
  notify(...args) {
    const readyState = this.underlyingSocket?.readyState;
    if (readyState === 1) {
      return super.notify(...args);
    }
    return Promise.reject(new Error("Tried to send a JSON-RPC notification `" + args[0] + "` but the socket was not `CONNECTING` or `OPEN` (`readyState` was " + readyState + ")"));
  }
}
var LOOKUP_TABLE_META_SIZE = 56;

class AddressLookupTableAccount {
  constructor(args) {
    this.key = undefined;
    this.state = undefined;
    this.key = args.key;
    this.state = args.state;
  }
  isActive() {
    const U64_MAX = BigInt("0xffffffffffffffff");
    return this.state.deactivationSlot === U64_MAX;
  }
  static deserialize(accountData) {
    const meta = decodeData(LookupTableMetaLayout, accountData);
    const serializedAddressesLen = accountData.length - LOOKUP_TABLE_META_SIZE;
    assert2(serializedAddressesLen >= 0, "lookup table is invalid");
    assert2(serializedAddressesLen % 32 === 0, "lookup table is invalid");
    const numSerializedAddresses = serializedAddressesLen / 32;
    const {
      addresses
    } = BufferLayout.struct([BufferLayout.seq(publicKey(), numSerializedAddresses, "addresses")]).decode(accountData.slice(LOOKUP_TABLE_META_SIZE));
    return {
      deactivationSlot: meta.deactivationSlot,
      lastExtendedSlot: meta.lastExtendedSlot,
      lastExtendedSlotStartIndex: meta.lastExtendedStartIndex,
      authority: meta.authority.length !== 0 ? new PublicKey(meta.authority[0]) : undefined,
      addresses: addresses.map((address) => new PublicKey(address))
    };
  }
}
var LookupTableMetaLayout = {
  index: 1,
  layout: BufferLayout.struct([
    BufferLayout.u32("typeIndex"),
    u642("deactivationSlot"),
    BufferLayout.nu64("lastExtendedSlot"),
    BufferLayout.u8("lastExtendedStartIndex"),
    BufferLayout.u8(),
    BufferLayout.seq(publicKey(), BufferLayout.offset(BufferLayout.u8(), -1), "authority")
  ])
};
var URL_RE = /^[^:]+:\/\/([^:[]+|\[[^\]]+\])(:\d+)?(.*)/i;
var PublicKeyFromString = coerce(instance(PublicKey), string(), (value) => new PublicKey(value));
var RawAccountDataResult = tuple([string(), literal("base64")]);
var BufferFromRawAccountData = coerce(instance(Buffer2), RawAccountDataResult, (value) => Buffer2.from(value[0], "base64"));
var BLOCKHASH_CACHE_TIMEOUT_MS = 30 * 1000;
var UnknownRpcResult = createRpcResult(unknown());
var GetInflationGovernorResult = type({
  foundation: number2(),
  foundationTerm: number2(),
  initial: number2(),
  taper: number2(),
  terminal: number2()
});
var GetInflationRewardResult = jsonRpcResult(array(nullable(type({
  epoch: number2(),
  effectiveSlot: number2(),
  amount: number2(),
  postBalance: number2(),
  commission: optional(nullable(number2()))
}))));
var GetRecentPrioritizationFeesResult = array(type({
  slot: number2(),
  prioritizationFee: number2()
}));
var GetInflationRateResult = type({
  total: number2(),
  validator: number2(),
  foundation: number2(),
  epoch: number2()
});
var GetEpochInfoResult = type({
  epoch: number2(),
  slotIndex: number2(),
  slotsInEpoch: number2(),
  absoluteSlot: number2(),
  blockHeight: optional(number2()),
  transactionCount: optional(number2())
});
var GetEpochScheduleResult = type({
  slotsPerEpoch: number2(),
  leaderScheduleSlotOffset: number2(),
  warmup: boolean(),
  firstNormalEpoch: number2(),
  firstNormalSlot: number2()
});
var GetLeaderScheduleResult = record(string(), array(number2()));
var TransactionErrorResult = nullable(union([type({}), string()]));
var SignatureStatusResult = type({
  err: TransactionErrorResult
});
var SignatureReceivedResult = literal("receivedSignature");
var VersionResult = type({
  "solana-core": string(),
  "feature-set": optional(number2())
});
var SimulatedTransactionResponseStruct = jsonRpcResultAndContext(type({
  err: nullable(union([type({}), string()])),
  logs: nullable(array(string())),
  accounts: optional(nullable(array(nullable(type({
    executable: boolean(),
    owner: string(),
    lamports: number2(),
    data: array(string()),
    rentEpoch: optional(number2())
  }))))),
  unitsConsumed: optional(number2()),
  returnData: optional(nullable(type({
    programId: string(),
    data: tuple([string(), literal("base64")])
  })))
}));
var BlockProductionResponseStruct = jsonRpcResultAndContext(type({
  byIdentity: record(string(), array(number2())),
  range: type({
    firstSlot: number2(),
    lastSlot: number2()
  })
}));
var GetInflationGovernorRpcResult = jsonRpcResult(GetInflationGovernorResult);
var GetInflationRateRpcResult = jsonRpcResult(GetInflationRateResult);
var GetRecentPrioritizationFeesRpcResult = jsonRpcResult(GetRecentPrioritizationFeesResult);
var GetEpochInfoRpcResult = jsonRpcResult(GetEpochInfoResult);
var GetEpochScheduleRpcResult = jsonRpcResult(GetEpochScheduleResult);
var GetLeaderScheduleRpcResult = jsonRpcResult(GetLeaderScheduleResult);
var SlotRpcResult = jsonRpcResult(number2());
var GetSupplyRpcResult = jsonRpcResultAndContext(type({
  total: number2(),
  circulating: number2(),
  nonCirculating: number2(),
  nonCirculatingAccounts: array(PublicKeyFromString)
}));
var TokenAmountResult = type({
  amount: string(),
  uiAmount: nullable(number2()),
  decimals: number2(),
  uiAmountString: optional(string())
});
var GetTokenLargestAccountsResult = jsonRpcResultAndContext(array(type({
  address: PublicKeyFromString,
  amount: string(),
  uiAmount: nullable(number2()),
  decimals: number2(),
  uiAmountString: optional(string())
})));
var GetTokenAccountsByOwner = jsonRpcResultAndContext(array(type({
  pubkey: PublicKeyFromString,
  account: type({
    executable: boolean(),
    owner: PublicKeyFromString,
    lamports: number2(),
    data: BufferFromRawAccountData,
    rentEpoch: number2()
  })
})));
var ParsedAccountDataResult = type({
  program: string(),
  parsed: unknown(),
  space: number2()
});
var GetParsedTokenAccountsByOwner = jsonRpcResultAndContext(array(type({
  pubkey: PublicKeyFromString,
  account: type({
    executable: boolean(),
    owner: PublicKeyFromString,
    lamports: number2(),
    data: ParsedAccountDataResult,
    rentEpoch: number2()
  })
})));
var GetLargestAccountsRpcResult = jsonRpcResultAndContext(array(type({
  lamports: number2(),
  address: PublicKeyFromString
})));
var AccountInfoResult = type({
  executable: boolean(),
  owner: PublicKeyFromString,
  lamports: number2(),
  data: BufferFromRawAccountData,
  rentEpoch: number2()
});
var KeyedAccountInfoResult = type({
  pubkey: PublicKeyFromString,
  account: AccountInfoResult
});
var ParsedOrRawAccountData = coerce(union([instance(Buffer2), ParsedAccountDataResult]), union([RawAccountDataResult, ParsedAccountDataResult]), (value) => {
  if (Array.isArray(value)) {
    return create(value, BufferFromRawAccountData);
  } else {
    return value;
  }
});
var ParsedAccountInfoResult = type({
  executable: boolean(),
  owner: PublicKeyFromString,
  lamports: number2(),
  data: ParsedOrRawAccountData,
  rentEpoch: number2()
});
var KeyedParsedAccountInfoResult = type({
  pubkey: PublicKeyFromString,
  account: ParsedAccountInfoResult
});
var StakeActivationResult = type({
  state: union([literal("active"), literal("inactive"), literal("activating"), literal("deactivating")]),
  active: number2(),
  inactive: number2()
});
var GetConfirmedSignaturesForAddress2RpcResult = jsonRpcResult(array(type({
  signature: string(),
  slot: number2(),
  err: TransactionErrorResult,
  memo: nullable(string()),
  blockTime: optional(nullable(number2()))
})));
var GetSignaturesForAddressRpcResult = jsonRpcResult(array(type({
  signature: string(),
  slot: number2(),
  err: TransactionErrorResult,
  memo: nullable(string()),
  blockTime: optional(nullable(number2()))
})));
var AccountNotificationResult = type({
  subscription: number2(),
  result: notificationResultAndContext(AccountInfoResult)
});
var ProgramAccountInfoResult = type({
  pubkey: PublicKeyFromString,
  account: AccountInfoResult
});
var ProgramAccountNotificationResult = type({
  subscription: number2(),
  result: notificationResultAndContext(ProgramAccountInfoResult)
});
var SlotInfoResult = type({
  parent: number2(),
  slot: number2(),
  root: number2()
});
var SlotNotificationResult = type({
  subscription: number2(),
  result: SlotInfoResult
});
var SlotUpdateResult = union([type({
  type: union([literal("firstShredReceived"), literal("completed"), literal("optimisticConfirmation"), literal("root")]),
  slot: number2(),
  timestamp: number2()
}), type({
  type: literal("createdBank"),
  parent: number2(),
  slot: number2(),
  timestamp: number2()
}), type({
  type: literal("frozen"),
  slot: number2(),
  timestamp: number2(),
  stats: type({
    numTransactionEntries: number2(),
    numSuccessfulTransactions: number2(),
    numFailedTransactions: number2(),
    maxTransactionsPerEntry: number2()
  })
}), type({
  type: literal("dead"),
  slot: number2(),
  timestamp: number2(),
  err: string()
})]);
var SlotUpdateNotificationResult = type({
  subscription: number2(),
  result: SlotUpdateResult
});
var SignatureNotificationResult = type({
  subscription: number2(),
  result: notificationResultAndContext(union([SignatureStatusResult, SignatureReceivedResult]))
});
var RootNotificationResult = type({
  subscription: number2(),
  result: number2()
});
var ContactInfoResult = type({
  pubkey: string(),
  gossip: nullable(string()),
  tpu: nullable(string()),
  rpc: nullable(string()),
  version: nullable(string())
});
var VoteAccountInfoResult = type({
  votePubkey: string(),
  nodePubkey: string(),
  activatedStake: number2(),
  epochVoteAccount: boolean(),
  epochCredits: array(tuple([number2(), number2(), number2()])),
  commission: number2(),
  lastVote: number2(),
  rootSlot: nullable(number2())
});
var GetVoteAccounts = jsonRpcResult(type({
  current: array(VoteAccountInfoResult),
  delinquent: array(VoteAccountInfoResult)
}));
var ConfirmationStatus = union([literal("processed"), literal("confirmed"), literal("finalized")]);
var SignatureStatusResponse = type({
  slot: number2(),
  confirmations: nullable(number2()),
  err: TransactionErrorResult,
  confirmationStatus: optional(ConfirmationStatus)
});
var GetSignatureStatusesRpcResult = jsonRpcResultAndContext(array(nullable(SignatureStatusResponse)));
var GetMinimumBalanceForRentExemptionRpcResult = jsonRpcResult(number2());
var AddressTableLookupStruct = type({
  accountKey: PublicKeyFromString,
  writableIndexes: array(number2()),
  readonlyIndexes: array(number2())
});
var ConfirmedTransactionResult = type({
  signatures: array(string()),
  message: type({
    accountKeys: array(string()),
    header: type({
      numRequiredSignatures: number2(),
      numReadonlySignedAccounts: number2(),
      numReadonlyUnsignedAccounts: number2()
    }),
    instructions: array(type({
      accounts: array(number2()),
      data: string(),
      programIdIndex: number2()
    })),
    recentBlockhash: string(),
    addressTableLookups: optional(array(AddressTableLookupStruct))
  })
});
var AnnotatedAccountKey = type({
  pubkey: PublicKeyFromString,
  signer: boolean(),
  writable: boolean(),
  source: optional(union([literal("transaction"), literal("lookupTable")]))
});
var ConfirmedTransactionAccountsModeResult = type({
  accountKeys: array(AnnotatedAccountKey),
  signatures: array(string())
});
var ParsedInstructionResult = type({
  parsed: unknown(),
  program: string(),
  programId: PublicKeyFromString
});
var RawInstructionResult = type({
  accounts: array(PublicKeyFromString),
  data: string(),
  programId: PublicKeyFromString
});
var InstructionResult = union([RawInstructionResult, ParsedInstructionResult]);
var UnknownInstructionResult = union([type({
  parsed: unknown(),
  program: string(),
  programId: string()
}), type({
  accounts: array(string()),
  data: string(),
  programId: string()
})]);
var ParsedOrRawInstruction = coerce(InstructionResult, UnknownInstructionResult, (value) => {
  if ("accounts" in value) {
    return create(value, RawInstructionResult);
  } else {
    return create(value, ParsedInstructionResult);
  }
});
var ParsedConfirmedTransactionResult = type({
  signatures: array(string()),
  message: type({
    accountKeys: array(AnnotatedAccountKey),
    instructions: array(ParsedOrRawInstruction),
    recentBlockhash: string(),
    addressTableLookups: optional(nullable(array(AddressTableLookupStruct)))
  })
});
var TokenBalanceResult = type({
  accountIndex: number2(),
  mint: string(),
  owner: optional(string()),
  uiTokenAmount: TokenAmountResult
});
var LoadedAddressesResult = type({
  writable: array(PublicKeyFromString),
  readonly: array(PublicKeyFromString)
});
var ConfirmedTransactionMetaResult = type({
  err: TransactionErrorResult,
  fee: number2(),
  innerInstructions: optional(nullable(array(type({
    index: number2(),
    instructions: array(type({
      accounts: array(number2()),
      data: string(),
      programIdIndex: number2()
    }))
  })))),
  preBalances: array(number2()),
  postBalances: array(number2()),
  logMessages: optional(nullable(array(string()))),
  preTokenBalances: optional(nullable(array(TokenBalanceResult))),
  postTokenBalances: optional(nullable(array(TokenBalanceResult))),
  loadedAddresses: optional(LoadedAddressesResult),
  computeUnitsConsumed: optional(number2())
});
var ParsedConfirmedTransactionMetaResult = type({
  err: TransactionErrorResult,
  fee: number2(),
  innerInstructions: optional(nullable(array(type({
    index: number2(),
    instructions: array(ParsedOrRawInstruction)
  })))),
  preBalances: array(number2()),
  postBalances: array(number2()),
  logMessages: optional(nullable(array(string()))),
  preTokenBalances: optional(nullable(array(TokenBalanceResult))),
  postTokenBalances: optional(nullable(array(TokenBalanceResult))),
  loadedAddresses: optional(LoadedAddressesResult),
  computeUnitsConsumed: optional(number2())
});
var TransactionVersionStruct = union([literal(0), literal("legacy")]);
var RewardsResult = type({
  pubkey: string(),
  lamports: number2(),
  postBalance: nullable(number2()),
  rewardType: nullable(string()),
  commission: optional(nullable(number2()))
});
var GetBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number2(),
  transactions: array(type({
    transaction: ConfirmedTransactionResult,
    meta: nullable(ConfirmedTransactionMetaResult),
    version: optional(TransactionVersionStruct)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number2()),
  blockHeight: nullable(number2())
})));
var GetNoneModeBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number2(),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number2()),
  blockHeight: nullable(number2())
})));
var GetAccountsModeBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number2(),
  transactions: array(type({
    transaction: ConfirmedTransactionAccountsModeResult,
    meta: nullable(ConfirmedTransactionMetaResult),
    version: optional(TransactionVersionStruct)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number2()),
  blockHeight: nullable(number2())
})));
var GetParsedBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number2(),
  transactions: array(type({
    transaction: ParsedConfirmedTransactionResult,
    meta: nullable(ParsedConfirmedTransactionMetaResult),
    version: optional(TransactionVersionStruct)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number2()),
  blockHeight: nullable(number2())
})));
var GetParsedAccountsModeBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number2(),
  transactions: array(type({
    transaction: ConfirmedTransactionAccountsModeResult,
    meta: nullable(ParsedConfirmedTransactionMetaResult),
    version: optional(TransactionVersionStruct)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number2()),
  blockHeight: nullable(number2())
})));
var GetParsedNoneModeBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number2(),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number2()),
  blockHeight: nullable(number2())
})));
var GetConfirmedBlockRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number2(),
  transactions: array(type({
    transaction: ConfirmedTransactionResult,
    meta: nullable(ConfirmedTransactionMetaResult)
  })),
  rewards: optional(array(RewardsResult)),
  blockTime: nullable(number2())
})));
var GetBlockSignaturesRpcResult = jsonRpcResult(nullable(type({
  blockhash: string(),
  previousBlockhash: string(),
  parentSlot: number2(),
  signatures: array(string()),
  blockTime: nullable(number2())
})));
var GetTransactionRpcResult = jsonRpcResult(nullable(type({
  slot: number2(),
  meta: nullable(ConfirmedTransactionMetaResult),
  blockTime: optional(nullable(number2())),
  transaction: ConfirmedTransactionResult,
  version: optional(TransactionVersionStruct)
})));
var GetParsedTransactionRpcResult = jsonRpcResult(nullable(type({
  slot: number2(),
  transaction: ParsedConfirmedTransactionResult,
  meta: nullable(ParsedConfirmedTransactionMetaResult),
  blockTime: optional(nullable(number2())),
  version: optional(TransactionVersionStruct)
})));
var GetRecentBlockhashAndContextRpcResult = jsonRpcResultAndContext(type({
  blockhash: string(),
  feeCalculator: type({
    lamportsPerSignature: number2()
  })
}));
var GetLatestBlockhashRpcResult = jsonRpcResultAndContext(type({
  blockhash: string(),
  lastValidBlockHeight: number2()
}));
var IsBlockhashValidRpcResult = jsonRpcResultAndContext(boolean());
var PerfSampleResult = type({
  slot: number2(),
  numTransactions: number2(),
  numSlots: number2(),
  samplePeriodSecs: number2()
});
var GetRecentPerformanceSamplesRpcResult = jsonRpcResult(array(PerfSampleResult));
var GetFeeCalculatorRpcResult = jsonRpcResultAndContext(nullable(type({
  feeCalculator: type({
    lamportsPerSignature: number2()
  })
})));
var RequestAirdropRpcResult = jsonRpcResult(string());
var SendTransactionRpcResult = jsonRpcResult(string());
var LogsResult = type({
  err: TransactionErrorResult,
  logs: array(string()),
  signature: string()
});
var LogsNotificationResult = type({
  result: notificationResultAndContext(LogsResult),
  subscription: number2()
});
var COMMON_HTTP_HEADERS = {
  "solana-client": `js/${"0.0.0-development"}`
};

class Connection {
  constructor(endpoint, _commitmentOrConfig) {
    this._commitment = undefined;
    this._confirmTransactionInitialTimeout = undefined;
    this._rpcEndpoint = undefined;
    this._rpcWsEndpoint = undefined;
    this._rpcClient = undefined;
    this._rpcRequest = undefined;
    this._rpcBatchRequest = undefined;
    this._rpcWebSocket = undefined;
    this._rpcWebSocketConnected = false;
    this._rpcWebSocketHeartbeat = null;
    this._rpcWebSocketIdleTimeout = null;
    this._rpcWebSocketGeneration = 0;
    this._disableBlockhashCaching = false;
    this._pollingBlockhash = false;
    this._blockhashInfo = {
      latestBlockhash: null,
      lastFetch: 0,
      transactionSignatures: [],
      simulatedSignatures: []
    };
    this._nextClientSubscriptionId = 0;
    this._subscriptionDisposeFunctionsByClientSubscriptionId = {};
    this._subscriptionHashByClientSubscriptionId = {};
    this._subscriptionStateChangeCallbacksByHash = {};
    this._subscriptionCallbacksByServerSubscriptionId = {};
    this._subscriptionsByHash = {};
    this._subscriptionsAutoDisposedByRpc = new Set;
    this.getBlockHeight = (() => {
      const requestPromises = {};
      return async (commitmentOrConfig) => {
        const {
          commitment,
          config
        } = extractCommitmentFromConfig(commitmentOrConfig);
        const args = this._buildArgs([], commitment, undefined, config);
        const requestHash = fastStableStringify$1(args);
        requestPromises[requestHash] = requestPromises[requestHash] ?? (async () => {
          try {
            const unsafeRes = await this._rpcRequest("getBlockHeight", args);
            const res = create(unsafeRes, jsonRpcResult(number2()));
            if ("error" in res) {
              throw new SolanaJSONRPCError(res.error, "failed to get block height information");
            }
            return res.result;
          } finally {
            delete requestPromises[requestHash];
          }
        })();
        return await requestPromises[requestHash];
      };
    })();
    let wsEndpoint;
    let httpHeaders;
    let fetch;
    let fetchMiddleware;
    let disableRetryOnRateLimit;
    let httpAgent;
    if (_commitmentOrConfig && typeof _commitmentOrConfig === "string") {
      this._commitment = _commitmentOrConfig;
    } else if (_commitmentOrConfig) {
      this._commitment = _commitmentOrConfig.commitment;
      this._confirmTransactionInitialTimeout = _commitmentOrConfig.confirmTransactionInitialTimeout;
      wsEndpoint = _commitmentOrConfig.wsEndpoint;
      httpHeaders = _commitmentOrConfig.httpHeaders;
      fetch = _commitmentOrConfig.fetch;
      fetchMiddleware = _commitmentOrConfig.fetchMiddleware;
      disableRetryOnRateLimit = _commitmentOrConfig.disableRetryOnRateLimit;
      httpAgent = _commitmentOrConfig.httpAgent;
    }
    this._rpcEndpoint = assertEndpointUrl(endpoint);
    this._rpcWsEndpoint = wsEndpoint || makeWebsocketUrl(endpoint);
    this._rpcClient = createRpcClient(endpoint, httpHeaders, fetch, fetchMiddleware, disableRetryOnRateLimit, httpAgent);
    this._rpcRequest = createRpcRequest(this._rpcClient);
    this._rpcBatchRequest = createRpcBatchRequest(this._rpcClient);
    this._rpcWebSocket = new RpcWebSocketClient(this._rpcWsEndpoint, {
      autoconnect: false,
      max_reconnects: Infinity
    });
    this._rpcWebSocket.on("open", this._wsOnOpen.bind(this));
    this._rpcWebSocket.on("error", this._wsOnError.bind(this));
    this._rpcWebSocket.on("close", this._wsOnClose.bind(this));
    this._rpcWebSocket.on("accountNotification", this._wsOnAccountNotification.bind(this));
    this._rpcWebSocket.on("programNotification", this._wsOnProgramAccountNotification.bind(this));
    this._rpcWebSocket.on("slotNotification", this._wsOnSlotNotification.bind(this));
    this._rpcWebSocket.on("slotsUpdatesNotification", this._wsOnSlotUpdatesNotification.bind(this));
    this._rpcWebSocket.on("signatureNotification", this._wsOnSignatureNotification.bind(this));
    this._rpcWebSocket.on("rootNotification", this._wsOnRootNotification.bind(this));
    this._rpcWebSocket.on("logsNotification", this._wsOnLogsNotification.bind(this));
  }
  get commitment() {
    return this._commitment;
  }
  get rpcEndpoint() {
    return this._rpcEndpoint;
  }
  async getBalanceAndContext(publicKey2, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([publicKey2.toBase58()], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("getBalance", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(number2()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get balance for ${publicKey2.toBase58()}`);
    }
    return res.result;
  }
  async getBalance(publicKey2, commitmentOrConfig) {
    return await this.getBalanceAndContext(publicKey2, commitmentOrConfig).then((x) => x.value).catch((e) => {
      throw new Error("failed to get balance of account " + publicKey2.toBase58() + ": " + e);
    });
  }
  async getBlockTime(slot) {
    const unsafeRes = await this._rpcRequest("getBlockTime", [slot]);
    const res = create(unsafeRes, jsonRpcResult(nullable(number2())));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get block time for slot ${slot}`);
    }
    return res.result;
  }
  async getMinimumLedgerSlot() {
    const unsafeRes = await this._rpcRequest("minimumLedgerSlot", []);
    const res = create(unsafeRes, jsonRpcResult(number2()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get minimum ledger slot");
    }
    return res.result;
  }
  async getFirstAvailableBlock() {
    const unsafeRes = await this._rpcRequest("getFirstAvailableBlock", []);
    const res = create(unsafeRes, SlotRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get first available block");
    }
    return res.result;
  }
  async getSupply(config) {
    let configArg = {};
    if (typeof config === "string") {
      configArg = {
        commitment: config
      };
    } else if (config) {
      configArg = {
        ...config,
        commitment: config && config.commitment || this.commitment
      };
    } else {
      configArg = {
        commitment: this.commitment
      };
    }
    const unsafeRes = await this._rpcRequest("getSupply", [configArg]);
    const res = create(unsafeRes, GetSupplyRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get supply");
    }
    return res.result;
  }
  async getTokenSupply(tokenMintAddress, commitment) {
    const args = this._buildArgs([tokenMintAddress.toBase58()], commitment);
    const unsafeRes = await this._rpcRequest("getTokenSupply", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(TokenAmountResult));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get token supply");
    }
    return res.result;
  }
  async getTokenAccountBalance(tokenAddress, commitment) {
    const args = this._buildArgs([tokenAddress.toBase58()], commitment);
    const unsafeRes = await this._rpcRequest("getTokenAccountBalance", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(TokenAmountResult));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get token account balance");
    }
    return res.result;
  }
  async getTokenAccountsByOwner(ownerAddress, filter, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    let _args = [ownerAddress.toBase58()];
    if ("mint" in filter) {
      _args.push({
        mint: filter.mint.toBase58()
      });
    } else {
      _args.push({
        programId: filter.programId.toBase58()
      });
    }
    const args = this._buildArgs(_args, commitment, "base64", config);
    const unsafeRes = await this._rpcRequest("getTokenAccountsByOwner", args);
    const res = create(unsafeRes, GetTokenAccountsByOwner);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get token accounts owned by account ${ownerAddress.toBase58()}`);
    }
    return res.result;
  }
  async getParsedTokenAccountsByOwner(ownerAddress, filter, commitment) {
    let _args = [ownerAddress.toBase58()];
    if ("mint" in filter) {
      _args.push({
        mint: filter.mint.toBase58()
      });
    } else {
      _args.push({
        programId: filter.programId.toBase58()
      });
    }
    const args = this._buildArgs(_args, commitment, "jsonParsed");
    const unsafeRes = await this._rpcRequest("getTokenAccountsByOwner", args);
    const res = create(unsafeRes, GetParsedTokenAccountsByOwner);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get token accounts owned by account ${ownerAddress.toBase58()}`);
    }
    return res.result;
  }
  async getLargestAccounts(config) {
    const arg = {
      ...config,
      commitment: config && config.commitment || this.commitment
    };
    const args = arg.filter || arg.commitment ? [arg] : [];
    const unsafeRes = await this._rpcRequest("getLargestAccounts", args);
    const res = create(unsafeRes, GetLargestAccountsRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get largest accounts");
    }
    return res.result;
  }
  async getTokenLargestAccounts(mintAddress, commitment) {
    const args = this._buildArgs([mintAddress.toBase58()], commitment);
    const unsafeRes = await this._rpcRequest("getTokenLargestAccounts", args);
    const res = create(unsafeRes, GetTokenLargestAccountsResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get token largest accounts");
    }
    return res.result;
  }
  async getAccountInfoAndContext(publicKey2, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([publicKey2.toBase58()], commitment, "base64", config);
    const unsafeRes = await this._rpcRequest("getAccountInfo", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(nullable(AccountInfoResult)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get info about account ${publicKey2.toBase58()}`);
    }
    return res.result;
  }
  async getParsedAccountInfo(publicKey2, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([publicKey2.toBase58()], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getAccountInfo", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(nullable(ParsedAccountInfoResult)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get info about account ${publicKey2.toBase58()}`);
    }
    return res.result;
  }
  async getAccountInfo(publicKey2, commitmentOrConfig) {
    try {
      const res = await this.getAccountInfoAndContext(publicKey2, commitmentOrConfig);
      return res.value;
    } catch (e) {
      throw new Error("failed to get info about account " + publicKey2.toBase58() + ": " + e);
    }
  }
  async getMultipleParsedAccounts(publicKeys, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const keys = publicKeys.map((key) => key.toBase58());
    const args = this._buildArgs([keys], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getMultipleAccounts", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(array(nullable(ParsedAccountInfoResult))));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get info for accounts ${keys}`);
    }
    return res.result;
  }
  async getMultipleAccountsInfoAndContext(publicKeys, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const keys = publicKeys.map((key) => key.toBase58());
    const args = this._buildArgs([keys], commitment, "base64", config);
    const unsafeRes = await this._rpcRequest("getMultipleAccounts", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(array(nullable(AccountInfoResult))));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get info for accounts ${keys}`);
    }
    return res.result;
  }
  async getMultipleAccountsInfo(publicKeys, commitmentOrConfig) {
    const res = await this.getMultipleAccountsInfoAndContext(publicKeys, commitmentOrConfig);
    return res.value;
  }
  async getStakeActivation(publicKey2, commitmentOrConfig, epoch) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([publicKey2.toBase58()], commitment, undefined, {
      ...config,
      epoch: epoch != null ? epoch : config?.epoch
    });
    const unsafeRes = await this._rpcRequest("getStakeActivation", args);
    const res = create(unsafeRes, jsonRpcResult(StakeActivationResult));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get Stake Activation ${publicKey2.toBase58()}`);
    }
    return res.result;
  }
  async getProgramAccounts(programId, configOrCommitment) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(configOrCommitment);
    const {
      encoding,
      ...configWithoutEncoding
    } = config || {};
    const args = this._buildArgs([programId.toBase58()], commitment, encoding || "base64", configWithoutEncoding);
    const unsafeRes = await this._rpcRequest("getProgramAccounts", args);
    const baseSchema = array(KeyedAccountInfoResult);
    const res = configWithoutEncoding.withContext === true ? create(unsafeRes, jsonRpcResultAndContext(baseSchema)) : create(unsafeRes, jsonRpcResult(baseSchema));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get accounts owned by program ${programId.toBase58()}`);
    }
    return res.result;
  }
  async getParsedProgramAccounts(programId, configOrCommitment) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(configOrCommitment);
    const args = this._buildArgs([programId.toBase58()], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getProgramAccounts", args);
    const res = create(unsafeRes, jsonRpcResult(array(KeyedParsedAccountInfoResult)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get accounts owned by program ${programId.toBase58()}`);
    }
    return res.result;
  }
  async confirmTransaction(strategy, commitment) {
    let rawSignature;
    if (typeof strategy == "string") {
      rawSignature = strategy;
    } else {
      const config = strategy;
      if (config.abortSignal?.aborted) {
        return Promise.reject(config.abortSignal.reason);
      }
      rawSignature = config.signature;
    }
    let decodedSignature;
    try {
      decodedSignature = import_bs58.default.decode(rawSignature);
    } catch (err) {
      throw new Error("signature must be base58 encoded: " + rawSignature);
    }
    assert2(decodedSignature.length === 64, "signature has invalid length");
    if (typeof strategy === "string") {
      return await this.confirmTransactionUsingLegacyTimeoutStrategy({
        commitment: commitment || this.commitment,
        signature: rawSignature
      });
    } else if ("lastValidBlockHeight" in strategy) {
      return await this.confirmTransactionUsingBlockHeightExceedanceStrategy({
        commitment: commitment || this.commitment,
        strategy
      });
    } else {
      return await this.confirmTransactionUsingDurableNonceStrategy({
        commitment: commitment || this.commitment,
        strategy
      });
    }
  }
  getCancellationPromise(signal) {
    return new Promise((_, reject) => {
      if (signal == null) {
        return;
      }
      if (signal.aborted) {
        reject(signal.reason);
      } else {
        signal.addEventListener("abort", () => {
          reject(signal.reason);
        });
      }
    });
  }
  getTransactionConfirmationPromise({
    commitment,
    signature: signature2
  }) {
    let signatureSubscriptionId;
    let disposeSignatureSubscriptionStateChangeObserver;
    let done = false;
    const confirmationPromise = new Promise((resolve, reject) => {
      try {
        signatureSubscriptionId = this.onSignature(signature2, (result, context) => {
          signatureSubscriptionId = undefined;
          const response = {
            context,
            value: result
          };
          resolve({
            __type: TransactionStatus.PROCESSED,
            response
          });
        }, commitment);
        const subscriptionSetupPromise = new Promise((resolveSubscriptionSetup) => {
          if (signatureSubscriptionId == null) {
            resolveSubscriptionSetup();
          } else {
            disposeSignatureSubscriptionStateChangeObserver = this._onSubscriptionStateChange(signatureSubscriptionId, (nextState) => {
              if (nextState === "subscribed") {
                resolveSubscriptionSetup();
              }
            });
          }
        });
        (async () => {
          await subscriptionSetupPromise;
          if (done)
            return;
          const response = await this.getSignatureStatus(signature2);
          if (done)
            return;
          if (response == null) {
            return;
          }
          const {
            context,
            value
          } = response;
          if (value == null) {
            return;
          }
          if (value?.err) {
            reject(value.err);
          } else {
            switch (commitment) {
              case "confirmed":
              case "single":
              case "singleGossip": {
                if (value.confirmationStatus === "processed") {
                  return;
                }
                break;
              }
              case "finalized":
              case "max":
              case "root": {
                if (value.confirmationStatus === "processed" || value.confirmationStatus === "confirmed") {
                  return;
                }
                break;
              }
              case "processed":
              case "recent":
            }
            done = true;
            resolve({
              __type: TransactionStatus.PROCESSED,
              response: {
                context,
                value
              }
            });
          }
        })();
      } catch (err) {
        reject(err);
      }
    });
    const abortConfirmation = () => {
      if (disposeSignatureSubscriptionStateChangeObserver) {
        disposeSignatureSubscriptionStateChangeObserver();
        disposeSignatureSubscriptionStateChangeObserver = undefined;
      }
      if (signatureSubscriptionId != null) {
        this.removeSignatureListener(signatureSubscriptionId);
        signatureSubscriptionId = undefined;
      }
    };
    return {
      abortConfirmation,
      confirmationPromise
    };
  }
  async confirmTransactionUsingBlockHeightExceedanceStrategy({
    commitment,
    strategy: {
      abortSignal,
      lastValidBlockHeight,
      signature: signature2
    }
  }) {
    let done = false;
    const expiryPromise = new Promise((resolve) => {
      const checkBlockHeight = async () => {
        try {
          const blockHeight = await this.getBlockHeight(commitment);
          return blockHeight;
        } catch (_e) {
          return -1;
        }
      };
      (async () => {
        let currentBlockHeight = await checkBlockHeight();
        if (done)
          return;
        while (currentBlockHeight <= lastValidBlockHeight) {
          await sleep(1000);
          if (done)
            return;
          currentBlockHeight = await checkBlockHeight();
          if (done)
            return;
        }
        resolve({
          __type: TransactionStatus.BLOCKHEIGHT_EXCEEDED
        });
      })();
    });
    const {
      abortConfirmation,
      confirmationPromise
    } = this.getTransactionConfirmationPromise({
      commitment,
      signature: signature2
    });
    const cancellationPromise = this.getCancellationPromise(abortSignal);
    let result;
    try {
      const outcome = await Promise.race([cancellationPromise, confirmationPromise, expiryPromise]);
      if (outcome.__type === TransactionStatus.PROCESSED) {
        result = outcome.response;
      } else {
        throw new TransactionExpiredBlockheightExceededError(signature2);
      }
    } finally {
      done = true;
      abortConfirmation();
    }
    return result;
  }
  async confirmTransactionUsingDurableNonceStrategy({
    commitment,
    strategy: {
      abortSignal,
      minContextSlot,
      nonceAccountPubkey,
      nonceValue,
      signature: signature2
    }
  }) {
    let done = false;
    const expiryPromise = new Promise((resolve) => {
      let currentNonceValue = nonceValue;
      let lastCheckedSlot = null;
      const getCurrentNonceValue = async () => {
        try {
          const {
            context,
            value: nonceAccount
          } = await this.getNonceAndContext(nonceAccountPubkey, {
            commitment,
            minContextSlot
          });
          lastCheckedSlot = context.slot;
          return nonceAccount?.nonce;
        } catch (e) {
          return currentNonceValue;
        }
      };
      (async () => {
        currentNonceValue = await getCurrentNonceValue();
        if (done)
          return;
        while (true) {
          if (nonceValue !== currentNonceValue) {
            resolve({
              __type: TransactionStatus.NONCE_INVALID,
              slotInWhichNonceDidAdvance: lastCheckedSlot
            });
            return;
          }
          await sleep(2000);
          if (done)
            return;
          currentNonceValue = await getCurrentNonceValue();
          if (done)
            return;
        }
      })();
    });
    const {
      abortConfirmation,
      confirmationPromise
    } = this.getTransactionConfirmationPromise({
      commitment,
      signature: signature2
    });
    const cancellationPromise = this.getCancellationPromise(abortSignal);
    let result;
    try {
      const outcome = await Promise.race([cancellationPromise, confirmationPromise, expiryPromise]);
      if (outcome.__type === TransactionStatus.PROCESSED) {
        result = outcome.response;
      } else {
        let signatureStatus;
        while (true) {
          const status = await this.getSignatureStatus(signature2);
          if (status == null) {
            break;
          }
          if (status.context.slot < (outcome.slotInWhichNonceDidAdvance ?? minContextSlot)) {
            await sleep(400);
            continue;
          }
          signatureStatus = status;
          break;
        }
        if (signatureStatus?.value) {
          const commitmentForStatus = commitment || "finalized";
          const {
            confirmationStatus
          } = signatureStatus.value;
          switch (commitmentForStatus) {
            case "processed":
            case "recent":
              if (confirmationStatus !== "processed" && confirmationStatus !== "confirmed" && confirmationStatus !== "finalized") {
                throw new TransactionExpiredNonceInvalidError(signature2);
              }
              break;
            case "confirmed":
            case "single":
            case "singleGossip":
              if (confirmationStatus !== "confirmed" && confirmationStatus !== "finalized") {
                throw new TransactionExpiredNonceInvalidError(signature2);
              }
              break;
            case "finalized":
            case "max":
            case "root":
              if (confirmationStatus !== "finalized") {
                throw new TransactionExpiredNonceInvalidError(signature2);
              }
              break;
            default:
              ((_) => {
              })(commitmentForStatus);
          }
          result = {
            context: signatureStatus.context,
            value: {
              err: signatureStatus.value.err
            }
          };
        } else {
          throw new TransactionExpiredNonceInvalidError(signature2);
        }
      }
    } finally {
      done = true;
      abortConfirmation();
    }
    return result;
  }
  async confirmTransactionUsingLegacyTimeoutStrategy({
    commitment,
    signature: signature2
  }) {
    let timeoutId;
    const expiryPromise = new Promise((resolve) => {
      let timeoutMs = this._confirmTransactionInitialTimeout || 60 * 1000;
      switch (commitment) {
        case "processed":
        case "recent":
        case "single":
        case "confirmed":
        case "singleGossip": {
          timeoutMs = this._confirmTransactionInitialTimeout || 30 * 1000;
          break;
        }
      }
      timeoutId = setTimeout(() => resolve({
        __type: TransactionStatus.TIMED_OUT,
        timeoutMs
      }), timeoutMs);
    });
    const {
      abortConfirmation,
      confirmationPromise
    } = this.getTransactionConfirmationPromise({
      commitment,
      signature: signature2
    });
    let result;
    try {
      const outcome = await Promise.race([confirmationPromise, expiryPromise]);
      if (outcome.__type === TransactionStatus.PROCESSED) {
        result = outcome.response;
      } else {
        throw new TransactionExpiredTimeoutError(signature2, outcome.timeoutMs / 1000);
      }
    } finally {
      clearTimeout(timeoutId);
      abortConfirmation();
    }
    return result;
  }
  async getClusterNodes() {
    const unsafeRes = await this._rpcRequest("getClusterNodes", []);
    const res = create(unsafeRes, jsonRpcResult(array(ContactInfoResult)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get cluster nodes");
    }
    return res.result;
  }
  async getVoteAccounts(commitment) {
    const args = this._buildArgs([], commitment);
    const unsafeRes = await this._rpcRequest("getVoteAccounts", args);
    const res = create(unsafeRes, GetVoteAccounts);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get vote accounts");
    }
    return res.result;
  }
  async getSlot(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("getSlot", args);
    const res = create(unsafeRes, jsonRpcResult(number2()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get slot");
    }
    return res.result;
  }
  async getSlotLeader(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("getSlotLeader", args);
    const res = create(unsafeRes, jsonRpcResult(string()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get slot leader");
    }
    return res.result;
  }
  async getSlotLeaders(startSlot, limit) {
    const args = [startSlot, limit];
    const unsafeRes = await this._rpcRequest("getSlotLeaders", args);
    const res = create(unsafeRes, jsonRpcResult(array(PublicKeyFromString)));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get slot leaders");
    }
    return res.result;
  }
  async getSignatureStatus(signature2, config) {
    const {
      context,
      value: values
    } = await this.getSignatureStatuses([signature2], config);
    assert2(values.length === 1);
    const value = values[0];
    return {
      context,
      value
    };
  }
  async getSignatureStatuses(signatures, config) {
    const params = [signatures];
    if (config) {
      params.push(config);
    }
    const unsafeRes = await this._rpcRequest("getSignatureStatuses", params);
    const res = create(unsafeRes, GetSignatureStatusesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get signature status");
    }
    return res.result;
  }
  async getTransactionCount(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("getTransactionCount", args);
    const res = create(unsafeRes, jsonRpcResult(number2()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get transaction count");
    }
    return res.result;
  }
  async getTotalSupply(commitment) {
    const result = await this.getSupply({
      commitment,
      excludeNonCirculatingAccountsList: true
    });
    return result.value.total;
  }
  async getInflationGovernor(commitment) {
    const args = this._buildArgs([], commitment);
    const unsafeRes = await this._rpcRequest("getInflationGovernor", args);
    const res = create(unsafeRes, GetInflationGovernorRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get inflation");
    }
    return res.result;
  }
  async getInflationReward(addresses, epoch, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([addresses.map((pubkey) => pubkey.toBase58())], commitment, undefined, {
      ...config,
      epoch: epoch != null ? epoch : config?.epoch
    });
    const unsafeRes = await this._rpcRequest("getInflationReward", args);
    const res = create(unsafeRes, GetInflationRewardResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get inflation reward");
    }
    return res.result;
  }
  async getInflationRate() {
    const unsafeRes = await this._rpcRequest("getInflationRate", []);
    const res = create(unsafeRes, GetInflationRateRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get inflation rate");
    }
    return res.result;
  }
  async getEpochInfo(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("getEpochInfo", args);
    const res = create(unsafeRes, GetEpochInfoRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get epoch info");
    }
    return res.result;
  }
  async getEpochSchedule() {
    const unsafeRes = await this._rpcRequest("getEpochSchedule", []);
    const res = create(unsafeRes, GetEpochScheduleRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get epoch schedule");
    }
    const epochSchedule = res.result;
    return new EpochSchedule(epochSchedule.slotsPerEpoch, epochSchedule.leaderScheduleSlotOffset, epochSchedule.warmup, epochSchedule.firstNormalEpoch, epochSchedule.firstNormalSlot);
  }
  async getLeaderSchedule() {
    const unsafeRes = await this._rpcRequest("getLeaderSchedule", []);
    const res = create(unsafeRes, GetLeaderScheduleRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get leader schedule");
    }
    return res.result;
  }
  async getMinimumBalanceForRentExemption(dataLength, commitment) {
    const args = this._buildArgs([dataLength], commitment);
    const unsafeRes = await this._rpcRequest("getMinimumBalanceForRentExemption", args);
    const res = create(unsafeRes, GetMinimumBalanceForRentExemptionRpcResult);
    if ("error" in res) {
      console.warn("Unable to fetch minimum balance for rent exemption");
      return 0;
    }
    return res.result;
  }
  async getRecentBlockhashAndContext(commitment) {
    const args = this._buildArgs([], commitment);
    const unsafeRes = await this._rpcRequest("getRecentBlockhash", args);
    const res = create(unsafeRes, GetRecentBlockhashAndContextRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get recent blockhash");
    }
    return res.result;
  }
  async getRecentPerformanceSamples(limit) {
    const unsafeRes = await this._rpcRequest("getRecentPerformanceSamples", limit ? [limit] : []);
    const res = create(unsafeRes, GetRecentPerformanceSamplesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get recent performance samples");
    }
    return res.result;
  }
  async getFeeCalculatorForBlockhash(blockhash, commitment) {
    const args = this._buildArgs([blockhash], commitment);
    const unsafeRes = await this._rpcRequest("getFeeCalculatorForBlockhash", args);
    const res = create(unsafeRes, GetFeeCalculatorRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get fee calculator");
    }
    const {
      context,
      value
    } = res.result;
    return {
      context,
      value: value !== null ? value.feeCalculator : null
    };
  }
  async getFeeForMessage(message, commitment) {
    const wireMessage = toBuffer(message.serialize()).toString("base64");
    const args = this._buildArgs([wireMessage], commitment);
    const unsafeRes = await this._rpcRequest("getFeeForMessage", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(nullable(number2())));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get fee for message");
    }
    if (res.result === null) {
      throw new Error("invalid blockhash");
    }
    return res.result;
  }
  async getRecentPrioritizationFees(config) {
    const accounts = config?.lockedWritableAccounts?.map((key) => key.toBase58());
    const args = accounts?.length ? [accounts] : [];
    const unsafeRes = await this._rpcRequest("getRecentPrioritizationFees", args);
    const res = create(unsafeRes, GetRecentPrioritizationFeesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get recent prioritization fees");
    }
    return res.result;
  }
  async getRecentBlockhash(commitment) {
    try {
      const res = await this.getRecentBlockhashAndContext(commitment);
      return res.value;
    } catch (e) {
      throw new Error("failed to get recent blockhash: " + e);
    }
  }
  async getLatestBlockhash(commitmentOrConfig) {
    try {
      const res = await this.getLatestBlockhashAndContext(commitmentOrConfig);
      return res.value;
    } catch (e) {
      throw new Error("failed to get recent blockhash: " + e);
    }
  }
  async getLatestBlockhashAndContext(commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgs([], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("getLatestBlockhash", args);
    const res = create(unsafeRes, GetLatestBlockhashRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get latest blockhash");
    }
    return res.result;
  }
  async isBlockhashValid(blockhash, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const args = this._buildArgs([blockhash], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("isBlockhashValid", args);
    const res = create(unsafeRes, IsBlockhashValidRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to determine if the blockhash `" + blockhash + "`is valid");
    }
    return res.result;
  }
  async getVersion() {
    const unsafeRes = await this._rpcRequest("getVersion", []);
    const res = create(unsafeRes, jsonRpcResult(VersionResult));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get version");
    }
    return res.result;
  }
  async getGenesisHash() {
    const unsafeRes = await this._rpcRequest("getGenesisHash", []);
    const res = create(unsafeRes, jsonRpcResult(string()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get genesis hash");
    }
    return res.result;
  }
  async getBlock(slot, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const args = this._buildArgsAtLeastConfirmed([slot], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("getBlock", args);
    try {
      switch (config?.transactionDetails) {
        case "accounts": {
          const res = create(unsafeRes, GetAccountsModeBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
        case "none": {
          const res = create(unsafeRes, GetNoneModeBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
        default: {
          const res = create(unsafeRes, GetBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          const {
            result
          } = res;
          return result ? {
            ...result,
            transactions: result.transactions.map(({
              transaction,
              meta,
              version
            }) => ({
              meta,
              transaction: {
                ...transaction,
                message: versionedMessageFromResponse(version, transaction.message)
              },
              version
            }))
          } : null;
        }
      }
    } catch (e) {
      throw new SolanaJSONRPCError(e, "failed to get confirmed block");
    }
  }
  async getParsedBlock(slot, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const args = this._buildArgsAtLeastConfirmed([slot], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getBlock", args);
    try {
      switch (config?.transactionDetails) {
        case "accounts": {
          const res = create(unsafeRes, GetParsedAccountsModeBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
        case "none": {
          const res = create(unsafeRes, GetParsedNoneModeBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
        default: {
          const res = create(unsafeRes, GetParsedBlockRpcResult);
          if ("error" in res) {
            throw res.error;
          }
          return res.result;
        }
      }
    } catch (e) {
      throw new SolanaJSONRPCError(e, "failed to get block");
    }
  }
  async getBlockProduction(configOrCommitment) {
    let extra;
    let commitment;
    if (typeof configOrCommitment === "string") {
      commitment = configOrCommitment;
    } else if (configOrCommitment) {
      const {
        commitment: c,
        ...rest
      } = configOrCommitment;
      commitment = c;
      extra = rest;
    }
    const args = this._buildArgs([], commitment, "base64", extra);
    const unsafeRes = await this._rpcRequest("getBlockProduction", args);
    const res = create(unsafeRes, BlockProductionResponseStruct);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get block production information");
    }
    return res.result;
  }
  async getTransaction(signature2, rawConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(rawConfig);
    const args = this._buildArgsAtLeastConfirmed([signature2], commitment, undefined, config);
    const unsafeRes = await this._rpcRequest("getTransaction", args);
    const res = create(unsafeRes, GetTransactionRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get transaction");
    }
    const result = res.result;
    if (!result)
      return result;
    return {
      ...result,
      transaction: {
        ...result.transaction,
        message: versionedMessageFromResponse(result.version, result.transaction.message)
      }
    };
  }
  async getParsedTransaction(signature2, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const args = this._buildArgsAtLeastConfirmed([signature2], commitment, "jsonParsed", config);
    const unsafeRes = await this._rpcRequest("getTransaction", args);
    const res = create(unsafeRes, GetParsedTransactionRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get transaction");
    }
    return res.result;
  }
  async getParsedTransactions(signatures, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const batch = signatures.map((signature2) => {
      const args = this._buildArgsAtLeastConfirmed([signature2], commitment, "jsonParsed", config);
      return {
        methodName: "getTransaction",
        args
      };
    });
    const unsafeRes = await this._rpcBatchRequest(batch);
    const res = unsafeRes.map((unsafeRes2) => {
      const res2 = create(unsafeRes2, GetParsedTransactionRpcResult);
      if ("error" in res2) {
        throw new SolanaJSONRPCError(res2.error, "failed to get transactions");
      }
      return res2.result;
    });
    return res;
  }
  async getTransactions(signatures, commitmentOrConfig) {
    const {
      commitment,
      config
    } = extractCommitmentFromConfig(commitmentOrConfig);
    const batch = signatures.map((signature2) => {
      const args = this._buildArgsAtLeastConfirmed([signature2], commitment, undefined, config);
      return {
        methodName: "getTransaction",
        args
      };
    });
    const unsafeRes = await this._rpcBatchRequest(batch);
    const res = unsafeRes.map((unsafeRes2) => {
      const res2 = create(unsafeRes2, GetTransactionRpcResult);
      if ("error" in res2) {
        throw new SolanaJSONRPCError(res2.error, "failed to get transactions");
      }
      const result = res2.result;
      if (!result)
        return result;
      return {
        ...result,
        transaction: {
          ...result.transaction,
          message: versionedMessageFromResponse(result.version, result.transaction.message)
        }
      };
    });
    return res;
  }
  async getConfirmedBlock(slot, commitment) {
    const args = this._buildArgsAtLeastConfirmed([slot], commitment);
    const unsafeRes = await this._rpcRequest("getConfirmedBlock", args);
    const res = create(unsafeRes, GetConfirmedBlockRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get confirmed block");
    }
    const result = res.result;
    if (!result) {
      throw new Error("Confirmed block " + slot + " not found");
    }
    const block = {
      ...result,
      transactions: result.transactions.map(({
        transaction,
        meta
      }) => {
        const message = new Message(transaction.message);
        return {
          meta,
          transaction: {
            ...transaction,
            message
          }
        };
      })
    };
    return {
      ...block,
      transactions: block.transactions.map(({
        transaction,
        meta
      }) => {
        return {
          meta,
          transaction: Transaction.populate(transaction.message, transaction.signatures)
        };
      })
    };
  }
  async getBlocks(startSlot, endSlot, commitment) {
    const args = this._buildArgsAtLeastConfirmed(endSlot !== undefined ? [startSlot, endSlot] : [startSlot], commitment);
    const unsafeRes = await this._rpcRequest("getBlocks", args);
    const res = create(unsafeRes, jsonRpcResult(array(number2())));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get blocks");
    }
    return res.result;
  }
  async getBlockSignatures(slot, commitment) {
    const args = this._buildArgsAtLeastConfirmed([slot], commitment, undefined, {
      transactionDetails: "signatures",
      rewards: false
    });
    const unsafeRes = await this._rpcRequest("getBlock", args);
    const res = create(unsafeRes, GetBlockSignaturesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get block");
    }
    const result = res.result;
    if (!result) {
      throw new Error("Block " + slot + " not found");
    }
    return result;
  }
  async getConfirmedBlockSignatures(slot, commitment) {
    const args = this._buildArgsAtLeastConfirmed([slot], commitment, undefined, {
      transactionDetails: "signatures",
      rewards: false
    });
    const unsafeRes = await this._rpcRequest("getConfirmedBlock", args);
    const res = create(unsafeRes, GetBlockSignaturesRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get confirmed block");
    }
    const result = res.result;
    if (!result) {
      throw new Error("Confirmed block " + slot + " not found");
    }
    return result;
  }
  async getConfirmedTransaction(signature2, commitment) {
    const args = this._buildArgsAtLeastConfirmed([signature2], commitment);
    const unsafeRes = await this._rpcRequest("getConfirmedTransaction", args);
    const res = create(unsafeRes, GetTransactionRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get transaction");
    }
    const result = res.result;
    if (!result)
      return result;
    const message = new Message(result.transaction.message);
    const signatures = result.transaction.signatures;
    return {
      ...result,
      transaction: Transaction.populate(message, signatures)
    };
  }
  async getParsedConfirmedTransaction(signature2, commitment) {
    const args = this._buildArgsAtLeastConfirmed([signature2], commitment, "jsonParsed");
    const unsafeRes = await this._rpcRequest("getConfirmedTransaction", args);
    const res = create(unsafeRes, GetParsedTransactionRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get confirmed transaction");
    }
    return res.result;
  }
  async getParsedConfirmedTransactions(signatures, commitment) {
    const batch = signatures.map((signature2) => {
      const args = this._buildArgsAtLeastConfirmed([signature2], commitment, "jsonParsed");
      return {
        methodName: "getConfirmedTransaction",
        args
      };
    });
    const unsafeRes = await this._rpcBatchRequest(batch);
    const res = unsafeRes.map((unsafeRes2) => {
      const res2 = create(unsafeRes2, GetParsedTransactionRpcResult);
      if ("error" in res2) {
        throw new SolanaJSONRPCError(res2.error, "failed to get confirmed transactions");
      }
      return res2.result;
    });
    return res;
  }
  async getConfirmedSignaturesForAddress(address, startSlot, endSlot) {
    let options = {};
    let firstAvailableBlock = await this.getFirstAvailableBlock();
    while (!("until" in options)) {
      startSlot--;
      if (startSlot <= 0 || startSlot < firstAvailableBlock) {
        break;
      }
      try {
        const block = await this.getConfirmedBlockSignatures(startSlot, "finalized");
        if (block.signatures.length > 0) {
          options.until = block.signatures[block.signatures.length - 1].toString();
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("skipped")) {
          continue;
        } else {
          throw err;
        }
      }
    }
    let highestConfirmedRoot = await this.getSlot("finalized");
    while (!("before" in options)) {
      endSlot++;
      if (endSlot > highestConfirmedRoot) {
        break;
      }
      try {
        const block = await this.getConfirmedBlockSignatures(endSlot);
        if (block.signatures.length > 0) {
          options.before = block.signatures[block.signatures.length - 1].toString();
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("skipped")) {
          continue;
        } else {
          throw err;
        }
      }
    }
    const confirmedSignatureInfo = await this.getConfirmedSignaturesForAddress2(address, options);
    return confirmedSignatureInfo.map((info) => info.signature);
  }
  async getConfirmedSignaturesForAddress2(address, options, commitment) {
    const args = this._buildArgsAtLeastConfirmed([address.toBase58()], commitment, undefined, options);
    const unsafeRes = await this._rpcRequest("getConfirmedSignaturesForAddress2", args);
    const res = create(unsafeRes, GetConfirmedSignaturesForAddress2RpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get confirmed signatures for address");
    }
    return res.result;
  }
  async getSignaturesForAddress(address, options, commitment) {
    const args = this._buildArgsAtLeastConfirmed([address.toBase58()], commitment, undefined, options);
    const unsafeRes = await this._rpcRequest("getSignaturesForAddress", args);
    const res = create(unsafeRes, GetSignaturesForAddressRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, "failed to get signatures for address");
    }
    return res.result;
  }
  async getAddressLookupTable(accountKey, config) {
    const {
      context,
      value: accountInfo
    } = await this.getAccountInfoAndContext(accountKey, config);
    let value = null;
    if (accountInfo !== null) {
      value = new AddressLookupTableAccount({
        key: accountKey,
        state: AddressLookupTableAccount.deserialize(accountInfo.data)
      });
    }
    return {
      context,
      value
    };
  }
  async getNonceAndContext(nonceAccount, commitmentOrConfig) {
    const {
      context,
      value: accountInfo
    } = await this.getAccountInfoAndContext(nonceAccount, commitmentOrConfig);
    let value = null;
    if (accountInfo !== null) {
      value = NonceAccount.fromAccountData(accountInfo.data);
    }
    return {
      context,
      value
    };
  }
  async getNonce(nonceAccount, commitmentOrConfig) {
    return await this.getNonceAndContext(nonceAccount, commitmentOrConfig).then((x) => x.value).catch((e) => {
      throw new Error("failed to get nonce for account " + nonceAccount.toBase58() + ": " + e);
    });
  }
  async requestAirdrop(to, lamports) {
    const unsafeRes = await this._rpcRequest("requestAirdrop", [to.toBase58(), lamports]);
    const res = create(unsafeRes, RequestAirdropRpcResult);
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `airdrop to ${to.toBase58()} failed`);
    }
    return res.result;
  }
  async _blockhashWithExpiryBlockHeight(disableCache) {
    if (!disableCache) {
      while (this._pollingBlockhash) {
        await sleep(100);
      }
      const timeSinceFetch = Date.now() - this._blockhashInfo.lastFetch;
      const expired = timeSinceFetch >= BLOCKHASH_CACHE_TIMEOUT_MS;
      if (this._blockhashInfo.latestBlockhash !== null && !expired) {
        return this._blockhashInfo.latestBlockhash;
      }
    }
    return await this._pollNewBlockhash();
  }
  async _pollNewBlockhash() {
    this._pollingBlockhash = true;
    try {
      const startTime = Date.now();
      const cachedLatestBlockhash = this._blockhashInfo.latestBlockhash;
      const cachedBlockhash = cachedLatestBlockhash ? cachedLatestBlockhash.blockhash : null;
      for (let i = 0;i < 50; i++) {
        const latestBlockhash = await this.getLatestBlockhash("finalized");
        if (cachedBlockhash !== latestBlockhash.blockhash) {
          this._blockhashInfo = {
            latestBlockhash,
            lastFetch: Date.now(),
            transactionSignatures: [],
            simulatedSignatures: []
          };
          return latestBlockhash;
        }
        await sleep(MS_PER_SLOT / 2);
      }
      throw new Error(`Unable to obtain a new blockhash after ${Date.now() - startTime}ms`);
    } finally {
      this._pollingBlockhash = false;
    }
  }
  async getStakeMinimumDelegation(config) {
    const {
      commitment,
      config: configArg
    } = extractCommitmentFromConfig(config);
    const args = this._buildArgs([], commitment, "base64", configArg);
    const unsafeRes = await this._rpcRequest("getStakeMinimumDelegation", args);
    const res = create(unsafeRes, jsonRpcResultAndContext(number2()));
    if ("error" in res) {
      throw new SolanaJSONRPCError(res.error, `failed to get stake minimum delegation`);
    }
    return res.result;
  }
  async simulateTransaction(transactionOrMessage, configOrSigners, includeAccounts) {
    if ("message" in transactionOrMessage) {
      const versionedTx = transactionOrMessage;
      const wireTransaction2 = versionedTx.serialize();
      const encodedTransaction2 = Buffer2.from(wireTransaction2).toString("base64");
      if (Array.isArray(configOrSigners) || includeAccounts !== undefined) {
        throw new Error("Invalid arguments");
      }
      const config2 = configOrSigners || {};
      config2.encoding = "base64";
      if (!("commitment" in config2)) {
        config2.commitment = this.commitment;
      }
      const args2 = [encodedTransaction2, config2];
      const unsafeRes2 = await this._rpcRequest("simulateTransaction", args2);
      const res2 = create(unsafeRes2, SimulatedTransactionResponseStruct);
      if ("error" in res2) {
        throw new Error("failed to simulate transaction: " + res2.error.message);
      }
      return res2.result;
    }
    let transaction;
    if (transactionOrMessage instanceof Transaction) {
      let originalTx = transactionOrMessage;
      transaction = new Transaction;
      transaction.feePayer = originalTx.feePayer;
      transaction.instructions = transactionOrMessage.instructions;
      transaction.nonceInfo = originalTx.nonceInfo;
      transaction.signatures = originalTx.signatures;
    } else {
      transaction = Transaction.populate(transactionOrMessage);
      transaction._message = transaction._json = undefined;
    }
    if (configOrSigners !== undefined && !Array.isArray(configOrSigners)) {
      throw new Error("Invalid arguments");
    }
    const signers = configOrSigners;
    if (transaction.nonceInfo && signers) {
      transaction.sign(...signers);
    } else {
      let disableCache = this._disableBlockhashCaching;
      for (;; ) {
        const latestBlockhash = await this._blockhashWithExpiryBlockHeight(disableCache);
        transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
        transaction.recentBlockhash = latestBlockhash.blockhash;
        if (!signers)
          break;
        transaction.sign(...signers);
        if (!transaction.signature) {
          throw new Error("!signature");
        }
        const signature2 = transaction.signature.toString("base64");
        if (!this._blockhashInfo.simulatedSignatures.includes(signature2) && !this._blockhashInfo.transactionSignatures.includes(signature2)) {
          this._blockhashInfo.simulatedSignatures.push(signature2);
          break;
        } else {
          disableCache = true;
        }
      }
    }
    const message = transaction._compile();
    const signData = message.serialize();
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config = {
      encoding: "base64",
      commitment: this.commitment
    };
    if (includeAccounts) {
      const addresses = (Array.isArray(includeAccounts) ? includeAccounts : message.nonProgramIds()).map((key) => key.toBase58());
      config["accounts"] = {
        encoding: "base64",
        addresses
      };
    }
    if (signers) {
      config.sigVerify = true;
    }
    const args = [encodedTransaction, config];
    const unsafeRes = await this._rpcRequest("simulateTransaction", args);
    const res = create(unsafeRes, SimulatedTransactionResponseStruct);
    if ("error" in res) {
      let logs;
      if ("data" in res.error) {
        logs = res.error.data.logs;
        if (logs && Array.isArray(logs)) {
          const traceIndent = "\n    ";
          const logTrace = traceIndent + logs.join(traceIndent);
          console.error(res.error.message, logTrace);
        }
      }
      throw new SendTransactionError("failed to simulate transaction: " + res.error.message, logs);
    }
    return res.result;
  }
  async sendTransaction(transaction, signersOrOptions, options) {
    if ("version" in transaction) {
      if (signersOrOptions && Array.isArray(signersOrOptions)) {
        throw new Error("Invalid arguments");
      }
      const wireTransaction2 = transaction.serialize();
      return await this.sendRawTransaction(wireTransaction2, signersOrOptions);
    }
    if (signersOrOptions === undefined || !Array.isArray(signersOrOptions)) {
      throw new Error("Invalid arguments");
    }
    const signers = signersOrOptions;
    if (transaction.nonceInfo) {
      transaction.sign(...signers);
    } else {
      let disableCache = this._disableBlockhashCaching;
      for (;; ) {
        const latestBlockhash = await this._blockhashWithExpiryBlockHeight(disableCache);
        transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.sign(...signers);
        if (!transaction.signature) {
          throw new Error("!signature");
        }
        const signature2 = transaction.signature.toString("base64");
        if (!this._blockhashInfo.transactionSignatures.includes(signature2)) {
          this._blockhashInfo.transactionSignatures.push(signature2);
          break;
        } else {
          disableCache = true;
        }
      }
    }
    const wireTransaction = transaction.serialize();
    return await this.sendRawTransaction(wireTransaction, options);
  }
  async sendRawTransaction(rawTransaction, options) {
    const encodedTransaction = toBuffer(rawTransaction).toString("base64");
    const result = await this.sendEncodedTransaction(encodedTransaction, options);
    return result;
  }
  async sendEncodedTransaction(encodedTransaction, options) {
    const config = {
      encoding: "base64"
    };
    const skipPreflight = options && options.skipPreflight;
    const preflightCommitment = options && options.preflightCommitment || this.commitment;
    if (options && options.maxRetries != null) {
      config.maxRetries = options.maxRetries;
    }
    if (options && options.minContextSlot != null) {
      config.minContextSlot = options.minContextSlot;
    }
    if (skipPreflight) {
      config.skipPreflight = skipPreflight;
    }
    if (preflightCommitment) {
      config.preflightCommitment = preflightCommitment;
    }
    const args = [encodedTransaction, config];
    const unsafeRes = await this._rpcRequest("sendTransaction", args);
    const res = create(unsafeRes, SendTransactionRpcResult);
    if ("error" in res) {
      let logs;
      if ("data" in res.error) {
        logs = res.error.data.logs;
      }
      throw new SendTransactionError("failed to send transaction: " + res.error.message, logs);
    }
    return res.result;
  }
  _wsOnOpen() {
    this._rpcWebSocketConnected = true;
    this._rpcWebSocketHeartbeat = setInterval(() => {
      (async () => {
        try {
          await this._rpcWebSocket.notify("ping");
        } catch {
        }
      })();
    }, 5000);
    this._updateSubscriptions();
  }
  _wsOnError(err) {
    this._rpcWebSocketConnected = false;
    console.error("ws error:", err.message);
  }
  _wsOnClose(code) {
    this._rpcWebSocketConnected = false;
    this._rpcWebSocketGeneration = (this._rpcWebSocketGeneration + 1) % Number.MAX_SAFE_INTEGER;
    if (this._rpcWebSocketIdleTimeout) {
      clearTimeout(this._rpcWebSocketIdleTimeout);
      this._rpcWebSocketIdleTimeout = null;
    }
    if (this._rpcWebSocketHeartbeat) {
      clearInterval(this._rpcWebSocketHeartbeat);
      this._rpcWebSocketHeartbeat = null;
    }
    if (code === 1000) {
      this._updateSubscriptions();
      return;
    }
    this._subscriptionCallbacksByServerSubscriptionId = {};
    Object.entries(this._subscriptionsByHash).forEach(([hash2, subscription]) => {
      this._setSubscription(hash2, {
        ...subscription,
        state: "pending"
      });
    });
  }
  _setSubscription(hash2, nextSubscription) {
    const prevState = this._subscriptionsByHash[hash2]?.state;
    this._subscriptionsByHash[hash2] = nextSubscription;
    if (prevState !== nextSubscription.state) {
      const stateChangeCallbacks = this._subscriptionStateChangeCallbacksByHash[hash2];
      if (stateChangeCallbacks) {
        stateChangeCallbacks.forEach((cb) => {
          try {
            cb(nextSubscription.state);
          } catch {
          }
        });
      }
    }
  }
  _onSubscriptionStateChange(clientSubscriptionId, callback) {
    const hash2 = this._subscriptionHashByClientSubscriptionId[clientSubscriptionId];
    if (hash2 == null) {
      return () => {
      };
    }
    const stateChangeCallbacks = this._subscriptionStateChangeCallbacksByHash[hash2] ||= new Set;
    stateChangeCallbacks.add(callback);
    return () => {
      stateChangeCallbacks.delete(callback);
      if (stateChangeCallbacks.size === 0) {
        delete this._subscriptionStateChangeCallbacksByHash[hash2];
      }
    };
  }
  async _updateSubscriptions() {
    if (Object.keys(this._subscriptionsByHash).length === 0) {
      if (this._rpcWebSocketConnected) {
        this._rpcWebSocketConnected = false;
        this._rpcWebSocketIdleTimeout = setTimeout(() => {
          this._rpcWebSocketIdleTimeout = null;
          try {
            this._rpcWebSocket.close();
          } catch (err) {
            if (err instanceof Error) {
              console.log(`Error when closing socket connection: ${err.message}`);
            }
          }
        }, 500);
      }
      return;
    }
    if (this._rpcWebSocketIdleTimeout !== null) {
      clearTimeout(this._rpcWebSocketIdleTimeout);
      this._rpcWebSocketIdleTimeout = null;
      this._rpcWebSocketConnected = true;
    }
    if (!this._rpcWebSocketConnected) {
      this._rpcWebSocket.connect();
      return;
    }
    const activeWebSocketGeneration = this._rpcWebSocketGeneration;
    const isCurrentConnectionStillActive = () => {
      return activeWebSocketGeneration === this._rpcWebSocketGeneration;
    };
    await Promise.all(Object.keys(this._subscriptionsByHash).map(async (hash2) => {
      const subscription = this._subscriptionsByHash[hash2];
      if (subscription === undefined) {
        return;
      }
      switch (subscription.state) {
        case "pending":
        case "unsubscribed":
          if (subscription.callbacks.size === 0) {
            delete this._subscriptionsByHash[hash2];
            if (subscription.state === "unsubscribed") {
              delete this._subscriptionCallbacksByServerSubscriptionId[subscription.serverSubscriptionId];
            }
            await this._updateSubscriptions();
            return;
          }
          await (async () => {
            const {
              args,
              method
            } = subscription;
            try {
              this._setSubscription(hash2, {
                ...subscription,
                state: "subscribing"
              });
              const serverSubscriptionId = await this._rpcWebSocket.call(method, args);
              this._setSubscription(hash2, {
                ...subscription,
                serverSubscriptionId,
                state: "subscribed"
              });
              this._subscriptionCallbacksByServerSubscriptionId[serverSubscriptionId] = subscription.callbacks;
              await this._updateSubscriptions();
            } catch (e) {
              if (e instanceof Error) {
                console.error(`${method} error for argument`, args, e.message);
              }
              if (!isCurrentConnectionStillActive()) {
                return;
              }
              this._setSubscription(hash2, {
                ...subscription,
                state: "pending"
              });
              await this._updateSubscriptions();
            }
          })();
          break;
        case "subscribed":
          if (subscription.callbacks.size === 0) {
            await (async () => {
              const {
                serverSubscriptionId,
                unsubscribeMethod
              } = subscription;
              if (this._subscriptionsAutoDisposedByRpc.has(serverSubscriptionId)) {
                this._subscriptionsAutoDisposedByRpc.delete(serverSubscriptionId);
              } else {
                this._setSubscription(hash2, {
                  ...subscription,
                  state: "unsubscribing"
                });
                this._setSubscription(hash2, {
                  ...subscription,
                  state: "unsubscribing"
                });
                try {
                  await this._rpcWebSocket.call(unsubscribeMethod, [serverSubscriptionId]);
                } catch (e) {
                  if (e instanceof Error) {
                    console.error(`${unsubscribeMethod} error:`, e.message);
                  }
                  if (!isCurrentConnectionStillActive()) {
                    return;
                  }
                  this._setSubscription(hash2, {
                    ...subscription,
                    state: "subscribed"
                  });
                  await this._updateSubscriptions();
                  return;
                }
              }
              this._setSubscription(hash2, {
                ...subscription,
                state: "unsubscribed"
              });
              await this._updateSubscriptions();
            })();
          }
          break;
      }
    }));
  }
  _handleServerNotification(serverSubscriptionId, callbackArgs) {
    const callbacks = this._subscriptionCallbacksByServerSubscriptionId[serverSubscriptionId];
    if (callbacks === undefined) {
      return;
    }
    callbacks.forEach((cb) => {
      try {
        cb(...callbackArgs);
      } catch (e) {
        console.error(e);
      }
    });
  }
  _wsOnAccountNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, AccountNotificationResult);
    this._handleServerNotification(subscription, [result.value, result.context]);
  }
  _makeSubscription(subscriptionConfig, args) {
    const clientSubscriptionId = this._nextClientSubscriptionId++;
    const hash2 = fastStableStringify$1([subscriptionConfig.method, args], true);
    const existingSubscription = this._subscriptionsByHash[hash2];
    if (existingSubscription === undefined) {
      this._subscriptionsByHash[hash2] = {
        ...subscriptionConfig,
        args,
        callbacks: new Set([subscriptionConfig.callback]),
        state: "pending"
      };
    } else {
      existingSubscription.callbacks.add(subscriptionConfig.callback);
    }
    this._subscriptionHashByClientSubscriptionId[clientSubscriptionId] = hash2;
    this._subscriptionDisposeFunctionsByClientSubscriptionId[clientSubscriptionId] = async () => {
      delete this._subscriptionDisposeFunctionsByClientSubscriptionId[clientSubscriptionId];
      delete this._subscriptionHashByClientSubscriptionId[clientSubscriptionId];
      const subscription = this._subscriptionsByHash[hash2];
      assert2(subscription !== undefined, `Could not find a \`Subscription\` when tearing down client subscription #${clientSubscriptionId}`);
      subscription.callbacks.delete(subscriptionConfig.callback);
      await this._updateSubscriptions();
    };
    this._updateSubscriptions();
    return clientSubscriptionId;
  }
  onAccountChange(publicKey2, callback, commitment) {
    const args = this._buildArgs([publicKey2.toBase58()], commitment || this._commitment || "finalized", "base64");
    return this._makeSubscription({
      callback,
      method: "accountSubscribe",
      unsubscribeMethod: "accountUnsubscribe"
    }, args);
  }
  async removeAccountChangeListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "account change");
  }
  _wsOnProgramAccountNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, ProgramAccountNotificationResult);
    this._handleServerNotification(subscription, [{
      accountId: result.value.pubkey,
      accountInfo: result.value.account
    }, result.context]);
  }
  onProgramAccountChange(programId, callback, commitment, filters) {
    const args = this._buildArgs([programId.toBase58()], commitment || this._commitment || "finalized", "base64", filters ? {
      filters
    } : undefined);
    return this._makeSubscription({
      callback,
      method: "programSubscribe",
      unsubscribeMethod: "programUnsubscribe"
    }, args);
  }
  async removeProgramAccountChangeListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "program account change");
  }
  onLogs(filter, callback, commitment) {
    const args = this._buildArgs([typeof filter === "object" ? {
      mentions: [filter.toString()]
    } : filter], commitment || this._commitment || "finalized");
    return this._makeSubscription({
      callback,
      method: "logsSubscribe",
      unsubscribeMethod: "logsUnsubscribe"
    }, args);
  }
  async removeOnLogsListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "logs");
  }
  _wsOnLogsNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, LogsNotificationResult);
    this._handleServerNotification(subscription, [result.value, result.context]);
  }
  _wsOnSlotNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, SlotNotificationResult);
    this._handleServerNotification(subscription, [result]);
  }
  onSlotChange(callback) {
    return this._makeSubscription({
      callback,
      method: "slotSubscribe",
      unsubscribeMethod: "slotUnsubscribe"
    }, []);
  }
  async removeSlotChangeListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "slot change");
  }
  _wsOnSlotUpdatesNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, SlotUpdateNotificationResult);
    this._handleServerNotification(subscription, [result]);
  }
  onSlotUpdate(callback) {
    return this._makeSubscription({
      callback,
      method: "slotsUpdatesSubscribe",
      unsubscribeMethod: "slotsUpdatesUnsubscribe"
    }, []);
  }
  async removeSlotUpdateListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "slot update");
  }
  async _unsubscribeClientSubscription(clientSubscriptionId, subscriptionName) {
    const dispose = this._subscriptionDisposeFunctionsByClientSubscriptionId[clientSubscriptionId];
    if (dispose) {
      await dispose();
    } else {
      console.warn("Ignored unsubscribe request because an active subscription with id " + `\`${clientSubscriptionId}\` for '${subscriptionName}' events ` + "could not be found.");
    }
  }
  _buildArgs(args, override, encoding, extra) {
    const commitment = override || this._commitment;
    if (commitment || encoding || extra) {
      let options = {};
      if (encoding) {
        options.encoding = encoding;
      }
      if (commitment) {
        options.commitment = commitment;
      }
      if (extra) {
        options = Object.assign(options, extra);
      }
      args.push(options);
    }
    return args;
  }
  _buildArgsAtLeastConfirmed(args, override, encoding, extra) {
    const commitment = override || this._commitment;
    if (commitment && !["confirmed", "finalized"].includes(commitment)) {
      throw new Error("Using Connection with default commitment: `" + this._commitment + "`, but method requires at least `confirmed`");
    }
    return this._buildArgs(args, override, encoding, extra);
  }
  _wsOnSignatureNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, SignatureNotificationResult);
    if (result.value !== "receivedSignature") {
      this._subscriptionsAutoDisposedByRpc.add(subscription);
    }
    this._handleServerNotification(subscription, result.value === "receivedSignature" ? [{
      type: "received"
    }, result.context] : [{
      type: "status",
      result: result.value
    }, result.context]);
  }
  onSignature(signature2, callback, commitment) {
    const args = this._buildArgs([signature2], commitment || this._commitment || "finalized");
    const clientSubscriptionId = this._makeSubscription({
      callback: (notification, context) => {
        if (notification.type === "status") {
          callback(notification.result, context);
          try {
            this.removeSignatureListener(clientSubscriptionId);
          } catch (_err) {
          }
        }
      },
      method: "signatureSubscribe",
      unsubscribeMethod: "signatureUnsubscribe"
    }, args);
    return clientSubscriptionId;
  }
  onSignatureWithOptions(signature2, callback, options) {
    const {
      commitment,
      ...extra
    } = {
      ...options,
      commitment: options && options.commitment || this._commitment || "finalized"
    };
    const args = this._buildArgs([signature2], commitment, undefined, extra);
    const clientSubscriptionId = this._makeSubscription({
      callback: (notification, context) => {
        callback(notification, context);
        try {
          this.removeSignatureListener(clientSubscriptionId);
        } catch (_err) {
        }
      },
      method: "signatureSubscribe",
      unsubscribeMethod: "signatureUnsubscribe"
    }, args);
    return clientSubscriptionId;
  }
  async removeSignatureListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "signature result");
  }
  _wsOnRootNotification(notification) {
    const {
      result,
      subscription
    } = create(notification, RootNotificationResult);
    this._handleServerNotification(subscription, [result]);
  }
  onRootChange(callback) {
    return this._makeSubscription({
      callback,
      method: "rootSubscribe",
      unsubscribeMethod: "rootUnsubscribe"
    }, []);
  }
  async removeRootChangeListener(clientSubscriptionId) {
    await this._unsubscribeClientSubscription(clientSubscriptionId, "root change");
  }
}

class Keypair {
  constructor(keypair) {
    this._keypair = undefined;
    this._keypair = keypair ?? generateKeypair();
  }
  static generate() {
    return new Keypair(generateKeypair());
  }
  static fromSecretKey(secretKey, options) {
    if (secretKey.byteLength !== 64) {
      throw new Error("bad secret key size");
    }
    const publicKey2 = secretKey.slice(32, 64);
    if (!options || !options.skipValidation) {
      const privateScalar = secretKey.slice(0, 32);
      const computedPublicKey = getPublicKey(privateScalar);
      for (let ii = 0;ii < 32; ii++) {
        if (publicKey2[ii] !== computedPublicKey[ii]) {
          throw new Error("provided secretKey is invalid");
        }
      }
    }
    return new Keypair({
      publicKey: publicKey2,
      secretKey
    });
  }
  static fromSeed(seed) {
    const publicKey2 = getPublicKey(seed);
    const secretKey = new Uint8Array(64);
    secretKey.set(seed);
    secretKey.set(publicKey2, 32);
    return new Keypair({
      publicKey: publicKey2,
      secretKey
    });
  }
  get publicKey() {
    return new PublicKey(this._keypair.publicKey);
  }
  get secretKey() {
    return new Uint8Array(this._keypair.secretKey);
  }
}
var LOOKUP_TABLE_INSTRUCTION_LAYOUTS = Object.freeze({
  CreateLookupTable: {
    index: 0,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), u642("recentSlot"), BufferLayout.u8("bumpSeed")])
  },
  FreezeLookupTable: {
    index: 1,
    layout: BufferLayout.struct([BufferLayout.u32("instruction")])
  },
  ExtendLookupTable: {
    index: 2,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), u642(), BufferLayout.seq(publicKey(), BufferLayout.offset(BufferLayout.u32(), -8), "addresses")])
  },
  DeactivateLookupTable: {
    index: 3,
    layout: BufferLayout.struct([BufferLayout.u32("instruction")])
  },
  CloseLookupTable: {
    index: 4,
    layout: BufferLayout.struct([BufferLayout.u32("instruction")])
  }
});

class AddressLookupTableInstruction {
  constructor() {
  }
  static decodeInstructionType(instruction) {
    this.checkProgramId(instruction.programId);
    const instructionTypeLayout = BufferLayout.u32("instruction");
    const index = instructionTypeLayout.decode(instruction.data);
    let type2;
    for (const [layoutType, layout] of Object.entries(LOOKUP_TABLE_INSTRUCTION_LAYOUTS)) {
      if (layout.index == index) {
        type2 = layoutType;
        break;
      }
    }
    if (!type2) {
      throw new Error("Invalid Instruction. Should be a LookupTable Instruction");
    }
    return type2;
  }
  static decodeCreateLookupTable(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeysLength(instruction.keys, 4);
    const {
      recentSlot
    } = decodeData$1(LOOKUP_TABLE_INSTRUCTION_LAYOUTS.CreateLookupTable, instruction.data);
    return {
      authority: instruction.keys[1].pubkey,
      payer: instruction.keys[2].pubkey,
      recentSlot: Number(recentSlot)
    };
  }
  static decodeExtendLookupTable(instruction) {
    this.checkProgramId(instruction.programId);
    if (instruction.keys.length < 2) {
      throw new Error(`invalid instruction; found ${instruction.keys.length} keys, expected at least 2`);
    }
    const {
      addresses
    } = decodeData$1(LOOKUP_TABLE_INSTRUCTION_LAYOUTS.ExtendLookupTable, instruction.data);
    return {
      lookupTable: instruction.keys[0].pubkey,
      authority: instruction.keys[1].pubkey,
      payer: instruction.keys.length > 2 ? instruction.keys[2].pubkey : undefined,
      addresses: addresses.map((buffer) => new PublicKey(buffer))
    };
  }
  static decodeCloseLookupTable(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeysLength(instruction.keys, 3);
    return {
      lookupTable: instruction.keys[0].pubkey,
      authority: instruction.keys[1].pubkey,
      recipient: instruction.keys[2].pubkey
    };
  }
  static decodeFreezeLookupTable(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeysLength(instruction.keys, 2);
    return {
      lookupTable: instruction.keys[0].pubkey,
      authority: instruction.keys[1].pubkey
    };
  }
  static decodeDeactivateLookupTable(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeysLength(instruction.keys, 2);
    return {
      lookupTable: instruction.keys[0].pubkey,
      authority: instruction.keys[1].pubkey
    };
  }
  static checkProgramId(programId) {
    if (!programId.equals(AddressLookupTableProgram.programId)) {
      throw new Error("invalid instruction; programId is not AddressLookupTable Program");
    }
  }
  static checkKeysLength(keys, expectedLength) {
    if (keys.length < expectedLength) {
      throw new Error(`invalid instruction; found ${keys.length} keys, expected at least ${expectedLength}`);
    }
  }
}

class AddressLookupTableProgram {
  constructor() {
  }
  static createLookupTable(params) {
    const [lookupTableAddress, bumpSeed] = PublicKey.findProgramAddressSync([params.authority.toBuffer(), import_bigint_buffer.toBufferLE(BigInt(params.recentSlot), 8)], this.programId);
    const type2 = LOOKUP_TABLE_INSTRUCTION_LAYOUTS.CreateLookupTable;
    const data = encodeData(type2, {
      recentSlot: BigInt(params.recentSlot),
      bumpSeed
    });
    const keys = [{
      pubkey: lookupTableAddress,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: params.authority,
      isSigner: true,
      isWritable: false
    }, {
      pubkey: params.payer,
      isSigner: true,
      isWritable: true
    }, {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false
    }];
    return [new TransactionInstruction({
      programId: this.programId,
      keys,
      data
    }), lookupTableAddress];
  }
  static freezeLookupTable(params) {
    const type2 = LOOKUP_TABLE_INSTRUCTION_LAYOUTS.FreezeLookupTable;
    const data = encodeData(type2);
    const keys = [{
      pubkey: params.lookupTable,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: params.authority,
      isSigner: true,
      isWritable: false
    }];
    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data
    });
  }
  static extendLookupTable(params) {
    const type2 = LOOKUP_TABLE_INSTRUCTION_LAYOUTS.ExtendLookupTable;
    const data = encodeData(type2, {
      addresses: params.addresses.map((addr) => addr.toBytes())
    });
    const keys = [{
      pubkey: params.lookupTable,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: params.authority,
      isSigner: true,
      isWritable: false
    }];
    if (params.payer) {
      keys.push({
        pubkey: params.payer,
        isSigner: true,
        isWritable: true
      }, {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false
      });
    }
    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data
    });
  }
  static deactivateLookupTable(params) {
    const type2 = LOOKUP_TABLE_INSTRUCTION_LAYOUTS.DeactivateLookupTable;
    const data = encodeData(type2);
    const keys = [{
      pubkey: params.lookupTable,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: params.authority,
      isSigner: true,
      isWritable: false
    }];
    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data
    });
  }
  static closeLookupTable(params) {
    const type2 = LOOKUP_TABLE_INSTRUCTION_LAYOUTS.CloseLookupTable;
    const data = encodeData(type2);
    const keys = [{
      pubkey: params.lookupTable,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: params.authority,
      isSigner: true,
      isWritable: false
    }, {
      pubkey: params.recipient,
      isSigner: false,
      isWritable: true
    }];
    return new TransactionInstruction({
      programId: this.programId,
      keys,
      data
    });
  }
}
AddressLookupTableProgram.programId = new PublicKey("AddressLookupTab1e1111111111111111111111111");

class ComputeBudgetInstruction {
  constructor() {
  }
  static decodeInstructionType(instruction) {
    this.checkProgramId(instruction.programId);
    const instructionTypeLayout = BufferLayout.u8("instruction");
    const typeIndex = instructionTypeLayout.decode(instruction.data);
    let type2;
    for (const [ixType, layout] of Object.entries(COMPUTE_BUDGET_INSTRUCTION_LAYOUTS)) {
      if (layout.index == typeIndex) {
        type2 = ixType;
        break;
      }
    }
    if (!type2) {
      throw new Error("Instruction type incorrect; not a ComputeBudgetInstruction");
    }
    return type2;
  }
  static decodeRequestUnits(instruction) {
    this.checkProgramId(instruction.programId);
    const {
      units,
      additionalFee
    } = decodeData$1(COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.RequestUnits, instruction.data);
    return {
      units,
      additionalFee
    };
  }
  static decodeRequestHeapFrame(instruction) {
    this.checkProgramId(instruction.programId);
    const {
      bytes: bytes2
    } = decodeData$1(COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.RequestHeapFrame, instruction.data);
    return {
      bytes: bytes2
    };
  }
  static decodeSetComputeUnitLimit(instruction) {
    this.checkProgramId(instruction.programId);
    const {
      units
    } = decodeData$1(COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.SetComputeUnitLimit, instruction.data);
    return {
      units
    };
  }
  static decodeSetComputeUnitPrice(instruction) {
    this.checkProgramId(instruction.programId);
    const {
      microLamports
    } = decodeData$1(COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.SetComputeUnitPrice, instruction.data);
    return {
      microLamports
    };
  }
  static checkProgramId(programId) {
    if (!programId.equals(ComputeBudgetProgram.programId)) {
      throw new Error("invalid instruction; programId is not ComputeBudgetProgram");
    }
  }
}
var COMPUTE_BUDGET_INSTRUCTION_LAYOUTS = Object.freeze({
  RequestUnits: {
    index: 0,
    layout: BufferLayout.struct([BufferLayout.u8("instruction"), BufferLayout.u32("units"), BufferLayout.u32("additionalFee")])
  },
  RequestHeapFrame: {
    index: 1,
    layout: BufferLayout.struct([BufferLayout.u8("instruction"), BufferLayout.u32("bytes")])
  },
  SetComputeUnitLimit: {
    index: 2,
    layout: BufferLayout.struct([BufferLayout.u8("instruction"), BufferLayout.u32("units")])
  },
  SetComputeUnitPrice: {
    index: 3,
    layout: BufferLayout.struct([BufferLayout.u8("instruction"), u642("microLamports")])
  }
});

class ComputeBudgetProgram {
  constructor() {
  }
  static requestUnits(params) {
    const type2 = COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.RequestUnits;
    const data = encodeData(type2, params);
    return new TransactionInstruction({
      keys: [],
      programId: this.programId,
      data
    });
  }
  static requestHeapFrame(params) {
    const type2 = COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.RequestHeapFrame;
    const data = encodeData(type2, params);
    return new TransactionInstruction({
      keys: [],
      programId: this.programId,
      data
    });
  }
  static setComputeUnitLimit(params) {
    const type2 = COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.SetComputeUnitLimit;
    const data = encodeData(type2, params);
    return new TransactionInstruction({
      keys: [],
      programId: this.programId,
      data
    });
  }
  static setComputeUnitPrice(params) {
    const type2 = COMPUTE_BUDGET_INSTRUCTION_LAYOUTS.SetComputeUnitPrice;
    const data = encodeData(type2, {
      microLamports: BigInt(params.microLamports)
    });
    return new TransactionInstruction({
      keys: [],
      programId: this.programId,
      data
    });
  }
}
ComputeBudgetProgram.programId = new PublicKey("ComputeBudget111111111111111111111111111111");
var PRIVATE_KEY_BYTES$1 = 64;
var PUBLIC_KEY_BYTES$1 = 32;
var SIGNATURE_BYTES = 64;
var ED25519_INSTRUCTION_LAYOUT = BufferLayout.struct([BufferLayout.u8("numSignatures"), BufferLayout.u8("padding"), BufferLayout.u16("signatureOffset"), BufferLayout.u16("signatureInstructionIndex"), BufferLayout.u16("publicKeyOffset"), BufferLayout.u16("publicKeyInstructionIndex"), BufferLayout.u16("messageDataOffset"), BufferLayout.u16("messageDataSize"), BufferLayout.u16("messageInstructionIndex")]);

class Ed25519Program {
  constructor() {
  }
  static createInstructionWithPublicKey(params) {
    const {
      publicKey: publicKey2,
      message,
      signature: signature2,
      instructionIndex
    } = params;
    assert2(publicKey2.length === PUBLIC_KEY_BYTES$1, `Public Key must be ${PUBLIC_KEY_BYTES$1} bytes but received ${publicKey2.length} bytes`);
    assert2(signature2.length === SIGNATURE_BYTES, `Signature must be ${SIGNATURE_BYTES} bytes but received ${signature2.length} bytes`);
    const publicKeyOffset = ED25519_INSTRUCTION_LAYOUT.span;
    const signatureOffset = publicKeyOffset + publicKey2.length;
    const messageDataOffset = signatureOffset + signature2.length;
    const numSignatures = 1;
    const instructionData = Buffer2.alloc(messageDataOffset + message.length);
    const index = instructionIndex == null ? 65535 : instructionIndex;
    ED25519_INSTRUCTION_LAYOUT.encode({
      numSignatures,
      padding: 0,
      signatureOffset,
      signatureInstructionIndex: index,
      publicKeyOffset,
      publicKeyInstructionIndex: index,
      messageDataOffset,
      messageDataSize: message.length,
      messageInstructionIndex: index
    }, instructionData);
    instructionData.fill(publicKey2, publicKeyOffset);
    instructionData.fill(signature2, signatureOffset);
    instructionData.fill(message, messageDataOffset);
    return new TransactionInstruction({
      keys: [],
      programId: Ed25519Program.programId,
      data: instructionData
    });
  }
  static createInstructionWithPrivateKey(params) {
    const {
      privateKey,
      message,
      instructionIndex
    } = params;
    assert2(privateKey.length === PRIVATE_KEY_BYTES$1, `Private key must be ${PRIVATE_KEY_BYTES$1} bytes but received ${privateKey.length} bytes`);
    try {
      const keypair = Keypair.fromSecretKey(privateKey);
      const publicKey2 = keypair.publicKey.toBytes();
      const signature2 = sign(message, keypair.secretKey);
      return this.createInstructionWithPublicKey({
        publicKey: publicKey2,
        message,
        signature: signature2,
        instructionIndex
      });
    } catch (error) {
      throw new Error(`Error creating instruction; ${error}`);
    }
  }
}
Ed25519Program.programId = new PublicKey("Ed25519SigVerify111111111111111111111111111");
var ecdsaSign = (msgHash, privKey) => {
  const signature2 = secp256k1.sign(msgHash, privKey);
  return [signature2.toCompactRawBytes(), signature2.recovery];
};
secp256k1.utils.isValidPrivateKey;
var publicKeyCreate = secp256k1.getPublicKey;
var PRIVATE_KEY_BYTES = 32;
var ETHEREUM_ADDRESS_BYTES = 20;
var PUBLIC_KEY_BYTES = 64;
var SIGNATURE_OFFSETS_SERIALIZED_SIZE = 11;
var SECP256K1_INSTRUCTION_LAYOUT = BufferLayout.struct([BufferLayout.u8("numSignatures"), BufferLayout.u16("signatureOffset"), BufferLayout.u8("signatureInstructionIndex"), BufferLayout.u16("ethAddressOffset"), BufferLayout.u8("ethAddressInstructionIndex"), BufferLayout.u16("messageDataOffset"), BufferLayout.u16("messageDataSize"), BufferLayout.u8("messageInstructionIndex"), BufferLayout.blob(20, "ethAddress"), BufferLayout.blob(64, "signature"), BufferLayout.u8("recoveryId")]);

class Secp256k1Program {
  constructor() {
  }
  static publicKeyToEthAddress(publicKey2) {
    assert2(publicKey2.length === PUBLIC_KEY_BYTES, `Public key must be ${PUBLIC_KEY_BYTES} bytes but received ${publicKey2.length} bytes`);
    try {
      return Buffer2.from(keccak_256(toBuffer(publicKey2))).slice(-ETHEREUM_ADDRESS_BYTES);
    } catch (error) {
      throw new Error(`Error constructing Ethereum address: ${error}`);
    }
  }
  static createInstructionWithPublicKey(params) {
    const {
      publicKey: publicKey2,
      message,
      signature: signature2,
      recoveryId,
      instructionIndex
    } = params;
    return Secp256k1Program.createInstructionWithEthAddress({
      ethAddress: Secp256k1Program.publicKeyToEthAddress(publicKey2),
      message,
      signature: signature2,
      recoveryId,
      instructionIndex
    });
  }
  static createInstructionWithEthAddress(params) {
    const {
      ethAddress: rawAddress,
      message,
      signature: signature2,
      recoveryId,
      instructionIndex = 0
    } = params;
    let ethAddress;
    if (typeof rawAddress === "string") {
      if (rawAddress.startsWith("0x")) {
        ethAddress = Buffer2.from(rawAddress.substr(2), "hex");
      } else {
        ethAddress = Buffer2.from(rawAddress, "hex");
      }
    } else {
      ethAddress = rawAddress;
    }
    assert2(ethAddress.length === ETHEREUM_ADDRESS_BYTES, `Address must be ${ETHEREUM_ADDRESS_BYTES} bytes but received ${ethAddress.length} bytes`);
    const dataStart = 1 + SIGNATURE_OFFSETS_SERIALIZED_SIZE;
    const ethAddressOffset = dataStart;
    const signatureOffset = dataStart + ethAddress.length;
    const messageDataOffset = signatureOffset + signature2.length + 1;
    const numSignatures = 1;
    const instructionData = Buffer2.alloc(SECP256K1_INSTRUCTION_LAYOUT.span + message.length);
    SECP256K1_INSTRUCTION_LAYOUT.encode({
      numSignatures,
      signatureOffset,
      signatureInstructionIndex: instructionIndex,
      ethAddressOffset,
      ethAddressInstructionIndex: instructionIndex,
      messageDataOffset,
      messageDataSize: message.length,
      messageInstructionIndex: instructionIndex,
      signature: toBuffer(signature2),
      ethAddress: toBuffer(ethAddress),
      recoveryId
    }, instructionData);
    instructionData.fill(toBuffer(message), SECP256K1_INSTRUCTION_LAYOUT.span);
    return new TransactionInstruction({
      keys: [],
      programId: Secp256k1Program.programId,
      data: instructionData
    });
  }
  static createInstructionWithPrivateKey(params) {
    const {
      privateKey: pkey,
      message,
      instructionIndex
    } = params;
    assert2(pkey.length === PRIVATE_KEY_BYTES, `Private key must be ${PRIVATE_KEY_BYTES} bytes but received ${pkey.length} bytes`);
    try {
      const privateKey = toBuffer(pkey);
      const publicKey2 = publicKeyCreate(privateKey, false).slice(1);
      const messageHash = Buffer2.from(keccak_256(toBuffer(message)));
      const [signature2, recoveryId] = ecdsaSign(messageHash, privateKey);
      return this.createInstructionWithPublicKey({
        publicKey: publicKey2,
        message,
        signature: signature2,
        recoveryId,
        instructionIndex
      });
    } catch (error) {
      throw new Error(`Error creating instruction; ${error}`);
    }
  }
}
Secp256k1Program.programId = new PublicKey("KeccakSecp256k11111111111111111111111111111");
var _class2;
var STAKE_CONFIG_ID = new PublicKey("StakeConfig11111111111111111111111111111111");

class Authorized {
  constructor(staker, withdrawer) {
    this.staker = undefined;
    this.withdrawer = undefined;
    this.staker = staker;
    this.withdrawer = withdrawer;
  }
}

class Lockup {
  constructor(unixTimestamp, epoch, custodian) {
    this.unixTimestamp = undefined;
    this.epoch = undefined;
    this.custodian = undefined;
    this.unixTimestamp = unixTimestamp;
    this.epoch = epoch;
    this.custodian = custodian;
  }
}
_class2 = Lockup;
Lockup.default = new _class2(0, 0, PublicKey.default);

class StakeInstruction {
  constructor() {
  }
  static decodeInstructionType(instruction) {
    this.checkProgramId(instruction.programId);
    const instructionTypeLayout = BufferLayout.u32("instruction");
    const typeIndex = instructionTypeLayout.decode(instruction.data);
    let type2;
    for (const [ixType, layout] of Object.entries(STAKE_INSTRUCTION_LAYOUTS)) {
      if (layout.index == typeIndex) {
        type2 = ixType;
        break;
      }
    }
    if (!type2) {
      throw new Error("Instruction type incorrect; not a StakeInstruction");
    }
    return type2;
  }
  static decodeInitialize(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);
    const {
      authorized: authorized2,
      lockup: lockup2
    } = decodeData$1(STAKE_INSTRUCTION_LAYOUTS.Initialize, instruction.data);
    return {
      stakePubkey: instruction.keys[0].pubkey,
      authorized: new Authorized(new PublicKey(authorized2.staker), new PublicKey(authorized2.withdrawer)),
      lockup: new Lockup(lockup2.unixTimestamp, lockup2.epoch, new PublicKey(lockup2.custodian))
    };
  }
  static decodeDelegate(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 6);
    decodeData$1(STAKE_INSTRUCTION_LAYOUTS.Delegate, instruction.data);
    return {
      stakePubkey: instruction.keys[0].pubkey,
      votePubkey: instruction.keys[1].pubkey,
      authorizedPubkey: instruction.keys[5].pubkey
    };
  }
  static decodeAuthorize(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    const {
      newAuthorized,
      stakeAuthorizationType
    } = decodeData$1(STAKE_INSTRUCTION_LAYOUTS.Authorize, instruction.data);
    const o = {
      stakePubkey: instruction.keys[0].pubkey,
      authorizedPubkey: instruction.keys[2].pubkey,
      newAuthorizedPubkey: new PublicKey(newAuthorized),
      stakeAuthorizationType: {
        index: stakeAuthorizationType
      }
    };
    if (instruction.keys.length > 3) {
      o.custodianPubkey = instruction.keys[3].pubkey;
    }
    return o;
  }
  static decodeAuthorizeWithSeed(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 2);
    const {
      newAuthorized,
      stakeAuthorizationType,
      authoritySeed,
      authorityOwner
    } = decodeData$1(STAKE_INSTRUCTION_LAYOUTS.AuthorizeWithSeed, instruction.data);
    const o = {
      stakePubkey: instruction.keys[0].pubkey,
      authorityBase: instruction.keys[1].pubkey,
      authoritySeed,
      authorityOwner: new PublicKey(authorityOwner),
      newAuthorizedPubkey: new PublicKey(newAuthorized),
      stakeAuthorizationType: {
        index: stakeAuthorizationType
      }
    };
    if (instruction.keys.length > 3) {
      o.custodianPubkey = instruction.keys[3].pubkey;
    }
    return o;
  }
  static decodeSplit(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    const {
      lamports
    } = decodeData$1(STAKE_INSTRUCTION_LAYOUTS.Split, instruction.data);
    return {
      stakePubkey: instruction.keys[0].pubkey,
      splitStakePubkey: instruction.keys[1].pubkey,
      authorizedPubkey: instruction.keys[2].pubkey,
      lamports
    };
  }
  static decodeMerge(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    decodeData$1(STAKE_INSTRUCTION_LAYOUTS.Merge, instruction.data);
    return {
      stakePubkey: instruction.keys[0].pubkey,
      sourceStakePubKey: instruction.keys[1].pubkey,
      authorizedPubkey: instruction.keys[4].pubkey
    };
  }
  static decodeWithdraw(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 5);
    const {
      lamports
    } = decodeData$1(STAKE_INSTRUCTION_LAYOUTS.Withdraw, instruction.data);
    const o = {
      stakePubkey: instruction.keys[0].pubkey,
      toPubkey: instruction.keys[1].pubkey,
      authorizedPubkey: instruction.keys[4].pubkey,
      lamports
    };
    if (instruction.keys.length > 5) {
      o.custodianPubkey = instruction.keys[5].pubkey;
    }
    return o;
  }
  static decodeDeactivate(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    decodeData$1(STAKE_INSTRUCTION_LAYOUTS.Deactivate, instruction.data);
    return {
      stakePubkey: instruction.keys[0].pubkey,
      authorizedPubkey: instruction.keys[2].pubkey
    };
  }
  static checkProgramId(programId) {
    if (!programId.equals(StakeProgram.programId)) {
      throw new Error("invalid instruction; programId is not StakeProgram");
    }
  }
  static checkKeyLength(keys, expectedLength) {
    if (keys.length < expectedLength) {
      throw new Error(`invalid instruction; found ${keys.length} keys, expected at least ${expectedLength}`);
    }
  }
}
var STAKE_INSTRUCTION_LAYOUTS = Object.freeze({
  Initialize: {
    index: 0,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), authorized(), lockup()])
  },
  Authorize: {
    index: 1,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("newAuthorized"), BufferLayout.u32("stakeAuthorizationType")])
  },
  Delegate: {
    index: 2,
    layout: BufferLayout.struct([BufferLayout.u32("instruction")])
  },
  Split: {
    index: 3,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), BufferLayout.ns64("lamports")])
  },
  Withdraw: {
    index: 4,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), BufferLayout.ns64("lamports")])
  },
  Deactivate: {
    index: 5,
    layout: BufferLayout.struct([BufferLayout.u32("instruction")])
  },
  Merge: {
    index: 7,
    layout: BufferLayout.struct([BufferLayout.u32("instruction")])
  },
  AuthorizeWithSeed: {
    index: 8,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("newAuthorized"), BufferLayout.u32("stakeAuthorizationType"), rustString("authoritySeed"), publicKey("authorityOwner")])
  }
});
var StakeAuthorizationLayout = Object.freeze({
  Staker: {
    index: 0
  },
  Withdrawer: {
    index: 1
  }
});

class StakeProgram {
  constructor() {
  }
  static initialize(params) {
    const {
      stakePubkey,
      authorized: authorized2,
      lockup: maybeLockup
    } = params;
    const lockup2 = maybeLockup || Lockup.default;
    const type2 = STAKE_INSTRUCTION_LAYOUTS.Initialize;
    const data = encodeData(type2, {
      authorized: {
        staker: toBuffer(authorized2.staker.toBuffer()),
        withdrawer: toBuffer(authorized2.withdrawer.toBuffer())
      },
      lockup: {
        unixTimestamp: lockup2.unixTimestamp,
        epoch: lockup2.epoch,
        custodian: toBuffer(lockup2.custodian.toBuffer())
      }
    });
    const instructionData = {
      keys: [{
        pubkey: stakePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false
      }],
      programId: this.programId,
      data
    };
    return new TransactionInstruction(instructionData);
  }
  static createAccountWithSeed(params) {
    const transaction = new Transaction;
    transaction.add(SystemProgram.createAccountWithSeed({
      fromPubkey: params.fromPubkey,
      newAccountPubkey: params.stakePubkey,
      basePubkey: params.basePubkey,
      seed: params.seed,
      lamports: params.lamports,
      space: this.space,
      programId: this.programId
    }));
    const {
      stakePubkey,
      authorized: authorized2,
      lockup: lockup2
    } = params;
    return transaction.add(this.initialize({
      stakePubkey,
      authorized: authorized2,
      lockup: lockup2
    }));
  }
  static createAccount(params) {
    const transaction = new Transaction;
    transaction.add(SystemProgram.createAccount({
      fromPubkey: params.fromPubkey,
      newAccountPubkey: params.stakePubkey,
      lamports: params.lamports,
      space: this.space,
      programId: this.programId
    }));
    const {
      stakePubkey,
      authorized: authorized2,
      lockup: lockup2
    } = params;
    return transaction.add(this.initialize({
      stakePubkey,
      authorized: authorized2,
      lockup: lockup2
    }));
  }
  static delegate(params) {
    const {
      stakePubkey,
      authorizedPubkey,
      votePubkey
    } = params;
    const type2 = STAKE_INSTRUCTION_LAYOUTS.Delegate;
    const data = encodeData(type2);
    return new Transaction().add({
      keys: [{
        pubkey: stakePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: votePubkey,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: SYSVAR_CLOCK_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: SYSVAR_STAKE_HISTORY_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: STAKE_CONFIG_ID,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    });
  }
  static authorize(params) {
    const {
      stakePubkey,
      authorizedPubkey,
      newAuthorizedPubkey,
      stakeAuthorizationType,
      custodianPubkey
    } = params;
    const type2 = STAKE_INSTRUCTION_LAYOUTS.Authorize;
    const data = encodeData(type2, {
      newAuthorized: toBuffer(newAuthorizedPubkey.toBuffer()),
      stakeAuthorizationType: stakeAuthorizationType.index
    });
    const keys = [{
      pubkey: stakePubkey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: SYSVAR_CLOCK_PUBKEY,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: authorizedPubkey,
      isSigner: true,
      isWritable: false
    }];
    if (custodianPubkey) {
      keys.push({
        pubkey: custodianPubkey,
        isSigner: true,
        isWritable: false
      });
    }
    return new Transaction().add({
      keys,
      programId: this.programId,
      data
    });
  }
  static authorizeWithSeed(params) {
    const {
      stakePubkey,
      authorityBase,
      authoritySeed,
      authorityOwner,
      newAuthorizedPubkey,
      stakeAuthorizationType,
      custodianPubkey
    } = params;
    const type2 = STAKE_INSTRUCTION_LAYOUTS.AuthorizeWithSeed;
    const data = encodeData(type2, {
      newAuthorized: toBuffer(newAuthorizedPubkey.toBuffer()),
      stakeAuthorizationType: stakeAuthorizationType.index,
      authoritySeed,
      authorityOwner: toBuffer(authorityOwner.toBuffer())
    });
    const keys = [{
      pubkey: stakePubkey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: authorityBase,
      isSigner: true,
      isWritable: false
    }, {
      pubkey: SYSVAR_CLOCK_PUBKEY,
      isSigner: false,
      isWritable: false
    }];
    if (custodianPubkey) {
      keys.push({
        pubkey: custodianPubkey,
        isSigner: true,
        isWritable: false
      });
    }
    return new Transaction().add({
      keys,
      programId: this.programId,
      data
    });
  }
  static splitInstruction(params) {
    const {
      stakePubkey,
      authorizedPubkey,
      splitStakePubkey,
      lamports
    } = params;
    const type2 = STAKE_INSTRUCTION_LAYOUTS.Split;
    const data = encodeData(type2, {
      lamports
    });
    return new TransactionInstruction({
      keys: [{
        pubkey: stakePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: splitStakePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    });
  }
  static split(params) {
    const transaction = new Transaction;
    transaction.add(SystemProgram.createAccount({
      fromPubkey: params.authorizedPubkey,
      newAccountPubkey: params.splitStakePubkey,
      lamports: 0,
      space: this.space,
      programId: this.programId
    }));
    return transaction.add(this.splitInstruction(params));
  }
  static splitWithSeed(params) {
    const {
      stakePubkey,
      authorizedPubkey,
      splitStakePubkey,
      basePubkey,
      seed,
      lamports
    } = params;
    const transaction = new Transaction;
    transaction.add(SystemProgram.allocate({
      accountPubkey: splitStakePubkey,
      basePubkey,
      seed,
      space: this.space,
      programId: this.programId
    }));
    return transaction.add(this.splitInstruction({
      stakePubkey,
      authorizedPubkey,
      splitStakePubkey,
      lamports
    }));
  }
  static merge(params) {
    const {
      stakePubkey,
      sourceStakePubKey,
      authorizedPubkey
    } = params;
    const type2 = STAKE_INSTRUCTION_LAYOUTS.Merge;
    const data = encodeData(type2);
    return new Transaction().add({
      keys: [{
        pubkey: stakePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: sourceStakePubKey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_CLOCK_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: SYSVAR_STAKE_HISTORY_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    });
  }
  static withdraw(params) {
    const {
      stakePubkey,
      authorizedPubkey,
      toPubkey,
      lamports,
      custodianPubkey
    } = params;
    const type2 = STAKE_INSTRUCTION_LAYOUTS.Withdraw;
    const data = encodeData(type2, {
      lamports
    });
    const keys = [{
      pubkey: stakePubkey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: toPubkey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: SYSVAR_CLOCK_PUBKEY,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: SYSVAR_STAKE_HISTORY_PUBKEY,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: authorizedPubkey,
      isSigner: true,
      isWritable: false
    }];
    if (custodianPubkey) {
      keys.push({
        pubkey: custodianPubkey,
        isSigner: true,
        isWritable: false
      });
    }
    return new Transaction().add({
      keys,
      programId: this.programId,
      data
    });
  }
  static deactivate(params) {
    const {
      stakePubkey,
      authorizedPubkey
    } = params;
    const type2 = STAKE_INSTRUCTION_LAYOUTS.Deactivate;
    const data = encodeData(type2);
    return new Transaction().add({
      keys: [{
        pubkey: stakePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_CLOCK_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: authorizedPubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    });
  }
}
StakeProgram.programId = new PublicKey("Stake11111111111111111111111111111111111111");
StakeProgram.space = 200;

class VoteInit {
  constructor(nodePubkey, authorizedVoter, authorizedWithdrawer, commission) {
    this.nodePubkey = undefined;
    this.authorizedVoter = undefined;
    this.authorizedWithdrawer = undefined;
    this.commission = undefined;
    this.nodePubkey = nodePubkey;
    this.authorizedVoter = authorizedVoter;
    this.authorizedWithdrawer = authorizedWithdrawer;
    this.commission = commission;
  }
}

class VoteInstruction {
  constructor() {
  }
  static decodeInstructionType(instruction) {
    this.checkProgramId(instruction.programId);
    const instructionTypeLayout = BufferLayout.u32("instruction");
    const typeIndex = instructionTypeLayout.decode(instruction.data);
    let type2;
    for (const [ixType, layout] of Object.entries(VOTE_INSTRUCTION_LAYOUTS)) {
      if (layout.index == typeIndex) {
        type2 = ixType;
        break;
      }
    }
    if (!type2) {
      throw new Error("Instruction type incorrect; not a VoteInstruction");
    }
    return type2;
  }
  static decodeInitializeAccount(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 4);
    const {
      voteInit: voteInit2
    } = decodeData$1(VOTE_INSTRUCTION_LAYOUTS.InitializeAccount, instruction.data);
    return {
      votePubkey: instruction.keys[0].pubkey,
      nodePubkey: instruction.keys[3].pubkey,
      voteInit: new VoteInit(new PublicKey(voteInit2.nodePubkey), new PublicKey(voteInit2.authorizedVoter), new PublicKey(voteInit2.authorizedWithdrawer), voteInit2.commission)
    };
  }
  static decodeAuthorize(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    const {
      newAuthorized,
      voteAuthorizationType
    } = decodeData$1(VOTE_INSTRUCTION_LAYOUTS.Authorize, instruction.data);
    return {
      votePubkey: instruction.keys[0].pubkey,
      authorizedPubkey: instruction.keys[2].pubkey,
      newAuthorizedPubkey: new PublicKey(newAuthorized),
      voteAuthorizationType: {
        index: voteAuthorizationType
      }
    };
  }
  static decodeAuthorizeWithSeed(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    const {
      voteAuthorizeWithSeedArgs: {
        currentAuthorityDerivedKeyOwnerPubkey,
        currentAuthorityDerivedKeySeed,
        newAuthorized,
        voteAuthorizationType
      }
    } = decodeData$1(VOTE_INSTRUCTION_LAYOUTS.AuthorizeWithSeed, instruction.data);
    return {
      currentAuthorityDerivedKeyBasePubkey: instruction.keys[2].pubkey,
      currentAuthorityDerivedKeyOwnerPubkey: new PublicKey(currentAuthorityDerivedKeyOwnerPubkey),
      currentAuthorityDerivedKeySeed,
      newAuthorizedPubkey: new PublicKey(newAuthorized),
      voteAuthorizationType: {
        index: voteAuthorizationType
      },
      votePubkey: instruction.keys[0].pubkey
    };
  }
  static decodeWithdraw(instruction) {
    this.checkProgramId(instruction.programId);
    this.checkKeyLength(instruction.keys, 3);
    const {
      lamports
    } = decodeData$1(VOTE_INSTRUCTION_LAYOUTS.Withdraw, instruction.data);
    return {
      votePubkey: instruction.keys[0].pubkey,
      authorizedWithdrawerPubkey: instruction.keys[2].pubkey,
      lamports,
      toPubkey: instruction.keys[1].pubkey
    };
  }
  static checkProgramId(programId) {
    if (!programId.equals(VoteProgram.programId)) {
      throw new Error("invalid instruction; programId is not VoteProgram");
    }
  }
  static checkKeyLength(keys, expectedLength) {
    if (keys.length < expectedLength) {
      throw new Error(`invalid instruction; found ${keys.length} keys, expected at least ${expectedLength}`);
    }
  }
}
var VOTE_INSTRUCTION_LAYOUTS = Object.freeze({
  InitializeAccount: {
    index: 0,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), voteInit()])
  },
  Authorize: {
    index: 1,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), publicKey("newAuthorized"), BufferLayout.u32("voteAuthorizationType")])
  },
  Withdraw: {
    index: 3,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), BufferLayout.ns64("lamports")])
  },
  AuthorizeWithSeed: {
    index: 10,
    layout: BufferLayout.struct([BufferLayout.u32("instruction"), voteAuthorizeWithSeedArgs()])
  }
});
var VoteAuthorizationLayout = Object.freeze({
  Voter: {
    index: 0
  },
  Withdrawer: {
    index: 1
  }
});

class VoteProgram {
  constructor() {
  }
  static initializeAccount(params) {
    const {
      votePubkey,
      nodePubkey,
      voteInit: voteInit2
    } = params;
    const type2 = VOTE_INSTRUCTION_LAYOUTS.InitializeAccount;
    const data = encodeData(type2, {
      voteInit: {
        nodePubkey: toBuffer(voteInit2.nodePubkey.toBuffer()),
        authorizedVoter: toBuffer(voteInit2.authorizedVoter.toBuffer()),
        authorizedWithdrawer: toBuffer(voteInit2.authorizedWithdrawer.toBuffer()),
        commission: voteInit2.commission
      }
    });
    const instructionData = {
      keys: [{
        pubkey: votePubkey,
        isSigner: false,
        isWritable: true
      }, {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: SYSVAR_CLOCK_PUBKEY,
        isSigner: false,
        isWritable: false
      }, {
        pubkey: nodePubkey,
        isSigner: true,
        isWritable: false
      }],
      programId: this.programId,
      data
    };
    return new TransactionInstruction(instructionData);
  }
  static createAccount(params) {
    const transaction = new Transaction;
    transaction.add(SystemProgram.createAccount({
      fromPubkey: params.fromPubkey,
      newAccountPubkey: params.votePubkey,
      lamports: params.lamports,
      space: this.space,
      programId: this.programId
    }));
    return transaction.add(this.initializeAccount({
      votePubkey: params.votePubkey,
      nodePubkey: params.voteInit.nodePubkey,
      voteInit: params.voteInit
    }));
  }
  static authorize(params) {
    const {
      votePubkey,
      authorizedPubkey,
      newAuthorizedPubkey,
      voteAuthorizationType
    } = params;
    const type2 = VOTE_INSTRUCTION_LAYOUTS.Authorize;
    const data = encodeData(type2, {
      newAuthorized: toBuffer(newAuthorizedPubkey.toBuffer()),
      voteAuthorizationType: voteAuthorizationType.index
    });
    const keys = [{
      pubkey: votePubkey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: SYSVAR_CLOCK_PUBKEY,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: authorizedPubkey,
      isSigner: true,
      isWritable: false
    }];
    return new Transaction().add({
      keys,
      programId: this.programId,
      data
    });
  }
  static authorizeWithSeed(params) {
    const {
      currentAuthorityDerivedKeyBasePubkey,
      currentAuthorityDerivedKeyOwnerPubkey,
      currentAuthorityDerivedKeySeed,
      newAuthorizedPubkey,
      voteAuthorizationType,
      votePubkey
    } = params;
    const type2 = VOTE_INSTRUCTION_LAYOUTS.AuthorizeWithSeed;
    const data = encodeData(type2, {
      voteAuthorizeWithSeedArgs: {
        currentAuthorityDerivedKeyOwnerPubkey: toBuffer(currentAuthorityDerivedKeyOwnerPubkey.toBuffer()),
        currentAuthorityDerivedKeySeed,
        newAuthorized: toBuffer(newAuthorizedPubkey.toBuffer()),
        voteAuthorizationType: voteAuthorizationType.index
      }
    });
    const keys = [{
      pubkey: votePubkey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: SYSVAR_CLOCK_PUBKEY,
      isSigner: false,
      isWritable: false
    }, {
      pubkey: currentAuthorityDerivedKeyBasePubkey,
      isSigner: true,
      isWritable: false
    }];
    return new Transaction().add({
      keys,
      programId: this.programId,
      data
    });
  }
  static withdraw(params) {
    const {
      votePubkey,
      authorizedWithdrawerPubkey,
      lamports,
      toPubkey
    } = params;
    const type2 = VOTE_INSTRUCTION_LAYOUTS.Withdraw;
    const data = encodeData(type2, {
      lamports
    });
    const keys = [{
      pubkey: votePubkey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: toPubkey,
      isSigner: false,
      isWritable: true
    }, {
      pubkey: authorizedWithdrawerPubkey,
      isSigner: true,
      isWritable: false
    }];
    return new Transaction().add({
      keys,
      programId: this.programId,
      data
    });
  }
  static safeWithdraw(params, currentVoteAccountBalance, rentExemptMinimum) {
    if (params.lamports > currentVoteAccountBalance - rentExemptMinimum) {
      throw new Error("Withdraw will leave vote account with insuffcient funds.");
    }
    return VoteProgram.withdraw(params);
  }
}
VoteProgram.programId = new PublicKey("Vote111111111111111111111111111111111111111");
VoteProgram.space = 3731;
var VALIDATOR_INFO_KEY = new PublicKey("Va1idator1nfo111111111111111111111111111111");
var InfoString = type({
  name: string(),
  website: optional(string()),
  details: optional(string()),
  keybaseUsername: optional(string())
});

class ValidatorInfo {
  constructor(key, info) {
    this.key = undefined;
    this.info = undefined;
    this.key = key;
    this.info = info;
  }
  static fromConfigData(buffer) {
    let byteArray = [...buffer];
    const configKeyCount = decodeLength(byteArray);
    if (configKeyCount !== 2)
      return null;
    const configKeys = [];
    for (let i = 0;i < 2; i++) {
      const publicKey2 = new PublicKey(byteArray.slice(0, PUBLIC_KEY_LENGTH));
      byteArray = byteArray.slice(PUBLIC_KEY_LENGTH);
      const isSigner = byteArray.slice(0, 1)[0] === 1;
      byteArray = byteArray.slice(1);
      configKeys.push({
        publicKey: publicKey2,
        isSigner
      });
    }
    if (configKeys[0].publicKey.equals(VALIDATOR_INFO_KEY)) {
      if (configKeys[1].isSigner) {
        const rawInfo = rustString().decode(Buffer2.from(byteArray));
        const info = JSON.parse(rawInfo);
        assert(info, InfoString);
        return new ValidatorInfo(configKeys[1].publicKey, info);
      }
    }
    return null;
  }
}
var VOTE_PROGRAM_ID = new PublicKey("Vote111111111111111111111111111111111111111");
var VoteAccountLayout = BufferLayout.struct([
  publicKey("nodePubkey"),
  publicKey("authorizedWithdrawer"),
  BufferLayout.u8("commission"),
  BufferLayout.nu64(),
  BufferLayout.seq(BufferLayout.struct([BufferLayout.nu64("slot"), BufferLayout.u32("confirmationCount")]), BufferLayout.offset(BufferLayout.u32(), -8), "votes"),
  BufferLayout.u8("rootSlotValid"),
  BufferLayout.nu64("rootSlot"),
  BufferLayout.nu64(),
  BufferLayout.seq(BufferLayout.struct([BufferLayout.nu64("epoch"), publicKey("authorizedVoter")]), BufferLayout.offset(BufferLayout.u32(), -8), "authorizedVoters"),
  BufferLayout.struct([BufferLayout.seq(BufferLayout.struct([publicKey("authorizedPubkey"), BufferLayout.nu64("epochOfLastAuthorizedSwitch"), BufferLayout.nu64("targetEpoch")]), 32, "buf"), BufferLayout.nu64("idx"), BufferLayout.u8("isEmpty")], "priorVoters"),
  BufferLayout.nu64(),
  BufferLayout.seq(BufferLayout.struct([BufferLayout.nu64("epoch"), BufferLayout.nu64("credits"), BufferLayout.nu64("prevCredits")]), BufferLayout.offset(BufferLayout.u32(), -8), "epochCredits"),
  BufferLayout.struct([BufferLayout.nu64("slot"), BufferLayout.nu64("timestamp")], "lastTimestamp")
]);

class VoteAccount {
  constructor(args) {
    this.nodePubkey = undefined;
    this.authorizedWithdrawer = undefined;
    this.commission = undefined;
    this.rootSlot = undefined;
    this.votes = undefined;
    this.authorizedVoters = undefined;
    this.priorVoters = undefined;
    this.epochCredits = undefined;
    this.lastTimestamp = undefined;
    this.nodePubkey = args.nodePubkey;
    this.authorizedWithdrawer = args.authorizedWithdrawer;
    this.commission = args.commission;
    this.rootSlot = args.rootSlot;
    this.votes = args.votes;
    this.authorizedVoters = args.authorizedVoters;
    this.priorVoters = args.priorVoters;
    this.epochCredits = args.epochCredits;
    this.lastTimestamp = args.lastTimestamp;
  }
  static fromAccountData(buffer) {
    const versionOffset = 4;
    const va = VoteAccountLayout.decode(toBuffer(buffer), versionOffset);
    let rootSlot = va.rootSlot;
    if (!va.rootSlotValid) {
      rootSlot = null;
    }
    return new VoteAccount({
      nodePubkey: new PublicKey(va.nodePubkey),
      authorizedWithdrawer: new PublicKey(va.authorizedWithdrawer),
      commission: va.commission,
      votes: va.votes,
      rootSlot,
      authorizedVoters: va.authorizedVoters.map(parseAuthorizedVoter),
      priorVoters: getPriorVoters(va.priorVoters),
      epochCredits: va.epochCredits,
      lastTimestamp: va.lastTimestamp
    });
  }
}
var endpoint = {
  http: {
    devnet: "http://api.devnet.solana.com",
    testnet: "http://api.testnet.solana.com",
    "mainnet-beta": "http://api.mainnet-beta.solana.com/"
  },
  https: {
    devnet: "https://api.devnet.solana.com",
    testnet: "https://api.testnet.solana.com",
    "mainnet-beta": "https://api.mainnet-beta.solana.com/"
  }
};
var LAMPORTS_PER_SOL = 1e9;

// index.js
console.log(exports_index_esm);
