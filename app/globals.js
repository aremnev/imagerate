module.exports = function() {

    String.prototype.format = function(i, safe, arg) {
        function format() {
            var str = this, len = arguments.length+1;

            // For each {0} {1} {n...} replace with the argument in that position.  If
            // the argument is an object or an array it will be stringified to JSON.
            for (i=0; i < len; arg = arguments[i++]) {
                safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
                str = str.replace(RegExp('\\{'+(i-1)+'\\}', 'g'), safe);
            }
            return str;
        }

        // Save a reference of what may already exist under the property native.
        format.native = String.prototype.format;

        // Replace the prototype property
        return format;
    }();

    String.prototype.trim = function(full){
        if(full) return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
        return this.replace(/^\s+|\s+$/g, '');
    };

    String.prototype.ltrim = function(){return this.replace(/^\s+/,'');};

    String.prototype.rtrim = function(){return this.replace(/\s+$/,'');};

    String.prototype.isEmpty = function() { return this && this.trim() }
}