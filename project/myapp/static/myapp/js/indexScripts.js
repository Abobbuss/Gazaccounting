import * as ScriptsAPI from './ScriptsAPI.js';


var personSearchAPI = 'http://127.0.0.1:8000/api/person/search/';

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

document.addEventListener('DOMContentLoaded', function() {
  loadCitiesIntoSelect();
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

window.searchNames = searchNames;