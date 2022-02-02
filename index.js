
// selects the canvas element on the html file
const canvas = document.querySelector('canvas')


// Returns a drawing context do add elements too (API)
const canvasContext = canvas.getContext('2d')

/* 
sets the width of canvas element 
innerWidth comes from the window attribute
It contains the size of the window in px
*/
canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGame = document.querySelector('#startGameBtn')
const mainButton = document.querySelector('#mainButton')
const bigScoreEl = document.querySelector('#bigScoreEl')

//Creates the object for the player to interact with the game
class Player {
    constructor(x, y, radius, color){
        //creates the properties and assings the passed values 
        this.x = x 
        this.y = y
        this.radius = radius
        this.color = color
    }

    //draws the circle for the player
    draw(){
        canvasContext.beginPath()
        canvasContext.arc(this.x,this.y,this.radius,0,Math.PI*2, false)
        canvasContext.fillStyle = this.color
        canvasContext.fill()
    }
    
}

// object for bullets
class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    //Draws the circle for the bullet
    draw(){
        canvasContext.beginPath()
        canvasContext.arc(this.x,this.y,this.radius,0,Math.PI*2, false)
        canvasContext.fillStyle = this.color
        canvasContext.fill()
    }
    //Animates the movement of the bullet
    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

//class for partiles when enemies explode 
const friction = 0.99
class Particle {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    //Draws the circle for the bullet
    draw(){
        canvasContext.save()
        canvasContext.globalAlpha = this.alpha
        canvasContext.beginPath()
        canvasContext.arc(this.x,this.y,this.radius,0,Math.PI*2, false)
        canvasContext.fillStyle = this.color
        canvasContext.fill()
        canvasContext.restore()
    }
    //Animates the movement of the bullet
    update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

class Enemy{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    //Draws the circle for the enemy
    draw(){
        canvasContext.beginPath()
        canvasContext.arc(this.x,this.y,this.radius,0,Math.PI*2, false)
        canvasContext.fillStyle = this.color
        canvasContext.fill()
    }
    //Animates the movement of the enemy
    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}


const middleX = canvas.width / 2
const middleY = canvas.height / 2

//creates an instance of the object 'player'
const player = new Player(middleX,middleY, 15, 'white')
player.draw()

//used to manage different instances of the same object
const projectiles = []
const enemies = []
const particles = []

//spawns the enemies and sends them into the player form the edge of the map
function spawnEnemies(){
    setInterval(() => {

        // decides the size of the enemies between 30 - 10
        const radius = Math.random() * (30 - 5) + 5
        let x 
        let y

        //uses math to spawn the enemies off screen at a any point
        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius 
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius 
        }
        

        //decides the colour of the enemies to be random
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(
            canvas.height / 2 - y, 
            canvas.width / 2 - x
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x,y,radius,color,velocity))
    },1000)
}

//creates a function that updates every frame automatically
let animationId
let score = 0
function animate(){
    animationId = requestAnimationFrame(animate)
    canvasContext.fillStyle = 'rgba(0,0,0,0.1)'
    canvasContext.fillRect(0,0,canvas.width, canvas.height)
    player.draw()

    particles.forEach((particle, index) => {
        if(particle.alpha <= 0){
            particles.splice(index, 1)
        } else{
            particle.update()
        }

    })

    projectiles.forEach((projectile, index) => {
        projectile.update()
        //remove projectiles when they hit the edge of screen
        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height){
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }
    })


    enemies.forEach((enemy, index) => {
        enemy.update()
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        //end game
        if(dist - enemy.radius - player.radius < 1)  { 
                cancelAnimationFrame(animationId)
                mainButton.style.display = 'flex'
                bigScoreEl.innerHTML = score
            }
        projectiles.forEach((projectile, projectileIndex) =>{
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            //bullet and enemy touch
            if(dist - enemy.radius - projectile.radius < 1)
            {
                
                //create explosion
                for(let i = 0; i < enemy.radius * 2; i++){
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x:(Math.random() - 0.5) * (Math.random() * 6), y:(Math.random() - 0.5) * (Math.random() * 6)}))
                }
                //larger enemies shrink when hit (using GSAP)
                if(enemy.radius - 10 > 10){

                    score += 100
                    scoreEl.innerHTML = score

                    gsap.to(enemy,{
                        radius: enemy.radius -10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0) 
                }else{
                    //stops weird flashing bug 
                    //deletes enemy
                    score += 250
                    scoreEl.innerHTML = score
                    setTimeout(() => {
                    
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0) 
                }
                
            }

        })

    })
}
//Listens for new events in the eventloop
addEventListener('click', 
    (event) => 
    {
        //creates the bullets when you left click
        const angle = Math.atan2(
            event.clientY - canvas.height / 2, 
            event.clientX - canvas.width / 2
        )
        const velocity = { //speed of the bullet
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }
        projectiles.push(
            new Projectile(
                canvas.width / 2,
                canvas.height / 2,
                6,
                'white',
                velocity
                )
        )
        
    }
)


startGame.addEventListener('click', () =>{
    animate()
    spawnEnemies()
    mainButton.style.display = 'none'
})