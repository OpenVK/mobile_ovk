function fmtTime(time) {
    const mins = String(Math.floor(time / 60)).padStart(2, '0');
    const secs = String(Math.floor(time % 60)).padStart(2, '0');
    return `${ mins}:${ secs}`;
}

function addEvent(selector, eventType, func) {
    var objects = document.querySelectorAll(selector)
    objects.forEach(el => {
        el.addEventListener(eventType, () => {func(event)})
    })
}

$(document).on("click", ".litePlayer", (event) => {
    var player = event.target.closest(".litePlayer")
    if(player.classList.contains("inited")) return

    initPlayer(player.dataset.id, 
    JSON.parse(player.dataset.keys), 
    player.dataset.url, 
    player.dataset.length)

    if(event.target.classList.contains("playButton") || event.target.classList.contains("hasLyrics") )
        event.target.click()
})

$(document).on("click", ".litePlayer .hasLyrics", (event) => {
    var player = event.target.closest(".litePlayer")
    var lyrics = player.querySelector(".lyrics")

    if(!lyrics) return
    if(lyrics.style.display == "none") lyrics.style.display = "block"
    else lyrics.style.display = "none"
})

function initPlayer(id, keys, url, length) {
    document.querySelector(`.litePlayer[data-id='${ id}']`).classList.add("inited")
    var player = document.querySelector(`.litePlayer[data-id='${ id}']`)
    var audio = player.querySelector("audio")
    var playButton = player.querySelector(".playButton")

    const protData = {
        "org.w3.clearkey": {
            "clearkeys": keys
        }
    };

    player.querySelector(".tracks").style.display = "block"

    const dashPlayer = dashjs.MediaPlayer().create();
    dashPlayer.initialize(audio, url, false);
    dashPlayer.setProtectionData(protData);

    playButton.addEventListener("click", (event) => {
        if(audio.paused) {
            document.querySelectorAll('audio').forEach(el => el.pause());
            audio.play()
        } else {
            audio.pause()
        }
    })

    function changePlayButton() {
        playButton.classList.toggle("paused")
    }

    function hideTracks() {
        player.querySelector(".tracks").style.display = "none"
    }

    audio.addEventListener("play", changePlayButton)
    audio.addEventListener("pause", changePlayButton)
    audio.addEventListener("ended", (e) => {
        var nextPlayer = null
        if(player.closest(".attachment") != null) {
            try {
                nextPlayer = player.closest(".attachment").nextElementSibling.querySelector(".litePlayer")
            } catch(e) {return}
        } else if(player.closest(".infObj") != null) {
            try {
                nextPlayer = player.closest(".infObj").nextElementSibling.querySelector(".litePlayer")
            } catch(e) {return}
        } else {
            nextPlayer = player.nextElementSibling
        }

        if(!nextPlayer) return

        initPlayer(nextPlayer.dataset.id, 
        JSON.parse(nextPlayer.dataset.keys), 
        nextPlayer.dataset.url, 
        nextPlayer.dataset.length)
    
        nextPlayer.querySelector(".playButton").click()
        hideTracks()
    })

    audio.addEventListener("loadstart", () => {
        var xhr = new XMLHttpRequest
        var formdata = new FormData()
        formdata.append("hash", document.querySelector("meta[name=csrf]").getAttribute("value"))

        xhr.open("POST", "/audio" + player.dataset.realid + "/listen")
        xhr.send(formdata)
    })

    try {
        audio.addEventListener("volumechange", (e) => {
            const volume = audio.volume;
            const ps = Math.ceil((volume * 100) / 1);
    
            if (ps <= 100)
                player.querySelector(".volumeTrack .usedPart").style.width = `${ ps}%`;
        })

        audio.addEventListener("timeupdate", () => {
            const time = audio.currentTime;
            const ps = ((time * 100) / length).toFixed(3);
            player.querySelector(".lengthText").innerHTML = (fmtTime(Math.floor(time)));
    
            if (ps <= 100)
                player.querySelector(".lengthTrack .usedPart").style.width = `${ ps}%`;
        })
    } catch(e) {
        console.log("Что-то ёбнулось")
    }

    // тяжело без jquery
    try {
        ["click", "mouseup"].forEach(ev => {
            addEvent(`.litePlayer[data-id='${ id}'] .lengthTrack > div`, ev, (e) => {
                var rect  = player.querySelector(".selectableTrack").getBoundingClientRect();
                const width = e.clientX - rect.left;
                const time = Math.ceil((width * length) / (rect.right - rect.left));
        
                audio.currentTime = time;
            })
        })
    } catch(e) {}

    try {
        ["click", "mouseup", "mousemove"].forEach(ev => {
            addEvent(`.litePlayer[data-id='${ id}'] .volumeTrack > div`, ev, (e) => {
                if(e.type == "mousemove") {
                    var buttonsPresseed = e.buttons.toString(2).split("").reverse().map(x => x === "1")
                    if(!buttonsPresseed[0])
                        return;
                }
        
                var rect = player.querySelector(".volumeTrack").getBoundingClientRect();
                
                const width = e.clientX - rect.left;
                const volume = (width * 1) / (rect.right - rect.left);
        
                audio.volume = volume;
            })
        })
    } catch(e) {}

    audio.volume = 0.5
    audio.dispatchEvent(new Event("volumechange"));
}