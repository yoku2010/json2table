/**
 * @description: To convert json 2 table.
 * @dependency: jquery1.12.x, bootstrap
 * @verion: 0.1.1
 * @date: 07-Feb-2017
 */
(function ($, d) {
    'use strict';
    $.fn.extend({
        JSON2Table: function (options) {
            var options = $.extend({
                json: {
                    "Your Key": "Your Value"
                }
            }, options);
            this.each(function () {
                new J2T(this, options);
            });
            return this;
        }
    });
    var J2T = function (me, opt) {
        var o = {
            $me: $(me),
            func: {
                init: function () {
                    o.func.resetAll();
                    o.func.drawJSON(opt.json, o.func.drawTable(o.$me));
                },
                resetAll: function () {
                    o.$me.empty();
                },
                drawTable: function ($container) {
                    var $table = $("<table></table>").addClass("table table-bordered"),
                        $tbody = $("<tbody></tbody>");
                    $tbody.appendTo($table);
                    $table.appendTo($container);
                    return $tbody;
                },
                drawJSON: function (json, $container) {
                    var $tr, $td, $tbody, $trChild, $tdChild;
                    for (var key in json) {
                        $tr = $("<tr></tr>");
                        $("<td></td>").addClass("k").text(key).appendTo($tr);
                        if ($.isArray(json[key])) {
                            $td = $("<td></td>").addClass("o");
                            $tbody = o.func.drawTable($td);
                            $trChild = $("<tr></tr>");
                            for (var index in json[key]) {
                                $tdChild = $("<td></td>");
                                o.func.drawJSON(json[key][index], o.func.drawTable($tdChild));
                                $tdChild.appendTo($trChild);
                            }
                            $trChild.appendTo($tbody);
                            $td.appendTo($tr);
                        } else if ($.isPlainObject(json[key])){
                            $td = $("<td></td>").addClass("o");
                            o.func.drawJSON(json[key], o.func.drawTable($td));
                            $td.appendTo($tr);
                        } else {
                            $("<td></td>").addClass("v").text(json[key]).appendTo($tr);
                        }
                        $tr.appendTo($container);
                    }
                }
            }
        }
		o.func.init();
    }
}).call(window, jQuery, document);