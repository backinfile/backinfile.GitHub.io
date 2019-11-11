var Resources = (function() {
    var loadImageList = [];
    var isloaded = false;
    return {
        collectImages: function() {
            Resources.CardData.forEach(data => {
                loadImageList.uniquePush(data.frontUrl);
                loadImageList.uniquePush(data.backUrl);
            });
        },
        ready: function(callback) {
            this.collectImages();

            var total = loadImageList.length;
            isloaded = true;
            var cnt = 0;
            for (let i = 0; i < loadImageList.length; i++) {
                var img = new Image();
                img.onload = function() {
                    cnt++;
                    if (cnt >= loadImageList.length) {
                        if (callback) callback(1);
                    } else {
                        if (callback) callback(cnt / (loadImageList.length));
                        // $('#per').html(Math.floor(cnt/total*100)+'%');
                    }
                };
                img.src = loadImageList[i];
            }
        }
    };
})();



Resources.CardData = [
    { "name": "风", "party": 0, "type": "元素", "num": 4, "frontUrl": "img/圣殿-风元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "地", "party": 0, "type": "元素", "num": 4, "frontUrl": "img/圣殿-地元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "水", "party": 0, "type": "元素", "num": 4, "frontUrl": "img/圣殿-水元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "火", "party": 0, "type": "元素", "num": 4, "frontUrl": "img/圣殿-火元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "雷", "party": 0, "type": "元素", "num": 4, "frontUrl": "img/圣殿-雷元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "光", "party": 0, "type": "元素", "num": 4, "frontUrl": "img/圣殿-光元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "暗", "party": 0, "type": "元素", "num": 4, "frontUrl": "img/圣殿-暗元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "初级魔法", "party": 0, "type": "行动", "num": 9, "frontUrl": "img/圣殿-初级.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "中级魔法", "party": 0, "type": "行动", "num": 6, "frontUrl": "img/圣殿-中级.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "高级魔法", "party": 0, "type": "行动", "num": 2, "frontUrl": "img/圣殿-高级.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "禁咒", "party": 0, "type": "行动", "num": 1, "frontUrl": "img/圣殿-禁咒.jpg", "backUrl": "img/卡背-牌堆.jpg" },

    { "name": "风", "party": 1, "type": "元素", "num": 4, "frontUrl": "img/学院-风元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "地", "party": 1, "type": "元素", "num": 4, "frontUrl": "img/学院-地元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "水", "party": 1, "type": "元素", "num": 4, "frontUrl": "img/学院-水元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "火", "party": 1, "type": "元素", "num": 4, "frontUrl": "img/学院-火元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "雷", "party": 1, "type": "元素", "num": 4, "frontUrl": "img/学院-雷元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "光", "party": 1, "type": "元素", "num": 4, "frontUrl": "img/学院-光元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "暗", "party": 1, "type": "元素", "num": 4, "frontUrl": "img/学院-暗元素.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "初级魔法", "party": 1, "type": "行动", "num": 9, "frontUrl": "img/学院-初级.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "中级魔法", "party": 1, "type": "行动", "num": 6, "frontUrl": "img/学院-中级.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "高级魔法", "party": 1, "type": "行动", "num": 2, "frontUrl": "img/学院-高级.jpg", "backUrl": "img/卡背-牌堆.jpg" },
    { "name": "禁咒", "party": 1, "type": "行动", "num": 1, "frontUrl": "img/学院-禁咒.jpg", "backUrl": "img/卡背-牌堆.jpg" },

    { "name": "元素使者", "no": 0, "type": "人物", "num": 1, "frontUrl": "img/人物-元素使者.jpg", "backUrl": "img/卡背-人物.jpg" },
    { "name": "冰原女王", "no": 1, "type": "人物", "num": 1, "frontUrl": "img/人物-冰原女王.jpg", "backUrl": "img/卡背-人物.jpg" },
    { "name": "圣剑骑士", "no": 2, "type": "人物", "num": 1, "frontUrl": "img/人物-圣剑骑士.jpg", "backUrl": "img/卡背-人物.jpg" },
];