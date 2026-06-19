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

// Переменные для мобильной логики
let touchStartX = 0;
let touchStartY = 0;
const scrollThreshold = 10; 
let activeMobileKey = null; 

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

keys.forEach(key => {
    // ОТКРЫТИЕ БОЛЬШОГО ОКНА (Чисто для ПК)
    key.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isTouchDevice) return; // На мобилках клик полностью игнорируем
        openFullPopup(this);
    });

    // ЛОГИКА ДЛЯ ПК (Наведение мышки)
    if (!isTouchDevice) {
        key.addEventListener('mousemove', function(e) {
            tooltip.innerText = this.dataset.title;
            tooltip.style.top = (e.clientY + 20) + 'px';
            tooltip.style.left = (e.clientX + 20) + 'px';
        });

        key.addEventListener('mouseenter', function() { tooltip.style.display = 'block'; });
        key.addEventListener('mouseleave', function() { tooltip.style.display = 'none'; });
    }

    // УМНАЯ ЛОГИКА ДЛЯ МОБИЛОК (Исправленная!)
    if (isTouchDevice) {
        key.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });

        key.addEventListener('touchend', function(e) {
            // ВАЖНО: Предотвращаем симуляцию клика браузером после тапа!
            e.preventDefault(); 
            e.stopPropagation();
            
            const touch = e.changedTouches[0];
            const moveX = Math.abs(touch.clientX - touchStartX);
            const moveY = Math.abs(touch.clientY - touchStartY);

            // Если это был чистый тап (не сдвиг карты)
            if (moveX < scrollThreshold && moveY < scrollThreshold) {
                
                // Если мы тапаем по ключу, который УЖЕ активен (тултип горит) — открываем большое окно
                if (activeMobileKey === this) {
                    openFullPopup(this);
                } else {
                    // Иначе это первый тап по новому ключу.
                    tooltip.style.display = 'none'; // Скрываем предыдущий тултип, если он был
                    
                    activeMobileKey = this; // Запоминаем текущую точку
                    tooltip.innerText = this.dataset.title;
                    tooltip.style.display = 'block';
                    
                    tooltip.style.top = (touch.clientY - 55) + 'px';
                    tooltip.style.left = (touch.clientX - 40) + 'px';
                }
            }
        }, { passive: false }); // Важно: false, чтобы разрешить preventDefault
    }
});

// Функция открытия большого попапа
function openFullPopup(keyElement) {
    activeMobileKey = null; 
    tooltip.style.display = 'none';
    
    popup.querySelector('.info__photo').setAttribute('src', keyElement.dataset.photo);
    popup.querySelector('.info_title').innerText = keyElement.dataset.title;
    popup.querySelector('.info__text').innerText = keyElement.dataset.description;
    popupBg.classList.add('active');
}

// Функция закрытия окна
const closePopup = () => {
    popupBg.classList.remove('active');
    activeMobileKey = null; 
    tooltip.style.display = 'none';
};

// Сброс подсказок при клике на пустую карту или сдвиге
document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.filter-btn') && !e.target.closest('.info')) {
        tooltip.style.display = 'none';
        activeMobileKey = null;
    }
}, { passive: true });

panzoomElement.addEventListener('panzoompan', () => {
    tooltip.style.display = 'none';
    activeMobileKey = null;
});

// Фильтрация кнопок
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation(); 
        tooltip.style.display = 'none';
        activeMobileKey = null;
        
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

popupBg.addEventListener('click', (e) => { if(e.target === popupBg) closePopup(); });
if (popupClose) popupClose.addEventListener('click', closePopup);
