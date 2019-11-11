class Card {
    constructor(frontUrl, backUrl) {
        this.cardSize = GlobalCoor.cardSize;
        this.cardWidth = this.cardSize[0];
        this.cardHeight = this.cardSize[1];
        this.frontUrl = frontUrl;
        this.backUrl = backUrl;

        this.animationList = []; // animation list
        this.curAnimation = null;


        this.rotateYVal = 0;
        this.rotateZVal = 0;
        this.scaleVal = 1;
        this.zIndex = 0;
        this.x = 100;
        this.y = 50;

        this.buildDom();
        GlobalLoopCall.add(this, this.nextAnimation);
    }

    buildDom() {
        this.warp = $("<div>").css({
            perspective: "1000px",
            left: this.x,
            top: this.y,
            position: "absolute",
            "border-radius": "5px",
            "z-index": 0,
        });

        this.div = $("<div>").css({
            width: this.cardWidth,
            height: this.cardHeight,
            "backface-visibility": "hidden",
            position: "relative",
            "transform-style": "preserve-3d",
            "background-color": "rgba(0,0,0,0)",
        });


        this.back = $("<div>").css({
            "background-image": "url(" + this.backUrl + ")",
            "background-size": "100% 100%",
            width: this.cardWidth,
            height: this.cardHeight,
            position: "absolute",
            "border-radius": GlobalCoor.borderRadius,
            transform: "rotateY(180deg) translateZ(1px)",

        });

        this.front = $("<div>").css({
            "background-image": "url(" + this.frontUrl + ")",
            "background-size": "100% 100%",
            width: this.cardWidth,
            height: this.cardHeight,
            position: "absolute",
            "border-radius": GlobalCoor.borderRadius,
            transform: "translateZ(1px)",

        });

        this.div.append(this.front);
        this.div.append(this.back);
        this.warp.append(this.div);
        $('#gamebody').append(this.warp);
    }

    setBorderState(type) {
        if (type == 0) {
            this.front.css("box-shadow", '');
        } else if (type == 1) {
            this.front.css("box-shadow", '0px 0px 8px 4px green');
        } else if (type == 2) {
            this.front.css("box-shadow", '0px 0px 8px 4px red');
        } else if (type == 3) {
            this.front.css("box-shadow", '0px 0px 8px 4px black');
        } else if (type == 4) {
            this.front.css("box-shadow", '0px 0px 8px 4px black inset');
        } else {
            this.front.css("box-shadow", '0px 0px 8px 4px ' + type);
        }
    }

    setZIndex(index = -1) {
        this.warp.css("z-index", index + "");
    }

    setPos(x, y) {
        this.warp.css("left", x - this.cardWidth / 2);
        this.warp.css("top", y - this.cardHeight / 2);
        this.x = x;
        this.y = y;
    }

    fadeOut(callback) {
        $(this.warp).fadeOut("fast", callback);
    }
    fadeIn(callback) {
        $(this.warp).fadeIn("fast", callback);
    }

    rotateY(angle) {
        this.animationList.push(['rotateY', angle]);
        return this;
    }
    rotateZ(angle) {
        this.animationList.push(['rotateZ', angle]);
        return this;
    }
    move(ax, ay, speed = 30) {
        this.animationList.push(['move', ax, ay, speed]);
        return this;
    }
    scale(sc = 1) {
        this.animationList.push(["scale", sc]);
        return this;
    }
    wait(t = 0) {
        this.animationList.push(['wait', t]);
        return this;
    }
    callback(func = null) {
        this.animationList.push(["callback", func]);
        return this;
    }
    nextAnimation() {
        var my = this;
        if (this.curAnimation == null) {
            if (this.animationList.length) {
                this.curAnimation = this.animationList.shift();
                this.stepAnimation();
            } else {
                return;
            }
        } else {
            return;
        }
    }
    stepAnimation(animation) {
        var my = this;

        function acRotateY(angle, callback) {
            let step = 8;
            let sign = angle > my.rotateYVal ? 1 : -1;

            var inter = setInterval(function() {
                let curstep = Math.abs(my.rotateYVal - angle);
                if (curstep > step) curstep = step;
                my.rotateYVal += sign * curstep;
                my.div.css("transform",
                    'rotateY(' + my.rotateYVal + 'deg) rotateZ(' + my.rotateZVal + 'deg) scale(' + my.scaleVal + ')');
                if (curstep < step) {
                    clearInterval(inter);
                    my.rotateYVal = angle;
                    setTimeout(callback, 0);
                }
            }, 1000 / 60);
        }

        function acRotateZ(angle, callback) {
            let step = 8;
            let sign = angle > my.rotateZVal ? 1 : -1;

            var inter = setInterval(function() {
                let curstep = Math.abs(my.rotateZVal - angle);
                if (curstep > step) curstep = step;
                my.rotateZVal += sign * curstep;
                my.div.css("transform",
                    'rotateY(' + my.rotateYVal + 'deg) rotateZ(' + my.rotateZVal + 'deg) scale(' + my.scaleVal + ')');
                if (curstep < step) {
                    clearInterval(inter);
                    my.rotateZVal = angle;
                    setTimeout(callback, 0);
                }
            }, 1000 / 60);
        }

        function acScale(sc, callback) {
            let step = 0.05;
            let sign = sc > my.scaleVal ? 1 : -1;

            var inter = setInterval(function() {
                let curstep = Math.abs(my.scaleVal - sc);
                if (curstep > step) curstep = step;
                my.scaleVal += sign * curstep;
                my.div.css("transform",
                    'rotateY(' + my.rotateYVal + 'deg) rotateZ(' + my.rotateZVal + 'deg) scale(' + my.scaleVal + ')');
                if (curstep < step) {
                    clearInterval(inter);
                    my.scaleVal = sc;
                    setTimeout(callback, 0);
                }
            }, 1000 / 60);

        }

        function acMove(ax, ay, speed, callback) {
            my.setZIndex(999 + my.zIndex);
            my.warp.animate({ 'left': ax - my.cardWidth / 2, 'top': ay - my.cardHeight / 2 }, "fast", 'swing', function() {
                my.setZIndex(my.zIndex);
                my.setPos(ax, ay);
                setTimeout(callback, 0);
            });
        }

        function animationEnd() {
            my.curAnimation = null;
        }

        animation = my.curAnimation;
        if (animation[0] == 'rotateY') {
            acRotateY(animation[1], animationEnd);
        } else if (animation[0] == 'rotateZ') {
            acRotateZ(animation[1], animationEnd);
        } else if (animation[0] == 'move') {
            acMove(animation[1], animation[2], animation[3], animationEnd);
        } else if (animation[0] == 'scale') {
            acScale(animation[1], animationEnd);
        } else if (animation[0] == 'wait') {
            setTimeout(function() { animationEnd(); }, animation[1] || 0);
        } else if (animation[0] == 'callback') {
            if (animation[1]) animation[1]();
            animationEnd();
        } else {
            animationEnd();
        }
    }

    setClickState(click = false, callback = null) {
        this.warp.off('click');
        if (click && callback) this.warp.on('click', callback);
        if (click) {
            this.warp.css("cursor", "pointer");
        } else {
            this.warp.css("cursor", "default");
        }
    }

    setDragState(drag = false, dragStart = null, dragEnd = null) {
        var my = this;
        if (drag) {
            this.setDragState(false);

            this.isDragable = true;
            my.warp.css("cursor", "grab");
            my.warp.mousedown(function(event) {
                // my.setZIndex(1999);
                let ori_x = my.x;
                let ori_y = my.y;
                let m_x = event.clientX;
                let m_y = event.clientY;
                my.warp.css("cursor", "grabbing");
                $(document).mousemove(function(event) {
                    let n_x = event.clientX;
                    let n_y = event.clientY;
                    my.setPos(n_x - m_x + ori_x, n_y - m_y + ori_y);
                });
                $(my.warp).mouseup(function() {
                    $(document).off('mousemove');
                    my.warp.off('mousemove mouseup');
                    my.warp.css("cursor", "grab");
                    // if (callback) callback(my, ori_x, ori_y, my.x, my.y);
                    if (dragEnd) dragEnd();
                });
                if (dragStart) dragStart();
            });
        } else {
            this.isDragable = false;
            this.warp.off('mousemove mouseup mousedown');
            this.warp.css("cursor", "default");
            $(document).off("mousemove");
        }
    }

    destroy() {
        this.div.off('mouseout mouseover');
        this.warp.off('click mousemove mouseup mousedown');
        this.warp.remove();
    }
}