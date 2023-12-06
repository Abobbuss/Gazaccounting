var postAddPersonAPI = 'http://127.0.0.1:8000/api/person/create/';
var getCitiesAPI = 'http://127.0.0.1:8000/api/city/';
var postAddItemAPI = 'http://127.0.0.1:8000/api/item/create/';
var postAddOwnerShipAPI = 'http://127.0.0.1:8000/api/ownership/create/';
var getOwnerShipDetailsAPI = 'http://127.0.0.1:8000/api/ownership/'
var getOnwerShipRecordCount = 'http://127.0.0.1:8000/api/ownership/recordCount/';


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

  const csrfTokenMatch = fetchCsrfToken();

  if (!csrfTokenMatch) {
    console.error('Не удалось получить CSRF-токен');
    return;
  }

  fetch(postAddPersonAPI, {
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
    console.log(data)
  })
  .catch(error => {
    console.error('Error:', error);
    if (error.response) {
      error.response.text().then(text => {
        console.error('Response body:', text);
      });
    }
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

  fetch(postAddItemAPI, {
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

export function postAddOwnerShip() {
  var ownerName = document.querySelector('.home-textinput5').value;
  var itemName = document.querySelector('.home-textinput6').value;
  var quantity = document.querySelector('.home-textinput7').value;
  var serial_number = document.querySelector('.home-textinput8').value;
  var downloadQR = document.getElementById('checkbox_dowloadQR').checked;
  var downloadDOC = document.getElementById('checkbox_dowloadDOC').checked;

  var data = {
      owner: { name: ownerName },  
      item: { name: itemName },
      serial_number: serial_number,    
      quantity: quantity,
      downloadQR: downloadQR,
      downloadDOC: downloadDOC
  };

  var csrfTokenMatch = fetchCsrfToken();

  fetch(postAddOwnerShipAPI, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfTokenMatch
      },
      body: JSON.stringify(data)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      // Проверяем, нужно ли скачивать QR
      if (downloadQR) {
          return response.blob();
      } else {
          // Если не нужно, возвращаем null, чтобы избежать ошибки в следующем блоке кода
          return null;
      }
  })
  .then(blob => {
      // Проверяем, есть ли данные для скачивания QR
      if (blob !== null) {
          // qr
          const urlQR = window.URL.createObjectURL(blob);

          const aQR = document.createElement('a');
          aQR.href = urlQR;
          aQR.download = 'qr_code.png';  
          document.body.appendChild(aQR);

          aQR.click();

          document.body.removeChild(aQR);

          window.URL.revokeObjectURL(urlQR);
      }

      // Проверяем, нужно ли скачивать документ
      if (downloadDOC) {
          return fetch(postAddOwnerShipAPI, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrfTokenMatch
              },
              body: JSON.stringify({ downloadDOC: true })
          });
      } else {
          // Если не нужно, возвращаем null
          return null;
      }
  })
  .then(responseDoc => {
      // Проверяем, есть ли данные для скачивания документа
      if (responseDoc !== null) {
          return responseDoc.blob();
      } else {
          // Если не нужно, возвращаем null
          return null;
      }
  })
  .then(blobDoc => {
      // Проверяем, есть ли данные для скачивания документа
      if (blobDoc !== null) {
          // document
          const urlDoc = window.URL.createObjectURL(blobDoc);

          const aDoc = document.createElement('a');
          aDoc.href = urlDoc;
          aDoc.download = 'document.docx';  
          document.body.appendChild(aDoc);

          aDoc.click();

          document.body.removeChild(aDoc);

          window.URL.revokeObjectURL(urlDoc);
      }
  })
  .catch(error => {
      console.error('Ошибка:', error);
      console.log(error.response);
  });
}

function search(query, resultsId, textInputClass, searchAPI) {
  return new Promise((resolve, reject) => {
    if (!query.trim()) {
      document.getElementById(resultsId).innerHTML = '';
      resolve([]); 
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const parsedResults = JSON.parse(xhr.responseText);
          resolve(parsedResults);
        } else {
          reject(new Error(`Failed with status ${xhr.status}`));
        }
      }
    };

    xhr.open('GET', searchAPI + encodeURIComponent(query), true);
    xhr.send();
  });
}

export function getOwnerShipDetails(callback, id) {


  var csrfTokenMatch = fetchCsrfToken();

  fetch(getOwnerShipDetailsAPI + id)
      .then(response => response.json())
      .then(data => callback(data))
      .catch(error => console.error('Error fetching user info:', error));
}

export async function getOwnerShipRecordCount(city, item) {
  var csrfTokenMatch = fetchCsrfToken();

  const params = new URLSearchParams();
  params.append('city', city);
  params.append('item', item);

  const apiUrlWithParams = `${getOnwerShipRecordCount}?${params.toString()}`;

  return fetch(apiUrlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfTokenMatch
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.statusText}`);
    }
    return response.json();
  });
}


window.postAddItem = postAddItem;
window.postAddPerson = postAddPerson;
window.postAddOwnerShip = postAddOwnerShip;
window.search = search;
window.getOwnerShipDetails = getOwnerShipDetails;
window.getOwnerShipRecordCount = getOwnerShipRecordCount;
