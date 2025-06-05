function deleteCard(cardElement) {
    cardElement.remove();
}

function likeCard(evt) {
    evt.currentTarget.classList.toggle('card__like-button_is-active');
}

export function createCard(cardData, openModal) {
    const template = document.querySelector('#card-template').content;
    const card = template.cloneNode(true).querySelector('.card');

    card.querySelector('.card__image').src = cardData.link;
    card.querySelector('.card__image').alt = cardData.name;
    card.querySelector('.card__title').textContent = cardData.name;
    
    card.querySelector('.card__delete-button').addEventListener('click', () => deleteCard(card));
    
    const cardImage = card.querySelector('.card__image');
    const likeButton = card.querySelector('.card__like-button');
    
    likeButton.addEventListener('click', likeCard);
    
    cardImage.addEventListener('click', () => {
        const modalImage = document.querySelector('.popup_type_image');
        const popupImage = document.querySelector('.popup__image');
        const popupCaption = document.querySelector('.popup__caption');
        
        popupImage.src = cardData.link;
        popupImage.alt = cardData.name;
        popupCaption.textContent = cardData.name;
        
        openModal(modalImage);
    });
    
    return card;
}