
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

const middleX = canvas.width / 2
const middleY = canvas.height / 2

//creates an instance of the object 'player'
const player = new Player(middleX,middleY, 30, 'red')
player.draw()


console.log(player)
