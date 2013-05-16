exports.safe = function safe(callback, func, dontExecuteCallback) {
    return function(err) {
        if (err) {
            return callback(err);
        }
        var args = Array.prototype.slice.call(arguments, 1);
        func.apply(null, args);
        if (!dontExecuteCallback && callback) {
            args.unshift(null);
            callback.apply(this, args);
        }
    };
};