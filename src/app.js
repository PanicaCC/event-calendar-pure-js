//lib
import 'bootstrap'

//styles
import './scss/index.css'
import './scss/main.scss'

//code
const arrMembers = ['Homer J. Simpson', 'Marge Simpson', 'Clancy Bouvier', 'Mayor Quimby', 'Tobias'];
const arrDaysLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const workTime = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00','16:00', '17:00', '18:00'];
const calendar = document.getElementById('calendar');
let currentHour = '';
let currentDay = '';

function getCurrentHour(date) {
    let hours = date.getHours();
    const minutes = ':00'
    hours = hours + minutes;
    return hours
}

function getCurrentDay(date) {
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

const listEvent = document.createElement('ul');
listEvent.setAttribute('id','listEvent');
listEvent.setAttribute('class','calendar');
listEvent.append('Time');

const memberList = document.getElementById( 'eventMembers' ).getElementsByTagName( 'div' )[0];
arrMembers.map((member)=>{
    const memberItem = document.createElement('a');
    memberItem.setAttribute('href', '#');
    memberItem.setAttribute('class', 'dropdown-item');
    memberItem.append(member)
    memberList.appendChild(memberItem)
})

workTime.map((time, index) => {
    const listEventItem = document.createElement('li');
    listEventItem.setAttribute('class', `calendar__time time${index}`);
    listEventItem.setAttribute('key', `time${index}`);
    listEventItem.append(time);
    listEvent.appendChild(listEventItem);

    if (currentHour === time){
        listEventItem.classList.add('active')
    }

    calendar.appendChild(listEvent);
})

const daysEvent = document.createElement('div');
daysEvent.setAttribute('id', 'calendarDays')
daysEvent.setAttribute('class', 'calendar__wrap')

calendar.appendChild(daysEvent)

arrDaysLabel.map((day)=> {
    const dayLabel = document.createElement('span');
    dayLabel.setAttribute('class', 'label')
    dayLabel.append(day)

    if(currentDay === day){
        dayLabel.classList.add('active')
    }

    daysEvent.appendChild(dayLabel)
})

for(let i=0; i < workTime.length; i++){
    const dayRow = document.createElement('div');
    dayRow.setAttribute('class', 'calendar__row')
    arrDaysLabel.map((day)=>{
        const timeCell = document.createElement('button');
        timeCell.setAttribute('type', 'button')
        timeCell.setAttribute('class', 'calendar__row--cell')
        timeCell.append(day)

        dayRow.append(timeCell);
    })

    document.getElementById('calendarDays').appendChild(dayRow);
}



