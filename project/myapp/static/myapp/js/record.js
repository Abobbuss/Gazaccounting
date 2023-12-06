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
      })
      .catch(error => {
        console.error('Ошибка получения данных:', error);
      });
  }