const tooltip = document.querySelector('.tooltip');
const keys = document.querySelectorAll('.key');
const popupBg = document.querySelector('.info__bg');
const popup = document.querySelector('.info');
const popupClose = document.querySelector('.info__close');

// 1. Находим элемент для Panzoom
const panzoomElement = document.getElementById('panzoom-element');

// 2. Инициализируем библиотеку с полной свободой перетаскивания
const panzoom = Panzoom(panzoomElement, {
    maxScale: 5,
    minScale: 0.3,
    contain: 'outside', // Разрешает выходить за границы экрана для скролла влево/вправо
    canvas: true,       // Корректно считает координаты SVG внутри блока
    startScale: 1
});

// 3. Зум колесиком мыши (на ПК)
panzoomElement.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

// Проверка на тач-устройство
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Логика кликов и наведения на ключи
keys.forEach(key => {
	key.addEventListener('click', function(e) {
		popup.querySelector('.info__photo').setAttribute('src', this.dataset.photo);
		popup.querySelector('.info_title').textContent = this.dataset.title;
		popup.querySelector('.info__text').textContent = this.dataset.description;
		popupBg.classList.add('active');
	});

	if (!isTouchDevice) {
		key.addEventListener('mousemove', function(e) {
			tooltip.textContent = this.dataset.title;
			tooltip.style.top = (e.pageY + 20) + 'px';
			tooltip.style.left = (e.pageX + 20) + 'px';
		});

		key.addEventListener('mouseenter', function() {
			tooltip.style.display = 'block';
		});

		key.addEventListener('mouseleave', function() {
			tooltip.style.display = 'none';
		});
	}
});

// Закрытие попапа
const closePopup = () => popupBg.classList.remove('active');
if(popupBg) popupBg.addEventListener('click', (e) => { if(e.target === popupBg) closePopup(); });
if(popupClose) popupClose.addEventListener('click', closePopup);

// Исправленная логика фильтрации
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.dataset.filter;

        keys.forEach(key => {
            const keyType = key.dataset.type;
            if (filterValue === 'all' || keyType === filterValue) {
                key.style.display = 'block'; // Исправлено: убрано лишнее .style
            } else {
                key.style.display = 'none';  // Исправлено: убрано лишнее .style
            }
        });
    });
});
