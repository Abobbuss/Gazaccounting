var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';
var addPersonAPI = 'http://127.0.0.1:8000/api/person/create/';
var getCitiesAPI = 'http://127.0.0.1:8000/api/city/'


function loadCities() {
  const citySelect = document.getElementById('citySelect');

  // Очистка текущих опций в списке
  citySelect.innerHTML = '';

  // Запрос к API
  fetch(getCitiesAPI)
    .then(response => response.json())
    .then(data => {
      // Заполнение выпадающего списка полученными городами
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

// Вызов функции при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  loadCities();
});

// function addPerson() {
//   const lastName = document.getElementById('last-name').value;
//   const firstName = document.getElementById('first-name').value;
//   const middleName = document.getElementById('middle-name').value;
//   const selectedCityId = document.getElementById('citySelect').value;

//   const personData = {
//     last_name: lastName,
//     first_name: firstName,
//     middle_name: middleName,
//     city: selectedCityId
//   };

//   // Получение CSRF-токена из куки
//   const csrfToken = document.cookie
//   .split('; ')
//   .find(row => row.startsWith('csrftoken='))
//   .split('=')[1];
//   console.log(csrfToken);

//   fetch(addPersonAPI, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-CSRFToken': csrfToken  // Добавление CSRF-токена в заголовки
//     },
//     body: JSON.stringify(personData),
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
// }

function searchNames(query) {
  if (!query.trim()) {
    document.getElementById('results').innerHTML = '';
    return;
  }

  // AJAX-запрос к новому эндпоинту поиска
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      displayResults(JSON.parse(xhr.responseText));
    }
  };

  // encodeURIComponent для корректной обработки спецсимволов
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

