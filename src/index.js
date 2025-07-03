import './styles/index.css';
import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  updateAvatar,
  likeCard,
  unlikeCard,
  deleteCard
} from './components/api.js';

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
const profilePhoto = document.querySelector('.profile__image');
const popupProfileImage = document.querySelector('.popup_type_edit-image');
const editImageForm = document.forms['edit-image'];
const imageInput = editImageForm.querySelector('.popup__input_type_url');
const profilePhotoContainer = document.querySelector('.profile__image-container');

let currentUserId = '';
let currentUserAvatar = '';

function submitWithLoader(promise, submitButton) {
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  
  return promise
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function updateUserAvatar(avatarUrl) {
  profilePhoto.style.backgroundImage = `url('${avatarUrl}')`;
  currentUserAvatar = avatarUrl;
}

function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaptionImage.textContent = cardData.name;
  openModal(modalImage);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  submitWithLoader(
    updateUserInfo(nameInput.value, jobInput.value),
    submitButton
  )
    .then((userData) => {
      profileName.textContent = userData.name;
      profileJob.textContent = userData.about;
      closeModal(editModal);
    })
    .catch((error) => {
      console.error('Ошибка при обновлении профиля:', error);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const newAvatarUrl = imageInput.value;
  
  submitWithLoader(
    updateAvatar(newAvatarUrl),
    submitButton
  )
    .then((userData) => {
      updateUserAvatar(userData.avatar);
      closeModal(popupProfileImage);
      editImageForm.reset();
    })
    .catch((error) => {
      console.error('Ошибка при обновлении аватара:', error);
    });
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  
  submitWithLoader(
    addNewCard(cardName.value, cardImage.value),
    submitButton
  )
    .then((newCard) => {
      const cardElement = createCard(
        newCard, 
        openImagePopup,
        (cardId, cardElement) => handleDeleteCard(cardId, cardElement),
        (cardId, likeButton, likeCounter) => handleLikeClick(cardId, likeButton, likeCounter),
        currentUserId
      );
      
      container.prepend(cardElement);
      closeModal(addModal);
      addCardForm.reset();
    })
    .catch((error) => {
      console.error('Ошибка при добавлении карточки:', error);
    });
}

function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((error) => {
      console.error('Ошибка при удалении карточки:', error);
    });
}

function handleLikeClick(cardId, likeButton, likeCounter) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  
  const likePromise = isLiked 
    ? unlikeCard(cardId) 
    : likeCard(cardId);
  
  likePromise
    .then((updatedCard) => {
      likeCounter.textContent = updatedCard.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch((error) => {
      console.error('Ошибка при обновлении лайка:', error);
    });
}

profilePhotoContainer.addEventListener('click', () => {
  imageInput.value = currentUserAvatar;
  clearValidation(editImageForm, validationConfig);
  openModal(popupProfileImage);
});

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
editImageForm.addEventListener('submit', handleAvatarFormSubmit);

enableValidation(validationConfig);

function loadUserInfo() {
  return getUserInfo()
    .then(userData => {
      profileName.textContent = userData.name;
      profileJob.textContent = userData.about;
      updateUserAvatar(userData.avatar);
      currentUserId = userData._id;
      return userData;
    })
    .catch(error => {
      console.error('Ошибка загрузки данных пользователя:', error);
    });
}

function loadCards() {
  return getInitialCards()
    .then(cards => {
      container.innerHTML = '';
      cards.forEach(cardData => {
        const cardElement = createCard(
          cardData, 
          openImagePopup,
          (cardId, cardElement) => handleDeleteCard(cardId, cardElement),
          (cardId, likeButton, likeCounter) => handleLikeClick(cardId, likeButton, likeCounter),
          currentUserId
      );
        container.append(cardElement);
      });
    })
    .catch(error => {
      console.error('Ошибка загрузки карточек:', error);
    });
}

Promise.all([loadUserInfo(), loadCards()])
  .catch(error => {
    console.error('Ошибка при инициализации приложения:', error);
  });