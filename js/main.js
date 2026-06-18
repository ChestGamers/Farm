const tooltip = document.querySelector('.tooltip');
const keys = document.querySelectorAll('.key');
const popupBg = document.querySelector('.info__bg');
const popup = document.querySelector('.info');
const popupClose = document.querySelector('.info__close');

const container = document.getElementById('map-container');
const draggable = document.getElementById('map-draggable');

// Переменные для перетаскивания и масштабирования карты
let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;
let scale = 1;

// НАЧАЛО ПЕРЕТАСКИВАНИЯ (Мышь и Тач)
const startDrag = (e) => {
    // Не запускаем перетаскивание, если кликнули по ключу или попапу
    if (e.target.closest('.key') || e.target.closest('.info') || e.target.closest('.filters')) return;
    
    isDragging = true;
    const pageX = e.pageX || e.touches[0].pageX;
    const pageY = e.pageY || e.touches[0].pageY;
    
    startX = pageX - translateX;
    startY = pageY - translateY;
};

// ПРОЦЕСС ПЕРЕТАСКИВАНИЯ (Влево/Вправо/Вверх/Вниз)
const doDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const pageX = e.pageX || (e.touches && e.touches[0].pageX);
    const pageY = e.pageY || (e.touches && e.touches[0].pageY);
    
    translateX = pageX - startX;
    translateY = pageY - startY;
    
    updateTransform();
};

// КОНЕЦ ПЕРЕТАСКИВАНИЯ
const stopDrag = () => { isDragging = false; };

// Функция обновления CSS-трансформации
const updateTransform = () => {
    draggable.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
};

// Слушатели для мыши
container.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', doDrag);
window.addEventListener('mouseup', stopDrag);

// Слушатели для мобильных экранов (тач)
container.addEventListener('touchstart', startDrag);
window.addEventListener('touchmove', doDrag, { passive: false });
window.addEventListener('touchend', stopDrag);

// МАСШТАБИРОВАНИЕ (Колесико мыши)
container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    if (e.deltaY < 0) {
        scale = Math.min(scale + zoomSpeed, 4); // Макс зум х4
    } else {
        scale = Math.max(scale - zoomSpeed, 0.4); // Мин зум х0.4
    }
    updateTransform();
}, { passive: false });


// Проверка на сенсорный экран
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Логика работы с ключами
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

		key.addEventListener('mouseenter', function() { tooltip.style.display = 'block'; });
		key.addEventListener('mouseleave', function() { tooltip.style.display = 'none'; });
	}
});

// Закрытие окон
const closePopup = () => popupBg.classList.remove('active');
if(popupBg) popupBg.addEventListener('click', (e) => { if(e.target === popupBg) closePopup(); });
if(popupClose) popupClose.addEventListener('click', closePopup);

// Фильтрация
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
