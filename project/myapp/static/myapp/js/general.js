export function displayResults(results, resultsId, textInputClass) {
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
          console.log('ResultsList closed.');
      });

        resultsList.appendChild(li);
    });
}
  
export function updateDropdown(results, dropdownId, textInputId) {
    const dropdown = document.getElementById(dropdownId);
    const ul = dropdown.querySelector('ul');

    ul.innerHTML = '';

    results.forEach(result => {
        const li = document.createElement('li');

        let displayString;
        if (result.brand) {
            displayString = `${result.name} (${result.brand})`;
        } else if (result.first_name) {
            const firstName = result.first_name;
            const lastName = result.last_name || '';
            const middleName = result.middle_name || '';
            const city = result.city || '' 
        
            displayString = `${lastName} ${firstName} ${middleName}-${city} `.trim();
        } else {
            displayString = result.name;
        }

        li.textContent = displayString;

        ul.appendChild(li);

        li.addEventListener('click', () => {
            document.getElementById(textInputId).value = displayString;
            dropdown.style.display = 'none';
        });
    });

    dropdown.style.display = 'block';
}

  