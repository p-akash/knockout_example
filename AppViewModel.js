class AppViewModel {
  constructor() {
    this.firstString = ko.observable("Enter First String");
    this.secondString = ko.observable("Enter Second String");
    this.showMessage = function() {
      alert(this.firstString() + " " + this.secondString());
    };
    this.thirdString = ko.computed(function() {
      return this.firstString() + " " + this.secondString();
    }, this);
    this.courseArray = ko.observableArray([
      "JavaScript",
      "KnockoutJS",
      "BackboneJS",
      "EmberJS"
    ]);
    this.courseArray.push("HTML");
    this.item = ko.observable();
    this.addItem = function() {
      alert("click");
      this.courseArray.push(this.item());
    };
  }
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
