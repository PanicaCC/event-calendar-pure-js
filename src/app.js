//lib
import 'bootstrap'
import SelectPure from 'select-pure';
import axios from "axios";

//styles
import './scss/index.css'
import './scss/main.scss'
import './scss/select.scss'

//code
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
let stateLength = 0;


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
    const res = await axios.get('https://event-team-calendar-default-rtdb.europe-west1.firebasedatabase.app/data-event.json')
    return stateEvent = res.data;
}

async function makePostRequest(data) {
    await axios.post('https://event-team-calendar-default-rtdb.europe-west1.firebasedatabase.app/data-event.json', data).then((res) => {
        return console.log(res.data)
    }).catch((error)=> {
        console.log('Error', error)
    });
}

async function deleteEventRequest(id) {
    const res = await axios.delete('https://event-team-calendar-default-rtdb.europe-west1.firebasedatabase.app/data-event/' + id +'.json')
    return console.log('axios-del', res.data)
}

function formAction(){
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
        let newState = {id: stateLength+1, name: nameValue.value, day: dayValue, time: timeValue, member: participantsValue }

        console.log(stateLength)

        nameValue.value = '';
        instance.reset();
        instance2.reset();
        instance3.reset();
        makePostRequest(newState).then((res) => {
            //window.location.href = '/'
        });
    })
}

if (window.location.pathname !== '/'){
    window.onload = function(){
        makeGetRequest().then(()=>{
            stateLength = Object.keys(stateEvent).length;
        })
        formAction();
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
            let memberCell = targetCell.dataset.member.split(',');
            modalMember.innerHTML = '';

            deleteButton.setAttribute('data-deleteId', eventId);

            Object.values(arrMembers).map((member) => {
                for (let i = 0; i<memberCell.length; i++){
                    if (member.value === memberCell[i]){
                        const itemMember = document.createElement('li');
                        modalMember.append(itemMember)
                        itemMember.append(`${member.label}`);
                    }
                }
            })
        }

        const del = document.getElementById('deleteEvent');
        del.addEventListener('click', () => {
            const delId = del.dataset.deleteid
            console.log(delId)
            deleteEventRequest(delId).then(()=>{
                console.log("good", stateEvent)
            }).catch((error)=>{
                console.log("Error", error)
            })
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
                    timeCell.append('-')
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

        function createMemberList(){
            const memberList = document.getElementById( 'eventMembers' ).getElementsByTagName( 'div' )[0];
            Object.values(arrMembers).map((member)=>{
                const memberItem = document.createElement('a');
                memberItem.setAttribute('href', '#');
                memberItem.setAttribute('class', 'dropdown-item');
                memberItem.append(member.label)
                memberList.appendChild(memberItem)
            })
        }
        createMemberList();

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

        function CreateEventCell(data){
            const eventsCell = document.getElementsByClassName('js-cell');
            for(let k = 0; k<eventsCell.length; k++ ){
                Object.values(data).map((item) => {
                    if (eventsCell[k].dataset.day === item.day && eventsCell[k].dataset.time === item.time){
                        eventsCell[k].innerHTML = '';
                        eventsCell[k].setAttribute('data-member', item.member)
                        eventsCell[k].setAttribute('data-id', item.id)
                        eventsCell[k].append(item.name);
                    }
                })
            }
        }
        CreateEventCell(stateEvent);
    })
}
