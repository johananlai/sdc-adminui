/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

var React = require('react');
var BackboneMixin = require('../../_backbone-mixin');
var ServerDiskUtilizationCircle = require('./disk-utilization-circle');
var utils = require('../../../lib/utils');

var ServerDiskOverview = React.createClass({
    mixins: [BackboneMixin],
    getBackboneModels: function() {
        return [this.props.server];
    },
    render: function() {
        var server = this.props.server.toJSON();
        if (!server.vms) { return null; }
        if (server.memory_disk_pool_size_bytes < 0) { server.disk_pool_size_bytes = 0; }

        var usedBytes = server.disk_kvm_zvol_used_bytes +
                        server.disk_kvm_quota_used_bytes +
                        server.disk_cores_quota_used_bytes +
                        server.disk_zone_quota_used_bytes +
                        server.disk_system_used_bytes +
                        server.disk_installed_images_used_bytes;
        var totalBytes = server.disk_pool_size_bytes;
        var provisionableBytes = totalBytes - usedBytes;

        var disk_attr = [usedBytes, totalBytes, provisionableBytes];
        for (var i = 0; i < disk_attr.length; i++) {
            if (disk_attr[i] < 0) { disk_attr[i] = 0; }
        }

        var used = utils.getReadableSize(disk_attr[0]);
        var total = utils.getReadableSize(disk_attr[1]);
        var provisionable = utils.getReadableSize(disk_attr[2]);

        return <div className="disk-overview">
            <div className="row">
                <div className="col-sm-12">
                    <h5 className="overview-title">Disk Utilization</h5>
                </div>
            </div>
            <div className="row">
                <div className="server-disk-utilization-container">
                    <ServerDiskUtilizationCircle diameter="120px" inner="38" server={this.props.server} />
                </div>
                <div className="provisionable-disk">
                    <div className="value">{provisionable.value + ' ' + provisionable.measure}</div>
                    <div className="title">Provisionable</div>
                </div>
                <div className="provisioned-disk">
                    <div className="value">{used.value + ' ' + used.measure}</div>
                    <div className="title">Provisioned</div>
                </div>

                <div className="total-disk">
                    <div className="value">{total.value + ' ' + total.measure}</div>
                    <div className="title">Total</div>
                </div>
            </div>
        </div>;
    }
});

module.exports = ServerDiskOverview;
