/*jshint esversion: 6 */

(function () {
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

  const PRICE = {
    min: 1000,
    max: 1000000
  };

  const PROPERTY_TYPES = [
    'flat',
    'house',
    'bungalo'
  ];

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

  const ROOMS = {
    min: 1,
    max: 5
  };

  const TIME = [
    '12:00',
    '13:00',
    '14:00'
  ];

  const FEATURES_LIST = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  const MAP_COORDS = {
    x: {
      min: 300,
      max: 900
    },

    y: {
      min: 160,
      max: 680
    }
  };

  // TODO: quest 5
  const PIN_PARAMS = {
    user: {
      width: 65,
      height: 82,
      offsetX: 0,
      offsetY: 48
    },

    rival: {
      width: 46,
      height: 62,
      offsetX: 5,
      offsetY: 39
    }
  }

  // TODO: quest 5
  const ROOMS_CAPACITY = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  const RUB_CURRENCY = '\u20BD';

  let userId = 0;
  let offersTitles = OFFERS_TITLES.slice(0, OFFERS_TITLES.length);

  // TODO: quest 5 - получение уникального заголовка предложения
  let getOfferTitle = function (titles) {
    let offerIndex = window.utils.getRandomInteger(0, titles.length - 1);
    let offerTitle = offersTitles[offerIndex];
    offersTitles.splice(offerIndex, 1);
    return offerTitle;
  };

  // TODO: quest 5 - получение массива с особенностями предложения
  let getFeatures = function (features) {
    let offerFeatures = [];
    let featuresCount = window.utils.getRandomInteger(1, features.length);
    for (let i = 0; i < featuresCount; i++) {
      offerFeatures.push(features[i]);
    }
    return offerFeatures;
  };


  // TODO: quest 5 - формирование объекта с данными по предложению
  let getOfferData = function () {
    let locationX =
      window.utils.getRandomInteger(MAP_COORDS.x.min, MAP_COORDS.x.max);

    let locationY =
      window.utils.getRandomInteger(MAP_COORDS.y.min, MAP_COORDS.y.max);

    let roomsCount = window.utils.getRandomInteger(ROOMS.min, ROOMS.max);
    userId++;

    return {
      'author': {
        'avatar': AVATAR_FILE_MASK +
        AVATAR_ID_PREFIX +
        userId +
        AVATAR_FILE_EXTENSION
      },

      'offer': {
        'title': getOfferTitle(offersTitles),
        'address': locationX + ', ' + locationY,
        'price': window.utils.getRandomInteger(PRICE.min, PRICE.max),
        'type': window.utils.getRandomArrayElement(PROPERTY_TYPES),
        'rooms': roomsCount,
        'guests': window.utils.getRandomInteger(1, roomsCount),
        'checkin': window.utils.getRandomArrayElement(TIME),
        'checkout': window.utils.getRandomArrayElement(TIME),
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

  // NOTE: формирование массива объектов недвижимости
  let getOffers = function (usersCount) {
    let offers = [];
    for (let i = 0; i < usersCount; i++) {
      offers.push(getOfferData());
    }
    return offers;
  };

  let offers = getOffers(USERS_COUNT);

  // TODO: quest 5
  window.data = {
    offers: offers,
    types: TYPES,
    roomsCapacity: ROOMS_CAPACITY,
    rubCurrency: RUB_CURRENCY,
    mapCoords: MAP_COORDS,
    pinParams: PIN_PARAMS
  };
})();