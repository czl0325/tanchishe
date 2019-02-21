//index.js

var startX = 0;
var startY = 0;

var windowWidth = 0;
var windowHeight = 0;

var snakelength = 3;

//蛇头的对象
var snakeHeader = {
  l: 0,
  t: 0,
  w: 20,
  h: 20,
  color: "#ff0000"
};
//蛇头的对象
var snakeBodys = [];
//蛇头的方向
var snakeDirection = "right";
var direction = null;
var foods = [];

Page({

  onTouchStart: function(event) {
    startX = event.touches[0].x;
    startY = event.touches[0].y;
  },
  onTouchMove: function(event) {
    var moveX = event.touches[0].x;
    var moveY = event.touches[0].y;
    var x = moveX - startX;
    var y = moveY - startY;
    if (Math.abs(x) > Math.abs(y) && x > 0) {
      direction = "right";
    } else if (Math.abs(x) > Math.abs(y) && x < 0) {
      direction = "left";
    } else if (Math.abs(x) < Math.abs(y) && y < 0) {
      direction = "top";
    } else if (Math.abs(x) < Math.abs(y) && y > 0) {
      direction = "bottom";
    }
  },
  onTouchEnd: function(event) {
    snakeDirection = direction;
  },

  onLoad: function(option) {
    var context = wx.createContext();
    var frameTime = 0;

    //随机函数
    function rand(min,max){
      return parseInt(Math.random()*(max-min)+min);
    }

    function Food() {
      this.l = 0;
      this.t = 0;
      this.w = 20;
      this.h = 20;
      this.color = "rgb(0,255,0)";
      this.resetPos = function() {
        while(true) {
          this.l = rand(0, windowWidth - this.w) /20 * 20;
          this.t = rand(0, windowHeight - this.h) / 20 * 20;
          console.log("原始l=" + rand(0, windowWidth - this.w) + ",原始t="
            + rand(0, windowHeight - this.h));
          console.log("转换后l=" + this.l + ",转换后t=" + this.t);
          var isCollision = false;
          if (collision(this, snakeHeader)) {
            isCollision = true;
            continue;
          }
          for (var i=0; i<snakeBodys.length; i++) {
            var body = snakeBodys[i];
            if (collision(this, body)) {
              isCollision = true;
              break;
            }
          }

          if (isCollision) {
            continue;
          } else {
            break;
          }
        }
      }
    }

    //碰撞函数
    function collision(obj1, obj2) {
      var l1 = obj1.l;
      var r1 = l1 + obj1.w;
      var t1 = obj1.t;
      var b1 = t1 + obj1.h;

      var l2 = obj2.l;
      var r2 = l2 + obj2.w;
      var t2 = obj2.t;
      var b2 = t2 + obj2.h;

      if (r1 > l2 && l1 < r2 && b1 > t2 && t1 < b2) {
        return true;
      } else {
        return false;
      }
    }

    function animate() {
      frameTime++;
      if (frameTime > 20) {
        snakeBodys.push({
          l: snakeHeader.l,
          t: snakeHeader.t,
          w: snakeHeader.w,
          h: snakeHeader.h,
          color: "#0000ff"
        })

        move();

        if (snakeHeader.l < 0 || snakeHeader.t < 0 ||
          snakeHeader.l + snakeHeader.w > windowWidth ||
          snakeHeader.t + snakeHeader.h > windowHeight) {
          wx.showModal({
            title: '游戏结束',
            content: '您已经死亡',
            confirmText: '重新开始',
            cancelText: '退出游戏',
            success(res) {
              if (res.confirm) {
                snakeHeader.l = 0;
                snakeHeader.t = 0;
                snakeDirection = "right";
                snakeBodys = [];
                snakelength = 3;
                for (var i = 0; i < foods.length; i++) {
                  var food = foods[i];
                  food.resetPos();
                }
                requestAnimationFrame(animate);
              } else if (res.cancel) {
                
              }
            }
          })
          return;
        }

        context.setFillStyle(snakeHeader.color);
        context.beginPath();
        context.rect(snakeHeader.l, snakeHeader.t, snakeHeader.w, snakeHeader.h);
        context.closePath();
        context.fill();

        //如果超过4截身体就删除最老的那一截
        if (snakeBodys.length > snakelength) {
          snakeBodys.shift();
        }

        for (var i = 0; i < snakeBodys.length; i++) {
          var snake = snakeBodys[i];
          context.setFillStyle(snake.color);
          context.beginPath();
          context.rect(snake.l, snake.t, snake.w, snake.h);
          context.closePath();
          context.fill();
        }

        //绘制食物
        for (var i = 0; i < foods.length; i++) {
          var food = foods[i];
          context.setFillStyle(food.color);
          context.beginPath();
          context.rect(food.l, food.t, food.w, food.h);
          context.closePath();
          context.fill();

          //食物跟蛇头碰撞检测
          if (collision(food, snakeHeader)) {
            console.log('吃掉');
            food.resetPos();
            snakelength++;
          }
        }

        wx.drawCanvas({
          canvasId: "snakeCanvas",
          actions: context.getActions()
        });

        frameTime = 0;
      }
      requestAnimationFrame(animate);
    }


    function move() {
      switch (snakeDirection) {
        case 'left':
          break;
        case 'right':
          break;
        case 'top':
          break;
        case 'bottom':
          break;
      }
    }

    function move() {
      switch (snakeDirection) {
        case 'left':
          snakeHeader.l -= snakeHeader.w;
          break;
        case 'right':
          snakeHeader.l += snakeHeader.w;
          break;
        case 'top':
          snakeHeader.t -= snakeHeader.h;
          break;
        case 'bottom':
          snakeHeader.t += snakeHeader.h;
          break;
      }
    }

    wx.getSystemInfo({
      success: function(res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;
        var food = new Food();
        food.resetPos();
        foods.push(food);
        animate();
      },
    })
  }
})