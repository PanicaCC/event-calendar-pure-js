//lib
import 'bootstrap'
import SelectPure from 'select-pure';
import axios from "axios";

//styles
import './scss/index.css'
import './scss/main.scss'
import './scss/select.scss'

//code
const BASE_URL = 'https://event-team-calendar-default-rtdb.europe-west1.firebasedatabase.app/data-event'
const arrMembers = [
    {label: 'Homer J. Simpson', value: '0'},
    {label: 'Marge Simpson', value: '1'},
    {label: 'Clancy Bouvier', value: '2'},
    {label: 'Mayor Quimby', value: '3'},
    {label: 'Tobias', value: '4'}
];
const arrDaysLabel = [
    {label: 'Mon', value: 'Mon'},
    {label: 'Tue', value: 'Tue'},
    {label: 'Wed', value: 'Wed'},
    {label: 'Thu', value: 'Thu'},
    {label: 'Fri', value: 'Fri'},
];

const workTime = [
    {label: '10:00', value: '10'},
    {label: '11:00', value: '11'},
    {label: '12:00', value: '12'},
    {label: '13:00', value: '13'},
    {label: '14:00', value: '14'},
    {label: '15:00', value: '15'},
    {label: '16:00', value: '16'},
    {label: '17:00', value: '17'},
    {label: '18:00', value: '18'},
];

const calendar = document.getElementById('calendar');
let currentHour = '';
let currentDay = '';

let stateEvent = [];

const getCurrentHour = (date) => {
    let hours = date.getHours();
    const minutes = ':00'
    hours = hours + minutes;
    return hours
}

const getCurrentDay = date => {
    let day = date.getDay();
    if (day > 0 || day < 5) {
        switch (day){
            case 1: return day = "Mon";
            case 2: return day = "Tue";
            case 3: return day = "Wed";
            case 4: return day = "Thu"
            case 5: return day = "Fri"
            default: return null
        }
    }
    return day
}
currentDay = getCurrentDay(new Date);
currentHour = getCurrentHour(new Date);

//Axios
async function makeGetRequest() {
    const res = await axios.get(`${BASE_URL}.json`)
    return stateEvent = res.data;
}

async function makePostRequest(data) {
    const res = axios.post(`${BASE_URL}.json`, data)
}

async function deleteEventRequest(id) {
    const res = await axios.delete(`${BASE_URL}/${id}.json`)
    return console.log('axios-del', res.data)
}

//Create Event
function formAction(data) {
    const InfoAlert = document.getElementById('formAlert');
    let prevState;
    data.then(function (result) {
        return prevState = result
    })

    const instance = new SelectPure(".select", {
        options: arrMembers,
        multiple: true
    });

    const instance2 = new SelectPure(".select-day", {
        options: arrDaysLabel,
        multiple: false
    });

    const instance3 = new SelectPure(".select-time", {
        options: workTime,
        multiple: false
    });

    const clearSelectValue = document.getElementById('clearSelectValue');
    clearSelectValue.onclick = () => {
        instance.reset();
    }

    const createEventForm = document.getElementById('createEventForm');
    createEventForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nameValue = document.getElementById('eventName');
        let participantsValue = instance.value()
        let dayValue = instance2.value();
        let timeValue = instance3.value();
        let newState = {name: nameValue.value, day: dayValue, time: timeValue, member: participantsValue}

        if (!!newState.name || !!newState.day || !!newState.time || !!newState.member) {
            if (Object.values(prevState).filter(el => el.day === newState.day).length > 0 && Object.values(prevState).filter(el => el.time === newState.time).length > 0){
                InfoAlert.append('Filed to create as event. Time slot is already booking')
                InfoAlert.classList.add('alert-danger')
                setTimeout(() => {
                    InfoAlert.innerHTML = ''
                    InfoAlert.classList.remove('alert-danger');
                }, 3500)
            } else {
                nameValue.value = '';
                instance.reset();
                instance2.reset();
                instance3.reset();
                makePostRequest(newState).then(() => {
                    InfoAlert.append('The event was successfully added to the calendar.')
                    InfoAlert.classList.add('alert-success')
                    setTimeout(() => {
                        InfoAlert.innerHTML = ''
                        InfoAlert.classList.remove('alert-success');
                        window.location.href = '/'
                    }, 3500)

                });
            }
        } else {
            InfoAlert.append('All field can not be blank!')
            InfoAlert.classList.add('alert-warning')
            setTimeout(() => {
                InfoAlert.innerHTML = ''
                InfoAlert.classList.remove('alert-warning');
            }, 3500)
        }
    })
}

function CreateEventCell(data){
    const eventsCell = document.getElementsByClassName('js-cell');
    for(let k = 0; k<eventsCell.length; k++ ){
        Object.entries(data).map((item) => {
            if (eventsCell[k].dataset.day === item[1].day && eventsCell[k].dataset.time === item[1].time){
                console.log('test1')
                console.log(data)
                eventsCell[k].innerHTML = '';
                eventsCell[k].setAttribute('data-member', item[1].member)
                eventsCell[k].setAttribute('data-id', item[0])
                eventsCell[k].append(item[1].name);
            }
        })
    }
}

if (window.location.pathname !== '/'){
    window.onload = function(){
        let state = makeGetRequest()
        formAction(state);

    }
} else {
    makeGetRequest().then(()=> {

        const countEvent = document.getElementById('eventsCount').getElementsByTagName('span')[0];
        countEvent.innerHTML = '';
        countEvent.append(Object.keys(stateEvent).length);

        const setEvent = (event) => {
            const targetCell = document.getElementById(event.target.id)
            const modalMember = document.getElementById('eventModal').getElementsByClassName('js-member-in-modal')[0];
            const deleteButton = document.getElementById('deleteEvent');
            let eventId = targetCell.dataset.id
            modalMember.innerHTML = '';
            if (targetCell.dataset.member){
                let memberCell = targetCell.dataset.member.split(',');
                Object.values(arrMembers).map((member) => {
                    for (let i = 0; i<memberCell.length; i++){
                        if (member.value === memberCell[i]){
                            const itemMember = document.createElement('li');
                            modalMember.append(itemMember)
                            itemMember.append(`${member.label}`);
                        }
                    }
                })
            } else {
                modalMember.append('Event is empty!');
            }
            deleteButton.setAttribute('data-deleteId', eventId);
        }

        const del = document.getElementById('deleteEvent');
        del.addEventListener('click', () => {
            const delId = del.dataset.deleteid
            const result = confirm('Do you confirm the deletion of this event?');
            if (result) {
                deleteEventRequest(delId).then(() => {
                    try {
                        window.location.href = '/'
                    } catch (e) {
                        console.log("Error", e)
                    }
                })
            }
        })

        function appendEventCell(){
            for(let i=0; i < workTime.length; i++){
                const dayRow = document.createElement('div');
                dayRow.setAttribute('class', 'calendar__row')
                Object.values(arrDaysLabel).map((day, index)=>{
                    const timeCell = document.createElement('button');
                    timeCell.setAttribute('type', 'button')
                    timeCell.setAttribute('class', 'calendar__row--cell js-cell')
                    timeCell.setAttribute('id', `cell${ i +''+ index }`)
                    timeCell.setAttribute('id', `cell${ i +''+ index }`)
                    timeCell.setAttribute('data-toggle', `modal`)
                    timeCell.setAttribute('data-day', day.value)
                    timeCell.setAttribute('data-time', workTime[i].value)
                    timeCell.setAttribute('data-target', `#eventModal`)

                    timeCell.onclick = (event) => setEvent(event)
                    timeCell.append(' ')
                    dayRow.append(timeCell);
                })
                if (document.getElementById('calendarDays')){
                    document.getElementById('calendarDays').appendChild(dayRow);
                }
            }
        }

        function createListEvent(){
            const listEvent = document.createElement('ul');
            listEvent.setAttribute('id','listEvent');
            listEvent.setAttribute('class','calendar');
            listEvent.append('Time');

            createWorkTime(listEvent);
        }
        createListEvent();

        function createWorkTime(listEvent){
            Object.values(workTime).map((time, index) => {
                const listEventItem = document.createElement('li');
                listEventItem.setAttribute('class', `calendar__time time${index}`);
                listEventItem.setAttribute('key', `time${index}`);
                listEventItem.append(time.label);
                listEvent.appendChild(listEventItem);

                if (currentHour === time.label){
                    listEventItem.classList.add('active')
                }

                calendar.appendChild(listEvent);
            })
        }

        function createDayEvent(){
            const daysEvent = document.createElement('div');
            daysEvent.setAttribute('id', 'calendarDays')
            daysEvent.setAttribute('class', 'calendar__wrap')
            calendar.appendChild(daysEvent)

            Object.values(arrDaysLabel).map((day)=> {
                const dayLabel = document.createElement('span');
                dayLabel.setAttribute('class', 'label')
                dayLabel.append(day.label)

                if(currentDay === day.label){
                    dayLabel.classList.add('active')
                }

                daysEvent.appendChild(dayLabel)
            })
            appendEventCell();
        }
        createDayEvent();
        CreateEventCell(stateEvent);
    })

    const instanceSort = new SelectPure(".sort_select", {
        options: [{label: 'All members', value: '10'}, ...arrMembers],
        multiple: false,
        onChange: value => sortEventWithMember(value)
    })

    function sortEventWithMember(member){
        let updateStateEvent = {}
        const res = Object.entries(stateEvent).map((item, index) => {
            if (item[1].member.filter((el) => el === member).length > 0){
                updateStateEvent[item[0]] = item[1]
            }
        })
        console.log(updateStateEvent)
        CreateEventCell(updateStateEvent) //todo continued with sort member
    }
}
