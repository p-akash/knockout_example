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
ko.extenders.isEmail = function(elm, customMessage) {
  //add some sub-observables to our observable
  elm.hasError = ko.observable();
  elm.validationMessage = ko.observable();
  //This is the function to validate the value entered in the text boxes
  function validateEmail(valEntered) {
    var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //If the value entered is a valid mail id, return fals or return true
    elm.hasError(emailPattern.test(valEntered) === false ? true : false);
    //If not a valid mail id, return custom message
    elm.validationMessage(
      emailPattern.test(valEntered) === true ? "" : customMessage
    );
  }
  //Call the validation function for the initial validation
  validateEmail(elm());
  //Validate the value whenever there is a change in value
  elm.subscribe(validateEmail);
  return elm;
};

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
    self.email = ko.observable().extend({
      required: "Please enater a email",
      isEmail: "Not a valid mail id"
    });
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
          alert("Deleted successfully!");
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
        d = data;
      },
      async: false
    });
    self.list = ko.observableArray(d);
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
              _id: self.id(),
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
                alert("Data updated  successfully!");
              }
            });
            self.OnSubmit(false);
            self.firstName("");
            self.id("");
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
        $.post("http://localhost:8080/api/user-data", userData, function() {
          alert("Data inserated successfully");
        });
        self.OnSubmit(false);
        self.firstName("");
        self.lastName("");
        self.email("");
        self.dateOfBirth("");
        self.selectedCity("");
      }
    };
  }
}
var vm = new ViewModel();
ko.applyBindings(vm);
