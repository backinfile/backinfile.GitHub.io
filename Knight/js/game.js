var GlobalCoor = {
    rate: 1,
    offset: [0, 0],
    windowSize: [],

    cardSize: [143, 200],

    borderRadius: 5,

    slotShrink: 0.7, // 储备区的卡牌缩放
    slotCenterOffset: [20, -20], //储备区的卡牌间隔
    slotOffset: [0, -40], // 所有储备区整体的偏移

    get: function(attr) {
        if (Array.isArray(this[attr])) {
            return [this.rate * (this[attr][0] + this.offset[0]), this.rate * (this[attr][1] + this.offset[1])];
        } else {
            return this.rate * (this[attr] + this.offset[0]);
        }
    },

    init: function() {
        let stdx = 1536;
        let stdy = 754;
        this.windowSize = [window.innerWidth, window.innerHeight];
        let flagx = window.innerWidth > stdx ? 1 : -1;
        let flagy = window.innerHeight > stdy ? 1 : -1;
        let ratex = window.innerWidth / stdx;
        let ratey = window.innerHeight / stdy;
        let dx = Math.abs(window.innerWidth - stdx);
        let dy = Math.abs(window.innerHeight - stdy);
        this.rate = ratex > ratey ? ratey : ratex;

        keys = Object.keys(this);
        keys.remove("rate");
        keys.remove("offset");
        keys.remove("windowSize");
        keys.remove("get");
        keys.remove("init");
        var my = this;
        keys.forEach(function(key) {
            my[key] = my.get(key);
        });

    }
}

var GlobalLoopCall = {
    inter: null,
    loopList: [],
    start: function() {
        var my = this;
        my.inter = setInterval(function() {
            my.loopList.forEach(loop => {
                loop[1].call(loop[0]);
            });
        }, 1000 / 60);
    },
    add: function(obj, func) {
        this.loopList.push([obj, func]);
    }
}

class Game {
    constructor() {
        this.GameInit();

        // $.cookie('name', null);
        // $.cookie('name', name, { expires: 7 });
        let name = $.cookie("name") || "DD";
        // console.log($.cookie("name"));
        $("#name").val(name);
        let hero = $.cookie("herono") || 22;
        $("#hero").val(hero);
    }
    getSlotPosition(hero, pos) {
        // hero:0 1
        // pos:0~4
        let screenCenterX = GlobalCoor.windowSize[0] / 2;
        let screenCenterY = GlobalCoor.windowSize[1] / 2;

        if (hero == 0) {
            let x = screenCenterX + GlobalCoor.slotOffset[0] + (pos - 2) * (GlobalCoor.cardSize[0] + GlobalCoor.slotCenterOffset[0]);
            let y = screenCenterY + GlobalCoor.slotCenterOffset[1] + GlobalCoor.cardSize[1] / 2 + GlobalCoor.slotOffset[1];
            return [x, y];
        } else {
            let x = screenCenterX + GlobalCoor.slotOffset[0] + (2 - pos) * (GlobalCoor.cardSize[0] + GlobalCoor.slotCenterOffset[0]);
            let y = screenCenterY - GlobalCoor.slotCenterOffset[1] - GlobalCoor.cardSize[1] / 2 + GlobalCoor.slotOffset[1];
            return [x, y];
        }
    }
    GameStart() {

    }
    tip(show = false, message = null) {
        if (show) {
            $("#tip-body").html(message);
            $("#tipmodal").modal("show");
        } else {
            $("#tipmodal").modal("hide");
        }
    }
    GameInit() {
        let my = this;
        GlobalCoor.init();
        GlobalLoopCall.start();

        this.tip(true, "加载中...");

        Resources.CardData.forEach(function(data, index) {
            if (data.type == "人物") {
                $("#hero").append($("<option>").html(data.name).val(index));
            }
        });
        Resources.ready(function(per) {
            my.tip(true, "加载中..." + "(" + (per * 100 + "").slice(0, 4) + "%)");
            if (per >= 1) {
                my.tip(false);
                setTimeout(() => {
                    $("#interface").modal("show");
                }, 500);
            }
        });

        $("#searchbtn").click(function() {
            let $btn = $(this);
            $btn.button("loading");
            let name = delHtmlTag($("#name").val());
            name = name.slice(0, 6);
            let herono = $("#hero").val();
            this.net = new Net("ws://127.0.0.1:8800", { name: name, herono: herono }, function() {
                console.log("onopen");
                $("#interface").modal("hide");
                my.GameStart();
            }, function(e) {
                console.log("onmessage");
            }, function() {
                console.log("onclose");
                $btn.html("服务器连接失败");
                setTimeout(function() {
                    $btn.button("reset");
                }, 5000);
            });
            // $(this).button("reset");
        });
    }

}

class Net {
    constructor(url, args, onopen = null, onmessage = null, onclose = null) {
        var queryUrl = url + "?" + Object.keys(args).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
        }).join('&');
        console.log(queryUrl);
        this.ws = new WebSocket(queryUrl);
        let ws = this.ws;
        ws.onopen = onopen;
        ws.onclose = onclose;
        ws.onmessage = onmessage;
        // ws.onopen = function() {

        // };
        // ws.onclose = function() {};
        // ws.onmessage = function(e) {
        //     var msg = JSON.parse(e.data);
        // };
        // ws.send(JSON.stringify({ 'type': 'chat', 'position': 'opponent', 'content': msg }));
    }
    onopen(func) {
        this.ws.onopen = func;
    }
    onclose(func) {
        this.ws.onclose = func;
    }
    onmessage(func) {
        this.ws.onmessage = func;
    }
    send(message_json) {
        ws.send(JSON.stringify(message_json));
    }
}



$(function() {
    // $('#interface').modal('show');
    // $('#interface').hide();
    new Game();
    // let card = new Card("img/圣殿-风元素.jpg", "img/卡背-牌堆.jpg");
    // let state = 2;
    // card.setClickState(true, function() {
    //     state = 6 - state;
    //     card.setBorderState(state);
    // });
});


// var game = new Game();

// let pos = game.getSlotPosition(0, 4);
// let pos2 = game.getSlotPosition(1, 4);

// var card = new Card("img/人物-元素使者.jpg", "img/卡背-人物.jpg");
// var card2 = new Card("img/人物-元素使者.jpg", "img/卡背-人物.jpg");
// card.rotateY(180).rotateZ(-90).rotateZ(0).rotateY(0)
//     .scale(GlobalCoor.slotShrink)
//     .move(pos[0], pos[1])
//     .callback(function() { console.log("in"); });

// card2.move(pos2[0], pos2[1]).scale(GlobalCoor.slotShrink);


// card.setClickState(true, function() {
//     console.log("innn");
// });

// card.setDragState(false, function() {
//     console.log("dragStart");
// }, function() {
//     console.log("dragEnd");
// });