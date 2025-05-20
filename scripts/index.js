function createCard(cardData, deleteCard) {
    const template = document.querySelector('#card-template').content;
    const card = template.cloneNode(true).querySelector('.card');

    card.querySelector('.card__image').src = cardData.link;
    card.querySelector('.card__image').alt = cardData.name;
    card.querySelector('.card__title').textContent = cardData.name;
    card.querySelector('.card__delete-button').addEventListener('click', () => deleteCard(card));
    return card;
}

function deleteCard(cardElement) {
    cardElement.remove();
}

const container = document.querySelector('.places__list');
initialCards.forEach(data => container.append(createCard(data, deleteCard)));
