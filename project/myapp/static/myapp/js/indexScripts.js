import * as ScriptsAPI  from './ScriptsAPI.js';
import { displayResults } from './general.js';



var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';
var itemSearchAPI = 'http://127.0.0.1:8000/api/item/search/';

document.addEventListener('DOMContentLoaded', function() {
  loadCitiesIntoSelect();
});

// document.addEventListener('mousedown', closeDropdown('home-textinput5'));
// document.addEventListener('mousedown', closeDropdown('home-textinput6')); 

function closeDropdown(targetClass) {
  return function(event) {
    var homeCard = document.querySelector('.home-card2');
    var inputField = document.querySelector('.' + targetClass);

    if (!homeCard.contains(event.target) && event.target !== inputField) {
      setTimeout(() => {
        document.getElementById('results').innerHTML = '';
      }, 0);
    }
  };
}

async function loadCitiesIntoSelect() {
  const citySelect = document.getElementById('citySelect');
  citySelect.innerHTML = '';

  try {
      const cities = await ScriptsAPI.getFetchCities();
      // console.log(cities)
      cities.forEach(city => {
          const option = document.createElement('option');
          option.value = city.name;
          option.textContent = city.name;
          citySelect.appendChild(option);
      });
  } catch (error) {
      console.error('Error loading cities into select:', error);
  }
}

function searchNames(query) {
  search(query, personSearchAPI)
    .then(names => displayResults(names, 'results', 'home-textinput5'))
    .catch(error => console.error(error))
}

function searchItems(query) {
  search(query, itemSearchAPI)
    .then(results => displayResults(results, 'resultsItems', 'home-textinput6'));
}

// const lastName = document.getElementById('last-name').value;
// const firstName = document.getElementById('first-name').value;
// const middleName = document.getElementById('middle-name').value;
// const cityId = document.getElementById('citySelect').value;

// ScriptsAPI.postPerson(lastName, firstName, middleName, cityId)
function postAddPerson() {
  var x = 2

  return x
} 

export default postAddPerson;

window.searchNames = searchNames;
window.searchItems = searchItems;
