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
                data: {
                    "Your Key": "Your Value"
                },
                drawResponsive: true,
                displayLevel: 0,
                widthPercentage: 30,
                _callResize: true
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
            $window: $(window),
            $movableDivs: $(),
            func: {
                init: function () {
                    o.func.resetAll();
                    //o.func.drawToggleView(o.$me);
                    o.func.drawInitial(opt, "data", o.$me, 0);
                    o.evnt.windowResize();
                },
                resetAll: function () {
                    if (opt.displayLevel === 0) {
                        opt.displayLevel = Infinity;
                    }
                    o.$me.addClass("json-2-table").empty();
                },
                drawInitial: function (json, key, $container, level) {
                    var $tbody = o.func.drawTable($container, true);
                    if ($.isArray(json[key])) {
                        o.func.drawArray(json, key, $tbody, level);
                    } else if ($.isPlainObject(json[key])){
                        o.func.drawJSON(json, key, $tbody, level);
                    } else {
                        bootbox.alert("You have enter wrong JSON Object.");
                    }
                },
                drawTable: function ($container, border) {
                    var $table = $("<table></table>").addClass("table"),
                        $tbody = $("<tbody></tbody>");
                    border && $table.addClass("table-bordered");
                    $tbody.appendTo($table);
                    $table.appendTo($container);
                    return $tbody;
                },
                drawArray: function (json, key, $container, level) {
                    var $tr = $("<tr></tr>"), $td, boxResult, $tdDiv, $div, $tbody, $trChild, arrLength;
                    if (opt.drawResponsive) {
                        $td = $("<td></td>").addClass("o");
                        $tdDiv = $("<div></div>").addClass("scrollable");
                        $div = $("<div></div>").addClass("movable").hide();
                        o.$movableDivs = o.$movableDivs.add($div);
                        $tbody = o.func.drawTable($div, true);
                        $trChild = $("<tr></tr>");
                        arrLength = json[key].length;
                        if (arrLength > 1) {
                            var $left = $("<a></a>").addClass("left").attr("href", "#"),
                                $right = $("<a></a>").addClass("right").attr("href", "#"),
                                tableWidth = 100 + ((arrLength - 1)*opt.widthPercentage);
                            $("<i></i>").addClass("fa fa-caret-left").appendTo($left);
                            $("<i></i>").addClass("fa fa-caret-right").appendTo($right);
                            $left.on("mousedown", function (e) {
                                e.preventDefault()
                                o.timeoutId = setInterval(o.evnt.leftScroller.bind($left), 1);
                            }).on("mouseup mouseleave", function (e) {
                                e.preventDefault();
                                o.timeoutId && clearTimeout(o.timeoutId);
                            }).on("click", o.evnt.clickPrevent).appendTo($tdDiv);
                            $right.on("mousedown", function (e) {
                                e.preventDefault()
                                o.timeoutId = setInterval(o.evnt.rightScroller.bind($right), 1);
                            }).on("mouseup mouseleave", function (e) {
                                e.preventDefault();
                                o.timeoutId && clearTimeout(o.timeoutId);
                            }).on("click", o.evnt.clickPrevent).appendTo($tdDiv);
                            $div.css("width", tableWidth + "%");
                        }
                        $trChild.appendTo($tbody);
                        $div.appendTo($tdDiv);
                        $tdDiv.appendTo($td);
                        $td.appendTo($tr);
                    } else {
                        $trChild = $tr;
                    }
                    for (var i in json[key]) {
                        $td = $("<td></td>");
                        boxResult = o.func.drawBoxButton(json[key], i, $td, level);
                        if (!boxResult.isDraw) {
                            if (boxResult.isArray) {
                                o.func.drawArray(json[key], i, o.func.drawTable($td.addClass("o"), true), level + 1);
                            } else if (boxResult.isPlainObject){
                                o.func.drawJSON(json[key], i, o.func.drawTable($td.addClass("o"), true), level + 1);
                            } else {
                                $td.addClass("v").text(json[key][i]);
                            }
                        }
                        $td.appendTo($trChild);
                    }
                    $tr.appendTo($container);
                },
                drawJSON: function (json, key, $container, level) {
                    var k, $tr, $td, boxResult;
                    for (k in json[key]) {
                        $tr = $("<tr></tr>");
                        $("<td></td>").addClass("k").text(k).appendTo($tr);
                        $td = $("<td></td>");
                        boxResult = o.func.drawBoxButton(json[key], k, $td, level);
                        if (!boxResult.isDraw) {
                            if (boxResult.isArray) {
                                o.func.drawArray(json[key], k, o.func.drawTable($td.addClass("o"), true), level + 1);
                            } else if (boxResult.isPlainObject){
                                o.func.drawJSON(json[key], k, o.func.drawTable($td.addClass("o"), true), level + 1);
                            } else {
                                $td.addClass("v").text(json[key][k]);
                            }
                        }
                        $td.appendTo($tr);
                        $tr.appendTo($container);
                    }
                },
                drawBoxButton: function (json, key, $container, level) {
                    var isArray = $.isArray(json[key]),
                        isPlainObject = $.isPlainObject(json[key]);

                    if ((isArray || isPlainObject) && level >= opt.displayLevel) {
                        $("<a></a>").attr("href", "#").text("view more").data({
                            "json": json[key],
                            "key": key
                        }).click(o.evnt.drawJSONInBox).appendTo($container.addClass("v"));
                        return {
                            isDraw: true,
                            isArray:isArray,
                            isPlainObject:isPlainObject
                        };
                    }
                    return {
                        isDraw: false,
                        isArray:isArray,
                        isPlainObject:isPlainObject
                    };
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
                        data: data.json,
                        displayLevel: opt.displayLevel,
                        _callResize: false
                    });
                    bootbox.dialog({
                        title: data.key,
                        message: $div
                    });
                    setTimeout(function () {
                        o.$window.resize();
                    },300)
                },
                clickPrevent: function (e) {
                    e.preventDefault();
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
                },
                windowResize: function () {
                    o.$window.resize(function () {
                        var $parents = o.$movableDivs.parent();
                        o.$movableDivs.hide();
                        $parents.width($parents.width());
                        setTimeout(function () {
                            o.$movableDivs.show();
                        }, 0);
                    });
                    opt._callResize && o.$window.resize();
                }
            }
        }
		o.func.init();
    }
}).call(window, jQuery, document);