const mongoose = require('mongoose')
const Calendar = require('../models/schoolCalendar')

const schoolCalendar= ()=>{
    const date = new Date()
    const year = date.getFullYear()
    console.log(year)

     
    const calendar = new Calendar({
        year,
        term,
       week

    })
    calendar.save()
    
    
}

module.exports = schoolCalendar