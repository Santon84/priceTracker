/**
 * Модальное окно
 * @module Modal
 */

import React, { useRef, useState } from 'react'
import './Modal.css';

import Title from './Title';
import Button from './Button';




function Modal({
    setUrl,
    setShowModal
}) {
const urlRef = useRef();
const priceRef = useRef();
const modalTitle = 'Добавление товара'
const [isLoading, setIsLoading] = useState(false);
/**
 * Закрываем модальное окно и обнуляем стейты
 * @function onCloseClick
 */
 const onCloseClick = () => {
    //beforeToDo.current = {};
    setShowModal(false);

 }
  
 async function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();

    await setUrl(urlRef.current.value);
    await setShowModal(false);
    setIsLoading(false);

 }
/**
 * Обработка клика вне модального окна
 * @param {event} e 
 */
 function onModalClick(e) {

    if (e.target.className === 'modal') {
        onCloseClick();
        }
    }



// if (!showModal) {
// return null;
// }


return (
        <div onClick={(e)=> onModalClick(e)} className='modal' >
            <div className="modal-window">
                <button id="modal-close-btn" className="modal-close-button" onClick={() => onCloseClick()} >&times;</button>
                <div className="modal-conteiner">
                    <Title title={modalTitle}/>
                    
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <input ref={urlRef} required type='text' className='modal-title' name='title' placeholder='Ссылка на товар c OZON'></input>
                        <input ref={priceRef}  type='number' className='modal-target-price' name='target-price' placeholder='Целевая цена(необязательно)'></input>
                       
                    
                        <div className='modal-btn-conteiner'>
                            <Button disabled={isLoading} value='Добавить' type='submit' isPrimary={true}></Button>
                            <Button value='Отмена' handleClick={onCloseClick}></Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  );
}

export default Modal;


