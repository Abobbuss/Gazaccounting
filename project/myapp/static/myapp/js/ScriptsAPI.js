var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';
var addPersonAPI = 'http://127.0.0.1:8000/api/person/create/';
var getCitiesAPI = 'http://127.0.0.1:8000/api/city/';
var addItemAPI = 'http://127.0.0.1:8000/api/item/create/';

export function fetchCsrfToken() {
    var csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);

    if (csrfTokenMatch && csrfTokenMatch[1]) {
        return csrfTokenMatch[1];
    } else {
        console.error('Не удалось найти csrftoken в cookie');
        return null;
    }
}

export async function getFetchCities() {
    try {
        const response = await fetch(getCitiesAPI);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
}

function postAddPerson() {
  const lastName = document.getElementById('last-name').value;
  const firstName = document.getElementById('first-name').value;
  const middleName = document.getElementById('middle-name').value;
  const cityId = document.getElementById('citySelect').value;

  const data = {
    last_name: lastName,
    first_name: firstName,
    middle_name: middleName,
    city: cityId,
  };
  console.log(data)

  const csrfTokenMatch = fetchCsrfToken();

  if (!csrfTokenMatch) {
    console.error('Не удалось получить CSRF-токен');
    return;
  }

  fetch('http://127.0.0.1:8000/api/person/create/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfTokenMatch,
  },
  body: JSON.stringify(data),
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    
  })
  .catch(error => {
    console.error('Error:', error);

    // Выводим тело ответа в случае ошибки
    if (error.response) {
      error.response.text().then(text => {
        console.error('Response body:', text);
      });
    }

    // Добавьте здесь код для обработки ошибки
  });
}



export function postAddItem() {
  var itemName = document.getElementById('itemName');
  var itemBrand = document.getElementById('itemBrand');

  if (!itemName || !itemBrand) {
    console.error('Не удалось найти один из элементов');
    return;
  }

  var csrfTokenMatch = fetchCsrfToken();

  if (!csrfTokenMatch) {
  return;
  }

  var itemNameValue = itemName.value;
  var itemBrandValue = itemBrand.value;

  var data = {
  "name": itemNameValue,
  "brand": itemBrandValue
  };

  fetch(addItemAPI, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfTokenMatch
  },
  body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data && data.message === 'Успешно добавлено') {
        console.log('Вещь добавлена успешно:', data);
        showMessage(data.message, true);
    } else {
        console.log(data);
        showMessage(data.message || "Произошла ошибка");
    }
  })
  .catch((error) => {
    const errorText = error.response ? error.response.text() : undefined;

    return Promise.resolve(errorText);
  });
}

function showMessage(message) {
  var resultsList = document.getElementById('errorMesageItem');
  resultsList.innerHTML = '';

  resultsList.append(message)
}

window.postAddItem = postAddItem;
window.postAddPerson = postAddPerson;