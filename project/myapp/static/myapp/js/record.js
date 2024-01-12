import * as ScriptsAPI from './ScriptsAPI.js';
import { updateDropdown } from './general.js';


var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';
var itemSearchAPI = 'http://127.0.0.1:8000/api/item/search/';

document.addEventListener('DOMContentLoaded', OwnerShipRecordPeople);
document.addEventListener('DOMContentLoaded', OwnerShipRecordCount);

document.addEventListener('DOMContentLoaded', function() {
  var containerSwitch = document.getElementById('containerSwitch');
  var container06 = document.getElementById('home-container06');
  var container20 = document.getElementById('home-container20');

  containerSwitch.addEventListener('change', function() {
    if (containerSwitch.checked) {
      container06.style.display = 'none';
      container20.style.display = 'flex';
    } else {
      container06.style.display = 'flex';
      container20.style.display = 'none';
    }
  });
});

document.addEventListener('click', function (event) {
  const dropdown = document.getElementById('dropdown');
  if (!event.target.closest('.home-container09')) {
      dropdown.style.display = 'none';
  }
});

document.getElementById('full-name').addEventListener('input', function () {
  const query = this.value;

  ScriptsAPI.search(query, personSearchAPI)
      .then(results => updateDropdown(results, "dropdown", "full-name"))
      .catch(error => console.error(error));
});

export function OwnerShipRecordCount() {
  const cityInput = document.getElementById('full-name').value;
  const itemInput = document.getElementById('item1').value;

  if (!cityInput || !itemInput) {
    console.error('Не удалось найти один из элементов');
    return;
  }

  const cityValue = cityInput.value || 'None';
  const itemValue = itemInput.value || 'None';

  ScriptsAPI.getOwnerShipRecordCount(cityValue, itemValue)
    .then(data => {
      displayDataInTableCounter(data);
    })
    .catch(error => {
      console.error('Ошибка получения данных:', error);
    });
};

function displayDataInTableCounter(data) {
  const tableContainer = document.querySelector('.home-container21');

  data.forEach(item => {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('home-container22');

    const cityCell = document.createElement('div');
    cityCell.classList.add('home-container23');
    cityCell.innerHTML = `<span style="color: white;">${item.owner__city__name}</span>`;
    rowContainer.appendChild(cityCell);

    const itemCell = document.createElement('div');
    itemCell.classList.add('home-container24');
    itemCell.innerHTML = `<span class="home-text06">${item.item__name} (${item.item__brand || 'N/A'})</span>`;
    rowContainer.appendChild(itemCell);

    const countCell = document.createElement('div');
    countCell.classList.add('home-container25');
    countCell.innerHTML = `<span style="color: white;">${item.item_count}</span>`;
    rowContainer.appendChild(countCell);

    tableContainer.appendChild(rowContainer);
  });
};

export function OwnerShipRecordPeople() {
  const cityInput = document.getElementById('full-name').value;
  const itemInput = document.getElementById('item1').value;
  const serialNumber = document.getElementById('SN').value;
  const date = document.getElementById('date').value;

  if (!cityInput || !itemInput) {
    console.error('Не удалось найти один из элементов');
    return;
  }

  const cityValue = cityInput.value || 'None';
  const itemValue = itemInput.value || 'None';
  const serialNumberValue = serialNumber.value || 'None';
  const dataValue = date.value || 'None';

  ScriptsAPI.getOwnerShipRecordPeople(cityValue, itemValue, serialNumberValue, dataValue)
    .then(data => {
      console.log('Полученные данные:', data);
      displayPeopleDataInTable(data);
    })
    .catch(error => {
      console.error('Ошибка получения данных:', error);
    });
};

function displayPeopleDataInTable(data) {
  const tableContainer = document.querySelector('.home-container07');

  data.forEach(person => {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('home-container08');

    const nameCell = document.createElement('div');
    nameCell.classList.add('home-container09');
    nameCell.innerHTML = `<span style="color: white;">${person.last_name + ' ' + person.name + ' ' + person.middle_name}</span>`;
    rowContainer.appendChild(nameCell);

    const tmcCell = document.createElement('div');
    tmcCell.classList.add('home-container10');
    tmcCell.innerHTML = `<span style="color: white;">${person.item}</span>`;
    rowContainer.appendChild(tmcCell);

    const snCell = document.createElement('div');
    snCell.classList.add('home-container12');
    snCell.innerHTML = `<span style="color: white;">${person.serial_number || '-'}</span>`;
    rowContainer.appendChild(snCell);

    const dateCell = document.createElement('div');
    dateCell.classList.add('home-container11');
    dateCell.innerHTML = `<span style="color: white;">${person.added_date}</span>`;
    rowContainer.appendChild(dateCell);

    tableContainer.appendChild(rowContainer);
  });
}



// document.getElementById('item1').addEventListener('input', function () {
//   const query = this.value;

//   ScriptsAPI.search(query, itemSearchAPI)
//       .then(results => updateDropdown(results, "dropdown1", "item1"))
//       .catch(error => console.error(error));
// });

// export function displayDataInTable(data) {
//   const tableContainer = document.querySelector('.home-table1');

//   data.forEach(item => {
//     const cityContainer = document.createElement('div');
//     cityContainer.classList.add('home-container04');

//     const cityCell = document.createElement('div');
//     cityCell.classList.add('home-container05');
//     cityCell.innerHTML = `<span>${item.owner__city__name}</span>`;
//     cityContainer.appendChild(cityCell);

//     const itemCell = document.createElement('div');
//     itemCell.classList.add('home-container06');
//     itemCell.innerHTML = `<span class="home-text06">${item.item__name} (${item.item__brand})</span>`;
//     cityContainer.appendChild(itemCell);

//     const countCell = document.createElement('div');
//     countCell.classList.add('home-container07');
//     countCell.innerHTML = `<span>${item.item_count}</span>`;
//     cityContainer.appendChild(countCell);

//     tableContainer.appendChild(cityContainer);
//   });
// }


// document.addEventListener("click", event => {
//   const resultsContainer = document.getElementById("resultsCities");
//   if (!resultsContainer.contains(event.target)) {
//     resultsContainer.innerHTML = "";
//   }
// });

// itemSearchAPI = "http://127.0.0.1:8000/api/city/search/";

// export function searchCities(query){
//   search(query, itemSearchAPI)
//     .then(results => displayResults(results, 'resultsCities', 'home-textinput'));
// }

// window.OwnerShipRecordCount = OwnerShipRecordCount;
// window.searchCities = searchCities;
