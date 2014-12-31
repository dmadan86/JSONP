;(function (window, document) {
    'use strict';
    var encode = window.encodeURIComponent,
        emptyFn = function () {},
        src,
        object_to_uri = function (obj) {
            var data = [], key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    data.push(encode(key) + '=' + encode(obj[key]));
                }
            }
            return data.join('&');
        },
        JSONP = function (options) {
            var isLoaded = false,
                head = document.getElementsByTagName('head')[0],
                params = {
                    data: options.data || {},
                    error: options.error || emptyFn,
                    success: options.success || emptyFn,
                    url: options.url || '',
                    callback: options.callback || ("jsonp_" + (+new Date()))
                },
                script = document.createElement('script');
            if (params.url.length === 0) {
                throw new Error('No URL Provided...');
            }
            var callback = params.callback;
            params.data.callback = callback;
            window[callback] = function (data) {
                setTimeout(function () {
                    params.success(data);
                }, 0);
                return delete window[callback];
            };
            src = [
                params.url,
                params.url.indexOf('?') === -1 ? '?' : '&',
                object_to_uri(params.data)
            ];
            script.async = true;
            script.onerror = function (evt) {
                return params.error({
                    url: script.src,
                    event: evt
                });
            };
            script.onload = script.onreadystatechange = function () {
                if (!isLoaded && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                    isLoaded = true;
                    script.onload = script.onreadystatechange = null;
                    if (script && script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                }
            };
            script.src = src.join("");
            return head.appendChild(script);
        };

    window.JSONP = JSONP;

})(window, document);


