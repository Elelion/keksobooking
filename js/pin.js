/*jshint esversion: 6 */

(function () {
  let mapPins = document.querySelector('.map__pins');

  let mapPin =
    document.querySelector('template').content.querySelector('button.map__pin');

  // NOTE: функция убирает активное состояние у метки
  let removePinActiveState = function () {
    let activePin = mapPins.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  // NOTE: функция добавляет активное состояние для текущей метки
  let addCurrentPinActiveState = function (currentPin) {
    removePinActiveState();
    currentPin.classList.add('map__pin--active');
  };

  // TODO: quest 5 - создает метки на карте
  let createPin = function (offerData, offerNumber) {
    let newPin = mapPin.cloneNode(true);
    let left = offerData.location.x - window.data.pinParams.rival.offsetX;
    let top = offerData.location.y - window.data.pinParams.rival.offsetY;
    newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
    newPin.querySelector('img').src = offerData.author.avatar;
    newPin.tabIndex = offerNumber;
    return newPin;
  };

  // TODO: quest 5
  window.pin = {
    create: createPin,
    activate: addCurrentPinActiveState,
    deactivate: removePinActiveState
  };
})();