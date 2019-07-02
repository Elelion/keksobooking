/*jshint esversion: 6 */

(function () {
  let map = document.querySelector('.map');

  let mapCard =
    document.querySelector('template').content.querySelector('.map__card');

  let mapFiltersContainer = map.querySelector('.map__filters-container');

  // NOTE: формирует список особенностей предложения для вывода в объявление
  let getFeaturesList = function (features) {
    let featuresList = '';
    for (let i = 0; i < features.length; i++) {
      featuresList += '<li class="feature feature--' + features[i] + '"></li>';
    }
    return featuresList;
  };

  // NOTE: формирует текст объявления
  let createAdvert = function (offerData) {
    let advert = mapCard.cloneNode(true);
    advert.querySelector('h3').textContent = offerData.offer.title;
    advert.querySelector('small').textContent = offerData.offer.address;

    advert.querySelector('.popup__price').textContent =
      offerData.offer.price + ' ' + RUB_CURRENCY + '/ночь';

    advert.querySelector('h4').textContent = TYPES[offerData.offer.type].ru;

    advert.querySelector('h4 + p').textContent =
      offerData.offer.rooms + ' комнаты для ' +
      offerData.offer.guests + ' гостей';

    advert.querySelector('h4 + p + p').textContent =
      'Заезд после ' + offerData.offer.checkin + ', выезд до ' +
      offerData.offer.checkout;

    advert.querySelector('.popup__features').innerHTML =
      getFeaturesList(offerData.offer.features);

    advert.querySelector('.popup__features + p').textContent =
      offerData.offer.description;

    advert.querySelector('.popup__avatar').src = offerData.author.avatar;
    return advert;
  };

  /**
 * NOTE:
 * показывает объявление: если уже есть попап,
 * то сначала удаляем, а затем создаем новый
 */
  let showAdvert = function (advert) {
    removePopup();
    let currentAdvert = createAdvert(advert);
    map.insertBefore(currentAdvert, mapFiltersContainer);
  };

  // NOTE: удаляет попап, если он есть
  let removePopup = function () {
    let popup = map.querySelector('.popup');
    if (popup) {
      map.removeChild(popup);
    }
  };

  // TODO: quest 5 - функция закрытия попапа
  let closePopup = function () {
    removePopup();
    window.pin.deactivate();
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // NOTE: функция нажатия на кнопку Закрыть в попап
  let onPopupCloseClick = function () {
    closePopup();
  };

  // NOTE: функция нажатия Esc при открытом попапе
  let onPopupEscPress = function (evt) {
    // TODO: quest 5
    window.utils.isEscEvent(evt, closePopup);
  };

  // **

  // TODO: quest 5
  window.card = {
    show: showAdvert,
    closeClick: onPopupCloseClick,
    escPress: onPopupEscPress
  };
})();