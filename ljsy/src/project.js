window.__require=function t(o,i,e){function n(h,r){if(!i[h]){if(!o[h]){var c=h.split("/");if(c=c[c.length-1],!o[c]){var a="function"==typeof __require&&__require;if(!r&&a)return a(c,!0);if(s)return s(c,!0);throw new Error("Cannot find module '"+h+"'")}}var u=i[h]={exports:{}};o[h][0].call(u.exports,function(t){return n(o[h][1][t]||t)},u,u.exports,t,o,i,e)}return i[h].exports}for(var s="function"==typeof __require&&__require,h=0;h<e.length;h++)n(e[h]);return n}({Door:[function(t,o,i){"use strict";cc._RF.push(o,"f500cKKEzJBE4CMt1j0LGeM","Door"),cc.Class({extends:cc.Component,properties:{openedDoor:{default:null,type:cc.Prefab}},onLoad:function(){this.node.on("touchstart",function(t){if(!this.game.getComponent("GameController").isZoomed){var o=cc.instantiate(this.openedDoor);o.setPosition(this.node.getPosition()),o.setRotation(this.node.getRotation()),this.game.node.addChild(o),this.game.getComponent("GameController").aims.push(this.aim),this.node.destroy()}},this)},start:function(){},onDestroy:function(){this.node.off("touchstart")}}),cc._RF.pop()},{}],GameController:[function(t,o,i){"use strict";cc._RF.push(o,"18880Ha/+VAMqE9Y1Sv4yvR","GameController"),cc.Class({extends:cc.Component,properties:{room:{default:null,type:cc.Prefab},door:{default:null,type:cc.Prefab},openedDoor:{default:null,type:cc.Prefab},disabledDoor:{default:null,type:cc.Prefab},camera:{default:null,type:cc.Node},cameraZoom:{default:null,type:cc.Camera},text:{default:null,type:cc.RichText}},onLoad:function(){this.rooms={},this.aims=[],this.initGame(),this.canOpenDoor=!0,this.isZoomed=!1},start:function(){},update:function(t){if(this.aims.length>0){cc.log(this.aims[0]);var o=this.aims.shift();this.getRoom(o.x,o.y,o.from),this.camera.runAction(cc.moveTo(.5,this.getRoomPosition(o.x,o.y)).easing(cc.easeCubicActionInOut())),cc.log(this.camera.x,this.camera.y)}},initGame:function(){this.tmpRoom=cc.instantiate(this.room),this.newRoom(0,0,3,this.getStartRoomData())},showMore:function(){this.isZoomed?(this.cameraZoom.zoomRatio=1,this.text.string="<b><color=#00ff00>OPEN</c></b>",this.isZoomed=!1):(this.cameraZoom.zoomRatio=.5,this.text.string="<b><color=#00ff00>CLOSE</c></b>",this.isZoomed=!0)},buildRoom:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=cc.instantiate(this.room);i.setPosition(t*i.width,o*i.height);var e=i.getComponent("Room");return e.game=this,e.aim={x:t,y:o},this.node.addChild(i),i},getRoomPosition:function(t,o){return cc.v2(t*this.tmpRoom.width,o*this.tmpRoom.height)},buildDoor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,e=arguments.length>3&&void 0!==arguments[3]&&arguments[3],n=[-1,0,1,0],s=[0,1,0,-1],h=cc.instantiate(this.door);this.node.addChild(h);var r=h.getComponent("Door");r.game=this,r.aim={x:t+n[i],y:o+s[i],from:this.getOppositeDir(i)},h.setPosition(t*this.tmpRoom.width+n[i]*(this.tmpRoom.width/2-h.width/2),o*this.tmpRoom.height+s[i]*(this.tmpRoom.height/2-h.height/2)),h.setRotation([270,0,90,180][i]+(e?180:0))},buildOpenedDoor:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,e=arguments.length>3&&void 0!==arguments[3]&&arguments[3],n=cc.instantiate(this.openedDoor);this.node.addChild(n),n.setPosition(t*this.tmpRoom.width+[-1,0,1,0][i]*(this.tmpRoom.width/2-n.width/2),o*this.tmpRoom.height+[0,1,0,-1][i]*(this.tmpRoom.height/2-n.height/2)),n.setRotation([270,0,90,180][i]+(e?180:0))},getOppositeDir:function(t){return t%2?4-t:2-t},newRoom:function(t,o,i,e){for(var n=[0,1,2,3],s=0;s<(i+1)%4;s++)n.push(n.shift());for(var h=this.buildRoom(t,o),r=0;r<4;r++)e[r]&&(i==n[r]?this.buildOpenedDoor(t,o,n[r],i==n[r]):this.buildDoor(t,o,n[r],i==n[r]));return h},getRandomRoomData:function(){return[this.randint(0,1),this.randint(0,2),this.randint(0,1),1]},getStartRoomData:function(){return[0,1,0,0]},randint:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return o++,Math.floor(Math.random()*(o-t))+t},getRoom:function(t,o){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3,e=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;return this.rooms[t]||(this.rooms[t]={}),this.rooms[t][o]||(e=e||this.getRandomRoomData(),this.rooms[t][o]=this.newRoom(t,o,i,e)),this.rooms[t][o]}}),cc._RF.pop()},{}],Room:[function(t,o,i){"use strict";cc._RF.push(o,"18240m/VmRMfZeTvEtzjzDA","Room"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){this.touching=!1,this.counter=0,this.isMoved=!1,this.gameController=this.game.getComponent("GameController"),this.node.on("touchstart",this.onTouchStart,this),this.node.on("touchmove",this.onTouchMove,this),this.node.on("touchend",this.onTouchEnd,this)},start:function(){},update:function(t){this.touching&&(this.counter+=t)},onTouchStart:function(t){this.gameController.isZoomed?(this.touching=!0,this.counter=0,this.isMoved=!1):this.touching=!1},onTouchMove:function(t){if(this.touching){var o=t.getDelta(),i=this.gameController.camera.getPosition();this.gameController.camera.setPosition(i.sub(o).sub(o)),this.isMoved=!0}},onTouchEnd:function(){if(this.touching&&!this.isMoved&&this.counter<5){var t=cc.callFunc(this.gameController.showMore,this.gameController),o=cc.moveTo(.5,this.node.getPosition()).easing(cc.easeCubicActionInOut());this.gameController.camera.runAction(cc.sequence(o,t))}this.touching=!1},onDestroy:function(){this.node.off("touchstart"),this.node.off("touchmove"),this.node.off("touchend")}}),cc._RF.pop()},{}]},{},["Door","GameController","Room"]);