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

// УМНАЯ НАСТРОЙКА ЗУМА КОЛЕСИКОМ НА ПК
panzoomElement.parentElement.addEventListener('wheel', function(e) {
    const currentScale = panzoom.getScale();

    // Если масштаб минимальный (0.1) И пользователь крутит колесико НА СЕБЯ (вниз, e.deltaY > 0)
    if (currentScale <= 0.1 && e.deltaY > 0) {
        // Мы НЕ вызываем panzoom.zoomWithWheel и НЕ делаем e.preventDefault().
        // Позволяем браузеру прокрутить саму страницу вниз к инструкции.
    } else if (window.scrollY > 0 && e.deltaY < 0) {
        // Если страница прокручена вниз, и пользователь крутит колесико ОТ СЕБЯ (вверх),
        // даем странице сначала вернуться в самый верх, прежде чем зумить карту.
    } else {
        // Во всех остальных случаях — зумим карту и запрещаем скролл страницы
        e.preventDefault();
        panzoom.zoomWithWheel(e);
    }
}, { passive: false });

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

    // УМНАЯ ЛОГИКА ДЛЯ МОБИЛОК (1-й тап — имя, 2-й тап — попап)
    if (isTouchDevice) {
        key.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });

        key.addEventListener('touchend', function(e) {
            e.preventDefault(); 
            e.stopPropagation();
            
            const touch = e.changedTouches[0];
            const moveX = Math.abs(touch.clientX - touchStartX);
            const moveY = Math.abs(touch.clientY - touchStartY);

            if (moveX < scrollThreshold && moveY < scrollThreshold) {
                if (activeMobileKey === this) {
                    openFullPopup(this);
                } else {
                    tooltip.style.display = 'none'; 
                    activeMobileKey = this; 
                    tooltip.innerText = this.dataset.title;
                    tooltip.style.display = 'block';
                    
                    // Получаем геометрию текущей кнопки-маркера
                    const rect = this.getBoundingClientRect();
                    
                    // Высчитываем центр по горизонтали
                    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                    
                    // УМНОЕ ПОЗИЦИОНИРОВАНИЕ ВЕРТИКАЛИ:
                    // Если до верхнего края экрана осталось меньше 60px — кидаем тултип ПОД кнопку
                    if (rect.top < 60) {
                        tooltip.style.top = (rect.bottom + 10) + 'px'; // 10px отступ снизу
                    } else {
                        // Иначе стандартно вешаем НАД кнопкой
                        tooltip.style.top = (rect.top - 45) + 'px'; 
                    }
                }
            }
        }, { passive: false }); 
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
    
    // Сбрасываем скролл попапа в самый верх при открытии нового ключа
    popup.scrollTop = 0;
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

// УМНЫЙ БЛОКИРОВЩИК ДЛЯ МОБИЛОК: скроллит страницу ТОЛЬКО при максимальном отдалении карты
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.info')) {
        return; 
    }
    
    const currentScale = panzoom.getScale();
    
    if (currentScale > 0.1) {
        e.preventDefault();
    }
}, { passive: false });
