let menuBtn = document.querySelector('.navigation');
let menu = document.querySelector('.menuovk');
let search_menu_box = document.querySelector('.search_menu_box');
let content = document.querySelector('.main');
let head_now = document.querySelector('.head_now');
let ovk_mobile_mail_icon = document.querySelector('.ovk_mobile_mail_icon');

menuBtn.addEventListener('click', function(){
	search_menu_box.classList.toggle('active');
	head_now.classList.toggle('active');
	menu.classList.toggle('active');
	content.classList.toggle('active');
	ovk_mobile_mail_icon.classList.toggle('active');
})