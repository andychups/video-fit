$.fn.videoFit = function (options) {
    var plugin = {};

    options = $.extend({
        'centering': false,
        'timeUpdate': 500
    }, options);

    plugin.$window = $(window);
    plugin.video = {};
    plugin.video.el = null;
    plugin.video.width = null;
    plugin.video.height = null;
    plugin.throttle = null;

    plugin.featureDetection = {};
    plugin.featureDetection.objectFit = ('objectFit' in document.documentElement.style);

    plugin.init = function () {
        plugin.video.$el = $(this);
        plugin.video.width = $(this).attr('width');
        plugin.video.height = $(this).attr('height');

        plugin.removeAttrs();

        if (plugin.featureDetection.objectFit) {
            plugin.video.$el.css({
                'object-fit': 'cover',
                '-o-object-fit': 'cover',
                'width': '100%',
                'height': '100%'
            });

            return false;
        }

        plugin.adaptiveVideoSize();

        plugin.$window.resize(function() {
            if (plugin.throttle) {
                return;
            }

            plugin.throttle = setTimeout(function () {
                plugin.adaptiveVideoSize();
                plugin.throttle = null;
            }, options.timeUpdate);
        });

        return true;
    };

    plugin.removeAttrs = function () {
        plugin.video.$el.removeAttr('width').removeAttr('height');
    };

    plugin.adaptiveVideoSize = function () {
        plugin.setProportion(this.getProportion());

        if (options.centering) {
            plugin.centeringVideo();
        }
    };

    plugin.centeringVideo = function () {
        var x = Math.floor(plugin.$window.width() - plugin.video.$el.width())+'px';
        var y = Math.floor(plugin.$window.height() - plugin.video.$el.height())+'px';

        plugin.video.$el.css({
            '-webkit-transform': 'translate('+x+', '+y+')',
            '-moz-transform': 'translate('+x+', '+y+')',
            '-ms-transform': 'translate('+x+', '+y+')',
            '-o-transform': 'translate('+x+', '+y+')',
            'transform': 'translate('+x+', '+y+')'
        });
    };

    plugin.getProportion = function () {
        var windowWidth = plugin.$window.width();
        var windowHeight = plugin.$window.height();
        var windowProportion = windowWidth / windowHeight;

        var videoWidth = plugin.video.width;
        var videoHeight = plugin.video.height;
        var videoProportion = videoWidth / videoHeight;

        var proportion = windowHeight / videoHeight;

        if (windowProportion >= videoProportion) {
            proportion = windowWidth / videoWidth;
        }

        return proportion;
    };

    plugin.setProportion = function (proportion) {
        plugin.video.$el.width(Math.ceil(plugin.video.width * proportion));
        plugin.video.$el.height(Math.ceil(plugin.video.height * proportion));
    };

    plugin.init.call(this);

    return this;
};