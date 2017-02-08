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
                },
                toggleView: true,
                displayLevel: 0
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
                    o.func.drawToggleView(o.$me);
                    o.func.drawJSON(opt.json, o.func.drawTable(o.$me, false), 0);
                },
                resetAll: function () {
                    if (opt.displayLevel === 0) {
                        opt.displayLevel = Infinity;
                    }
                    o.$me.addClass("json-2-table").empty();
                },
                drawTable: function ($container, border) {
                    var $table = $("<table></table>").addClass("table table-bordered"),
                        $tbody = $("<tbody></tbody>");
                    border && $table.removeClass("table-bordered");
                    $tbody.appendTo($table);
                    $table.appendTo($container);
                    return $tbody;
                },
                drawJSON: function (json, $container, level) {
                    var $tr, $td, $tbody, $trChild, $tdChild, $newContainer, $delContainer;
                    if (level >= opt.displayLevel) {
                        $delContainer = $container.parent();
                        $newContainer = $delContainer.parent().removeClass("o").addClass("v");
                        $delContainer.remove();
                        $("<a></a>").attr("href", "#").addClass("view-more").text("view more").data("json", json).click(o.evnt.drawJSONInBox).appendTo($newContainer);
                    } else {
                        for (var key in json) {
                            $tr = $("<tr></tr>");
                            $("<td></td>").addClass("k").text(key).appendTo($tr);
                            if ($.isArray(json[key])) {
                                $td = $("<td></td>").addClass("o");
                                $tbody = o.func.drawTable($td, false);
                                $trChild = $("<tr></tr>");
                                for (var index in json[key]) {
                                    $tdChild = $("<td></td>");
                                    if ($.isPlainObject(json[key][index])) {
                                        o.func.drawJSON(json[key][index], o.func.drawTable($tdChild, false), level + 1);
                                    } else {
                                        $tdChild.addClass("v").text(json[key][index]);
                                    }
                                    $tdChild.appendTo($trChild);
                                }
                                $trChild.appendTo($tbody);
                                $td.appendTo($tr);
                            } else if ($.isPlainObject(json[key])){
                                $td = $("<td></td>").addClass("o");
                                o.func.drawJSON(json[key], o.func.drawTable($td, false), level + 1);
                                $td.appendTo($tr);
                            } else {
                                $("<td></td>").addClass("v").text(json[key]).appendTo($tr);
                            }
                            $tr.appendTo($container);
                        }
                    }
                },
                drawToggleView: function ($container) {
                    var $a = $("<a></a>").attr({
                        href: "#",
                        title: "Toggle View",
                        "data-toggle":"tooltip",
                        "data-placement":"right"
                    }).addClass("toggle-view").tooltip(),
                    $i = $("<i></i>").addClass("fa fa-toggle-off");
                    $a.click(o.evnt.toggleFlex).append($i);
                    $a.appendTo($container);
                }
            },
            evnt: {
                toggleFlex: function (e) {
                    e.preventDefault();
                    var $this = $(this),
                        $i = $this.find("i");
                    if ($i.hasClass("fa-toggle-off")) {
                        $i.removeClass("fa-toggle-off").addClass("fa-toggle-on");
                    } else {
                        $i.addClass("fa-toggle-off").removeClass("fa-toggle-on");
                    }
                },
                drawJSONInBox: function (e) {
                    e.preventDefault();
                    var $this = $(this),
                        json = $this.data("json"),
                        $div =$("<div></div>");

                    $div.JSON2Table({
                        json: json,
                        displayLevel: opt.displayLevel
                    });
                    bootbox.dialog({
                        title: 'A custom dialog with init',
                        message: $div
                    });
                }
            }
        }
		o.func.init();
    }
}).call(window, jQuery, document);