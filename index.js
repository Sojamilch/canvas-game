
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

class Enemy{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
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
const player = new Player(middleX,middleY, 30, 'red')
player.draw()

//used to manage different instances of the same object
const projectiles = []
const enemies = []

//spawns the enemies and sends them into the player form the edge of the map
function spawnEnemies(){
    setInterval(() => {

        // decides the size of the enemies between 30 - 10
        const radius = Math.random() * (30 - 10) + 10
        let x 
        let y

        //uses math to spawn the enemies off screen at a any point
        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius 
            y = Math.random() * canvas.height
            //const y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius 
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius 
        }
       
        const color = 'green'
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
function animate(){
    requestAnimationFrame(animate)
    canvasContext.clearRect(0,0,canvas.width, canvas.height)
    player.draw()

    projectiles.forEach((projectile) => {
        projectile.update()
    })


    enemies.forEach((enemy, index) => {
        enemy.update()

        projectiles.forEach((projectile, projectileIndex) =>{
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            //bullet and enemy touch
            if(dist - enemy.radius - projectile.radius < 1)
            {
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0)
            }

        })

    })
}
//Listens for new events in the eventloop
addEventListener('click', 
    (event) => 
    {
        const angle = Math.atan2(
            event.clientY - canvas.height / 2, 
            event.clientX - canvas.width / 2
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        projectiles.push(
            new Projectile(
                canvas.width / 2,
                canvas.height / 2,
                2,
                'blue',
                velocity
                )
        )
        //creates the bullets when you left click
    }
)


animate()
spawnEnemies()