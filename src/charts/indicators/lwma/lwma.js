﻿/**
Created By Mahboob.M on 12/22/2015
*/

define(["jquery", "jquery-ui", 'color-picker', 'ddslick'], function ($) {

    var before_add_callback = null;

    function closeDialog() {
        $(this).dialog('close');
    }

    function init(containerIDWithHash, _callback) {
        require(['css!charts/indicators/lwma/lwma.css']);

        require(['text!charts/indicators/lwma/lwma.html', 'text!charts/indicators/indicators.json'], function ($html, data) {

            $html = $($html);

            $html.appendTo("body");

            data = JSON.parse(data);
            var current_indicator_data = data.lwma;
            $html.attr('title', current_indicator_data.long_display_name);
            $html.find('.lwma-description').html(current_indicator_data.description);

            $html.find("#lwma_stroke_color").each(function () {
                $(this).colorpicker({
                    position: {
                        at: "right+100 bottom",
                        of: "element",
                        collision: "fit"
                    },
                    part: {
                        map: { size: 128 },
                        bar: { size: 128 }
                    },
                    select: function (event, color) {
                        $(this).css({
                            background: '#' + color.formatted
                        }).val('');
                        $(this).data("color", '#' + color.formatted);
                    },
                    ok: function (event, color) {
                        $(this).css({
                            background: '#' + color.formatted
                        }).val('');
                        $(this).data("color", '#' + color.formatted);
                    }
                });
            });

            var selectedDashStyle = "Solid";
            $('#lwma_dash_style').ddslick({
                imagePosition: "left",
                width: 150,
                background: "white",
                onSelected: function (data) {
                    $('#lwma_dash_style .dd-selected-image').css('max-width', '115px');
                    selectedDashStyle = data.selectedData.value
                }
            });
            $('#lwma_dash_style .dd-option-image').css('max-width', '115px');

            $html.dialog({
                autoOpen: false,
                resizable: false,
                width: 350,
                height: 400,
                modal: true,
                my: "center",
                at: "center",
                of: window,
                dialogClass: 'lwma-ui-dialog',
                buttons: [
					{
					    text: "OK",
					    click: function () {
					         var $elem = $(".lwma_input_width_for_period");
					         if (!_.isInteger(_.toNumber($elem.val())) || !_.inRange($elem.val(),
                                             parseInt($elem.attr("min")),
                                             parseInt($elem.attr("max")) + 1)) {
					             require(["jquery", "jquery-growl"], function ($) {
					                 $.growl.error({
					                     message: "Only numbers between " + $elem.attr("min")
                                                 + " to " + $elem.attr("max")
                                                 + " is allowed for " + $elem.closest('tr').find('td:first').text() + "!"
					                 });
					             });
                                 $elem.val($elem.prop("defaultValue"));
					             return;
					         };

					        var options = {
					            period: parseInt($("#lwma_period").val()),
					            stroke: $("#lwma_stroke_color").css("background-color"),
					            strokeWidth: parseInt($("#lwma_stroke_width").val()),
					            dashStyle: selectedDashStyle,
					            appliedTo: parseInt($html.find("#lwma_appliedTo").val())
					        }

                            before_add_callback && before_add_callback();
					        //Add LWMA to the main series
					        $($(".lwma").data('refererChartID')).highcharts().series[0].addIndicator('lwma', options);

					        closeDialog.call($html);
					    }
					},
					{
					    text: "Cancel",
					    click: function () {
					        closeDialog.call(this);
					    }
					}
                ]
            });
            $html.find('select').each(function(index, value){
                $(value).selectmenu({
                    width : 150
                }).selectmenu("menuWidget").css("max-height","85px");
            });

            if ($.isFunction(_callback)) {
                _callback(containerIDWithHash);
            }

        });
    }

    return {
        open: function (containerIDWithHash, before_add_cb) {
            var open = function() {
                before_add_callback = before_add_cb;
                $(".lwma").data('refererChartID', containerIDWithHash).dialog( "open" );
            };
            if ($(".lwma").length == 0)
                init( containerIDWithHash, this.open );
            else
                open();
        }
    };
});
