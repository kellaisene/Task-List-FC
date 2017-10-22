AWS.config.update({
    accessKeyId: Meteor.settings.AWSAccessKeyId,
    secretAccessKey: Meteor.settings.AWSSecretAccessKey,
  });
  
  STS = new AWS.STS();
  
  S3 = new AWS.S3();