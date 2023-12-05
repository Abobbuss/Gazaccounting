

document.addEventListener('DOMContentLoaded', function () {
    const id = window.location.pathname.split('/').filter(segment => segment !== '')[1];

    getOwnerShipDetails(updateUserInfo, id);
});

function updateUserInfo(data) {
    const userDetails = document.getElementById('user-details');
    userDetails.innerHTML = `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Last Name:</strong> ${data.last_name}</p>
        <p><strong>Middle Name:</strong> ${data.middle_name}</p>
        <p><strong>Item:</strong> ${data.item}</p>
        <p><strong>Brand:</strong> ${data.brand}</p>
        <p><strong>Serial Number:</strong> ${data.serial_number || 'N/A'}</p>
        <p><strong>Added Date:</strong> ${new Date(data.added_date).toLocaleString()}</p>
    `;
}

function deductItem() {
    // Логика для списания предмета
    console.log('Item deducted');
}

function returnItem() {
    // Логика для возврата предмета с учетом выбора из выпадающего списка
    const returnOptions = document.getElementById('return-options');
    const selectedOption = returnOptions.value;
    console.log('Item returned with option:', selectedOption);
}
