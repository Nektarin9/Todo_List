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
/* Модальное окно */
const modal_content = document.querySelector(".modal") 
/* Модальное окно */
const color_progress = document.querySelector(".progress-value")
/* Ключ localStorage */
const ls_key = "todo";

/* Создаем обьект, будем сохранять в нём заголовок и описание заметок */
const notes = {
    title_mas: [],
    description_mas: [],
    input_number: [],
    use_localStorage: false,
}
/* Обновляем наши данные объекта после работы localStorage*/
let read_LS = read()
if (read_LS !== null && read_LS.use_localStorage) {
    notes.title_mas = read_LS.title_mas
    notes.description_mas = read_LS.description_mas
    notes.input_number = read_LS.input_number
}
notes.title_mas = notes.title_mas.filter(elem => elem !== "deleted")
notes.description_mas = notes.description_mas.filter(elem => elem !== "deleted")
notes.input_number = notes.input_number.filter(elem => elem !== "deleted")

/* Логика кнопки "Создать"*/
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
    </div>`
    card = document.querySelectorAll(".card")
    notes.title_mas.push(title.value)
    notes.description_mas.push(description.value)
    notes.input_number.push(false)
    notes.use_localStorage = true
    progress()
    save()
}

/* Показываем модальное окно с нужным заголовком и описанием при клике на карточку с заметками */
function open_or_delete_modal() {
    for (let i = 0; i < card.length; i++) {
        /* Кнопка удаления заметки */
        let del_btn = document.querySelectorAll(".del-btn")
        card[i].addEventListener("click", (event) => {
            /* Проверяем клик, если нажали не на крестик => показываем модальное окно */
            if (event.target !== del_btn[i]) {
                modal_show.style.display = "block"
                modal_content.innerHTML = `<div class="container_modal">
                <h2>${notes.title_mas[i]}</h2>
                <p>${notes.description_mas[i]}</p>
            </div>
            <div class="container_modal2">
            <label><input id="modal_input" type="checkbox"> Выполнил</label>
            </div>`
           /* Инпут модального окна */
            let input_modal = document.getElementById("modal_input")
            input_modal.addEventListener("change", () => {
                if (input_modal.checked === true) {
                    notes.input_number[i] = true
                    card[i].style.backgroundColor = "#73ba3c"
                    card[i].style.color = "#ffffff"
                    notes.use_localStorage = true
                    modal_show.style.display = "none" 
                    progress()
                    save()
                }
                else {
                    notes.input_number[i] = false
                    card[i].style.backgroundColor = "#ffffff"
                    card[i].style.color = "#000000"
                    notes.use_localStorage= true
                    modal_show.style.display = "none" 
                    progress()
                    save()
                }
            })
            input_modal.checked = notes.input_number[i]
            }
            /* Удаляем карточку, при клике на крестик */
            else {
                card[i].style.display = "none"
                notes.title_mas[i] = "deleted"
                notes.description_mas[i] = "deleted"
                notes.input_number[i] = "deleted"
                notes.use_localStorage = true
                progress()
                save()
                read() 
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

/* Подсчитываем процент выполненных заметок и меняем прогресс */
function progress() {
    let index_input = 0
    let index_card = 0
    let percent = 0
    /* Подсчитываем выполненные заметки */
    for (let i = 0; i < notes.input_number.length; i++) {
        if (notes.input_number[i] === true) {
            index_input = index_input + 1
        }
    }
    /* Подсчитываем количество заметок */
    for (let i = 0; i < card.length; i++) {
        if (card[i].style.display != "none") {
            index_card = index_card + 1
        }
    }
    /* Расчитываем процент выполненных заметок */
    if (index_card != 0) {
        percent = Math.round((index_input / index_card) * 100)
    }
    /* Рисуем шкалу прогресса */
    color_progress.style.width = `${percent}%`
    color_progress.style.background = `hsl(${percent}, 50%, 50%)`;
    color_progress.textContent = `${percent}%`
    return percent


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
        title.value = ""
        description.value = ""
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

/* Записываем данные в localStorage*/
function save() {
    localStorage.setItem(ls_key, JSON.stringify(notes));
  }
function read() {
    const row = localStorage.getItem(ls_key);
        return JSON.parse(row);
}

  /* Загружаем карточки по данным из localStorage */
function create_card_LS(elem) {
    text_content.innerHTML = ""
    content.innerHTML = content.innerHTML + `<div id="card" class="card">
    <div class="del-btn">X</div>
    <h3>${elem}</h3>
    </div>`
    del_btn = document.querySelectorAll(".del-btn")
}

  /* Красим выполненные карточки по данным из localStorage */
function color_card_LS(index) {
    if (read_LS.input_number[index]) {
        card[index].style.backgroundColor = "#73ba3c"
        card[index].style.color = "#ffffff"
        modal_show.style.display = "none"
    }
    else {
        card[index].style.backgroundColor = "#ffffff"
        card[index].style.color = "#000000"
        modal_show.style.display = "none" 
    }
}
 
  /* Показываем сохраненные карточки */
if (read_LS !== null && read_LS.use_localStorage) {
    read_LS.title_mas.forEach(element => {
    if (element !== "deleted") {
        create_card_LS(element)   
        card = document.querySelectorAll(".card") 
        open_or_delete_modal() 
        progress()
    }
 });

    read_LS.input_number = read_LS.input_number.filter(elem => elem !== "deleted")
    let count_LS = 0
    read_LS.input_number.forEach((element) => {
        if (element && element !== "deleted") {
            card[count_LS].style.backgroundColor = "#73ba3c"
            card[count_LS].style.color = "#ffffff"
            modal_show.style.display = "none"
            count_LS++
        }
        else {
            card[count_LS].style.backgroundColor = "#ffffff"
            card[count_LS].style.color = "#000000"
            modal_show.style.display = "none" 
            count_LS++
        }
    })
}

