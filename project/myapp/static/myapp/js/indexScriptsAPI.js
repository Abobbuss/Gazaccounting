


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
      // Если вещь добавлена успешно, вывести сообщение в консоль
      if (data && data.message === 'Успешно добавлено') {
        console.log('Вещь добавлена успешно:', data);
      } else {
        // Если возвращается сообщение о том, что вещь уже существует, вывести пользователю
        showMessage(data.message);
      }
    })
    .catch((error) => {
      console.error('Ошибка:', error);
  
      // Вывести полный объект ответа в консоль
      console.log('Ответ сервера в случае ошибки:', error.response);
  
      // Попробовать получить текст ответа
      const errorText = error.response ? error.response.text() : undefined;
  
      return Promise.resolve(errorText);
    })
    .then(errorText => {
      // Проверить, что текст ответа не равен undefined
      if (errorText !== undefined) {
        console.log('Текст ответа об ошибке:', errorText);
  
        // Попробовать преобразовать текст ответа в JSON
        try {
          const errorData = JSON.parse(errorText);
          console.log('Данные об ошибке:', errorData);
  
          // Попробовать вывести сообщение об ошибке
          if (errorData && errorData.message) {
            showMessage(errorData.message);
          }
        } catch (parseError) {
          console.error('Ошибка при разборе JSON:', parseError);
        }
      } else {
        console.log('Текст ответа об ошибке отсутствует.');
        showMessage("Такая вещь уже есть");
      }
    });
  }  

function showMessage(message) {
  var resultsList = document.getElementById('errorMesageItem');
  resultsList.innerHTML = '';

  resultsList.append(message)
}

