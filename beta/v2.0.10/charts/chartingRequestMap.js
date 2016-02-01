define(["lokijs","lodash","jquery","websockets/binary_websockets","common/util"],function(a,b,c,d){function e(a){var b=a;if(this[b]&&this[b].chartIDs){var d=this[b].chartIDs,e=this.processOHLC;d.forEach(function(a){if(a){var d=c(a.containerIDWithHash).highcharts().get(b),f=c(a.containerIDWithHash).data("type");if(d){var h=d.data[d.data.length-1].x||d.data[d.data.length-1].time,i=g.chain().find({instrumentCdAndTp:b}).where(function(a){return a.time>=h}).simplesort("time",!1).data();for(var j in i){for(var k=i[j],l=void 0,m=d.data.length-1;m>=0;m--){var n=d.data[m];if(n&&k.time==(n.x||n.time)){l=n;break}}l?f&&isDataTypeClosePriceOnly(f)?l.update([k.time,k.close],!1):l.update([k.time,k.open,k.high,k.low,k.close],!1):f&&isDataTypeClosePriceOnly(f)?d.addPoint([k.time,k.close],!1,!0):d.addPoint([k.time,k.open,k.high,k.low,k.close],!1,!0)}d.isDirty=!0,d.isDirtyData=!0,d.chart.redraw()}else{var o=c(a.containerIDWithHash).highcharts(),p=[],i=g.chain().find({instrumentCdAndTp:b}).simplesort("time",!1).data();for(var q in i)e(i[q].open,i[q].high,i[q].low,i[q].close,i[q].time,f,p);if(!o)return;var r=p.length,s=p.length>30?r-30:0,t=a.instrumentName,u=a.series_compare,v=0;o.series.forEach(function(a){a.options.isInstrument&&"navigator"!==a.options.id&&++v}),0===v&&(o.xAxis[0].range=p[r-1][0]-p[s][0]);var w={id:b,name:t,data:p,type:f?f:"candlestick",dataGrouping:{enabled:!1},compare:u,states:{hover:{enabled:!1}},isInstrument:!0};(isLineDotType(f)||isDotType(f))&&(w.type="line",isDotType(f)&&(w.dashStyle="dot"),w.marker={enabled:!isDotType(f),radius:4}),o.addSeries(w)}}})}}var f=new a,g=f.addCollection("bars_table");return{barsTable:g,processOHLC:function(a,b,d,e,f,g,h){if(!(h.length>0&&h[h.length-1][0]>f))if(g&&isDataTypeClosePriceOnly(g)){if(!c.isNumeric(f)||!c.isNumeric(e))return;h.push([f,e])}else{if(!(c.isNumeric(f)&&c.isNumeric(a)&&c.isNumeric(b)&&c.isNumeric(d)&&c.isNumeric(e)))return;h.push([f,a,b,d,e])}},barsLoaded:e,keyFor:function(a,b){var c=b||0;return"string"==typeof c&&(c=convertToTimeperiodObject(c).timeInSeconds()),(a+c).toUpperCase()},register:function(a){var b=this,e=b.keyFor(a.symbol,a.granularity),f=a.granularity||0,g=a.style||"ticks",h=!0;"string"==typeof f&&("0"===c.trim(f)||("1t"===c.trim(f).toLowerCase()?f=convertToTimeperiodObject(f).timeInSeconds():(h=!1,f=convertToTimeperiodObject(f).timeInSeconds())));var i={ticks_history:a.symbol,granularity:f,subscribe:a.subscribe||0,count:a.count||1,end:"latest",style:g};if(!h){var j=a.count||1,k=(new Date).getTime()/1e3-j*f|0,l=new Date;l.setUTCFullYear(l.getUTCFullYear()-3),l.setDate(l.getDate()+1),1e3*k<l.getTime()&&(k=l.getTime()/1e3|0),i.style="candles",i.start=k,i.adjust_start_time=a.adjust_start_time||1}return b[e]={symbol:a.symbol,granularity:f,subscribers:0,chartIDs:[]},i.subscribe&&(b[e].subscribers=1),d.send(i,3e4)["catch"](function(a){throw delete b[e],a})},subscribe:function(a,b){var c=this;c[a]&&(c[a].subscribers+=1,b&&c[a].chartIDs.push(b))},unregister:function(a,c){var e=this;e[a]&&(c&&b.remove(e[a].chartIDs,{containerIDWithHash:c}),e[a].subscribers-=1,0===e[a].chartIDs.length&&e[a].timerHandler&&(clearInterval(e[a].timerHandler),e[a].timerHandler=null),0===e[a].subscribers&&e[a].id&&d.send({forget:e[a].id})["catch"](function(a){}),0===e[a].subscribers&&delete e[a])},removeChart:function(a,c){var d=this;d[a]&&b(d[a].chartIDs).map("containerIDWithHash").contains(c)&&(d[a].subscribers-=1,b.remove(d[a].chartIDs,{containerIDWithHash:c}))}}});