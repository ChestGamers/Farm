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
let activeMobileKey = null; // Запоминаем, на какой ключ нажали первый раз

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

keys.forEach(key => {
    // ОТКРЫТИЕ БОЛЬШОГО ОКНА (Для ПК — по клику, для мобилок — контролируется ниже)
    key.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Если это мобилка, стандартный клик не должен сразу открывать большое окно
        if (isTouchDevice) return; 

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

    // УМНАЯ ЛОГИКА ДЛЯ МОБИЛОК (Разделение на 1-й и 2-й тап)
    if (isTouchDevice) {
        key.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });

        key.addEventListener('touchend', function(e) {
            e.stopPropagation();
            const touch = e.changedTouches[0];
            
            const moveX = Math.abs(touch.clientX - touchStartX);
            const moveY = Math.abs(touch.clientY - touchStartY);

            // Если это был чистый тап (не сдвиг карты)
            if (moveX < scrollThreshold && moveY < scrollThreshold) {
                
                // Если мы тапаем по ключу, на котором УЖЕ горит тултип — открываем большое окно
                if (activeMobileKey === this) {
                    tooltip.style.display = 'none';
                    activeMobileKey = null; // сбрасываем статус
                    openFullPopup(this);
                } else {
                    // Иначе — это первый тап. Показываем только тултип
                    activeMobileKey = this;
                    tooltip.innerText = this.dataset.title;
                    tooltip.style.display = 'block';
                    
                    tooltip.style.top = (touch.clientY - 55) + 'px';
                    tooltip.style.left = (touch.clientX - 40) + 'px';
                }
            }
        }, { passive: true });
    }
});

// Функция открытия большого попапа
function openFullPopup(keyElement) {
    popup.querySelector('.info__photo').setAttribute('src', keyElement.dataset.photo);
    popup.querySelector('.info_title').innerText = keyElement.dataset.title;
    popup.querySelector('.info__text').innerText = keyElement.dataset.description;
    popupBg.classList.add('active');
}

// Сброс подсказок при клике на карту или сдвиге
document.addEventListener('touchstart', () => {
    tooltip.style.display = 'none';
    activeMobileKey = null;
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

const closePopup = () => popupBg.classList.remove('active');
popupBg.addEventListener('click', (e) => { if(e.target === popupBg) closePopup(); });
if (popupClose) popupClose.addEventListener('click', closePopup);
