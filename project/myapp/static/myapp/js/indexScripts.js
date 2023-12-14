import * as ScriptsAPI  from './ScriptsAPI.js';
import { displayResults } from './general.js';

var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';
var itemSearchAPI = 'http://127.0.0.1:8000/api/item/search/';


document.addEventListener('DOMContentLoaded', function() {
  loadCitiesIntoSelect();
});

document.getElementById('postAddPersonButton').addEventListener('click', function() {
  postAddPerson();
});
document.getElementById('postAddItemButton').addEventListener('click', function() {
  postAddItem();
});
document.getElementById('postAddOwnerShipButton').addEventListener('click', function() {
  postAddOwnerShip();
});

// document.addEventListener('mousedown', closeDropdown('home-textinput5'));
// document.addEventListener('mousedown', closeDropdown('home-textinput6')); 

async function loadCitiesIntoSelect() {
  const citySelect = document.getElementById('citySelect');
  citySelect.innerHTML = '';
  try {
      const cities = await ScriptsAPI.getFetchCities();
      cities.forEach(city => {
          const option = document.createElement('option');
          option.value = city.name;
          option.textContent = city.name;
          citySelect.appendChild(option);
      });
  } catch (error) {
      console.error('Error loading cities into select:', error);
  };
};

function postAddPerson() {
  const lastName = document.getElementById('last-name').value;
  const firstName = document.getElementById('first-name').value;
  const middleName = document.getElementById('middle-name').value;
  const cityId = document.getElementById('citySelect').value;
  
  ScriptsAPI.postPerson(lastName, firstName, middleName, cityId);
};

function postAddItem(){
  var itemName = document.getElementById('itemName').value;
  var itemBrand = document.getElementById('itemBrand').value;

  ScriptsAPI.postAddItem(itemName, itemBrand);
};

function postAddOwnerShip(){
  var ownerDepartmentName = document.querySelector('.home-textinput5').value;
  var itemName = document.querySelector('.home-textinput6').value;
  var serial_number = document.querySelector('.home-textinput7').value || null;
  var quantity = document.querySelector('.home-textinput8').value || 1;
  var downloadQR = document.getElementById('checkbox_dowloadQR').checked;
  var downloadDOC = document.getElementById('checkbox_dowloadDOC').checked;

  ScriptsAPI.postAddOwnerShip(ownerDepartmentName, itemName, serial_number, quantity, downloadQR, downloadDOC)
}

// function closeDropdown(targetClass) {
//   return function(event) {
//     var homeCard = document.querySelector('.home-card2');
//     var inputField = document.querySelector('.' + targetClass);

//     if (!homeCard.contains(event.target) && event.target !== inputField) {
//       setTimeout(() => {
//         document.getElementById('results').innerHTML = '';
//       }, 0);
//     }
//   };
// };

// function searchNames(query) {
//   search(query, personSearchAPI)
//     .then(names => displayResults(names, 'results', 'home-textinput5'))
//     .catch(error => console.error(error))
// }

// function searchItems(query) {
//   search(query, itemSearchAPI)
//     .then(results => displayResults(results, 'resultsItems', 'home-textinput6'));
// }



// window.searchNames = searchNames;
// window.searchItems = searchItems;
