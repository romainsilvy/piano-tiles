let idRect = 1
let interval
let t = 200
let point = 0

const start = () => {
  document.querySelector('#start').addEventListener('click', ()=>{
    createBrick()
    gameLoop()
  })
}

const gameLoop = () => {
  moveRect()
  checkPoint()
  requestAnimationFrame(gameLoop);
}

const moveRect = () => {
  let rect = document.querySelectorAll(".rect")
  for (const rectangle of rect) {
    const posRect = parseInt(rectangle.style.top.split("px")[0]) + 2 + "px"
    rectangle.style.top = posRect
    if(rectangle.getBoundingClientRect().top >= window.innerHeight) {
      rectangle.remove()
      point -=10
      document.getElementById('affichePoint').innerHTML = point
    }
  }
}

const checkPoint = () => {
 if (document.getElementById('affichePoint').innerHTML < 0) {
   alert("tu est nul")
 }
}

const createBrick = () => {
    clearInterval(interval);
    let newdiv = document.createElement("div");
    newdiv.setAttribute("class", 'tile' + String(Math.floor(Math.random() * (5 - 1 + 1)) + 1))
    newdiv.className += ' rect'
    newdiv.style.top = '-110px'
    newdiv.style.height = Math.floor(Math.random() * (100 - 50 + 1)) + 50 + "px"
    newdiv.id = 'rect-' + idRect
    newdiv.addEventListener("click", () => {
      playSound(newdiv.classList)
      newdiv.remove()
      point++
      document.getElementById('affichePoint').innerHTML = point
    })

    document.getElementById('piano').append(newdiv)
    idRect +=1
    changeTimer();
    interval = setInterval(createBrick, t);
  }

  function changeTimer(){
    t = Math.floor(Math.random() * (1000 - 500 + 1)) + 500
  }


const playSound = (classList) => {
  if (classList.contains("tile1")) {
    new Audio('data/mouton.mp3').play();
  } else if (classList.contains("tile2")) {
    new Audio('data/chevre.mp3').play();
  } else if (classList.contains("tile3")) {
    new Audio('data/cheval.mp3').play();
  } else if (classList.contains("tile4")) {
    new Audio('data/sophie.mp3').play();
  } else if (classList.contains("tile5")) {
    new Audio('data/cochon.mp3').play();
  }
}

start()
