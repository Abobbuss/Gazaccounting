var postAddPersonAPI = 'http://127.0.0.1:8000/api/person/create/';
var getCitiesAPI = 'http://127.0.0.1:8000/api/city/';
var postAddItemAPI = 'http://127.0.0.1:8000/api/item/create/';
var postAddOwnerShipAPI = 'http://127.0.0.1:8000/api/ownership/create/';
var getOwnerShipDetailsAPI = 'http://127.0.0.1:8000/api/ownership/record/'
var getOnwerShipRecordCountAPI = 'http://127.0.0.1:8000/api/ownership/recordCount/';


export function fetchCsrfToken() {
    var csrfTokenMatch = document.cookie.match(/csrftoken=([^;]+)/);

    if (csrfTokenMatch && csrfTokenMatch[1]) {
        return csrfTokenMatch[1];
    } else {
        console.error('Не удалось найти csrftoken в cookie');
        return null;
    };
};

export async function getFetchCities() {
    try {
        const response = await fetch(getCitiesAPI);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    };
};


export function postPerson(last_name, first_name, middle_name, cityId) {
  if (!last_name || !first_name || !cityId) {
    console.error('Не удалось найти один из элементов');
    return;
  };

  const data = {
    last_name: last_name,
    first_name: first_name,
    middle_name: middle_name,
    city: cityId,
  };

  const csrfTokenMatch = fetchCsrfToken();

  if (!csrfTokenMatch) {
    console.error('Не удалось получить CSRF-токен');
    return;
  };

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
};

export function postAddItem(itemName, itemBrand) {
  if (!itemName || !itemBrand) {
    console.error('Не удалось найти один из элементов');
    return;
  }

  var csrfTokenMatch = fetchCsrfToken();

  if (!csrfTokenMatch) {
  return;
  }

  var data = {
  "name": itemName,
  "brand": itemBrand
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
    } else {
        console.log(data);
    }
  })
  .catch((error) => {
    const errorText = error.response ? error.response.text() : undefined;

    return Promise.resolve(errorText);
  });
};

export function postAddOwnerShip(ownerDepartmentName, itemName, serial_number, quantity, downloadQR, downloadDOC) {
  if (!ownerDepartmentName || !itemName){
    console.error('Не удалось найти один из элементов');
    return;
  };
  
  var data = {
      owner_department: { name: ownerDepartmentName },  
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);

    if (downloadQR && data.qr_file_path) {
      const downloadUrl = `/download-qr?path=${encodeURIComponent(data.qr_file_path)}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'qr_code.png');
      link.click();
    }
  })
  .catch((error) => {
    const errorText = error.response ? error.response.text() : undefined;

    return Promise.resolve(errorText);
  });
};

export function search(query, searchAPI) {
  return new Promise((resolve, reject) => {
    if (!query.trim()) {
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

    const encodedQuery = encodeURIComponent(query);
    xhr.open('GET', `${searchAPI}${encodedQuery}`, true);
    xhr.send();
  });
};

export async function getOwnerShipRecordCount(city, item) {
  var csrfTokenMatch = fetchCsrfToken();

  const params = new URLSearchParams();
  params.append('city', city);
  params.append('item', item);

  const apiUrlWithParams = `${getOnwerShipRecordCountAPI}?${params.toString()}`;

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
};

export async function getOwnerShipRecordPeople(city, item, sn, date) {
  var csrfTokenMatch = fetchCsrfToken();
  const params = new URLSearchParams();
  params.append('city', city);
  params.append('item', item);
  params.append('sn', sn);
  params.append('date', date);

  const apiUrlWithParams = `${getOwnerShipDetailsAPI}?${params.toString()}`;

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
};

// function showMessage(message) {
//   var resultsList = document.getElementById('errorMesageItem');
//   resultsList.innerHTML = '';

//   resultsList.append(message)
// };





// export function getOwnerShipDetails(callback, id) {


//   var csrfTokenMatch = fetchCsrfToken();

//   fetch(getOwnerShipDetailsAPI + id)
//       .then(response => response.json())
//       .then(data => callback(data))
//       .catch(error => console.error('Error fetching user info:', error));
// };





// window.postAddItem = postAddItem;
// window.postAddOwnerShip = postAddOwnerShip;
// window.search = search;
// window.getOwnerShipDetails = getOwnerShipDetails;

