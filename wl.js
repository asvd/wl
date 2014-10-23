/**
 * @fileoverview wl - Whenable events
 * @version 0.1.0
 * 
 * @license MIT, see http://github.com/asvd/wl
 * Copyright (c) 2014 asvd <heliosframework@gmail.com> 
 * 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.wl = {}));
    }
}(this, function (exports) {


    /**
     * Whenable event object constructor
     */
    var Whenable = function() {
        this._emitted = false;  // event state, may be emitted or not
        this._listeners = [];
        this._result = [];      // args to transfer to the listener
    }

      
    /**
     * Adds another listener to be executed upon the event emission
     * 
     * @param {Function} func listener function to subscribe
     * @param {Object} ctx optional context to call the listener in
     */
    Whenable.prototype.whenEmitted = function(func, ctx){
        if (this._emitted) {
            this._invoke(func, ctx, this._result);
        } else {
            this._listeners.push([func, ctx||null]);
        }
    }
      
      
    /**
     * (Asynchronously) invokes the given listener in the context with
     * the arguments
     * 
     * @param {Function} listener to invoke
     * @param {Object} ctx context to invoke the listener in
     * @param {Array} args to provide to the listener
     */
    Whenable.prototype._invoke = function(listener, ctx, args) {
        setTimeout(function() {
            listener.apply(ctx, args);
        },0);
    }

      
    /**
     * Fires the event, issues the listeners
     * 
     * @param ... all given arguments are forwarded to the listeners
     */
    Whenable.prototype.emit = function(){
        if (!this._emitted) {
            this._emitted = true;

            for (var i = 0; i < arguments.length; i++) {
                this._result.push(arguments[i]);
            }

            var listener;
            while(listener = this._listeners.pop()) {
                this._invoke(listener[0], listener[1], this._result);
            }
        }
    }
      
    
    exports.Whenable = Whenable;
}));

