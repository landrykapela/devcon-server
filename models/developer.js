class Developer {
  constructor(
    uid,
    name,
    email,
    profession,
    experience,
    pic,
    links = null,
    skills = null,
    languages = null,
    frameworks = null,
    work = null
  ) {
    this.uid = uid;
    this.name = name;
    this.profession = profession;
    this.email = email;
    this.links = links;
    this.skills = skills;
    this.languages = languages;
    this.experience = experience;
    this.pic = pic;
    this.frameworks = frameworks;
    this.work = work;
  }
}
module.exports = Developer;
