let p_bt = document.querySelector('.podrobnee');
let p_content = document.querySelector('.podrobnee_content');

p_bt.addEventListener('click', function(){
	let text = ["Показать подробнее", "Скрыть"];
	p_bt.innerText = text[Number(p_bt.innerText === text[0])]
	p_content.classList.toggle('active');
})