const tooltip = document.querySelector('.tooltip');
const keys = document.querySelectorAll('.key');
const popupBg = document.querySelector('.info__bg');
const popup = document.querySelector('.info');
const popupClose = document.querySelector('.info__close');

// Инициализация Panzoom с правильными настройками свободы перемещения
const panzoomElement = document.getElementById('panzoom-element');
const panzoom = Panzoom(panzoomElement, {
    maxScale: 5,         // Максимальное увеличение
    minScale: 0.3,       // Максимальное уменьшение
    contain: 'outside',  // ВАЖНО: Разрешает карте выходить за границы для свободного перемещения
    canvas: true,        // Корректно обрабатывает внутренние элементы (картинку + SVG)
    startScale: 1
});

// Включаем зум колесиком мыши
panzoomElement.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

// Проверка: является ли устройство сенсорным
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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

// Закрытие модального окна
const closePopup = () => popupBg.classList.remove('active');
popupBg.addEventListener('click', (e) => { if(e.target === popupBg) closePopup(); });
popupClose.addEventListener('click', closePopup);

// Логика фильтрации
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.dataset.filter;

        keys.forEach(key => {
            const keyType = key.dataset.type;
            if (filterValue === 'all' || keyType === filterValue) {
                key.style.display = 'block';
            } else {
                key.style.display = 'none';
            }
        });
    });
});
