const Developer = require("../models/developer");
const firebase = require("../database/firebase");

//register developer
exports.registerDeveloper = (req, res) => {
  let dev = new Developer();
  const body = JSON.parse(req.body);
  dev.uid = body.uid;
  dev.email = body.email;
  dev.name = body.name;
  dev.pic = body.pic;
  dev.experience = body.experience;
  dev.skills = body.skills;
  dev.links = body.links;
  dev.languages = body.languages;
  dev.frameworks = body.frameworks;
  dev.work = body.work;

  firebase
    .saveDeveloperDetails(dev)
    .then(success => {
      if (success) {
        firebase
          .getDeveloperDetails(dev.uid)
          .then(dev => {
            res.status(201).json({ dev });
          })
          .catch(e => {
            console.log(e);
            res.status(400).json({ e });
          });
      }
    })
    .catch(e => {
      console.log(e);
      if (e.code === "auth/not logged in") res.status(403).json({ e });
      else res.status(400).json({ e });
    });
};

//get list of all developers
exports.getAll = (req, res) => {
  firebase
    .listDevelopers()
    .then(developers => {
      if (developers === null) {
        res.status(200).json("No data available");
      } else {
        res.status(200).json({ developers });
      }
    })
    .catch(e => {
      res.status(400).json({ e });
    });
};
//module to get developer details
exports.getDeveloper = (req, res, next) => {
  let id = req.params.id;
  firebase
    .getDeveloperDetails(id)
    .then(dev => {
      console.log("getDeveloper: ", dev);
      res.status(200).json({ dev });
    })
    .catch(e => {
      console.log(e);
      res.status(400).json({ e });
    });
};

//module to update developer info
exports.updateDeveloper = (req, res, next) => {
  let data = {};
  data = req.body;
  data.uid = req.params.id;
  firebase
    .updateDeveloper(data)
    .then(dev => {
      res.status(201).json({ dev });
    })
    .catch(e => {
      console.log(e);
      res.status(200).json({ e });
    })
    .catch(e => {
      console.log(e);
      res.status(400).json({ e });
    });
};

//module to update developer item
exports.updateDeveloperItem = (req, res, next) => {
  let data = {};
  data = req.body;
  data.uid = req.params.id;
  firebase
    .updateDeveloperItem(data)
    .then(success => {
      res.status(201).json({ success });
    })
    .catch(e => {
      console.log(e);
      res.status(200).json({ e });
    })
    .catch(e => {
      console.log(e);
      res.status(400).json({ e });
    });
};
