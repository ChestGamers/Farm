const tooltip = document.querySelector('.tooltip');
const keys = document.querySelectorAll('.key');
const popupBg = document.querySelector('.info__bg');
const popup = document.querySelector('.info');
const popupClose = document.querySelector('.info__close');

// Инициализация Panzoom
const panzoomElement = document.getElementById('panzoom-element');
const panzoom = Panzoom(panzoomElement, {
    maxScale: 5,
    minScale: 0.2,
    contain: 'outside', 
    startScale: 0.35 // Сразу немного отдаляем карту, чтобы она красиво влезала в экран телефона
});

// ВАЖНО ДЛЯ МОБИЛЬНЫХ: Принудительно запускаем отслеживание тач-жестов (щипков и свайпов)
panzoom.bind();

// Зум колесиком мыши на ПК
panzoomElement.parentElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    panzoom.zoomWithWheel(e);
});

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

keys.forEach(key => {
	key.addEventListener('click', function() {
		popup.querySelector('.info__photo').setAttribute('src', this.dataset.photo);
		popup.querySelector('.info_title').innerText = this.dataset.title;
		popup.querySelector('.info__text').innerText = this.dataset.description;
		popupBg.classList.add('active');
	});

	if (!isTouchDevice) {
		key.addEventListener('mousemove', function(e) {
			tooltip.innerText = this.dataset.title;
			tooltip.style.top = (e.clientY + 20) + 'px';
			tooltip.style.left = (e.clientX + 20) + 'px';
		});

		key.addEventListener('mouseenter', function() { tooltip.style.display = 'block'; });
		key.addEventListener('mouseleave', function() { tooltip.style.display = 'none'; });
	}
});

// Фильтрация кнопок
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.dataset.filter;
        keys.forEach(key => {
            if (filterValue === 'all' || key.dataset.type === filterValue) {
                key.style.display = 'block';
            } else {
                key.style.display = 'none';
            }
        });
    });
});

const closePopup = () => popupBg.classList.remove('active');
popupBg.addEventListener('click', (e) => { if(e.target === popupBg) closePopup(); });
if (popupClose) popupClose.addEventListener('click', closePopup);
