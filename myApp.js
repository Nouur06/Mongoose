require("dotenv").config();
const mongoose = require("mongoose");

// Connect only after a real Atlas URI has been added to the private .env file.
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Keep the required name while allowing the other fields to be optional.
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model("Person", personSchema);

// Save one example person and return the saved document through the callback.
const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Alex Example",
    age: 30,
    favoriteFoods: ["burritos", "pizza"],
  });
  person.save((err, data) => done(err, data));
};

// Seed the collection with each person in the supplied array.
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => done(err, people));
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, people) => done(err, people));
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => done(err, person));
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, person) => done(err, person));
};

// Edit the loaded document, then persist the change with save().
const findEditThenSave = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    if (!person) return done(null, null);

    person.favoriteFoods.push("hamburger");
    person.save((saveErr, updatedPerson) => done(saveErr, updatedPerson));
  });
};

const findAndUpdate = (personName, done) => {
  Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true },
    (err, updatedPerson) => done(err, updatedPerson),
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) =>
    done(err, removedPerson),
  );
};

const removeManyPeople = (done) => {
  Person.remove({ name: "Mary" }, (err, result) => done(err, result));
};

const queryChain = (done) => {
  Person.find({ favoriteFoods: "burritos" })
    .sort({ name: 1 })
    .limit(2)
    .select("-age")
    .exec((err, people) => done(err, people));
};

module.exports = {
  Person,
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain,
};
