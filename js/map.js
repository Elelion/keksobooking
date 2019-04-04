/*jshint esversion: 6 */

const TOTAL_ADS = 8;

let OffersCollection = {
    titles: [
        'Большая уютная квартира',
        'Маленькая неуютная квартира',
        'Огромный прекрасный дворец',
        'Маленький ужасный дворец',
        'Красивый гостевой домик',
        'Некрасивый негостеприимный домик',
        'Уютное бунгало далеко от моря',
        'Неуютное бунгало по колено в воде'
    ],

    types: [
        'palace',
        'flat',
        'house',
        'bungalo'
    ],

    checkins: [
        '12:00',
        '13:00',
        '14:00'
    ],

    checkouts: [
        '12:00',
        '13:00',
        '14:00'
    ],

    features: [
        'wifi',
        'dishwasher',
        'parking',
        'washer',
        'elevator',
        'conditioner'
    ],

    photos: [
        'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ],

    guests: {
        min: 1,
        max: 10
    },

    rooms: {
        min: 1,
        max: 5
    },

    price: {
        min: 1000,
        max: 1000000
    },

    location: {
        x: {
            min: 350,
            max: 900
        },

        y: {
            min: 130,
            max: 600
        }
    }
};

const PIN_SIZE = {
  width: 50,
  height: 70
};

// **

let announcements = [];
let template = document.querySelector('template');

const MAP = document.querySelector('.map');

let mapPins = document.querySelector('.map__pins');
let mapPinTemplate = template.content.querySelector('.map__pin');

let adTemplate = template.content.querySelector('.map__card');
let popupPhoto = template.content.querySelector('.popup__photo');
let mapFiltersContainer = document.querySelector('.map__filters-container');
let typesMap = {
	palace: 'Дворец',
	flat: 'Квартира',
	house: 'Дом',
	bungalo: 'Бунгало'
};

// **

let getRandomFromInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

let randomMixArray = function(array) {
	let copyArr = array.slice(0);

    for (let i = copyArr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = copyArr[i];
		copyArr[i] = copyArr[j];
		copyArr[j] = temp;
    }

    return copyArr;
};

let randomCutArray = function(array) {
    let copyArr = array.slice(0);
    let length = getRandomFromInterval(0, copyArr.length);
    copyArr.slice(0, length);
    return copyArr;
};

// **

let createRelatedAds = function(i) {
    let relatedAds = {
        author: {
            avatar: 'img/avatars/user' + (i < 10 ? '0' : '') + (i + 1) + '.png'
        },

        offer: {
            title: OffersCollection.titles[i],
            price: getRandomFromInterval(
				OffersCollection.price.min, OffersCollection.price.max),

            type: OffersCollection.types[getRandomFromInterval(
				0, OffersCollection.types.length - 1)],

            rooms: getRandomFromInterval(
				OffersCollection.rooms.min, OffersCollection.rooms.max),

            guests: getRandomFromInterval(
				OffersCollection.guests.min, OffersCollection.guests.max),

            checkin: OffersCollection.checkins[getRandomFromInterval(
				0, OffersCollection.checkins.length - 1)],

            checkout: OffersCollection.checkouts[getRandomFromInterval(
				0, OffersCollection.checkouts.length - 1)],

            features: randomCutArray(randomMixArray(
				OffersCollection.features)),

            description: '',
            photos: randomMixArray(OffersCollection.photos)
        },

        location: {
            x: getRandomFromInterval(
				OffersCollection.location.x.min,
				OffersCollection.location.x.max) - PIN_SIZE.width / 2,

            y: getRandomFromInterval(
				OffersCollection.location.y.min,
				OffersCollection.location.y.max) - PIN_SIZE.height
        }
    };

    relatedAds.offer.address = relatedAds.location.x + ', ' + relatedAds.location.y;
    return relatedAds;
};

// **

for (let i = 0; i < TOTAL_ADS; i++) {
    announcements[i] = createRelatedAds(i);
}

// **

MAP.classList.remove('map--faded');

// **

let createPinMarkup = function(pinData) {
	let cloneMapPinTemplate = mapPinTemplate.cloneNode(true);

	cloneMapPinTemplate.querySelector('img').src = pinData.author.avatar;
	cloneMapPinTemplate.style.left = pinData.location.x + 'px';
	cloneMapPinTemplate.style.top = pinData.location.y + 'px';
	cloneMapPinTemplate.querySelector('img').alt = pinData.offer.title;
	return cloneMapPinTemplate;
};

let renderPinsMarkup = function(pinsData) {
	let mapPinsFragment = document.createDocumentFragment();

	for (let i = 0; i < pinsData.length; i++) {
		mapPinsFragment.appendChild(createPinMarkup(pinsData[i]));
	}

	mapPins.appendChild(mapPinsFragment);
};

renderPinsMarkup(announcements);

// **

let createFeatureFragment = function(adsData) {
	let featureFragment = document.createDocumentFragment();

	for (let i = 0; i < adsData.offer.features.length; i++) {
		let featureItem = document.createElement('li');

		featureItem.className =
			'popup__feature popup__feature--' + adsData.offer.features[i];

		featureFragment.appendChild(featureItem);
	}

  	return featureFragment;
};

let createPhotosFragment = function(adsData) {
	let photosFragment = document.createDocumentFragment();

	for (let i = 0; i < adsData.offer.photos.length; i++) {
		let popupPhotoItem = popupPhoto.cloneNode(true);

		popupPhotoItem.src = adsData.offer.photos[i];
		photosFragment.appendChild(popupPhotoItem);
	}

	return photosFragment;
};

let createAds = function(adsData) {
	let ads = adTemplate.cloneNode(true);

	ads.querySelector('.map__card img').src = adsData.author.avatar;
	ads.querySelector('.popup__title').textContent = adsData.offer.title;
	ads.querySelector('.popup__text--price').textContent =
		adsData.offer.price + ' ₽/ночь';

	ads.querySelector('.popup__type').textContent =
		typesMap[adsData.offer.type];

	ads.querySelector('.popup__text--capacity').textContent =
		adsData.offer.rooms + ' комнаты для ' + adsData.offer.guests + ' гостей';

	ads.querySelector('.popup__text--time').textContent =
		'Заезд после ' + adsData.offer.checkin +
		', выезд до ' + adsData.offer.checkout;

	ads.querySelector('.popup__features').innerHTML = '';

	ads.querySelector('.popup__features').appendChild(
		createFeatureFragment(adsData));

	ads.querySelector('.popup__description').textContent =
		adsData.offer.description;

	ads.querySelector('.popup__photos').removeChild(
		ads.querySelector('.popup__photo'));

	ads.querySelector('.popup__photos').appendChild(
		createPhotosFragment(adsData));

	return ads;
};

mapFiltersContainer.insertAdjacentElement(
	'beforebegin', createAds(announcements[0]));