//global vars
let point = 0
let idRect = 1
let t = 200
let seconds = 60
let vitesse = 0
let interval
let timer;
let animation
let runing = false


//launched at start 
const start = () => {
  displayHistory()
  checkStart()
}


//take the localstorage var named history and display it in a table
const displayHistory = () => {
  let history = localStorage.getItem('history')
  if (history != null) {
    history = history.split('|')
    for (let i=0; i < history.length; i += 2) {
      createRow(history[i], history[i+1])
    }
  }
}

//launch the gameloop if startButton clicked
const checkStart = () => {
  document.querySelector('#start').addEventListener('click', ()=>{
    if (!runing) {
      runing = true
      createBrick()
      launchTimer()
      animation = requestAnimationFrame(gameLoop);
    }
  })
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
  document.getElementById('piano').append(newdiv)

  newdiv.addEventListener("click", () => {
    playSound(newdiv.classList)
    newdiv.remove()
    point++
    document.querySelector(".affichePoint").innerHTML = point
  })

  idRect +=1
  t = randomizer(300, 1200)
  interval = setInterval(createBrick, t);
}

//return random number between 2 numbers passed as parameter
const randomizer = (low, high) => {
  return Math.floor(Math.random() * (high - low + 1)) + low
}

//play sound when tile clicked
const playSound = (classList) => {
  if (classList.contains("tile1")) {
    new Audio('data/1.mp3').play();
  } else if (classList.contains("tile2")) {
    new Audio('data/2.mp3').play();
  } else if (classList.contains("tile3")) {
    new Audio('data/3.mp3').play();
  } else if (classList.contains("tile4")) {
    new Audio('data/4.mp3').play();
  } else if (classList.contains("tile5")) {
    new Audio('data/5.mp3').play();
  }
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
      document.querySelector('#displayWin').classList.remove("hidden")     
    }
  }, 1000);
}

//pause the animationframe and remove the rect on the screen 
const pauseAndRemoveAll = () => {
  pause() 
  for (let rect of document.querySelectorAll(".rect")) {
    rect.remove()
  }
}

//pause everything
const pause = () => {
  cancelAnimationFrame(animation);
  clearInterval(interval)
  clearInterval(timer)
}

//add score to history 
const addHistory = () => {
  let history = localStorage.getItem('history')
  if (history === null) {
    let toAdd = getDate() + "|" + point
    localStorage.setItem('history', toAdd)
  } else {
    let toAdd = getDate() + "|" + point
    localStorage.setItem('history', history.concat('|', toAdd))
    checkHistoryLength()
  }
  displayLastHistory()
}

//remove items if the history is too long 
const checkHistoryLength = () =>{
  let history = localStorage.getItem('history')
  history = history.split('|')
  if(history.length > 10) {
    let newHistory = ""
    history.shift()
    history.shift()
    for (let content of history) {
      newHistory = newHistory.concat("|", content)
    }
    localStorage.setItem('history', newHistory.substring(1))
  }
}

//return date and time
const getDate = () => {
  let date = new Date();
  let time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate() + ":" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
  return time
}

//display the last row of the history when the game is finished
const displayLastHistory = () => {
  let history = localStorage.getItem('history')
  if (history != null) {
    let rows = document.querySelectorAll('.rowOfScore')
    for (let row of rows) {
      row.remove()
    }
    displayHistory()
  }
}

//create a row in the table for the displayHistory function
const createRow = (date, score) => {
  let newTr = document.createElement('tr')
  let newTdDate = document.createElement('td')
  let newTdScore = document.createElement('td')
  newTr.classList.add("rowOfScore")
  newTdDate.textContent = date
  newTdScore.textContent = score
  newTr.appendChild(newTdDate)
  newTr.appendChild(newTdScore)
  document.querySelector('table').append(newTr)
}

//launched when start button clicked
const gameLoop = () => {
  moveRect(4)
  checkPause()
  animation = requestAnimationFrame(gameLoop);
  checkPoint()
}

//move all rect down  
const moveRect = (numberOfPixel) => {
  let rect = document.querySelectorAll(".rect")
  if ( point <= 15){
    vitesse = 0,5
  }
  if ( point > 15 || point <= 30){
    vitesse = 1
  }
  if ( point > 30 || point <= 45){
    vitesse = 1,5
  }
  if ( point > 45){
    vitesse = 2
  }
  for (const rectangle of rect) {
    const posRect = parseInt(rectangle.style.top.split("px")[0]) + numberOfPixel + vitesse + "px"
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
  document.querySelector(".affichePoint").innerHTML = point
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
    addHistory()
    document.querySelector('#displayLoose').classList.remove("hidden")
  }
}

start()
