define(["jquery","windows/windows","common/rivetsExtra","lodash","common/util"],function(a,b,c){function d(d){d=a(d);var f=e(d);h=c.bind(d[0],f),g=b.createBlankWindow(d,{title:"Configurations",resizable:!1,collapsable:!1,minimizable:!1,maximizable:!1,modal:!0,ignoreTileAction:!0,open:function(){var a=local_storage.get("config");a&&a.app_id&&(f.app_id=a.app_id),a&&a.server_url&&(f.server_url=a.server_url)},close:function(){h&&h.unbind(),g&&g.dialog("destroy").remove(),h=g=null},buttons:[{text:"Apply",icons:{primary:"ui-icon-check"},click:f.apply},{text:"Reset to Defaults",icons:{primary:"ui-icon-refresh"},click:f.reset}]}),g.dialog("open")}function e(){var b={websocket_url:"ws.binaryws.com",oauth_url:"oauth.binary.com",app_id:""};return b.apply=function(){var a={server_url:b.server_url,websocket_url:"wss://"+b.websocket_url+"/websockets/v3?l=EN",oauth_url:"https://"+b.oauth_url+"/oauth2/authorize",app_id:b.app_id};local_storage.set("config",a),b.reload_page()},b.reset=function(){local_storage.remove("config"),b.reload_page()},b.reload_page=function(){a.growl.notice({message:"Config changes successfull.<br/>Reloading page ..."}),setTimeout(function(){window.location.reload()},900)},b}function f(a){a.click(function(){g?g.moveToTop():require(["text!config/config.html"],d)})}require(["text!config/config.html"]),require(["css!config/config.css"]);var g=null,h=null;return{init:f}});