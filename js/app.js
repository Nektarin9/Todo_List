/* Кнопка, которая создает заметку */
const btn = document.getElementById("btn")
/* Инпут с заголовком */
const title = document.getElementById("title")
/* Инпут с описанием */
const description = document.getElementById("description")
/* Контейнер с заметками */
const content = document.getElementById("block_content")
/* Текст, показываем если нет заметок */
const text_content = document.getElementById("text_content")
/* Карточки с заметками */
let card = document.querySelectorAll(".card")
/* Модальное окно */
const modal_show = document.getElementById("modal_show")
/* Фон вокруг модального окна, скрываем при нажатии */
const modal_backdrop = document.getElementById("backdrop")

const modal_content = document.querySelector(".modal") 

/* Создаем массив, будем сохранять в нём заголовок и описание заметок */
let title_mas = []
let description_mas = []




btn.addEventListener("click", () => {
    validate()
    open_or_delete_modal()
})
/* Создаем карточки с заметками и записываем в массив заголовок и описание */

function create_card() {
    text_content.innerHTML = ""
    content.innerHTML = content.innerHTML + `<div id="card" class="card">
    <div class="del-btn">X</div>
    <h3>${title.value}</h3>
    </div> `
    card = document.querySelectorAll(".card")
    title_mas.push(title.value)
    description_mas.push(description.value)
    
}



/* Показываем модальное окно с нужным заголовком и описанием при клике на карточку с заметками */
function open_or_delete_modal() {
    for (let i = 0; i < card.length; i++) {
        /* Кнопка удаления заметки */
        let del_btn = document.querySelectorAll(".del-btn")
        card[i].addEventListener("click", (event) => {
            /* Проверяем клик, если нажали не на крестик => показываем модальное окно */
            if (event.target != del_btn[i]) {
                modal_show.style.display = "block"
                modal_content.innerHTML = `<div class="container_modal">
                <h2>${title_mas[i]}</h2>
                <p>${description_mas[i]}</p>
            </div>
            <div class="container_modal2">
            <label><input type="checkbox"> Выполнил</label>
            </div>`
            }
            /* Удаляем карточку, при клике на крестик */
            else {
                card[i].style.display = "none"
                let counter = 0
                /* Если карточек нет, возвращаем надпись */
                for (let j = 0; j < card.length; j++) {
                    if (card[j].style.display === "none") {
                        counter = counter + 1
                        if (counter === card.length) {
                            counter = 0
                            text_content.innerHTML =  "Технологий пока нет. Добавьте первую."
                        }
                    }
                }
            } 
        })
    }
}

/* Проверяем наличие пустых инпутов и подсвечиваем если такие есть */
function validate() {
    if (title.value === "" || description.value === "") {
        if (title.value === "" && description.value === "") {
            title.classList.add("invalid");
            description.classList.add("invalid");
            class_remove()
        }
        else if (title.value === "") {
            title.classList.add("invalid");
            class_remove()
        }
        else {
            description.classList.add("invalid");
            class_remove()
        }
    }
    else {
        create_card()
    }
}
/* Сбрасываем стиль подвечивающий инпут через 2s */
function class_remove() {
    setTimeout(() => {
        title.classList.remove("invalid");
        description.classList.remove("invalid");
      }, 2000);
}



/* Скрываем модальное окно при клике на все что вне блока с модальным окном */
addEventListener("click", (event) => {
    if (modal_show.style.display == "block") {
        if (event.target === modal_backdrop) {
            modal_show.style.display = "none"        
        }
    }
})



