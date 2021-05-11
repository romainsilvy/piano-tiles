//global vars
let point = 0
let idRect = 1
let t = 200
let seconds = 10
let interval
let timer;
let animation
let runing = false

//launched at start 
const start = () => {
  document.querySelector('#start').addEventListener('click', ()=>{
    if (!runing) {
      runing = true
      createBrick()
      launchTimer()
      animation = requestAnimationFrame(gameLoop);
    }
  })
}

const displayHistory = () => {
  let history = localStorage.getItem('history')
  if (history != null) {
    history = history.split('|')
    for (let i=0; i < history.length; i += 2) {
      let newTr = document.createElement('tr')
      let newTdDate = document.createElement('td')
      let newTdScore = document.createElement('td')
      newTdDate.textContent = history[i]
      newTdScore.textContent = history[i+1]
      newTr.appendChild(newTdDate)
      newTr.appendChild(newTdScore)
      document.querySelector('table').append(newTr)
    }
  }
}

//launched when start button clicked
const gameLoop = () => {
  moveRect(3)
  checkPause()
  animation = requestAnimationFrame(gameLoop);
  checkPoint()
}

//move all rect down  
const moveRect = (numberOfPixel) => {
  let rect = document.querySelectorAll(".rect")
  for (const rectangle of rect) {
    const posRect = parseInt(rectangle.style.top.split("px")[0]) + numberOfPixel + "px"
    rectangle.style.top = posRect
    if(rectangle.getBoundingClientRect().top >= window.innerHeight) {
      removeRect(rectangle)
    }
  }
}

//remove rect if it is out of the screen
const removeRect = (rectangle) => {
  rectangle.remove()
  point -=10
  document.getElementById('affichePoint').innerHTML = point
}

//check if Pause buton is clicked 
const checkPause = () => {
  document.querySelector('#pause').addEventListener('click', ()=>{
    pause()
    runing = false
  })
}

//check if points < 0
const checkPoint = () => {
  if (point < 0) {
    pauseAndRemoveAll()
  }
}

//create random height bricks at a random interval 
const createBrick = () => {
  clearInterval(interval);

  let newdiv = document.createElement("div");
  newdiv.setAttribute("class", 'tile' + String(randomizer(1, 5)))
  newdiv.className += ' rect'
  newdiv.style.top = '-110px'
  newdiv.style.height = randomizer(50, 150) + "px"
  newdiv.id = 'rect-' + idRect
  newdiv.addEventListener("click", () => {
    playSound(newdiv.classList)
    newdiv.remove()
    point++
    document.getElementById('affichePoint').innerHTML = point
  })

  document.getElementById('piano').append(newdiv)
  idRect +=1
  t = randomizer(500, 1500)
  interval = setInterval(createBrick, t);
}

//return random number between 2 numbers passed as parameter
const randomizer = (low, high) => {
  return Math.floor(Math.random() * (high - low + 1)) + low
}

//launch a timer of 60s
const launchTimer = () => {
  timer = window.setInterval(function() {
    if (seconds >0 ) {
      seconds--;
      document.querySelector("#countDown").innerHTML = seconds + "s"
    } else {
      pauseAndRemoveAll()
      addHistory()      
    }
  }, 1000);
}

//pause everything
const pause = () => {
  cancelAnimationFrame(animation);
  clearInterval(interval)
  clearInterval(timer)
}

//pause the animationframe and remove the rect on the screen 
const pauseAndRemoveAll = () => {
  pause() 
  for (let rect of document.querySelectorAll(".rect")) {
    rect.remove()
  }
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

const getDate = () => {
  let date = new Date();
  let time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate() + ":" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
  return time
}

const addHistory = () => {
  let history = localStorage.getItem('history')
  if (history === null) {
    let toAdd = getDate() + "|" + point
    localStorage.setItem('history', toAdd)
  } else {
    let toAdd = getDate() + "|" + point
    localStorage.setItem('history', history.concat('|', toAdd))
  }
}

displayHistory()
start()
