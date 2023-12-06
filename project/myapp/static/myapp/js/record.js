import * as ScriptsAPI from './ScriptsAPI.js';
import {  } from './indexScripts';


var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';
var itemSearchAPI = 'http://127.0.0.1:8000/api/item/search/';

document.addEventListener('DOMContentLoaded', OwnerShipRecordCount);


export function OwnerShipRecordCount() {
  const cityInput = document.querySelector('.home-textinput.input');
  const itemInput = document.querySelector('.home-textinput1.input');

  if (!cityInput || !itemInput) {
    console.error('Не удалось найти один из элементов');
    return;
  }

  const cityValue = cityInput.value || 'None';
  const itemValue = itemInput.value || 'None';

  getOwnerShipRecordCount(cityValue, itemValue)
    .then(data => {
      console.log('Полученные данные:', data);
      displayDataInTable(data);
    })
    .catch(error => {
      console.error('Ошибка получения данных:', error);
    });
}

export function displayDataInTable(data) {
  const tableContainer = document.querySelector('.home-table1');

  data.forEach(item => {
    const cityContainer = document.createElement('div');
    cityContainer.classList.add('home-container04');

    const cityCell = document.createElement('div');
    cityCell.classList.add('home-container05');
    cityCell.innerHTML = `<span>${item.owner__city__name}</span>`;
    cityContainer.appendChild(cityCell);

    const itemCell = document.createElement('div');
    itemCell.classList.add('home-container06');
    itemCell.innerHTML = `<span class="home-text06">${item.item__name} (${item.item__brand})</span>`;
    cityContainer.appendChild(itemCell);

    const countCell = document.createElement('div');
    countCell.classList.add('home-container07');
    countCell.innerHTML = `<span>${item.item_count}</span>`;
    cityContainer.appendChild(countCell);

    tableContainer.appendChild(cityContainer);
  });
}

// function searchItems(query) {
//     search(query, 'resultsItems', 'home-textinput1', itemSearchAPI)
//     .then(results => displayResults(results, 'resultsItems', 'home-textinput6'));
// }


// window.searchItems = searchItems;