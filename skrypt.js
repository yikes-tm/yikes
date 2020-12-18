var canvas= document.getElementById("canvas1");
var ctx= canvas.getContext("2d");
canvas.width= 1024;
canvas.height= 576;
var controller, loop;
var keys= [];
//Określanie wymiarów postaci, jej położenia oraz konktetnego obrazka z Sprite Sheet'a//
var player= {
    x: 0,
    x_velocity:0,
    y: 390,
    y_velocity:0,
    width: 58.5,
    height: 66,
    frameX: 0,
    frameY: 0,
    jumping: true
};
var kosmita={
    x: 950,
    x_velocity:0,
    y: 370,
    y_velocity:0,
    width: 66,
    height: 90,
    frameX: 0,
    frameY: 0,
    speed: 3,
};
var rock={
    x: 950,
    x_velocity:0,
    y: 100,
    y_velocity:0,
    width: 36,
    height: 37,
    frameX: 0,
    frameY: 0,
    speedX: 3,
    speedY: 1,
};
//Dodawanie obrazków//
var playerSprite = new Image();
playerSprite.src = "img/astronautasheet.png";
var background= new Image();
background.src = "img/bgfull.png";
var kosmitaSprite = new Image();
kosmitaSprite.src = "img/kosmitasheet.png";
var rockSprite = new Image();
rockSprite.src = "img/uf.png"
var lose = new Image();
lose.src = "img/lose.png";
//Rysiwanie tła i postaci//
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function drawkosmita(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function drawrock(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function animate(){
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
    drawkosmita(kosmitaSprite, kosmita.width * kosmita.frameX, kosmita.height * kosmita.frameY, kosmita.width, kosmita.height, kosmita.x, kosmita.y, kosmita.width, kosmita.height);
    drawrock(rockSprite, rock.width * rock.frameX, rock.height * rock.frameY, rock.width, rock.height, rock.x, rock.y, rock.width, rock.height)
    requestAnimationFrame(animate);
}
animate();
//Wykrywanie skoku, ruchu i wyieranie odpowiedniego obrazka//
controller= {
    keyListener: function(event) {
        
        var key_state= (event.type == "keydown")?true:false;

        switch(event.keyCode) {
            case 38:
                controller.up= key_state;
                break;
            case 37:
                controller.left= key_state;
                player.frameX=0;
                player.frameY=1;
                break;
            case 39:
                controller.right= key_state;
                player.frameX=0;
                player.frameY=0;
                break;
        }
    }
};
//Przyśpieszenie podczas odbicia//
function speedUpUfoX(){
    if(rock.speedX > 0 && rock.speedX < 13 ){
        rock.speedX += 0.05;
    }
    else if (rock.speedX < 0 && rock.speedX > -13){
        rock.speedX -= 0.05;
    }
};
function speedUpUfoY(){
    if(rock.speedY > 0 && rock.speedY < 13){
        rock.speedY += 0.05;
    }
    else if (rock.speedY < 0 && rock.speedY > -13){
        rock.speedY -= 0.05;
    }
};
function speedUpKosmita(){
    if(kosmita.speed > 0 && kosmita.speed < 10){
        kosmita.speed += 0.1;
    }
    else if (kosmita.speed < 0 && kosmita.speed > -10){
        kosmita.speed -= 0.1;
    }
};
//Lose screen'y//
function loseScreenKosm(){
    ctx.drawImage(lose, 0, 0, canvas.width, canvas.height);
    kosmita.speed = 0;
    rock.speedY =0;
    rock.speedX =0;
    if(controller.right){
        player.x_velocity-=0.5;
    }
    if(controller.left){
        player.x_velocity+=0.5;
    }
        player.y_velocity *= -2;
}
function loseScreenUfo(){
    ctx.drawImage(lose, 0, 0, canvas.width, canvas.height);
    kosmita.speed = 0;
    rock.speedY =0;
    rock.speedX =0;
    player.y= rock.y;
    if(controller.right){
        player.x_velocity-=0.5;
    }
    if(controller.left){
        player.x_velocity+=0.5;
    }
}
//Pętla//
loop= function() {
    //Określenie stania//
    if (player.y>=390 && player.frameX!=0 && player.frameY==0){
        player.frameX=1
        player.frameY=0;
    }
    //Ruch kosmity//
    kosmita.x -= kosmita.speed;
    //Ruch Ufo//
    rock.x -= rock.speedX;
    rock.y -= rock.speedY;
    //Odbicie Ufo//
    if(rock.y <= 0 || rock.y >= 460 - rock.height){
        rock.speedY = -rock.speedY;
        speedUpUfoY()
    }
    if(rock.x <= 0 || rock.x >= 1024 - rock.width){
        rock.speedX = -rock.speedX;
        speedUpUfoX()
    }
    //Odbicie kosmity//
    if(kosmita.x <= 0){
        kosmita.speed = -kosmita.speed;
        kosmita.frameX = 0;
        kosmita.frameY = 1;
        speedUpKosmita()
    }
    if (kosmita.x >= 1024 - kosmita.width){
        kosmita.speed = -kosmita.speed;
        kosmita.frameX = 0;
        kosmita.frameY = 0;
        speedUpKosmita()
    }
    if (player.y>=390 && player.frameX!=0 && player.frameY==1){
        player.frameX=1
        player.frameY=1;
    }
    //Określanie skoku//
    if(controller.up && player.jumping==false && player.frameY==0){
    player.y_velocity -= 35;
    player.jumping = true;
    player.frameX=3;
    player.frameY=0;
    }
    if(controller.up && player.jumping==false && player.frameY==1){
        player.y_velocity -= 35;
        player.jumping = true;
        player.frameX=3;
        player.frameY=1;
        }
        //Ruch w lewo//
    if(controller.left){
        player.x_velocity -= 0.5;
    }
        //Ruch w prawo//
    if(controller.right){
        player.x_velocity += 0.5
    }
    player.y_velocity += 0.5; //Grawitacja//
    player.x += player.x_velocity;
    player.y += player.y_velocity;
    player.x_velocity *= 0.9;//Hamowanie postaci//
    player.y_velocity *= 0.9;//Czas unoszenia//
    //Podłoga, żeby postać nie spadła na samo dno//
    if (player.y > 390) {

        player.jumping = false;
        player.y = 390;
        player.y_velocity = 0;
    }
    //Border dla postaci//
    if (player.x<0){
        player.x_velocity = 1;
    }
    if (player.x>958){
        player.x_velocity=-1;
    }
    //Wykrywanie kolizji gracza z obiektami//
    if (player.x < rock.x + rock.width &&
        player.x + player.width > rock.x &&
        player.y < rock.y + rock.height &&
        player.y + player.height > rock.y) {
        loseScreenUfo()
     }
     if (player.x < kosmita.x + kosmita.width &&
        player.x + player.width > kosmita.x &&
        player.y < kosmita.y + kosmita.height &&
        player.y + player.height > kosmita.y) {
        loseScreenKosm()
     }
    window.requestAnimationFrame(loop);
};

//Przycisk i wywoływanie pętli//
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);