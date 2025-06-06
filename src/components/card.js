const template = document.querySelector('#card-template').content;

function deleteCard(cardElement) {
    cardElement.remove();
}

function likeCard(evt) {
    evt.currentTarget.classList.toggle('card__like-button_is-active');
}

export function createCard(cardData, openImagePopup) {
    const card = template.cloneNode(true).querySelector('.card');

    card.querySelector('.card__image').src = cardData.link;
    card.querySelector('.card__image').alt = cardData.name;
    card.querySelector('.card__title').textContent = cardData.name;
    
    card.querySelector('.card__delete-button').addEventListener('click', () => deleteCard(card));
    
    const cardImage = card.querySelector('.card__image');
    const likeButton = card.querySelector('.card__like-button');
    
    likeButton.addEventListener('click', likeCard);

    cardImage.addEventListener('click', () => {    
        openImagePopup(cardData); 
    });

    return card;
}