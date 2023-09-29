let p_bt = null
let p_content = null
if(document.querySelector('.podrobnee') != null) {

    p_bt = document.querySelector('.podrobnee');
    p_content = document.querySelector('.podrobnee_content');

    p_bt.addEventListener('click', function(){
        let text = ["Показать подробнее", "Скрыть"];
        p_bt.innerText = text[Number(p_bt.innerText === text[0])]
        p_content.classList.toggle('active');
    });
}

/*u(".post-like-button").on("click", function(e) {
    e.preventDefault();
    
    var thisBtn = u(this).first();
    var link    = u(this).attr("href");
    var heart   = u(".like", thisBtn);
    var counter = u(".likeCnt", thisBtn);
    var likes   = counter.text() === "" ? 0 : counter.text();
    var isLiked = heart.attr("id") === 'liked';
    
    ky(link);
    heart.attr("id", isLiked ? '' : 'liked');
    counter.text(parseInt(likes) + (isLiked ? -1 : 1));
    if (counter.text() === "0") {
        counter.text("");
    }
    
    return false;
});*/

function mobileRepost(postId) {
    let el   = document.getElementById("post"+postId+"_actions")
    let hash = document.querySelector("meta[name=csrf]").getAttribute("value");

    if(document.querySelector("#post"+postId+"_actions #mobile_repost"+postId) == null) {
        el.insertAdjacentHTML("beforeend", `
            <div class="mobile_repost" id="mobile_repost${postId}">
                ${tr('your_comment')}:
                <textarea name="text" id='uRepostMsgInput_${postId}'></textarea><br/>
                <input type="hidden" name="hash" value="${hash}">
                <input id="repSubmit" class="button" type="button" value="${tr('send')}">
            </div>
        `)

        repSubmit.onclick = () => {
            text = document.querySelector("#uRepostMsgInput_"+postId).value;
            type = "wall";

            let xhr = new XMLHttpRequest()
            xhr.open("POST", "/wall"+postId+"/repost?hash="+encodeURIComponent(hash), true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = (function() {
                if(xhr.responseText.indexOf("wall_owner") === -1) {
                    el.innerHTML = "can't repost"
                } else {
                    let jsonR = JSON.parse(xhr.responseText);
                    location.href = "/wall" + jsonR.wall_owner
                }
            });

            xhr.send('text='+encodeURI(text) + '&type='+type);
        }
    } else {
        document.getElementById("post"+postId+"_actions").innerHTML = ""
    }
}

if(document.querySelector("#_noteDelete") != null) {
    document.querySelector("#_noteDelete").addEventListener("click", (e) => {
        let link = e.currentTarget.href
        let hash = document.querySelector("meta[name=csrf]").getAttribute("value")
        let id   = e.currentTarget.dataset.id
    
        let xhr = new XMLHttpRequest()
        xhr.open("POST", link)
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
        xhr.onload = () => {
            location.href = "/notes"+id
        }
        
        xhr.send('hash='+encodeURIComponent(hash));
    
        e.preventDefault()
    })
}