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
        });

        resultsList.appendChild(li);
    });
}