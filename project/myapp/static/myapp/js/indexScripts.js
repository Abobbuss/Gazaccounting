import * as ScriptsAPI from './ScriptsAPI.js';


var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';
var itemSearchAPI = 'http://127.0.0.1:8000/api/item/search/';

document.addEventListener('DOMContentLoaded', function() {
  loadCitiesIntoSelect();
});

document.addEventListener('mousedown', closeDropdown('home-textinput5'));
document.addEventListener('mousedown', closeDropdown('home-textinput6')); 

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

function displayResults(results, resultsId, textInputClass) {
  var resultsList = document.getElementById(resultsId);
  resultsList.innerHTML = '';
  results.forEach(function(result) {
    var li = document.createElement('li');

    if (resultsId === 'results') {
      if (result.middle_name != null) {
        li.textContent = result.last_name + ' ' + result.first_name + ' ' + result.middle_name + '-' + result.city;
      } else {
        li.textContent = result.last_name + ' ' + result.first_name + '-' + result.city;
      }
    } else if (resultsId === 'resultsItems') {
      if (result.brand != null) {
        li.textContent = result.name + '(' + result.brand + ')';
      } else {
        li.textContent = result.name;
      }
    }

    li.addEventListener('click', function() {
      document.querySelector(`.${textInputClass}`).value = li.textContent;
      resultsList.innerHTML = '';
    });

    resultsList.appendChild(li);
  });
}

function searchNames(query) {
  search(query, 'results', 'home-textinput5', personSearchAPI)
    .then(results => displayResults(results, 'results', 'home-textinput5'));
}

function searchItems(query) {
  search(query, 'resultsItems', 'home-textinput6', itemSearchAPI)
    .then(results => displayResults(results, 'resultsItems', 'home-textinput6'));
}

window.searchNames = searchNames;
window.searchItems = searchItems;