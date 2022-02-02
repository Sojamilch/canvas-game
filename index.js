
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

const middleX = canvas.width / 2
const middleY = canvas.height / 2

//creates an instance of the object 'player'
const player = new Player(middleX,middleY, 30, 'red')
player.draw()



const projectile = new Projectile(
    canvas.width / 2, //Projectile needs to spawn from centre of player
    canvas.height / 2, 
    5,
    'blue', 
    //this is a nested object (velocities properties)
    {
        x: 1,
        y: 1
    }
)

//used to manage different instances of the same object
const projectiles = []

//creates a function that updates every frame automatically
function animate(){
    requestAnimationFrame(animate)
    canvasContext.clearRect(0,0,canvas.width, canvas.height)
    player.draw()
    projectiles.forEach(projectile => {projectile.update()})
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
    }
)


animate()
