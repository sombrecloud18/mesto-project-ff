const template = document.querySelector('#card-template').content;

export function createCard(cardData, openImagePopup, deleteCallback, likeCallback, currentUserId) {
    const card = template.cloneNode(true).querySelector('.card');
    
    const cardImageElement = card.querySelector('.card__image');
    cardImageElement.src = cardData.link;
    cardImageElement.alt = cardData.name;
    card.querySelector('.card__title').textContent = cardData.name;
    
    const likesCount = cardData.likes ? cardData.likes.length : 0;
    const likeCounterElement = card.querySelector('.card__like-amount');
    likeCounterElement.textContent = likesCount;
    
    const isLikedByMe = cardData.likes && cardData.likes.some(like => like._id === currentUserId);
    const likeButton = card.querySelector('.card__like-button');
    if (isLikedByMe) {
        likeButton.classList.add('card__like-button_is-active');
    }
    
    const deleteButton = card.querySelector('.card__delete-button');
    if (cardData.owner._id !== currentUserId) {
        deleteButton.style.display = 'none';
    } else {
        deleteButton.addEventListener('click', () => {
            deleteCallback(cardData._id, card);
        });
    }
    
    likeButton.addEventListener('click', () => {
        likeCallback(cardData._id, likeButton, likeCounterElement);
    });

    cardImageElement.addEventListener('click', () => {    
        openImagePopup(cardData); 
    });

    return card;
}