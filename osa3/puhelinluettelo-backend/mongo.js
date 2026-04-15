const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://markus_db_user:${password}@cluster0.25l9h47.mongodb.net/contactApp?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const uusiNimi = process.argv[3]
const uusiNumero = process.argv[4]

const person = new Person({
    name: uusiNimi,
    number: uusiNumero,
})

if (process.argv.length > 3) {
    person.save().then(result => {
        console.log('Added', uusiNimi, 'number', uusiNumero, 'to phonebook')
        mongoose.connection.close()
    })
}

if (process.argv.length < 4) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
