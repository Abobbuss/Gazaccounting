var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';
var addPersonAPI = 'http://127.0.0.1:8000/api/person/create/';
var getCitiesAPI = 'http://127.0.0.1:8000/api/city/';
var addItemAPI = 'http://127.0.0.1:8000/api/item/create/';

function fetchCsrfToken() {
  var csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);

  if (csrfTokenMatch && csrfTokenMatch[1]) {
      return csrfTokenMatch[1];
  } else {
      console.error('Не удалось найти csrftoken в cookie');
      return null;
  }
}

function loadCities() {
  const citySelect = document.getElementById('citySelect');

  citySelect.innerHTML = '';

  fetch(getCitiesAPI)
    .then(response => response.json())
    .then(data => {
      data.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        citySelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  loadCities();
});

function searchNames(query) {
  if (!query.trim()) {
    document.getElementById('results').innerHTML = '';
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      displayResults(JSON.parse(xhr.responseText));
    }
  };

  xhr.open('GET', personSearchAPI + encodeURIComponent(query), true);
  xhr.send();
}

function displayResults(results) {
  var resultsList = document.getElementById('results');
  resultsList.innerHTML = '';

  results.forEach(function(result) {
    var li = document.createElement('li');
    li.textContent = result.last_name + ' ' + result.first_name + ' ' + result.middle_name;
    resultsList.appendChild(li);
  });
}

function addItem() {
  var itemName = document.getElementById('itemName');
  var itemBrand = document.getElementById('itemBrand');

  if (!itemName || !itemBrand) {
      console.error('Не удалось найти один из элементов');
      return;
  }

  var csrfTokenMatch = fetchCsrfToken();

  if(!csrfTokenMatch){
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
  .then(response => response.json())
  .then((data) => data && data.message && showMessage(data.message))
  .catch((error) => {
      console.error('Ошибка:', error);
  });
}

function showMessage(message) {
    console.log('showMessage вызвана');
    // Реализовать вывод сообщения на странице, например, в каком-то элементе с id="message"
    var messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.innerHTML = message;
    }
}
