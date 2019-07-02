/*jshint esversion: 6 */

(function () {
  const ESC_KEYCODE = 27;

  // TODO: quest 5 - при нажатии клавиши Escape
  let isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  // NOTE: функции для работы с массивами
  let getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let getRandomArrayElement = function (arr) {
    let randomElement = arr[getRandomInteger(0, arr.length - 1)];
    return randomElement;
  };

  // TODO: quest 5
  window.utils = {
    isEscEvent: isEscEvent,
    getRandomInteger: getRandomInteger,
    getRandomArrayElement: getRandomArrayElement
  };
})();