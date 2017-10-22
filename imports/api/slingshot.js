Slingshot.createDirective("fileUploader", Slingshot.S3Storage.TempCredentials, {
    authorize: function() {
      if (!this.userId) {
        var message = "Please login before posting files";
        throw new Meteor.Error("Login Required", message);
      }
      return true;
    },
  
    temporaryCredentials: Meteor.wrapAsync(function(expire, callback) {
      var duration = Math.max(Math.round(expire / 1000), 900);
  
      STS.getSessionToken({
        DurationSeconds: duration,
      }, function(error, result) {
        callback(error, result && result.Credentials);
      });
    }),
  
    key: function(file) {
      var rand = Math.floor(Math.random() * 9000000) + 1000000;
      var name = file.name;
      var idx = name.lastIndexOf(".");
      var noExtension = name.substring(0, idx);
      var extension = name.substring(idx, name.length);
      return "husd-" + noExtension + "-" + rand + extension;
    },
  });