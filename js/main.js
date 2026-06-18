const tooltip = document.querySelector('.tooltip');
const keys = document.querySelectorAll('.key');
const popupBg = document.querySelector('.info__bg');
const popup = document.querySelector('.info');
const popupClose = document.querySelector('.info__close');

// Инициализируем Panzoom на созданный блок
const panzoomElement = document.getElementById('panzoom-element');
const panzoom = Panzoom(panzoomElement, {
    maxScale: 5,
    minScale: 0.4,
    contain: 'outside', // Позволяет двигать карту влево/вправо за экран
    canvas: true
});

// Добавляем зум колесиком мыши
panzoomElement.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

keys.forEach(key => {
	key.addEventListener('click', function() {
		popup.querySelector('.info__photo').setAttribute('src', this.dataset.photo);
		popup.querySelector('.info_title').innerText = this.dataset.title;
		popup.querySelector('.info__text').innerText = this.dataset.description;
		popupBg.classList.add('active');
	});

	// Показываем тултип только на ПК
	if (!isTouchDevice) {
		key.addEventListener('mousemove', function(e) {
			tooltip.innerText = this.dataset.title;
			tooltip.style.top = (e.clientY + 20) + 'px';
			tooltip.style.left = (e.clientX + 20) + 'px';
		});

		key.addEventListener('mouseenter', function() {
			tooltip.style.display = 'block';
		});

		key.addEventListener('mouseleave', function() {
			tooltip.style.display = 'none';
		});
	}
});

// Закрытие попапа по клику на фон или на крестик
const closePopup = () => popupBg.classList.remove('active');
popupBg.addEventListener('click', (e) => { if(e.target === popupBg) closePopup(); });
if (popupClose) popupClose.addEventListener('click', closePopup);
