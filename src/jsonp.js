(function(){
    var encode = window.encodeURIComponent,
        emptyFn = function(){},
        object_to_uri = function(obj) {
            var data = [], key;
            for (key in obj) {
                data.push(encode(key) + '=' + encode(obj[key]));
            }
            return data.join('&');
        },
        JSONP = function(options) {
            var src=[],
                callback,
                isLoaded = false,
                head = window.document.getElementsByTagName('head')[0],
                params = {
                    data: options.data || {},
                    error: options.error || emptyFn,
                    success: options.success || emptyFn,
                    url: options.url || ''
                },
                script= window.document.createElement('script');
            options = options ? options : {};
            if (params.url.length === 0) {
                throw new Error('No URL Provided...');
            }
            callback = params.data[options.callback_name || 'callback'] = 'jsonp_' + random_string(15);
            window[callback] = function(data) {
                params.success(data);
                return delete window[callback];
            };
            src = [
                params.url,
                params.url.indexOf('?' === -1) ? '?' : '&',
                object_to_uri(params.data)
            ];
            script.src = params.url;
            script.async = true;
            script.onerror = function(evt) {
                return params.error({
                    url: script.src,
                    event: evt
                });
            };
            script.onload = script.onreadystatechange = function() {
                if (!isLoaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                    isLoaded = true;
                    script.onload = script.onreadystatechange = null;
                    if (script && script.parentNode) {
                        return script.parentNode.removeChild(script);
                    }
                }
            };
            return head.appendChild(script);
        };


    if ((typeof module !== "undefined" && module !== null) && module.exports) {
        module.exports = JSONP;
    } else if ((typeof module !== "undefined" && module !== null) && module.exports) {
        module.exports = JSONP;
    } else {
        this.JSONP = JSONP;
    }

}).call(this);


