let p_bt = document.querySelector('.podrobnee');
let p_content = document.querySelector('.podrobnee_content');

p_bt.addEventListener('click', function(){
	let text = ["Показать подробнее", "Скрыть"];
	p_bt.innerText = text[Number(p_bt.innerText === text[0])]
	p_content.classList.toggle('active');
});

u(".post-like-button").on("click", function(e) {
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
});
