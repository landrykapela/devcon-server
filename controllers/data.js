const firebase = require("../database/data");

exports.getLanguages = (req, res, next) => {
  firebase
    .getCollection("languages")
    .then(languages => {
      console.log(languages);
      if (languages === false) {
        res.status(200).json("No data available");
      } else res.status(200).json({ response: languages });
    })
    .catch(error => {
      res.status(200).json({ error });
    });
};

//get frameworks

exports.getFrameworks = (req, res, next) => {
  firebase
    .getCollection("frameworks")
    .then(frameworks => {
      if (frameworks === false) {
        res.status(200).json("No data available");
      } else res.status(200).json({ response: frameworks });
    })
    .catch(error => {
      res.status(200).json({ error });
    });
};

//get skills

exports.getSkills = (req, res, next) => {
  firebase
    .getCollection("skills")
    .then(skills => {
      if (skills === false) {
        res.status(200).json("No data available");
      } else res.status(200).json({ response: skills });
    })
    .catch(error => {
      res.status(200).json({ error });
    });
};

//get professions

exports.getProfessions = (req, res, next) => {
  firebase
    .getCollection("professions")
    .then(professions => {
      if (professions === false) {
        res.status(200).json("No data available");
      } else res.status(200).json({ response: professions });
    })
    .catch(error => {
      res.status(200).json({ error });
    });
};

//get work

// exports.getWork = (req, res, next) => {
//   let data = new Data();
//   firebase
//     .getCollection("work")
//     .then(work => {
//       console.log(work);
//       res.status(200).json({ work });
//     })
//     .catch(error => {
//       res.status(200).json({ error });
//     });
// };
