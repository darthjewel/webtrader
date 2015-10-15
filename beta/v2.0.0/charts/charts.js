define(["jquery","charts/chartingRequestMap","websockets/eventSourceHandler","websockets/ohlc_handler","currentPriceIndicator","common/util","highstock","highcharts-exporting"],function(a,b,c,d,e){"use strict";function f(d,e,f){if(e&&f){var g=(f+e).toUpperCase();if(b[g]){for(var h in b[g].chartIDs){var i=b[g].chartIDs[h];if(i.containerIDWithHash==d){b[g].chartIDs.splice(h,1);break}}a.isEmptyObject(b[g].chartIDs)&&(c.send({forget:b[g].tickStreamingID}),a(document).stopTime(b[g].timerHandler),delete b[g])}}}a(function(){Highcharts.setOptions({global:{useUTC:!0}})});b.barsTable;return{drawChart:function(b,f,g,h,i,j,k){a(b).highcharts()&&(this.destroy(b,h,f),a(b).highcharts().destroy()),a(b).data({instrumentCode:f,instrumentName:g,timeperiod:h,type:i}),a(b).highcharts("StockChart",{chart:{events:{load:function(){this.showLoading(),e.init(),c.execute(function(){d.retrieveChartDataAndRender(h,f,b,i,g,j)}),k&&k()}}},plotOptions:{candlestick:{lineColor:"black",color:"red",upColor:"green",upLineColor:"black",shadow:!0}},title:{text:g+" ("+h+")"},credits:{href:"http://www.binary.com",text:"Binary.com"},xAxis:{events:{afterSetExtremes:function(){}}},yAxis:[{opposite:!1,labels:{formatter:function(){return a(b).data("overlayIndicator")?(this.value>0?" + ":"")+this.value+"%":this.value}}}],rangeSelector:{enabled:!1},tooltip:{crosshairs:[{width:2,color:"red",dashStyle:"dash"},{width:2,color:"red",dashStyle:"dash"}],enabled:!0,enabledIndicators:!0},exporting:{enabled:!1}})},destroy:f,triggerReflow:function(b){a(b).highcharts()&&a(b).highcharts().reflow()},refresh:function(b){var c=a(b).highcharts(),d=[],e=void 0;a(c.series).each(function(b,c){a(c).data("isInstrument")&&(d.push(c.name),e=c.options.compare)}),this.drawChart(b,a(b).data("instrumentCode"),a(b).data("instrumentName"),a(b).data("timeperiod"),a(b).data("type"),e);var f=this;require(["instruments/instruments"],function(c){a(d).each(function(d,e){var g=c.getSpecificMarketData(e);void 0!=g.symbol&&a.trim(g.symbol)!=a(b).data("instrumentCode")&&f.overlay(b,g.symbol,e)})})},addIndicator:function(b,c){if(a(b).highcharts()){var d=a(b).highcharts(),e=d.series[0];e&&d.addIndicator(a.extend({id:e.options.id},c))}},overlay:function(b,f,g){if(a(b).highcharts()){var h=a(b).highcharts(),i=a(b).data("timeperiod"),j=a(b).data("type");h.showLoading();for(var k=0;k<h.series.length;k++){var l=h.series[k];if(a(l).data("isInstrument")){var m=l.options.data;l.setData([]);for(var n=0;n<m.length;n++)m[n].x&&m[n].y&&(m[n]=[m[n].x,m[n].y]);l.update({compare:"percent"}),l.setData(m),a(l).data("isInstrument",!0)}else a(l).data("onChartIndicator")&&l.update({compare:"percent"})}e.init(),c.execute(function(){d.retrieveChartDataAndRender(i,g,b,j,g,"percent")})}}}});