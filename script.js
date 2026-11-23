'use strict';

// Данные об услугах в виде JSON-подобной структуры
const SERVICES = {
  basic: {
    price: 100,
    hasOptions: false,
    hasProperty: false
  },
  standard: {
    price: 200,
    hasOptions: true,
    hasProperty: false
  },
  premium: {
    price: 300,
    hasOptions: false,
    hasProperty: true
  }
};

function getSelectedService() {
  const radios = document.getElementsByName('service');
  let selected = 'basic';
  radios.forEach(function (radio) {
    if (radio.checked) {
      selected = radio.value;
    }
  });
  return selected;
}

function updateVisibility(serviceKey) {
  const optionsBlock = document.getElementById('options-block');
  const propertyBlock = document.getElementById('property-block');
  const service = SERVICES[serviceKey];

  optionsBlock.style.display = service.hasOptions ? 'block' : 'none';
  propertyBlock.style.display = service.hasProperty ? 'block' : 'none';
}

function recalculate() {
  const errorBox = document.getElementById('error');
  const resultBox = document.getElementById('result');
  const quantityInput = document.getElementById('quantity');

  const rawValue = quantityInput.value.trim();
  const numberPattern = /^\d+$/;

  if (!numberPattern.test(rawValue)) {
    errorBox.textContent = 'Ошибка: количество должно быть целым неотрицательным числом.';
    resultBox.textContent = '';
    return;
  }

  errorBox.textContent = '';

  const quantity = parseInt(rawValue, 10);
  if (quantity <= 0) {
    errorBox.textContent = 'Ошибка: количество должно быть больше нуля.';
    resultBox.textContent = '';
    return;
  }

  const serviceKey = getSelectedService();
  const service = SERVICES[serviceKey];

  let unitPrice = service.price;

  // Учитываем опцию (только если она отображается)
  if (service.hasOptions) {
    const optionSelect = document.getElementById('option');
    unitPrice += parseInt(optionSelect.value, 10);
  }

  // Учитываем свойство (только если чекбокс отображается и отмечен)
  if (service.hasProperty) {
    const propertyCheckbox = document.getElementById('property');
    if (propertyCheckbox.checked) {
      unitPrice += parseInt(propertyCheckbox.value, 10);
    }
  }

  const total = unitPrice * quantity;
  resultBox.textContent = 'Стоимость услуги: ' + total + ' ₽ (цена за единицу: ' + unitPrice + ' ₽)';
}

window.addEventListener('DOMContentLoaded', function () {
  // Радиокнопки типа услуги
  const radios = document.getElementsByName('service');
  radios.forEach(function (radio) {
    radio.addEventListener('change', function (event) {
      updateVisibility(event.target.value);
      recalculate();
    });
  });

  // Количество
  const quantityInput = document.getElementById('quantity');
  quantityInput.addEventListener('input', recalculate);

  // Селект опции
  const optionSelect = document.getElementById('option');
  optionSelect.addEventListener('change', recalculate);

  // Чекбокс свойства
  const propertyCheckbox = document.getElementById('property');
  propertyCheckbox.addEventListener('change', recalculate);

  // Начальная инициализация: показываем/скрываем блоки и считаем
  updateVisibility(getSelectedService());
  recalculate();
});
