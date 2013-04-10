var Backbone = require('backbone');


module.exports = Backbone.Model.extend({
    urlRoot: '/_/images',

    idAttribute: 'uuid',

    defaults: {
        'name': null
    },

    nameWithVersion: function() {
        return _.str.sprintf('%s %s', this.get('name'), this.get('version'));
    },

    activate: function(cb) {
        $.post(this.url() + "?action=activate", cb);
    },

    disable: function(cb) {
        $.post(this.url() + "?action=disable", cb);
    },

    enable: function(cb) {
        $.post(this.url() + "?action=enable", cb);
    },

    adminImport: function() {
        var url = this.url() + '?action=import';
        var ajax = $.ajax(url, {
            data: JSON.stringify(this.attributes),
            contentType: 'application/json',
            type: 'POST'
        });

        return ajax;
    },

    toJSON: function() {
        var attrs = this.attributes;
        attrs.files = _.map(attrs.files, function(f) {
            if(f.size) {
                f.size_in_mb = _sizeToMB(f.size);
            }
            return f;
        });
        return attrs;
    }
});

function _sizeToMB(size) {
    return _.str.sprintf('%0.1f', size / 1024 / 1024);
}

