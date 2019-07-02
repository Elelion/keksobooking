/*jshint esversion: 6 */

(function () {
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

  // NOTE: переключение формы в неактивное/активное
  let toggleNoticeFormDisabled = function (isFormDisabled) {
    noticeForm.classList.toggle('notice__form--disabled', isFormDisabled);
    for (let i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = isFormDisabled;
    }
  };

  let setAddressFieldValue = function (x, y) {
    addressField.value = 'x: ' + x + ', y: ' + y;
  };

  // TODO: quest 5 - получение адреса по-умолчанию
  let getDefaultAddress = function () {
    let pin = document.querySelector('.map__pin--main');

    if (pin) {
      let x = window.getComputedStyle(pin, null)
        .getPropertyValue('left').slice(0, -2);

      let y = window.getComputedStyle(pin, null)
        .getPropertyValue('top').slice(0, -2);

      setAddressFieldValue(x, y);
    }
  };

  // NOTE: Валидация текста в поле Заголовок
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

  // NOTE: Валидация значения в поле Цена
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

  // TODO: quest 5
  let setPriceFieldMinValues = function () {
    priceField.min = priceField.placeholder =
      window.data.types[typeField.value].minPrice;
  };

  let resetInvalidFieldStyle = function (field) {
    field.style.borderColor = '';
  };

  let setCapacityFieldValues = function () {
    if (capacityField.options.length > 0) {
      [].forEach.call(capacityField.options, function (item) {
        item.selected =
          (window.data.roomsCapacity[roomsField.value][0] === item.value)
          ? true
          : false;

        item.hidden =
          (window.data.roomsCapacity[roomsField.value].indexOf(item.value) >= 0)
          ? false
          : true;
      });
    }
  };

  getDefaultAddress();
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

  // TODO: quest 5
  if (priceField) {
    priceField.addEventListener('invalid', onPriceFieldInvalid);

    priceField.addEventListener('input', function () {
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

  // TODO: quest 5
  window.form = {
    isDisabled: toggleNoticeFormDisabled,
    setAddressValue: setAddressFieldValue
  };
})();