const tooltip = document.querySelector('.tooltip');
const keys = document.querySelectorAll('.key');
const popupBg = document.querySelector('.info__bg');
const popup = document.querySelector('.info');
const popupClose = document.querySelector('.info__close');

// Инициализация свободного перемещения и зума
const panzoomElement = document.getElementById('panzoom-element');
const panzoom = Panzoom(panzoomElement, {
    maxScale: 5,
    minScale: 0.4,
    contain: 'outside',
    canvas: true
});

// Зум колесиком мыши
panzoomElement.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

keys.forEach(key => {
	key.addEventListener('click', function(e) {
		popup.querySelector('.info__photo').setAttribute('src', this.dataset.photo);
		popup.querySelector('.info_title').innerText = this.dataset.title;
		popup.querySelector('.info__text').innerText = this.dataset.description;
		popupBg.classList.add('active');
	});

	if (!isTouchDevice) {
		key.addEventListener('mousemove', function(e) {
			tooltip.innerText = this.dataset.title;
			tooltip.style.top = (e.pageY + 20) + 'px';
			tooltip.style.left = (e.pageX + 20) + 'px';
		});

		key.addEventListener('mouseenter', function() { tooltip.style.display = 'block'; });
		key.addEventListener('mouseleave', function() { tooltip.style.display = 'none'; });
	}
});

const closePopup = () => popupBg.classList.remove('active');
popupBg.addEventListener('click', (e) => { if(e.target === popupBg) closePopup(); });
popupClose.addEventListener('click', closePopup);
