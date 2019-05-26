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
    res.send([1,2,3]); 
});
app.get('/api/courses/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The book with the given ID not found');
    res.send(course);
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening to port ${port}`));
});
