var HOME = 1;
var COUNT = 4;
var PLAY = 3;
var END = 0;
var STATE = HOME;
var dragon, dragonImg;
var background1;
var background2;
var enemy, enemyImg1, enemyImg2, enemyImg3;
var home, homeImg;
var enemyGroup;
var next, nextImg;
var surround, surroundImg;
var gms;
var play, playImg;
var restart, restartImg;
var gameOver, gameOverImg;
var score = 0;
var o, oImg;
var fly;
var waterMark, waterMarkImg;
var symbol, symbolImg;
var fire, fireImg;
var f, fireImg;
var time = 20;
var blast;

function preload() {
  background1 = loadImage('WH.png');
  dragonImg = loadAnimation('d1.png', 'd2.png', 'd3.png');
  enemyImg1 = loadAnimation('e1.png', 'e2.png', 'e3.png');
  enemyImg2 = loadAnimation('e21.png', 'e22.png', 'e23.png');
  enemyImg3 = loadAnimation('e31.png', 'e32.png', 'e33.png', 'e34.png');
  homeImg = loadImage('home.png');
  nextImg = loadImage('next.png');
  surroundImg = loadImage('DRB.png');
  playImg = loadImage('PLAY.png');
  fly = loadSound('fly.mp3');
  restartImg = loadImage('restart.png');
  gameOverImg = loadAnimation(
    'gameOver.png',
    'gameOver.png',
    'g2.png',
    'g2.png'
  );
  oImg = loadImage('o.png');
  gms = loadSound('gms.mp3');
  waterMarkImg = loadImage('Tushar Punia.png');
  symbolImg = loadImage('dr.png');
  fireImg = loadAnimation(
    'fire1.png',
    'fire2.png',
    'fire3.png',
    'fire4.png',
    'fire5.png',
    'fire6.png'
  );
  fImg = loadAnimation(
    'f1.png',
    'f2.png',
    'f3.png',
    'f4.png',
    'f5.png',
    'f6.png',
    'f7.png'
  );
  blast = loadSound('blast.mp3');
}

function setup() {
  createCanvas(1000, 550);
  surround = createSprite(1000, height / 2, 10, 10);
  surround.addImage('surround', surroundImg);
  surround.visible = false;
  dragon = createSprite(200, height / 2, 10, 10);
  dragon.addAnimation('dragon', dragonImg);
  dragon.scale = 0.9;
  home = createSprite(50, 500, 10, 10);
  home.addImage('home', homeImg);
  home.scale = 0.5;
  enemyGroup = createGroup();
  next = createSprite(900, 460, 10, 10);
  next.addImage('next', nextImg);
  play = createSprite(width / 2, height / 2 + 100, 10, 10);
  play.addImage('play', playImg);
  play.visible = false;
  i = createSprite(width / 2, 0, width, 2);
  i.visible = false;
  gameOver = createSprite(width / 2, height / 3, 10, 10);
  gameOver.addAnimation('gameOver', gameOverImg);
  gameOver.scale = 1;
  gameOver.visible = false;
  restart = createSprite(width / 2, height / 2 + 200, 10, 10);
  restart.addImage('restart', restartImg);
  restart.scale = 1;
  restart.visible = false;
  dragon.setCollider('circle', 0, 0, 45);
  o = createSprite(width / 2, height / 2 - 150, 10, 10);
  o.addImage('o', oImg);
  o.visible = false;
  symbol = createSprite(width / 2, height / 2, 10, 10);
  symbol.addImage('sy', symbolImg);
  symbol.scale = 0.7;
  symbol.visible = false;
  fire = createSprite(200, 200, 10, 10);
  fire.addAnimation('fire', fireImg);
  fire.visible = false;

  waterMark = createSprite(925, 525, 10, 10);
  waterMark.addImage('waterMark', waterMarkImg);
  waterMark.scale = 0.4;
}

function draw() {
  console.log(time);

  if (mousePressedOver(home)) {
    STATE = HOME;
  }
  gameOver.visible = false;
  restart.visible = false;

  if (STATE === HOME) {
    o.visible = false;
    play.visible = false;
    score = 0;
    symbol.visible = true;
    background(background1);
    dragon.y = height / 2;
    enemyGroup.destroyEach();
    surround.visible = false;
    dragon.visible = false;

    if ((mousePressedOver(next) && STATE === HOME) || touches.length > 0) {
      STATE = COUNT;

      symbol.visible = false;
    }
    home.visible = false;
    next.visible = true;

    dragon.velocityY = 0;
    surround.velocityY = 0;
    fire.visible = false;
    touches = [];
  }

  if (STATE === COUNT) {
    symbol.visible = false;
    fire.visible = false;

    next.visible = false;
    home.visible = true;
    surround.visible = true;
    dragon.visible = true;

    o.visible = true;
    play.visible = true;
    if ((mousePressedOver(play) && STATE === COUNT) || touches.length > 0) {
      STATE = PLAY;
      play.visible = false;
      o.visible = false;
      touches = [];
    }
  }

  if (STATE === PLAY) {
    ENEMY();

    time -= 1;
    if (fire.x < 230) {
      fire.y = dragon.y;
    }

    if (keyDown('x')) {
      fire.visible = true;
      fire.velocityX = 15;
    }

    for (var n = 0; n < enemyGroup.length; n++) {
      if (fire.isTouching(enemyGroup.get(n)) && fire.visible === true) {
        time = time - 1;
        blast.play();
        fire.visible = false;
        fire.velocityX = 0;
        fire.x = 200;
        enemyGroup.get(n).destroy();
      }
    }

    if (fire.x > 950) {
      fire.visible = false;
      fire.velocityX = 0;
      fire.x = 200;
    }

    play.visible = false;
    dragon.collide(i);
    next.visible = false;
    home.visible = true;
    surround.visible = true;
    surround.velocityX = -10 - score / 50;

    if (surround.x < 0) {
      surround.x = 1000;
    }

    dragon.visible = true;
    dragon.velocityY += 0.8;
    if (keyDown('space') || mouseIsPressed || touches.length > 0) {
      dragon.velocityY = -9;
      fly.play();
      touches = [];
    }

    if (enemyGroup.isTouching(dragon) || dragon.y > 600) {
      STATE = END;
      gms.play();
    }
  }

  if (STATE === END) {
    restart.visible = true;
    gameOver.visible = true;
    dragon.velocityY = 0;
    surround.visible = true;
    surround.velocityX = 0;
    enemyGroup.destroyEach;
    if (mousePressedOver(restart) || touches.length > 0) {
      STATE = PLAY;
      restart.visible = false;
      gameOver.visible = false;
      dragon.y = 10;
      enemyGroup.destroyEach();
      score = 0;
      touches = [];
    }
  }

  drawSprites();

  if (STATE === PLAY) {
    if (frameCount % 5 === 0) {
      score = score + 5;
    }
    textSize(25);
    stroke('white');
    stroke(20);
    fill('white');
    text('SCORE  :  ' + score, 800, 50);
  }
}

function ENEMY() {
  if (frameCount % 20 === 0) {
    enemy = createSprite(1000, Math.round(random(0, 550)), 10, 10);
    switch (Math.round(random(1, 3))) {
      case 1:
        enemy.addAnimation('enemy1', enemyImg1);
        break;
      case 2:
        enemy.addAnimation('enemy2', enemyImg2);
        enemy.scale = 0.7;
        break;
      case 3:
        enemy.addAnimation('enemy3', enemyImg3);
        enemy.scale = 0.8;
        break;
      default:
        break;
    }
    enemy.velocityX = -15 - score / 50;
    enemy.lifetime = 80;

    enemy.setCollider('circle', 0, 0, 50);
    enemy.depth = home.depth;
    home.depth += 1;
    enemy.depth = gameOver.depth;
    gameOver.depth += 1;
    enemy.depth = restart.depth;
    restart.depth += 1;
    if (dragon.isTouching(enemy)) {
      enemy.destroy();
    }

    if (enemy.x < 0) {
      enemy.destroy();
    }

    enemyGroup.add(enemy);
  }
}