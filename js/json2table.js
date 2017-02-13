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
                displayLevel: 0,
                widthPercentage: 30
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
                    o.func.drawJSON(opt.json, o.func.drawTable(o.$me, false), 0, null);
                },
                resetAll: function () {
                    if (opt.displayLevel === 0) {
                        opt.displayLevel = Infinity;
                    }
                    o.$me.addClass("json-2-table").empty();
                },
                drawTable: function ($container, noBorder) {
                    var $table = $("<table></table>").addClass("table table-bordered"),
                        $tbody = $("<tbody></tbody>");
                    noBorder && $table.removeClass("table-bordered");
                    $tbody.appendTo($table);
                    $table.appendTo($container);
                    return $tbody;
                },
                drawJSON: function (json, $container, level, key) {
                    var $tr, $td, $tbody, $trChild, $tdChild, $newContainer,
                        $delContainer, headerIndex, keyLength, $tdDiv, $div;
                    if (level >= opt.displayLevel) {
                        $delContainer = $container.parent();
                        $newContainer = $delContainer.parent().removeClass("o").addClass("v");
                        $delContainer.remove();
                        $("<a></a>").attr("href", "#").text("view more").data({
                            "json": json,
                            "key": key
                        }).click(o.evnt.drawJSONInBox).appendTo($newContainer);
                    } else {
                        for (var key in json) {
                            $tr = $("<tr></tr>");
                            $("<td></td>").addClass("k").text(key).appendTo($tr);
                            if ($.isArray(json[key])) {
                                $td = $("<td></td>").addClass("o");
                                $tdDiv = $("<div></div>").addClass("scrollable");
                                $div = $("<div></div>").addClass("movable");
                                $tbody = o.func.drawTable($div, false);
                                $trChild = $("<tr></tr>");
                                keyLength = json[key].length;
                                if (keyLength > 1) {
                                    var $left = $("<a></a>").addClass("left").attr("href", "#"),
                                        $right = $("<a></a>").addClass("right").attr("href", "#"),
                                        tableWidth = 100 + ((keyLength - 1)*opt.widthPercentage);
                                    $("<i></i>").addClass("fa fa-caret-left").appendTo($left);
                                    $("<i></i>").addClass("fa fa-caret-right").appendTo($right);
                                    $left.on("mousedown", function (e) {
                                        e.preventDefault()
                                        o.timeoutId = setInterval(o.evnt.leftScroller.bind($left), 1);
                                    }).on("mouseup mouseleave", function (e) {
                                        e.preventDefault();
                                        o.timeoutId && clearTimeout(o.timeoutId);
                                    }).appendTo($tdDiv);
                                    $right.on("mousedown", function (e) {
                                        e.preventDefault()
                                        o.timeoutId = setInterval(o.evnt.rightScroller.bind($right), 1);
                                    }).on("mouseup mouseleave", function (e) {
                                        e.preventDefault();
                                        o.timeoutId && clearTimeout(o.timeoutId);
                                    }).appendTo($tdDiv);
                                    $div.css("width", tableWidth + "%");
                                }
                                for (var index in json[key]) {
                                    headerIndex = parseInt(index) + 1;
                                    $tdChild = $("<td></td>");
                                    if ($.isPlainObject(json[key][index]) || $.isArray(json[key][index])) {
                                        o.func.drawJSON(json[key][index], o.func.drawTable($tdChild, false), level + 1, key + " (" + headerIndex + ")");
                                    } else {
                                        $tdChild.addClass("v").text(json[key][index]);
                                    }
                                    $tdChild.appendTo($trChild);
                                }
                                $trChild.appendTo($tbody);
                                $div.appendTo($tdDiv);
                                $tdDiv.appendTo($td);
                                $td.appendTo($tr);
                            } else if ($.isPlainObject(json[key])){
                                $td = $("<td></td>").addClass("o");
                                o.func.drawJSON(json[key], o.func.drawTable($td, false), level + 1, key);
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
                        data = $this.data(),
                        $div =$("<div></div>");

                    $div.JSON2Table({
                        json: data.json,
                        displayLevel: opt.displayLevel
                    });
                    bootbox.dialog({
                        title: data.key,
                        message: $div
                    });
                },
                rightScroller: function () {
                    var $this = $(this),
                        $parent = $this.parent(),
                        $movable = $parent.find(">div.movable"),
                        left = $movable.position().left - 5;

                    if (left >= 0) {
                        left = 0;
                    } else if ($movable.width() + left < $parent.width()) {
                        left = $parent.width() - $movable.width();
                    }
                    $movable.css("left", left);
                },
                leftScroller: function () {
                    var $this = $(this),
                        $parent = $this.parent(),
                        $movable = $parent.find(">div.movable"),
                        left = $movable.position().left + 5;
                    if (left >= 0) {
                        left = 0;
                    }
                    $movable.css("left",  left);
                }
            }
        }
		o.func.init();
    }
}).call(window, jQuery, document);