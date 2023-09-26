const create_button = document.querySelector('.controls .create')
const mobile_create_button = document.querySelector('.mobile_controls .create')

const vipe_button = document.querySelector('.controls .vipe')
const mobile_vipe_button = document.querySelector('.mobile_controls .vipe')

const theme_button = document.querySelector('.controls .theme')
const mobile_theme_button = document.querySelector('.mobile_controls .theme')

const language_select = document.querySelector('.controls select')
const mobile_language_select = document.querySelector('.mobile_controls select')

const display = document.querySelector('.display')
const cancel_button = document.querySelector('.cancel')

const css_link = document.querySelector('.css_link')

const textarea = document.querySelector('.edit_block textarea')
const empty_message = document.querySelector('.empty_block p')
const empty_block = document.querySelector('.empty_block')
const save_button = document.querySelector('.save_button')
const main = document.querySelector('.main')

let is_theme_white = true
let current_language = 'en'
let now_editing = false

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function escapeHTML(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

function showDisplay() { display.classList.remove('hidden') }
function hideDisplay() { display.classList.add('hidden') }

function changeTheme() {
    if(is_theme_white) {
        css_link.href = 'styles/style_black.css'
        theme_button.innerHTML = `<i class="fas fa-sun"></i>`
        localStorage.setItem('theme', 'night')
        is_theme_white = false
    } else {
        css_link.href = 'styles/style_white.css'
        theme_button.innerHTML = `<i class="fas fa-moon"></i>`
        localStorage.setItem('theme', 'day')
        is_theme_white = true
    }
}

function changeThemeLS(value) {
    if(value === 'night') {
        css_link.href = 'styles/style_black.css'
        theme_button.innerHTML = `<i class="fas fa-sun"></i>`
        localStorage.setItem('theme', 'night')
        is_theme_white = false
    } else {
        css_link.href = 'styles/style_white.css'
        theme_button.innerHTML = `<i class="fas fa-moon"></i>`
        localStorage.setItem('theme', 'day')
        is_theme_white = true
    }
}

function changeLanguage(language_name) {
    current_language = language_name
    localStorage.setItem('language', language_name)
    create_button.innerHTML = `<i class="fas fa-plus"></i> ${languages[language_name].create}`
    vipe_button.innerHTML = `<i class="fas fa-trash-alt"></i> ${languages[language_name].vipe}`
    textarea.placeholder = languages[language_name].placeholder
    empty_message.innerHTML = languages[language_name].empty
    save_button.innerHTML = languages[language_name].save
    cancel_button.innerHTML = `<i class="far fa-times"></i> ${languages[language_name].cancel}`
    language_select.innerHTML = `<option value="en" ${language_name === 'en' ? 'selected' : ''}>${languages[language_name].languages.en}</option>
                <option value="ru" ${language_name === 'ru' ? 'selected' : ''}>${languages[language_name].languages.ru}</option>
                <option value="ua" ${language_name === 'ua' ? 'selected' : ''}>${languages[language_name].languages.ua}</option>
                <option value="pl" ${language_name === 'pl' ? 'selected' : ''}>${languages[language_name].languages.pl}</option>`
}

function getNotes(animation) {
    const keys = Object.keys(localStorage)
    let isNotEmpty = false
        main.innerHTML = `<div class="empty_block">
            <p>No notes</p>
        </div>`
        empty_block.style.display = 'none'
        for(let i = 0; i < keys.length; i++) {
            if(Number(keys[i])) {
                isNotEmpty = true
                const note = JSON.parse(localStorage.getItem(keys[i]))
                const noteBlock = `<div class="note ${animation ? 'animate__animated animate__zoomIn' : ''}" data-id="${note.id}">
            <div class="date">
                <p><i class="fas fa-calendar-alt"></i> ${note.date}</p>
            </div>
            <div class="note_text">
                <p>${escapeHTML(note.text)}</p>
            </div>
            <div class="note_controls">
                <button class="note_edit" onclick="startEditNote('${note.id}')"><i class="fas fa-edit"></i></button>
                <button class="note_remove" onclick="deleteNote('${note.id}')"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>`
                main.innerHTML += noteBlock
            }
        }
        if(!isNotEmpty) {
            main.innerHTML = `<div class="empty_block" style="display: flex">
            <p>${languages[current_language].empty}</p>
        </div>`
        }
        textarea.value = ''
}

function startEditNote(id) {
    now_editing = id
    textarea.value = JSON.parse(localStorage.getItem(id)).text
    showDisplay()
}

function stopEditNote() {
    now_editing = false
    textarea.value = ''
    hideDisplay()
}

function deleteNote(id) {
    let confirmation = confirm(languages[current_language].alert)
    if(confirmation) {
        localStorage.removeItem(id)
        getNotes(false)
    }
}

function createNote(text) {
    const keys = Object.keys(localStorage)
    if(keys.includes('prev_id')) {
        const id = String(Number(localStorage.getItem('prev_id')) + 1)
        const note = JSON.stringify({
            id,
            text: text,
            date: `${new Date().getDate()} ${monthNames[new Date().getMonth()]} ${new Date().getHours()}:${String(new Date().getMinutes()).length == 1 ? '0' + String(new Date().getMinutes()) : new Date().getMinutes()}`
        })
        localStorage.setItem(id, note)
        localStorage.setItem('prev_id', id)
        hideDisplay()
        getNotes(false)
    } else {
        const id = '1'
        const note = JSON.stringify({
            id,
            text,
            date: `${new Date().getDate()} ${monthNames[new Date().getMonth()]} ${new Date().getHours()}:${String(new Date().getMinutes()).length == 1 ? '0' + String(new Date().getMinutes()) : new Date().getMinutes()}`
        })
        localStorage.setItem(id, note)
        localStorage.setItem('prev_id', '1')
        hideDisplay()
        getNotes(false)
    }
}

create_button.addEventListener('click', () => showDisplay())
mobile_create_button.addEventListener('click', () => showDisplay())

cancel_button.addEventListener('click', () => stopEditNote())

theme_button.addEventListener('click', () => changeTheme())
mobile_theme_button.addEventListener('click', () => changeTheme())

language_select.addEventListener('input', () => changeLanguage(language_select.value))
mobile_language_select.addEventListener('input', () => changeLanguage(mobile_language_select.value))

save_button.addEventListener('click', () => {
    if(now_editing) {
        const note = JSON.stringify({
            id: now_editing,
            text: textarea.value,
            date: `${new Date().getDate()} ${monthNames[new Date().getMonth()]} ${new Date().getHours()}:${String(new Date().getMinutes()).length == 1 ? '0' + String(new Date().getMinutes()) : new Date().getMinutes()}`
        })
        localStorage.setItem(now_editing, note)
        stopEditNote()
        getNotes(false)
    } else {
        createNote(textarea.value)
    }
})

vipe_button.addEventListener('click', () => {
    let confirmation = confirm(languages[current_language].alert)
    if(confirmation) {
        localStorage.clear()
        location.reload()
    }
})
mobile_vipe_button.addEventListener('click', () => {
    let confirmation = confirm(languages[current_language].alert)
    if(confirmation) {
        localStorage.clear()
        location.reload()
    }
})

function onloadpage() {
    if(localStorage?.theme) {
        changeThemeLS(localStorage?.theme)
    }
    if(localStorage?.language) {
        changeLanguage(localStorage?.language)
    }
    getNotes(true)
}

window.onload = onloadpage
