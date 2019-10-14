ko.extenders.required = function(target, overrideMessage) {
  //add some sub-observables to our observable
  target.hasError = ko.observable();
  target.validationMessage = ko.observable();

  //define a function to do validation
  function validate(newValue) {
    target.hasError(newValue ? false : true);
    target.validationMessage(
      newValue ? "" : overrideMessage || "This field is required"
    );
  }

  //initial validation
  validate(target());

  //validate whenever the value changes
  target.subscribe(validate);

  //return the original observable
  return target;
};
function data(id, name, email, dateOfBirth, gender, city) {
  var self = this;
  self.id = id;
  self.name = name;
  self.email = email;
  self.dateOfBirth = dateOfBirth;
  self.gender = gender;
  self.city = city;
}

class ViewModel {
  constructor() {
    self = this;
    self.id = ko.observable();
    self.isUpdate = ko.observable(true);
    self.firstName = ko
      .observable("")
      .extend({ required: "Please eanter a first name" });
    self.lastName = ko
      .observable()
      .extend({ required: "Please enter a last name" });
    self.email = ko.observable().extend({ required: "Please enater a email" });
    self.checkGender = ko
      .observable("")
      .extend({ required: "Please select gender" });
    self.dateOfBirth = ko
      .observable()
      .extend({ required: "Please enter a date of birth" });
    self.selectedCity = ko
      .observable()
      .extend({ required: "Please seclect city" });
    self.OnSubmit = ko.observable(false);

    this.availableCity = ko.observableArray([
      "Surat",
      "Ahemdabad",
      "Vadodara",
      "Rajkot",
      "Mumbai",
      "Pune",
      "Kolkata",
      "Banglore",
      "Hydrabad"
    ]);

    self.removeItem = function() {
      self.list.remove(this);
      $.ajax({
        url: "http://localhost:8080/api/user-data/delete-user/" + this._id,
        type: "DELETE",
        success: function(result) {
          console.log(result);
        }
      });
    };
    self.editItems = function() {
      self.id(this._id);
      const srt = this.name.split(" ");
      self.firstName(srt[0]);
      self.lastName(srt[1]);
      self.email(this.email);
      self.dateOfBirth(this.dateOfBirth);
      self.checkGender(this.gender);
      self.selectedCity(this.city);
      self.isUpdate(false);
    };

    let d;
    $.ajax({
      url: "http://localhost:8080/api/user-data",
      success: function(data) {
        console.log(data);
        d = data;
      },
      async: false
    });
    self.list = ko.observableArray(d);
    console.log(self.list());
    console.log(d);
    this.updateItems = function() {
      self.OnSubmit(true);
      if (
        !self.firstName.hasError() &&
        !self.lastName.hasError() &&
        !self.email.hasError() &&
        !self.dateOfBirth.hasError() &&
        !self.checkGender.hasError() &&
        !self.selectedCity.hasError()
      ) {
        self.list().forEach(data => {
          if (data._id === self.id()) {
            const newData = {
              name: self.firstName() + " " + self.lastName(),
              email: self.email(),
              dateOfBirth: self.dateOfBirth(),
              gender: self.checkGender(),
              city: self.selectedCity()
            };
            self.list.replace(data, newData);
            $.ajax({
              url: "http://localhost:8080/api/user-data/edit-user/" + self.id(),
              type: "PUT",
              data: newData,
              success: function(result) {
                console.log(result);
              }
            });
            self.OnSubmit(false);
            self.firstName("");
            self.lastName("");
            self.email("");
            self.dateOfBirth("");
            self.isUpdate(true);
            self.checkGender("");
            self.selectedCity("");
          }
        });
      }
    };

    this.addition = function() {
      self.OnSubmit(true);
      if (
        !self.firstName.hasError() &&
        !self.lastName.hasError() &&
        !self.email.hasError() &&
        !self.dateOfBirth.hasError() &&
        !self.checkGender.hasError() &&
        !self.selectedCity.hasError()
      ) {
        const userData = {
          name: self.firstName() + " " + self.lastName(),
          email: self.email(),
          dateOfBirth: self.dateOfBirth(),
          gender: self.checkGender(),
          city: self.selectedCity()
        };
        self.list.push(userData);
        $.post("http://localhost:8080/api/user-data", userData, function(
          returnedData
        ) {
          console.log(returnedData);
        });
        self.OnSubmit(false);
        self.firstName("");
        self.lastName("");
        self.email("");
        self.dateOfBirth("");
        self.selectedCity("");
        alert("Data inserated successfully");
      }
    };
  }
}

var vm = new ViewModel();
ko.applyBindings(vm);
