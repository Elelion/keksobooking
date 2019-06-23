/*jshint esversion: 6 */

// **

const USERS_COUNT = 8;
const AVATAR_FILE_MASK = 'img/avatars/user';
const AVATAR_ID_PREFIX = 0;
const AVATAR_FILE_EXTENSION = '.png';

const OFFERS_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

const PRICE_MIN = 1000;
const PRICE_MAX = 1000000;
const PROPERTY_TYPES = ['flat', 'house', 'bungalo'];
const TYPES = {
  flat: {
    ru: 'Квартира',
    minPrice: 1000
  },
  bungalo: {
    ru: 'Бунгало',
    minPrice: 0
  },
  house: {
    ru: 'Дом',
    minPrice: 5000
  },
  palace: {
    ru: 'Дворец',
    minPrice: 10000
  }
};

const ROOMS_MIN = 1;
const ROOMS_MAX = 5;
const TIME = ['12:00', '13:00', '14:00'];
const FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

const LOCATION_X_MIN = 300;
const LOCATION_X_MAX = 900;

const LOCATION_Y_MIN = 100;
const LOCATION_Y_MAX = 500;

const MAP_PIN_WIDTH = 46;
const MAP_PIN_HEIGHT = 62;

const RUB_CURRENCY = '\u20BD';

const ESC_KEYCODE = 27;

let userId = 0;
let offersTitles = OFFERS_TITLES.slice(0, OFFERS_TITLES.length);

let map = document.querySelector('.map');
let mapPins = map.querySelector('.map__pins');
let userPin = map.querySelector('.map__pin--main');
let mapFiltersContainer = map.querySelector('.map__filters-container');
let mapPin = document.querySelector('template').content.querySelector('button.map__pin');
let mapCard = document.querySelector('template').content.querySelector('.map__card');

let noticeForm = document.querySelector('.notice__form');
let noticeFormFieldsets = document.querySelectorAll('fieldset');
let titleField = noticeForm.querySelector('#title');
let addressField = noticeForm.querySelector('#address');
let timeInField = noticeForm.querySelector('#timein');
let timeOutField = noticeForm.querySelector('#timeout');
let typeField = noticeForm.querySelector('#type');
let priceField = noticeForm.querySelector('#price');
let roomsField = noticeForm.querySelector('#room_number');
let capacityField = noticeForm.querySelector('#capacity');
let submitButton = noticeForm.querySelector('.form__submit');

// переключение сервиса в неактивное/активное состояние
let toggleMapDisabled = function (isMapDisabled) {
  map.classList.toggle('map--faded', isMapDisabled);
};

// переключение формы в неактивное/активное
let toggleNoticeFormDisabled = function (isFormDisabled) {
  noticeForm.classList.toggle('notice__form--disabled', isFormDisabled);
  for (let i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = isFormDisabled;
  }
};

// валидация формы объявления

// получение адреса по-умолчанию
let getAddress = function () {
  let pin = document.querySelector('.map__pin--main');
  if (pin) {
    let pinLeft = window.getComputedStyle(pin, null).getPropertyValue('left').slice(0, -2);
    let pinTop = window.getComputedStyle(pin, null).getPropertyValue('top').slice(0, -2);
    addressField.value = pinLeft + ', ' + pinTop;
  }
};

// Валидация текста в поле Заголовок
let onTitleFieldInvalid = function () {
  if (titleField.validity.tooShort) {
    titleField.setCustomValidity('Минимальная длина — 30 символов');
  } else if (titleField.validity.tooLong) {
    titleField.setCustomValidity('Максимальная длина — 100 символов');
  } else if (titleField.validity.valueMissing) {
    titleField.setCustomValidity('Обязательное поле');
  } else {
    titleField.setCustomValidity('');
  }
};

// Валидация значения в поле Цена
let onPriceFieldInvalid = function () {
  if (priceField.validity.rangeUnderflow) {
    priceField.setCustomValidity('Минимальная цена — ' + priceField.min);
  } else if (priceField.validity.rangeOverflow) {
    priceField.setCustomValidity('Максимальная цена — ' + priceField.max);
  } else if (priceField.validity.valueMissing) {
    priceField.setCustomValidity('Обязательное поле');
  } else {
    priceField.setCustomValidity('');
  }
};

let onTimeInFieldChange = function () {
  timeOutField.value = timeInField.value;
};

let onTimeOutFieldChange = function () {
  timeInField.value = timeOutField.value;
};

let setPriceFieldMinValues = function () {
  priceField.min = TYPES[typeField.value].minPrice;
};

let hideCapacityFieldValues = function () {
  for (let i = 0; i < roomsField.length; i++) {
    if (
      roomsField.value > roomsField.length //                   Прячем значения в поле Вместимость:
      && capacityField.children[i].value !== '0'//              1. если выбрано 100 комнат скроет все кроме -не для гостей-,
      || capacityField.children[i].value > roomsField.value //  2. если вместимость > числа комнат, то скроет вместимость
      || capacityField.children[i].value === '0' //             3. скроет -не для гостей- везде кроме 100 комнат
      && roomsField.value < roomsField.length //
    ) {
      capacityField.children[i].hidden = true;
    } else {
      capacityField.children[i].hidden = false;
    }
  }
};

let setCapacityFieldValues = function () {
  if (roomsField.value < roomsField.length) {
    capacityField.value = roomsField.value;
  } else {
    capacityField.value = '0';
  }
  hideCapacityFieldValues();
};

let resetInvalidFieldStyle = function (field) {
  field.style.borderColor = '';
};

/**/

getAddress();
setPriceFieldMinValues();
setCapacityFieldValues();

if (titleField) {
  titleField.addEventListener('invalid', onTitleFieldInvalid);

  titleField.addEventListener('focus', function () {
    resetInvalidFieldStyle(titleField);
  });

  titleField.addEventListener('blur', function () {
    titleField.checkValidity();
  });
}

if (priceField) {
  priceField.addEventListener('invalid', onPriceFieldInvalid);

  priceField.addEventListener('focus', function () {
    resetInvalidFieldStyle(priceField);
  });

  priceField.addEventListener('blur', function () {
    priceField.checkValidity();
  });
}

if (typeField) {
  typeField.addEventListener('change', function () {
    setPriceFieldMinValues();
  });
}

if (roomsField) {
  roomsField.addEventListener('change', function () {
    setCapacityFieldValues();
  });
}

if (timeInField) {
  timeInField.addEventListener('change', onTimeInFieldChange);
}

if (timeOutField) {
  timeOutField.addEventListener('change', onTimeOutFieldChange);
}

noticeForm.addEventListener('invalid', function (evt) {
  let invalidField = evt.target;
  invalidField.style.borderColor = 'red';
}, true);

submitButton.addEventListener('click', function () {
  if (noticeForm.checkValidity()) {
    noticeForm.submit();
  }
});

/**/

// функция убирает активное состояние у метки
let removePinActiveState = function () {
  let activePin = mapPins.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

// функция добавляет активное состояние для текущей метки
let addCurrentPinActiveState = function (currentPin) {
  removePinActiveState();
  currentPin.classList.add('map__pin--active');
};

// удаляет попап, если он есть
let removePopup = function () {
  let popup = map.querySelector('.popup');
  if (popup) {
    map.removeChild(popup);
  }
};

// функция закрытия попапа
let closePopup = function () {
  removePopup();
  removePinActiveState();
  document.removeEventListener('keydown', onPopupEscPress);
};

// функция нажатия Esc при открытом попапе
let onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

// функция нажатия на кнопку Закрыть в попап
let onPopupCloseClick = function () {
  closePopup();
};

// функция обработки клика по карте
let onMapPinClick = function (evt) {
  let targetPin = evt.target.closest('.map__pin'); // берем ближайший с классом, т.к. внутри картинка, забирающая фокус при клике
  if (
    targetPin && targetPin.classList.contains('map__pin') &&
    !targetPin.classList.contains('map__pin--main')
  ) {
    showAdvert(offers[targetPin.tabIndex]);
    addCurrentPinActiveState(targetPin);

    let popup = document.querySelector('.popup');
    let popupClose = popup.querySelector('.popup__close');
    popupClose.addEventListener('click', onPopupCloseClick);

    document.addEventListener('keydown', onPopupEscPress);
  }
};

// при отпускании кнопки мыши на маркере (пользовательская метка) сервис активируется и создаются другие метки
let onUserPinMouseup = function () {
  toggleMapDisabled(false);
  toggleNoticeFormDisabled(false);
  createPins(offers);

  map.addEventListener('click', onMapPinClick);
  userPin.removeEventListener('mouseup', onUserPinMouseup);
};

// функции для работы с массивами
let getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let getRandomArrayElement = function (arr) {
  let randomElement = arr[getRandomInteger(0, arr.length - 1)];
  return randomElement;
};

// получение уникального заголовка предложения
let getOfferTitle = function (titles) {
  let offerIndex = getRandomInteger(0, titles.length - 1);
  let offerTitle = offersTitles[offerIndex];
  offersTitles.splice(offerIndex, 1);
  return offerTitle;
};

// получение массива с особенностями предложения
let getFeatures = function (features) {
  let offerFeatures = [];
  let featuresCount = getRandomInteger(1, features.length);
  for (let i = 0; i < featuresCount; i++) {
    offerFeatures.push(features[i]);
  }
  return offerFeatures;
};

// формирование объекта с данными по предложению
let getOfferData = function () {
  let locationX = getRandomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
  let locationY = getRandomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);
  let propertyAddress = locationX + ', ' + locationY;
  let roomsCount = getRandomInteger(ROOMS_MIN, ROOMS_MAX);
  let guestsCount = getRandomInteger(1, roomsCount);
  userId++;

  return {
    'author': {
      'avatar': AVATAR_FILE_MASK + AVATAR_ID_PREFIX + userId + AVATAR_FILE_EXTENSION
    },
    'offer': {
      'title': getOfferTitle(offersTitles),
      'address': propertyAddress,
      'price': getRandomInteger(PRICE_MIN, PRICE_MAX),
      'type': getRandomArrayElement(PROPERTY_TYPES),
      'rooms': roomsCount,
      'guests': guestsCount,
      'checkin': getRandomArrayElement(TIME),
      'checkout': getRandomArrayElement(TIME),
      'features': getFeatures(FEATURES_LIST),
      'description': '',
      'photos': []
    },
    'location': {
      'x': locationX,
      'y': locationY
    }
  };
};

// формирование массива объектов недвижимости
let getOffers = function (usersCount) {
	let offers = [];
	for (let i = 0; i < usersCount; i++) {
		offers.push(getOfferData());
	}
	return offers;
};

// создает метки на карте
let createPin = function (offerData, offerNumber) {
	let newPin = mapPin.cloneNode(true);
	let left = offerData.location.x - MAP_PIN_WIDTH / 2;
	let top = offerData.location.y - MAP_PIN_HEIGHT;
	newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
	newPin.querySelector('img').src = offerData.author.avatar;
	newPin.tabIndex = offerNumber;
	return newPin;
};

let createPins = function (offers) {
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < offers.length; i++) {
    fragment.appendChild(createPin(offers[i], i));
  }
  mapPins.appendChild(fragment);
};

// формирует список особенностей предложения для вывода в объявление
let getFeaturesList = function (features) {
  let featuresList = '';
  for (let i = 0; i < features.length; i++) {
    featuresList += '<li class="feature feature--' + features[i] + '"></li>';
  }
  return featuresList;
};

// формирует текст объявления
let createAdvert = function (offerData) {
  let advert = mapCard.cloneNode(true);
  advert.querySelector('h3').textContent = offerData.offer.title;
  advert.querySelector('small').textContent = offerData.offer.address;
  advert.querySelector('.popup__price').textContent = offerData.offer.price + ' ' + RUB_CURRENCY + '/ночь';
  advert.querySelector('h4').textContent = TYPES[offerData.offer.type].ru;
  advert.querySelector('h4 + p').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  advert.querySelector('h4 + p + p').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  advert.querySelector('.popup__features').innerHTML = getFeaturesList(offerData.offer.features);
  advert.querySelector('.popup__features + p').textContent = offerData.offer.description;
  advert.querySelector('.popup__avatar').src = offerData.author.avatar;
  return advert;
};

// показывает объявление: если уже есть попап, то сначала удаляем, а затем создаем новый
let showAdvert = function (advert) {
  removePopup();
  let currentAdvert = createAdvert(advert);
  map.insertBefore(currentAdvert, mapFiltersContainer);
};

/**/

// по-умолчанию сервис отключен
toggleMapDisabled(true);
toggleNoticeFormDisabled(true);

// создаем обработчик отпускания маркера
if (userPin) {
  userPin.addEventListener('mouseup', onUserPinMouseup);
}

let offers = getOffers(USERS_COUNT);