const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];
app.use(bodyParser.json());
app.use(express.json());
app.get('/api/courses', (req, res) => {
    res.send(courses); 
});
app.get('/api/courses/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The book with the given ID not found');
    res.send(course);
});
var isPrime = function (num){
    if (num == 1 || num == 2){
        return true
    }
    for (var i=2; i<num; i++){
    if (num % i == 0){
        return false
        }
    }
        return true
}
app.post('/api/prime', (req, res) => {
    var num = req.body.num
    if (isPrime(num)){
        res.send(num + 'is prime number')
    }
    else{
        res.send(num + 'is not prime')
    }
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));
