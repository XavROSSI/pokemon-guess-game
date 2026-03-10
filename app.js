let pokedex=[]
let currentPokemon=null

let score=0
let streak=0

let compareA=null
let compareB=null
let compareFlip=false

let compareStat="weight"

let seenPokemon=new Set()

const typeColors={
fire:"#F08030",
water:"#6890F0",
grass:"#78C850",
electric:"#F8D030",
ice:"#98D8D8",
fighting:"#C03028",
poison:"#A040A0",
ground:"#E0C068",
flying:"#A890F0",
psychic:"#F85888",
bug:"#A8B820",
rock:"#B8A038",
ghost:"#705898",
dragon:"#7038F8",
dark:"#705848",
steel:"#B8B8D0",
fairy:"#EE99AC",
normal:"#A8A878"
}

const generations={
1:[1,151],
2:[152,251],
3:[252,386],
4:[387,493],
5:[494,649],
6:[650,721],
7:[722,809],
8:[810,905],
9:[906,1025]
}

let options={
language:"fr",
hardMode:false,
gens:[1,2,3,4,5,6,7,8,9]
}

function loadOptions(){

    const saved=JSON.parse(localStorage.getItem("pokemonOptions"))

    if(saved){
    options=saved
    }

    document.getElementById("languageOption").value=options.language
    document.getElementById("hardModeOption").checked=options.hardMode

    document.querySelectorAll("#genSelector input").forEach(cb=>{

    cb.checked=options.gens.includes(parseInt(cb.value))

    })

}

async function loadPokedex(){
const res=await fetch("data/pokedex.json")
pokedex=await res.json()
}

function getRandomPokemon(){

let pool=[]

options.gens.forEach(g=>{

const [min,max]=generations[g]

pool=pool.concat(
pokedex.filter(p=>p.id>=min && p.id<=max)
)

})

pool=pool.filter(p=>!seenPokemon.has(p.id))

if(pool.length===0){
seenPokemon.clear()
pool=pokedex
}

return pool[Math.floor(Math.random()*pool.length)]

}

function getSprite(id,mode){

if(mode==="back"){
return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`
}

return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

}

function openOptions(){

    document.getElementById("mainMenu").classList.add("hidden")
    document.getElementById("game").classList.add("hidden")
    document.getElementById("optionsMenu").classList.remove("hidden")

    loadOptions()

}

function closeOptions(){

    document.getElementById("optionsMenu").classList.add("hidden")
    document.getElementById("mainMenu").classList.remove("hidden")

}

function saveOptions(){

    const language=document.getElementById("languageOption").value
    const hardMode=document.getElementById("hardModeOption").checked

    const gens=[...document.querySelectorAll("#genSelector input:checked")]
    .map(e=>parseInt(e.value))

    options={
    language:language,
    hardMode:hardMode,
    gens:gens
    }

    localStorage.setItem("pokemonOptions",JSON.stringify(options))

    closeOptions()

}

function backToMenu(){

    document.getElementById("game").classList.add("hidden")
    document.getElementById("optionsMenu").classList.add("hidden")
    document.getElementById("mainMenu").classList.remove("hidden")

}

function startGame(){

document.getElementById("mainMenu").classList.add("hidden")
document.getElementById("game").classList.remove("hidden")

nextPokemon()

}

function nextPokemon(){

const mode=document.getElementById("mode").value

if(mode==="compare"){
nextCompare()
return
}

currentPokemon=getRandomPokemon()

renderPokemon(mode)

}

function renderPokemon(mode){

    const sprite=document.getElementById("sprite")
    const hints=document.getElementById("hints")
    const compare=document.getElementById("compare")

    compare.innerHTML=""
    hints.innerHTML=""
    sprite.style.display="block"

    sprite.style.display="block"
    sprite.src=getSprite(currentPokemon.id,mode)
    sprite.style.filter="none"

    if(mode==="silhouette" || mode==="back"){
        sprite.style.filter="brightness(0)"
    }

    sprite.style.display="block"
    if(mode==="types"){

        sprite.style.display="none"

        currentPokemon.types.forEach(t=>{

            const span=document.createElement("span")

            span.textContent=t
            span.className="typeBadge"
            span.style.background=typeColors[t]

            hints.appendChild(span)

        })

        const dot1=document.createElement("div")
        dot1.className="colorDot"
        dot1.style.background=currentPokemon.color

        const dot2=document.createElement("div")
        dot2.className="colorDot"
        dot2.style.background=currentPokemon.color

        hints.appendChild(dot1)
        hints.appendChild(dot2)

    }

}

function checkAnswer(){

const guess=document.getElementById("guess").value.toLowerCase().trim()

const lang=options.language

const correct=currentPokemon.names[lang]

const sprite=document.getElementById("sprite")

sprite.style.filter="none"

if(guess===correct){

score++
streak++

seenPokemon.add(currentPokemon.id)

}else{

streak=0

}

document.getElementById("result").textContent="Réponse : "+correct

updateScore()

document.getElementById("guess").value=""

setTimeout(()=>{

document.getElementById("result").textContent=""

nextPokemon()

},1500)

}

function updateScore(){

document.getElementById("score").textContent="Score: "+score
document.getElementById("streak").textContent="Streak: "+streak

}

function nextCompare(){

if(!compareA){

compareA=getRandomPokemon()
compareB=getRandomPokemon()

}else{

if(compareFlip){

compareA=getRandomPokemon()

}else{

compareB=getRandomPokemon()

}

compareFlip=!compareFlip

}

renderCompare()

}

function renderCompare(){

const compare=document.getElementById("compare")
const sprite=document.getElementById("sprite")
const hints=document.getElementById("hints")

sprite.style.display="none"
hints.innerHTML=""

const lang=options.language

const statNames={
weight:"poids",
height:"taille",
speed:"vitesse",
attack:"attaque"
}

compare.innerHTML=`

<select id="compareStatSelect">

<option value="weight">Poids</option>
<option value="height">Taille</option>
<option value="speed">Vitesse</option>
<option value="attack">Attaque</option>

</select>

<div class="compareBox">

<div class="comparePokemon" onclick="chooseCompare('A')">
${compareA.names[lang]}
</div>

<div> VS </div>

<div class="comparePokemon" onclick="chooseCompare('B')">
${compareB.names[lang]}
</div>

</div>

<p>Qui a le plus de ${statNames[compareStat]} ?</p>

`

document.getElementById("compareStatSelect").value=compareStat

document.getElementById("compareStatSelect").onchange=(e)=>{
compareStat=e.target.value
renderCompare()
}

}

function chooseCompare(choice){

let correct

if(compareA[compareStat]>compareB[compareStat]){
correct="A"
}else{
correct="B"
}

if(choice===correct){
score++
streak++
}else{
streak=0
}

updateScore()

nextCompare()

}
let suggestionIndex=-1
function updateSuggestions(){

    const input=document.getElementById("guess").value.toLowerCase()

    const lang=options.language

    const box=document.getElementById("suggestions")

    box.innerHTML=""
    suggestionIndex=-1

    if(input.length<2) return

    pokedex
    .map(p=>p.names[lang])
    .filter(name=>name.startsWith(input))
    .slice(0,6)
    .forEach(name=>{

    const div=document.createElement("div")

    div.className="suggestion"

    div.textContent=name

    div.onclick=()=>{

        document.getElementById("guess").value=name

        box.innerHTML=""

    }

    box.appendChild(div)

    })

}

function initEvents(){

    document.getElementById("validateBtn").onclick=checkAnswer
    document.getElementById("skipBtn").onclick=nextPokemon

    document.getElementById("mode").addEventListener("change",nextPokemon)
    const guessInput=document.getElementById("guess")
    guessInput.addEventListener("input",updateSuggestions)
    guessInput.addEventListener("keydown",e=>{
    if(e.key==="Enter"){
        checkAnswer()
    }

    if(e.key==="ArrowDown" || e.key==="ArrowUp"){

        const items=document.querySelectorAll(".suggestion")

        if(!items.length) return

        if(e.key==="ArrowDown"){
            suggestionIndex++
        }

        if(e.key==="ArrowUp"){
            suggestionIndex--
        }

        if(suggestionIndex>=items.length) suggestionIndex=0
        if(suggestionIndex<0) suggestionIndex=items.length-1

        items.forEach(el=>el.classList.remove("active"))

        items[suggestionIndex].classList.add("active")

        document.getElementById("guess").value=
        items[suggestionIndex].textContent

    }

    })
}

async function init(){

await loadPokedex()

loadOptions()

initEvents()

}

init()