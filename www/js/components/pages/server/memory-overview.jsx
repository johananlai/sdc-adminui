/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

var React = require('react');
var ServerMemoryUtilizationCircle = require('./memory-utilization-circle');
var BackboneMixin = require('../../_backbone-mixin');
var utils = require('../../../lib/utils');

var ServerMemoryOverview = React.createClass({
    mixins: [BackboneMixin],
    getBackboneModels: function() {
        return [this.props.server];
    },
    render: function() {
        var server = this.props.server.toJSON();
        if (!server.vms) { return null; }
        if (server.memory_provisionable_bytes < 0) { server.memory_provisionable_bytes = 0; }
        if (server.memory_available_bytes < 0) { server.memory_available_bytes = 0; }
        if (server.memory_total_bytes < 0) { server.memory_total_bytes = 0; }

        var provisionableBytes = server.memory_provisionable_bytes;
        var provisionedBytes = server.memory_total_bytes - (2 * server.memory_provisionable_bytes) - server.memory_available_bytes;
        var reservedBytes = server.memory_provisionable_bytes + server.memory_available_bytes;
        var unreservedBytes = server.memory_total_bytes - server.memory_provisionable_bytes - server.memory_available_bytes;
        var totalBytes = server.memory_total_bytes;

        memory_attr = [provisionableBytes, provisionedBytes, reservedBytes, unreservedBytes, totalBytes];
        for (var i = 0; i < memory_attr.length; i++) {
            if (memory_attr[i] < 0) { memory_attr[i] = 0; }
        }

        var provisionable = utils.getReadableSize(memory_attr[0]);
        var provisioned = utils.getReadableSize(memory_attr[1]);
        var reserved = utils.getReadableSize(memory_attr[2]);
        var unreserved = utils.getReadableSize(memory_attr[3]);
        var total = utils.getReadableSize(memory_attr[4]);

        return <div className="memory-overview">
            <div className="row">
                <div className="col-sm-12">
                    <h5 className="overview-title">Memory Utilization</h5>
                </div>
            </div>
            <div className="row">
                <div className="server-memory-utilization-container">
                    <ServerMemoryUtilizationCircle diameter="120px" inner="38" server={this.props.server} />
                </div>
                <div className="provisionable-memory">
                    <div className="value">{provisionable.value + ' ' + provisionable.measure}</div>
                    <div className="title">Provisionable</div>
                </div>
                <div className="provisioned-memory">
                    <div className="value">{provisioned.value + ' ' + provisioned.measure}</div>
                    <div className="title">Provisioned</div>
                </div>
                <div className="reserved-memory">
                    <div className="value">{reserved.value + ' ' + reserved.measure}</div>
                    <div className="title">Reserved</div>
                </div>
                <div className="unreserved-memory">
                    <div className="value">{unreserved.value + ' ' + unreserved.measure}</div>
                    <div className="title">Unreserved</div>
                </div>
                <div className="total-memory">
                    <div className="value">{total.value + ' ' + total.measure}</div>
                    <div className="title">Total</div>
                </div>
            </div>
        </div>;
    }
});

module.exports = ServerMemoryOverview;
