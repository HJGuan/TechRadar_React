const express = require('express');
// const {MongoClient} = require('mongodb')
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const mysql = require('mysql')
const techs = require('./Data/techs');
const app = express();
const port = 3003;

const cors = require('cors');


// Enable CORS
app.use(cors());
// Enable bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb://localhost:27017/techsCollection", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const techsSchema = {
  quadrant: Number, 
  ring: Number,  
  label: String,  
  link:String, 
  active:Boolean, 
  moved: Number,
}; 

const Techs = mongoose.model("Techs", techsSchema);

function insertData() {
  
  techs.forEach((data) => {
    const { quadrant, ring, label, link, active, moved } = data;
    const tech = new Techs({
      quadrant: quadrant,
      ring: ring,
      label: label,
      link: link,
      active: active,
      moved: moved,
    });
    tech.save();
  });

  console.log("Data inserted successfully.");
}

insertData();

app.get('/techradar/v1/spots', (req, res) => {
  Techs.find({}).exec()
    .then(spots => {
      res.json(spots);
    })
    .catch(error => {
      console.error('Error while fetching spots:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/techradar/v1/spots', (req, res) => {

  const { label, quadrant, ring } = req.body;

  const tech = new Techs({
    quadrant: quadrant,
    ring: ring,
    label: label,
    active: true
  });
  tech.save();
  console.log("saved "+ label);
});

app.post('/techradar/v1', (req, res) => {
  Techs.deleteMany({})
    .then(() => {
      console.log('All data deleted successfully');
      return insertData(); // Call the insertData function after deletion
    })
    .then(() => {
      console.log('Data inserted successfully');
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Failed to delete or insert data', error);
      res.sendStatus(500);
    });
});

app.put('/techradar/v1/spots/:techId', (req, res) => {
  const techId = req.params.techId;
  const { label, quadrant, ring } = req.body;
  Techs.findByIdAndUpdate(techId, { label, quadrant, ring }, { new: true })
    .then(updatedTech => {
      if (updatedTech) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404); // Tech entry not found
      }
    })
    .catch(error => {
      console.error('Failed to update tech entry', error);
      res.sendStatus(500);
    });
});

app.delete('/techradar/v1/spots/:techId', (req, res) => {
  const techId = req.params.techId;
  Techs.findByIdAndDelete(techId)
  .then(() => {
    console.log('Tech deleted successfully');
    res.sendStatus(200);
  })
  .catch(error => {
    console.error('Failed to delete Tech', error);
    res.sendStatus(500);
  });
});

app.delete('/techradar/v1/spots', (req, res) => {
  const isBodyEmpty = Object.keys(req.body).length === 0;
  if (isBodyEmpty){
    //if request body is not provided, delete all 
    Techs.deleteMany({})
    .then(() => {
      console.log('All data deleted successfully');
      res.sendStatus(200);
    })
    .catch(error => {
      console.error('Failed to delete data', error);
      res.sendStatus(500);
    });
  }else{
    const { ids } = req.body;
    Techs.deleteMany({ _id: { $in: ids } })
      .then(() => {
        console.log('Entries deleted successfully');
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Failed to delete entries', error);
        res.sendStatus(500);
      });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

