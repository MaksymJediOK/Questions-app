import {Question} from './question'
import {createModal, isValid} from "./utils";
import {authWithEmailAndPassword, getAuthForm} from "./auth";
import './styles.css'


const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')


window.addEventListener('load',Question.renderList)
modalBtn.addEventListener('click',openModal)
form.addEventListener('submit',submitFormHandler)
input.addEventListener('input', ()=> {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault()
    if (isValid(input.value)){
        let question = {
            text:input.value.trim(),
            date: new Date().toJSON()

        }
        submitBtn.disabled = true
        //Async request to server
        Question.create(question).then(()=> {
            input.value =''
            input.className = ''
            submitBtn.disabled = false
        })
    }
}

function openModal() {
      createModal('Auth',getAuthForm())
      document
        .getElementById('auth-form')
        .addEventListener('submit',authFormHandler, {once:true})
}

function authFormHandler(event) {
    event.preventDefault()

    let email = event.target.querySelector('#email').value
    let password = event.target.querySelector('#password').value

    authWithEmailAndPassword(email,password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)

}

function renderModalAfterAuth(content) {
    if  (typeof content === 'string'){
        createModal('error',content)
    }else {
       createModal('Question list',Question.listToHtml(content))
    }
}
