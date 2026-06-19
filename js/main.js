const tooltip = document.querySelector('.tooltip');
const keys = document.querySelectorAll('.key');
const popupBg = document.querySelector('.info__bg');
const popup = document.querySelector('.info');
const popupClose = document.querySelector('.info__close');

// Инициализация Panzoom
const panzoomElement = document.getElementById('panzoom-element');
const panzoom = Panzoom(panzoomElement, {
    maxScale: 6,
    minScale: 0.1,
    contain: 'outside',
    startScale: 1
});

// Настройка зума колесиком мыши на ПК
panzoomElement.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);

// Функция автоматического счетчика ключей
function updateCounters() {
    const totalKeys = keys.length;
    let lootCount = 0;
    let questCount = 0;

    keys.forEach(key => {
        if (key.dataset.type === 'loot') lootCount++;
        if (key.dataset.type === 'quest') questCount++;
    });

    document.getElementById('count-all').innerText = totalKeys;
    document.getElementById('count-loot').innerText = lootCount;
    document.getElementById('count-quest').innerText = questCount;
}

updateCounters();

// Переменные для отслеживания ложных тапов при скролле на мобилках
let touchStartX = 0;
let touchStartY = 0;
const scrollThreshold = 10; // Расстояние в пикселях, после которого тап считается свайпом карты

keys.forEach(key => {
    // 1. НАЖАТИЕ (ПК и Мобилки) — открывает большое окно с фото
    key.addEventListener('click', function(e) {
        e.stopPropagation();
        tooltip.style.display = 'none';
        
        popup.querySelector('.info__photo').setAttribute('src', this.dataset.photo);
        popup.querySelector('.info_title').innerText = this.dataset.title;
        popup.querySelector('.info__text').innerText = this.dataset.description;
        popupBg.classList.add('active');
    });

    // 2. ЛОГИКА ДЛЯ ПК (Движение мышки)
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

    // 3. УМНАЯ ЛОГИКА ДЛЯ МОБИЛОК (Фильтруем скролл и чистый тап)
    key.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        const touch = e.touches[0];
        // Запоминаем, где палец коснулся экрана изначально
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    key.addEventListener('touchend', function(e) {
        e.stopPropagation();
        const touch = e.changedTouches[0];
        
        // Вычисляем, насколько далеко палец ушел в сторону при свайпе
        const moveX = Math.abs(touch.clientX - touchStartX);
        const moveY = Math.abs(touch.clientY - touchStartY);

        // Если палец сместился меньше чем на 10 пикселей — это ЧИСТЫЙ КОРОТКИЙ ТАП! Показываем тултип
        if (moveX < scrollThreshold && moveY < scrollThreshold) {
            tooltip.innerText = this.dataset.title;
            tooltip.style.display = 'block';
            
            // Позиционируем чуть выше пальца
            tooltip.style.top = (touch.clientY - 55) + 'px';
            tooltip.style.left = (touch.clientX - 40) + 'px';
        }
    }, { passive: true });
});

// Если пользователь просто кликает по пустой карте или начинает свайп — убираем подсказку
document.addEventListener('touchstart', () => {
    tooltip.style.display = 'none';
}, { passive: true });

panzoomElement.addEventListener('panzoompan', () => {
    tooltip.style.display = 'none';
});

// Фильтрация кнопок
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation(); 
        tooltip.style.display = 'none';
        
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
