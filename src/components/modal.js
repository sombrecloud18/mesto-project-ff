//Работа с модулями

function handleEscape(evt) {
    if (evt.key === 'Escape') {
        const openedModal = document.querySelector('.popup_is-opened'); 
        if (openedModal) {
            closeModal(openedModal);
        }
    }
}

export function openModal(modal) {
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscape);
}

export function closeModal(modal) {
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscape);
} 

