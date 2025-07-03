const template = document.querySelector('#card-template').content;

function deleteCard(cardElement, cardId) {
    fetch(`https://nomoreparties.co/v1/wff-cohort-41/cards/${cardId}`, { 
        method: 'DELETE',
        headers: {
            authorization: 'ed2813cd-3e45-42f1-86f8-753c32ce7697',
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.ok) {
            cardElement.remove(); 
        }
    })
    .catch(err => console.error('Ошибка при удалении:', err));
}

function likeCard(cardElement, cardId) {
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCountElement = cardElement.querySelector('.card__like-amount');
    const isLiked = likeButton.classList.contains('card__like-button_is-active');

    
    fetch(`https://nomoreparties.co/v1/wff-cohort-41/cards/likes/${cardId}`, { 
        method: isLiked ? 'DELETE' : 'PUT',
        headers: {
            authorization: 'ed2813cd-3e45-42f1-86f8-753c32ce7697',
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error('Ошибка при постановке лайка');
    })
    .then(updatedCard => {
        likeButton.classList.toggle('card__like-button_is-active');
        likeCountElement.textContent = updatedCard.likes.length;
    })
    .catch(err => console.error('Ошибка:', err));
}

export function createCard(cardData, openImagePopup, currentUserId) {
    const card = template.cloneNode(true).querySelector('.card');
    
    card.querySelector('.card__image').src = cardData.link;
    card.querySelector('.card__image').alt = cardData.name;
    card.querySelector('.card__title').textContent = cardData.name;
    
    const likesCount = cardData.likes ? cardData.likes.length : 0;
    card.querySelector('.card__like-amount').textContent = likesCount;
    const isLikedByMe = cardData.likes && cardData.likes.some(like => like._id === currentUserId);
    const likeButton = card.querySelector('.card__like-button');
    if (isLikedByMe) {
        likeButton.classList.add('card__like-button_is-active');
    }
    
    const deleteButton = card.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => {
        deleteCard(card, cardData._id);
    });

    const cardImage = card.querySelector('.card__image');
    
    likeButton.addEventListener('click', () => {
        likeCard(card, cardData._id);
    });

    cardImage.addEventListener('click', () => {    
        openImagePopup(cardData); 
    });

    return card;
}