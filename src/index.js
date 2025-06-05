import './styles/index.css';
import initialCards from './cards.js';
import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';

const container = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const editModal = document.querySelector('.popup_type_edit');
const addButton = document.querySelector('.profile__add-button');
const addModal = document.querySelector('.popup_type_new-card');

initialCards.forEach(cardData => {
    container.append(createCard(cardData, openModal));
});

const editForm = document.forms['edit-profile'];
const nameInput = editForm.querySelector('.popup__input_type_name'); 
const jobInput = editForm.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = nameInput.value;
    profileJob.textContent = jobInput.value;
    closeModal(editModal);
}

editForm.addEventListener('submit', handleProfileFormSubmit);

editButton.addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    jobInput.value = profileJob.textContent;
    openModal(editModal);
});

const addCardForm = document.forms['new-place'];
const cardName = addCardForm.querySelector('.popup__input_type_card-name');
const cardImage = addCardForm.querySelector('.popup__input_type_url');

function handleCardFormSubmit(evt) {
    evt.preventDefault();
    
    const newCardData = {
        name: cardName.value,
        link: cardImage.value
    };
    const newCard = createCard(newCardData, openModal);
    container.prepend(newCard);

    closeModal(addModal);
    addCardForm.reset();
}

addCardForm.addEventListener('submit', handleCardFormSubmit);

addButton.addEventListener('click', () => {
    openModal(addModal);
});