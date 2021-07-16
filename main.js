const canvas = document.getElementById('canvas1'); 
canvas.style.border = '15px solid #333'; 

const ctx = canvas.getContext('2d'); 
// canvas.height = window.innerHeight; 
// canvas.width = window.innerWidth;

let LIFE = 5; 
let LEVEl = 1; 

const brick = { 
    row : 1,
    column : 4,
    width : 50,
    height : 20,
    offSetLeft : 40,
    offSetTop : 30,
    marginTop : 40,
    color : '#f5ce42'
}

console.log(canvas.height,canvas.width); 

let hue = 0; 
let collisionParticles = []; 

class BRICK { 
    constructor (x,y) { 
        this.x = x; 
        this.y = y; 
        this.status = true; 
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
            for (let i=0; i<5; i++) { 
                collisionParticles.push(new Particle(this.x + brick.width/2, this.y + brick.height/2,10, ball.color)); 
            }
            ball.color = 'hsl('+hue+',100%,50%)'; 
            this.status = false; 
        }
    }

    draw() { 
        ctx.fillStyle = ball.color; 
        ctx.beginPath(); 
        ctx.fillRect(this.x, this.y, brick.width, brick.height); 
        ctx.closePath(); 
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
    if (next_level) { 
        LEVEl++; 
        brick.row ++; 
        ball.speed += 2; 
        createBricks(); 
        paddle.reset(); 
        ball.reset(); 
    }
}

class PADDLE { 
    constructor (x,y) { 
        this.x = x; 
        this.y = y; 
        this.height = 10; 
        this.width = 70; 
        this.dx = 10; 
        this.dy = 10; 
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
        ctx.beginPath(); 
        ctx.fillRect(this.x, this.y, this.width, this.height); 
        ctx.fill(); 
        ctx.closePath(); 
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


class BALL { 
    constructor(x,y,speed) { 
        this.x = x;
        this.y = y; 
        this.color = 'hsl('+hue+',100%,50%)'; 
        this.size = 8; 
        this.speed = speed; 
        this.dx =3 * (Math.random() * 2 - 1); 
        this.dy = -3; 
    }

    update() { 
        // collison with screen 
        if (
            this.x + this.size >= canvas.width||
            this.x - this.size <= 0
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
            // this.color = 'hsl('+hue+',100%,50%)'; 
        }

        if (this.y + this.dy > canvas.height - this.size) { 
            //   alert("Game Over"); 
            LIFE --; 
            this.reset(); 
        }
        // collison with paddle 
        if (
            // this.dy > 0 &&
            // this.x >= paddle.x &&
            // this.x <= paddle.x + paddle.width &&
            // this.y + this.size  >= paddle.y 
            // this.y + this.size <= paddle.y + paddle.height
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
      
        this.x += this.dx ; 
        this.y += this.dy ; 
    }

    reset() { 
        ball = new BALL(paddle.x + paddle.width/2,paddle.y, ball.speed); 
    }

    draw() { 
        ctx.fillStyle = this.color; 
        ctx.beginPath() ; 
        ctx.arc(this.x,this.y,this.size,0,Math.PI *2); 
        ctx.fill(); 
        ctx.closePath(); 
    }
}



let ball = new BALL(paddle.x + paddle.width/2,paddle.y,4); 


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
        this.speedX = Math.random() * 3 - 1.5; 
        this.speedY = (Math.random() * this.speedX-1) - this.speedX; 
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
        if(collisionParticles[i].y < 0 || collisionParticles[i].x<0) {
            collisionParticles.splice(i,1); 
            i--; 
        }
    }
    
}

// 

function showStats() { 
    ctx.fillStyle = '#fff'; 
    ctx.font = "10px Arial"; 
    ctx.fillText('LIFE LEFT : ' + LIFE, canvas.width - 100, 30); 
    ctx.fillText('LEVEL : ' + LEVEl, 20, 30);
}

function animate() { 
    //ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle ='rgba(0,0,0,1)'; 
    ctx.fillRect(0,0,canvas.width,canvas.height); 
    
    ball.update(); 
    ball.draw(); 

    paddle.draw(); 
    // console.log(ball); 
    handleBricks();
    handleCollision(); 
    showStats();  
    hue+=0.5; 
    if (LIFE > 0) requestAnimationFrame(animate);  
}

animate(); 