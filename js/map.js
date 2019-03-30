/*jshint esversion: 6 */

/**
 * NOTE:
 * Это файл, в котором вы будете вести работу с похожими объявлениями на карте
 */

/**
 * TODO:
 * 1.
 * Создайте массив, состоящий из 8 сгенерированных JS объектов, которые
 * будут описывать похожие объявления неподалёку.
 */

const TOTAL_ADS = 8;
// let value = 0;

var OffersCollection = {
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

let PIN_SIZE = {
    width: 50,
    height: 70
};

// **

let getRandomFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

let randomMixArray = function (array) {
    /**
     * NOTE:
     * Метод slice() возвращает новый массив, содержащий копию
     * части исходного массива. Синтаксис: arr.slice([begin[, end]])
     */
    let copyArr = array.slice(0);

    for (let i = copyArr.length - 1; i > 0; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = copyArr[i];
        copyArr[i] = copyArr[j];
        copyArr[j] = temp;
    }
    return copyArr;
};

let randomCutArray = function (array) {
    var copyArr = array.slice(0);
    var length = getRandomFromInterval(0, copyArr.length);
    copyArr.slice(0, length);
    return copyArr;
};

//   **

// TODO: 1. ...объявления неподалёку. Структура объектов должна быть следующей:
let createRelatedAds = function(value) {
    let relatedAds = {
        author: {
            avatar: 'img/avatars/user' + (value < 10 ? '0' : '') + (value + 1) + '.png'
        },

        offer: {
            title: OffersCollection.titles[value],
            address: location.x + ', ' + location.y,
            price: getRandomFromInterval(OffersCollection.price.min, OffersCollection.price.max),
            type: OffersCollection.types[getRandomFromInterval(0, OffersCollection.types.length - 1)],
            rooms: getRandomFromInterval(OffersCollection.rooms.min, OffersCollection.rooms.max),
            guests: getRandomFromInterval(OffersCollection.guests.min, OffersCollection.guests.max),
            checkin: OffersCollection.checkins[getRandomFromInterval(0, OffersCollection.checkins.length -1)],
            checkout: OffersOptions.CHECKINS[getRandomFromInterval(0, OffersOptions.CHECKINS.length - 1)],
            features: randomCutArray(randomMixArray(OffersOptions.FEATURES)),
            description: '',
            photos: randomMixArray(OffersCollection.photos)
        },

        location: {
            x: getRandomFromInterval(OffersCollection.location.x.min, OffersCollection.location.x.max) - PIN_SIZE.width / 2,
            y: getRandomFromInterval(OffersCollection.location.y.min, OffersCollection.location.y.max) - PIN_SIZE.height
        }
};

// alert(relatedAds.offer.address.location.x);
for (let x = 0; x < TOTAL_ADS; x++) {
    alert('relatedAds.offer.title');
}