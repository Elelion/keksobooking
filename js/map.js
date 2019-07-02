/*jshint esversion: 6 */

(function () {
  let map = document.querySelector('.map');
  let mapPins = map.querySelector('.map__pins');
  let userPin = map.querySelector('.map__pin--main');

  // NOTE: переключение карты в неактивное/активное состояние
  let toggleMapDisabled = function (isMapDisabled) {
    map.classList.toggle('map--faded', isMapDisabled);
  };

  // TODO: quest 5
  let createPins = function (offers) {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < offers.length; i++) {
      fragment.appendChild(window.pin.create(offers[i], i));
    }
    mapPins.appendChild(fragment);
  };

  // TODO: quest 5 - функция обработки клика по карте
  let onMapPinClick = function (evt) {
    /**
     * NOTE:
     * берем ближайший с классом, т.к. внутри картинка,
     * забирающая фокус при клике
     */
    let targetPin = evt.target.closest('.map__pin');
    if (
      targetPin && targetPin.classList.contains('map__pin') &&
      !targetPin.classList.contains('map__pin--main')
    ) {
      window.card.show(window.data.offers[targetPin.tabIndex]);
      window.pin.activate(targetPin);

      let popup = document.querySelector('.popup');
      let popupClose = popup.querySelector('.popup__close');
      popupClose.addEventListener('click', window.card.closeClick);

      document.addEventListener('keydown', window.card.escPress);
    }
  };

  // TODO: quest 5 - drag and drop
  userPin.addEventListener('mousedown', function (evt) {
    // NOTE: отмена предыдущих действий
    evt.preventDefault();

    userPin.style.zIndex = '2';

    // NOTE: запоминаем координаты на которых стоит курсор мышы
    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    let onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      /**
       * NOTE:
       * разница между стартовыми координатами и текущим положением курсора
       */
      let shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      /**
       * NOTE:
       * перезаписываем наши текущие координаты новыми,
       * тем самым перемещаем нужный блок
       */
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      let currentCoords = {
        x: userPin.offsetLeft - shift.x,
        y: userPin.offsetTop - shift.y
      };

      let yMin = window.data.mapCoords.y.min - window.data.pinParams.user.offsetY;
      let yMax = window.data.mapCoords.y.max - window.data.pinParams.user.offsetY;

      if (window.data.mapCoords.x.min <
        currentCoords.x && currentCoords.x <
        window.data.mapCoords.x.max) {
          userPin.style.left = currentCoords.x + 'px';
      }

      if (yMin < currentCoords.y && currentCoords.y < yMax) {
        userPin.style.top = currentCoords.y + 'px';
      }

      window.form.setAddressValue(currentCoords.x,
        currentCoords.y + window.data.pinParams.user.offsetY);
    }

    let onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

  /**
  * TODO: quest 5
  * при отпускании кнопки мыши на маркере (пользовательская метка)
  * сервис активируется и создаются другие метки
  */
  let onUserPinMouseup = function () {
  toggleMapDisabled(false);
  window.form.isDisabled(false);
  createPins(window.data.offers);

  map.addEventListener('click', onMapPinClick);
  userPin.removeEventListener('mouseup', onUserPinMouseup);
  };

  // TODO: quest 5 - по-умолчанию сервис отключен
  toggleMapDisabled(true);
  window.form.isDisabled(true);

  userPin.addEventListener('mouseup', onUserPinMouseup);
})();