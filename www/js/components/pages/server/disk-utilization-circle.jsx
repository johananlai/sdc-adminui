/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

var $ = require('jquery');
require('epoch');
var React = require('react');
var BackboneMixin = require('../../_backbone-mixin');

var ServerMemoryUtilizationCircle = React.createClass({
    mixins: [BackboneMixin],
    getBackboneModels: function() {
        return [this.props.server];
    },

    propTypes: {
        server: React.PropTypes.object.isRequired,
        diameter: React.PropTypes.string.isRequired,
        inner: React.PropTypes.string.isRequired
    },

    getChartData: function() {
        var server = this.props.server.toJSON();
        if (server.memory_disk_pool_size_bytes < 0) { server.disk_pool_size_bytes = 0; }

        var used = server.disk_kvm_zvol_used_bytes +
                   server.disk_kvm_quota_used_bytes +
                   server.disk_cores_quota_used_bytes +
                   server.disk_zone_quota_used_bytes +
                   server.disk_system_used_bytes +
                   server.disk_installed_images_used_bytes;
        var provisionable = server.disk_pool_size_bytes - used;

        if (used < 0) { used = 0; }
        if (provisionable < 0) { provisionable = 0; }

        var pieData = [
            {label: 'Used', value: used },
            {label: 'Provisionable', value: provisionable },
        ];
        return pieData;
    },

    drawDiskGraph: function() {
        var $node = $(this.getDOMNode()).find('.graph');

        if (this.chart) {
            this.chart.update(this.getChartData());
        } else {
            this.chart = $node.epoch({
                type: 'pie',
                data: this.getChartData(),
                inner: this.props.inner,
            });
        }
    },

    componentDidMount: function() {
        this.drawDiskGraph();
        this.props.server.on('change:memory_provisionable_bytes change:reservation_ratio', this.drawDiskGraph, this);
    },

    componentWillUnmount: function() {
        this.props.server.off('change:memory_provisionable_bytes change:reservation_ratio', this.drawDiskGraph);
    },

    render: function() {
        var diameter = parseInt(this.props.diameter);
        var percentmTop = (-(diameter/2) - 9) + 'px';

        var server = this.props.server.toJSON();
        if (server.memory_disk_pool_size_bytes < 0) { server.disk_pool_size_bytes = 0; }

        var usedBytes = server.disk_kvm_zvol_used_bytes +
                        server.disk_kvm_quota_used_bytes +
                        server.disk_cores_quota_used_bytes +
                        server.disk_zone_quota_used_bytes +
                        server.disk_system_used_bytes +
                        server.disk_installed_images_used_bytes;
        var totalBytes = server.disk_pool_size_bytes;

        if (usedBytes < 0) { usedBytes = 0; }
        if (totalBytes < 0) { totalBytes *= -1; }

        var util_percent = Math.round(usedBytes / totalBytes * 100);
        if (util_percent < 0) { util_percent = 0; }

        var pctSize, labelSize;
        if (diameter > 100) {
            pctSize = '18px';
            labelSize = '10px';
            percentmTop = parseInt(percentmTop) - 2 + 'px';
        }

        return <div className="server-disk-utilization-circle" style={ {width: diameter, height: diameter} }>
            <div className="graph epoch" style={ {width: diameter, height: diameter} }></div>
            <div className="percent" style={ {'fontSize': pctSize, 'marginTop': percentmTop}}>
                <strong style={ {'fontSize': labelSize} }>UTILIZATION</strong> {util_percent}%
            </div>
        </div>;
    }
});

module.exports = ServerMemoryUtilizationCircle;
