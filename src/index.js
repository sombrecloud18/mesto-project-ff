import './styles/index.css';
import initialCards from './cards.js';
import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';


const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'form__submit_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'form__input-error_active'
};

const container = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const editModal = document.querySelector('.popup_type_edit');
const addButton = document.querySelector('.profile__add-button');
const addModal = document.querySelector('.popup_type_new-card');
const modalImage = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupCaptionImage = document.querySelector('.popup__caption');
const modals = document.querySelectorAll('.popup');
const editForm = document.forms['edit-profile'];
const nameInput = editForm.querySelector('.popup__input_type_name'); 
const jobInput = editForm.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');
const addCardForm = document.forms['new-place'];
const cardName = addCardForm.querySelector('.popup__input_type_card-name');
const cardImage = addCardForm.querySelector('.popup__input_type_url');

initialCards.forEach(cardData => {
  container.append(createCard(cardData, openImagePopup));
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closeModal(editModal);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  
  const newCardData = {
    name: cardName.value,
    link: cardImage.value
  };
  
  const newCard = createCard(newCardData, openImagePopup);
  container.prepend(newCard);
  closeModal(addModal);
  addCardForm.reset();
}

editButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editModal);
});

addButton.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addModal);
});

function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaptionImage.textContent = cardData.name;
  openModal(modalImage);
} 

modals.forEach(modal => {
  modal.classList.add('popup_is-animated');
  
  modal.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup__close') || event.target === modal) {
      closeModal(modal);
    }
  });
});

editForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleCardFormSubmit);

enableValidation(validationConfig);