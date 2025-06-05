//Работа с модулями

const modals = document.querySelectorAll('.popup');

modals.forEach(modal => {
    modal.classList.add('popup_is-animated');
});

function handleEscape(evt) {
    if (evt.key === 'Escape') {
        const openedModal = document.querySelector('.popup_is-opened'); 
        if (openedModal) {
            closeModal(openedModal);
        }
    }
}

modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
        if (event.target.classList.contains('popup__close') || event.target === modal) {
            closeModal(modal);
        }
    });
});



export function openModal(modal) {
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscape);

    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
}

export function closeModal(modal) {
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscape);
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
}

