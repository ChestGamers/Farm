const tooltip = document.querySelector('.tooltip');
const keys = document.querySelectorAll('.key');
const popupBg = document.querySelector('.info__bg');
const popup = document.querySelector('.info');

// Базовая логика для ключей (клики, наведение)
keys.forEach(key => {
	key.addEventListener('click', function() {
		popup.querySelector('.info__photo').setAttribute('src', this.dataset.photo);
		popup.querySelector('.info_title').textContent = this.dataset.title;
		popup.querySelector('.info__text').textContent = this.dataset.description;
		popupBg.classList.add('active');
	});

	key.addEventListener('mousemove', function(e) {
		tooltip.textContent = this.dataset.title;
        // pageX и pageY учитывают прокрутку страницы, спасая от багов смещения
        tooltip.style.top = (e.pageY + 20) + 'px';
        tooltip.style.left = (e.pageX + 20) + 'px';
	});

	key.addEventListener('mouseenter', function() {
		tooltip.style.display = 'block';
	});

	key.addEventListener('mouseleave', function() {
		tooltip.style.display = 'none';
	});
});

// Закрытие модального окна по клику на оверлей
document.addEventListener('click', (e) => {
	if(e.target === popupBg) {
		popupBg.classList.remove('active');
	}
});

// Логика фильтрации
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Меняем активный класс у кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.dataset.filter;

        // Перебираем ключи и скрываем/показываем нужные
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
