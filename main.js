const canvas = document.getElementById('canvas1'); 
canvas.style.border = '15px solid #333'; 

const ctx = canvas.getContext('2d'); 
// canvas.height = window.innerHeight; 
// canvas.width = window.innerWidth;

const defaulLife = 10; 


let NAME ; 

let LIFE = defaulLife; 
let LEVEl = 1; 
let SCORE = 0; 
// let BALL_SPEED = document.getElementById('game_level').value; 
const brick = { 
    row : 1,
    column : 4,
    width : 50,
    height : 20,
    offSetLeft : 40,
    offSetTop : 30,
    marginTop : 30,
    color : '#4d4e52'
}

// console.log(canvas.height,canvas.width); 

let hue = 0; 
let collisionParticles = []; 

class BRICK { 
    constructor (x,y) { 
        this.x = x; 
        this.y = y; 
        this.weight = Math.floor(Math.random() * (LEVEl*LEVEl) + 2); 
        this.status = true; 
        this.color = brick.color; 
    }

    update() { 
        if (
            ball.x + ball.size > this.x &&
            ball.x - ball.size < this.x + brick.width &&
            ball.y - ball.size < this.y + brick.height &&
            ball.y + ball.size > this.y
        ) { 
            ball.dx =  ball.dx; 
            ball.dy = - ball.dy; 
            this.weight -- ; 
            for (let i=0; i < Math.min(LEVEl + 2, 4) ; i++) { 
                collisionParticles.push(new Particle(this.x + brick.width/2, this.y + brick.height/2,10, ball.color)); 
            }
            this.color = ball.color; 
            ball.color = 'hsl('+hue+',100%,50%)'; 
            if (this.weight == 0) this.status = false; 
            SCORE += 10; 
            //console.log(ctx.lineWidth); 
        } 
        // else { 
        //     this.color = brick.color; 
        // }
    }

    draw() { 
        ctx.fillStyle = this.color; 
        ctx.fillRect(this.x, this.y, brick.width, brick.height); 
    
        ctx.lineWidth = 3; 

        ctx.strokeStyle = '#a9d6db' ;
        ctx.strokeRect(this.x, this.y, brick.width, brick.height); 

        ctx.fillStyle = '#000'; 
        ctx.font = "13px Arial"; 
        ctx.fillText(this.weight, this.x + brick.width/2 - 4, this.y + brick.height/2 +4); 
    }   
}

let bricks = []; 

function createBricks() { 
    for(let i = 0; i < brick.row; i++) { 
        bricks[i] = []; 
        for (let j=0; j< brick.column; j++) {
            let x = j * (brick.offSetLeft + brick.width) + brick.offSetLeft; 
            let y = i * (brick.offSetTop + brick.height) + brick.offSetTop +brick.marginTop;  
            bricks[i][j] = new BRICK(x,y); 
        }   
    }
}

createBricks(); 

function handleBricks() { 
    for (let i = 0; i < brick.row; i++) { 
        for (let j = 0; j < brick.column; j++) { 
            if (bricks[i][j].status == true) { 
               bricks[i][j].update(); 
                bricks[i][j].draw(); 
            }
        }
    }
    let next_level = true; 
    for (let i = 0; i < brick.row; i++) { 
        for (let j = 0; j < brick.column; j++) { 
            if (bricks[i][j].status ==  true) { 
                next_level = false; 
            }
        }
    }
    if (next_level ) { 
        // console.log(bricks); 
        LEVEl++; 
        clearSmallBall(); 
        brick.row ++; 
        ball.speed = eval(ball.speed + '+1'); 
        console.log(ball.speed); 
        createBricks(); 
        paddle.reset(); 
        ball.reset(); 
        console.log(ball); 
    }
}

//
function clearSmallBall() { 
    for (let i=0; i<collisionParticles.length;i++) { 
        collisionParticles.splice(i,1);
        i--; 
    }
}

class PADDLE { 
    constructor (x,y) { 
        this.x = x; 
        this.y = y; 
        this.height = 10; 
        this.width = 70; 
        this.dx = 15; 
        this.dy = 15; 
    }
    
    moveRight () { 
        this.x += this.dx; 
        if (this.x + this.width > canvas.width) { 
            this.x = canvas.width - this.width; 
        }
    }

    moveLeft () { 
        this.x -= this.dx; 
        if (this.x < 0 ) { 
            this.x = 0; 
        }
    }

    moveDown () { 
        this.y += this.dy; 
        if (this.y + this.height > canvas.height) { 
            this.y = canvas.height - this.height; 
        }
    }

    moveUp () { 
        this.y -= this.dy; 
        if (this.y < 0) { 
            this.y = 0; 
        }
    }

    reset() { 
        paddle = new PADDLE(canvas.width/2 - 35, canvas.height-10-10); 
    }

    draw(){ 
        ctx.fillStyle = 'white';
       
        //ctx.beginPath(); 
        ctx.fillRect(this.x, this.y, this.width, this.height); 
        
        // ctx.fill();   
        ctx.lineWidth = 3; 

        ctx.strokeStyle = '#fccf03' ;
        ctx.strokeRect(this.x, this.y, this.width, this.height); 
        //ctx.closePath(); 
       
    }
}
let paddle = new PADDLE(canvas.width/2 - 35, canvas.height-10-10); 

// check arrow
document.onkeydown = checkKey; 
function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
       paddle.moveUp(); 
    }
    else if (e.keyCode == '40') {
        // down arrow
       paddle.moveDown(); 
    }
    else if (e.keyCode == '37') {
       // left arrow
       paddle.moveLeft(); 

    }
    else if (e.keyCode == '39') {
       // right arrow
       paddle.moveRight(); 

    }

}

// get click position
const mouse = { 
    x:undefined, 
    y:undefined
}

// window.addEventListener('click',function(event) { 
//     mouse.x = event.x; 
//     mouse.y = event.y; 
// })


canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
    var canvasX = Math.round(e.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
    var canvasY = Math.round(e.clientY - cRect.top);         // positions to get make (0,0) the top left of the 
    paddle.x = canvasX - paddle.width/2; 
    paddle.y = canvasY - paddle.height/2; 
    if (paddle.x + paddle.width  > canvas.width ) paddle.x = canvas.width - paddle.width; 
    // if (paddle.x < 0) paddle.x = 0; 
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height; 
    if (paddle.y < 0) paddle.y = 0; 
    // ctx.clearRect(0, 0, canvas.width, canvas.height);        // canvas
    // ctx.fillText("X: "+canvasX+", Y: "+canvasY, 10, 20);
});


class BALL { 
    constructor(x,y,speed) { 
        this.x = x;
        this.y = y; 
        this.color = 'hsl('+hue+',100%,50%)'; 
        this.size = 8; 
        this.speed = speed; 
        this.dx =2 * (Math.random() * 2 - 1); 
        this.dy = -2; 
    }

    update() { 

         // collison with paddle 
         if (
            this.x + this.size > paddle.x &&
            this.x - this.size < paddle.x + paddle.width &&
            this.y - this.size < paddle.y + paddle.height &&
            this.y + this.size > paddle.y 
        )  { 
            let distance = ball.x - (paddle.x + paddle.width/2); 

            distance = distance / (paddle.width/2); 
            let angle = distance * (Math.PI/3); 

            this.dx = this.speed * Math.sin(angle); 
            this.dy = - this.speed * Math.cos(angle); 
            this.color = 'hsl('+hue+',100%,50%)'; 
        } 

        // collison with screen 
        if (
            this.x + this.size > canvas.width||
            this.x - this.size < 0
            ) { 
            this.dx= - this.dx; 
            for (let i=0; i<5; i++) { 
                collisionParticles.push(new Particle(this.x , this.y ,10, this.color)); 
            }
            this.color = 'hsl('+hue+',100%,50%)'; 
        }
        if (
            this.y - this.size <= 0
            ) { 
            this.dy = - this.dy; 
            this.color = 'hsl('+hue+',100%,50%)'; 
        }

        if (this.y + this.dy > canvas.height - this.size) { 
            //   alert("Game Over"); 
            LIFE --; 
            this.reset(); 
        }
       
      
        this.x += this.dx ; 
        this.y += this.dy ; 
    }

    reset() { 
        ball = new BALL(paddle.x + paddle.width/2 + 10 , paddle.y , ball.speed); 
    }

    draw() { 
        ctx.fillStyle = this.color; 
        ctx.beginPath() ; 
        ctx.arc(this.x,this.y,this.size,0,Math.PI *2); 
        ctx.fill(); 
        ctx.closePath(); 
    }
}

let ball = new BALL(paddle.x + paddle.width/2,paddle.y , 4); 



// add them cho vui 

class Particle { 
    constructor(x,y,sizeBall,color) { 
        this.x = x; 
        this.y = y; 
        // this.size = Math.random() * 30 + 5; 
        this.size = sizeBall; 
        // this.color = 'hsl('+hue+',100%,50%)'; 
        this.color = color; 
        this.weight = Math.random() * 4 + 1; 
        this.directionX = Math.random() * 5 - 1.5; 
        this.speedX = 4 * ( Math.random() * 2 - 1 ); 
        this.speedY = -4* ( Math.random() * 1 - 0 ); 
        // this.speedX = Math.random() * 3 - 1.5; 
        // this.speedY = (Math.random() * this.speedX-1) - this.speedX; 
    }
   

    updateCollision() { 
        this.x += this.speedX; 
        this.y += this.speedY; 
        if ( this.size >3) this.size -= 0.3; 
    }

    draw() { 
        ctx.fillStyle = this.color; 
        ctx.beginPath() ; 
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI); 
        ctx.closePath() ; 
        ctx.fill()
    }
}

function handleCollision() { 
    for (let i=0; i<collisionParticles.length;i++) { 
        collisionParticles[i].updateCollision(); 
        collisionParticles[i].draw(); 
        
        for(let j=i; j<collisionParticles.length; j++) { 
            let dx = collisionParticles[i].x - collisionParticles[j].x;
            let dy = collisionParticles[i].y - collisionParticles[j].y; 
            let distance = Math.sqrt(dx*dx + dy*dy); 

            if (distance<100) { 
                ctx.beginPath(); 
                ctx.strokeStyle = collisionParticles[i].color; 
                ctx.lineWidth = collisionParticles[i].size/10; 
                ctx.moveTo(collisionParticles[i].x, collisionParticles[i].y); 
                ctx.lineTo(collisionParticles[j].x,collisionParticles[j].y); 
                ctx.stroke(); 
                ctx.fill(); 
            }
        }
        if(collisionParticles[i].y < 0 
            || collisionParticles[i].x < 0
            || collisionParticles[i].x > canvas.height 
            ) {
            collisionParticles.splice(i,1); 
            i--; 
        }
    }
    
}

// 

function showStats() { 
    ctx.fillStyle = '#fff'; 
    ctx.font = "13px Arial"; 
    ctx.fillText('LIFE : ' + LIFE, 20, 20); 
    ctx.fillText('LEVEL : ' + LEVEl, canvas.width/2 - 30, 20);
    ctx.fillText('SCORE : ' + SCORE, canvas.width - 100, 20);
}


const Bg_img = new Image(); 
Bg_img.src = './wall_background.jpg'; 

function drawBackground() { 
    ctx.drawImage(Bg_img,0,0);
}

function createNewGame() { 
    LEVEl = 1; 
    brick.row = 1; 
    LIFE = defaulLife; 
    SCORE = 0; 
    let BALL_SPEED = document.getElementById('game_level').value; 
    // console.log(BALL_SPEED); 
    paddle = new PADDLE(canvas.width/2 - 35, canvas.height-10-10); 
    ball = new BALL(paddle.x + paddle.width/2,paddle.y ,BALL_SPEED); 
    drawBackground(); 
    clearSmallBall(); 
    createBricks(); 
    ball.draw(); 

    paddle.draw(); 
    showStats();  
}

// createNewGame(); 

let loop ;  

function animate() { 
    //ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle ='rgba(0,0,0,1)'; 
    ctx.fillRect(0,0,canvas.width,canvas.height); 
    drawBackground(); 
    ball.update(); 
    ball.draw(); 

    paddle.draw(); 
    // console.log(ball); 
    handleBricks();
    handleCollision(); 
    showStats();  
    hue+=0.8; 
    if (LIFE > 0) { 
         
        loop = requestAnimationFrame(animate); 
        //requestAnimationFrame(animate);  
    } else {
        let temp = document.getElementById('name1').value;
        NAME = temp.toUpperCase(); 
        console.log(NAME); 
        let alertmsg = "      😵GAME OVER !!!😵\n" 
        + "️🎉 YOUR SCORE WAS " + SCORE  
        + " 🌟\n GOOD LUCK NEXT TIME " + NAME 
        + " 🍀\n         THANK YOU 💖"; 
        alert(alertmsg);
    }
}

// animate(); 
// loop = requestAnimationFrame(animate);
btn.addEventListener("click", function() { 
    window.cancelAnimationFrame(loop); 
    createNewGame(); 
    animate();  
})