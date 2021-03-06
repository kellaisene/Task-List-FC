import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

YourFileCollection = new FS.Collection("yourFileCollection", {
    stores: [new FS.Store.FileSystem("yourFileCollection", {path: "~/meteor_uploads"})]
  });
  YourFileCollection.allow({
    insert: function (userId, doc) {
      return true;
    },
    update: function (userId, doc) {
      return true;
    },
    remove: function (userId, doc) {
      return true;
    },
    download: function (userId, doc) {
      return true;
    }
  });
  
  if (Meteor.isClient) {
    Meteor.subscribe("fileUploads");
    Template.fileList.helpers({
      theFiles: function () {
        return YourFileCollection.find();
      }
    });
  
    Template.fileList.events({
      'click #deleteFileButton ': function (event) {
        console.log("deleteFile button ", this);
        YourFileCollection.remove({_id: this._id});
      },
      'change .your-upload-class': function (event, template) {
        console.log("uploading...")
        FS.Utility.eachFile(event, function (file) {
          console.log("each file...");
          var yourFile = new FS.File(file);
          YourFileCollection.insert(yourFile, function (err, fileObj) {
            console.log("callback for the insert, err: ", err);
            if (!err) {
              console.log("inserted without error");
            }
            else {
              console.log("there was an error", err);
            }
          });
        });
      }
    });
  }

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish tasks that are publi or belone to the current user
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
                // { upload: { $ne: true } },
            ],
        });
    });
    Meteor.publish("fileUploads", function () {
        console.log("publishing fileUploads");
        return YourFileCollection.find();
      });
}

Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if(task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        // Make sure only the task owner can make a task private
        if (task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { private: setToPrivate } });
    },

    // Trying to get an upload button to work 
    // 'tasks.upload'(taskId, upload) {
    //     check(taskId, String);
    //     check(upload, Boolean);

    //     const task = Tasks.findOne(taskId);

    //     // Make sure only the task owner can make a task have upload
    //     if (task.owner !== Meteor.userId()) {
    //         throw new Meteor.Error('not-authorized');
    //     }

    //     Tasks.update(taskId, { $set: {upload: upload } });
    // },

    // 'tasks.saveUpload'(url) {
    //     if (!this.userId) {
    //         throw new Meteor.Error("unauthorized", "Unauthorized");
    //     }

    //     const split = url.split("/");

    //     Uploads.insert({
    //         owner: this.userId,
    //         url: url,
    //         key: split[split.length - 1],
    //     });
    // },
    // 'tasks.deleteUpload'(id) {
    //     if (!this.userId) {
    //         throw new Meteor.Error("unauthorized", "Unauthorized");
    //     }

    //     const upload = Uploads.findOne({_id: id, owner: this.userId});

    //     if (!upload) {
    //         throw new Meteor.Error("missing-data", "Upload not found");
    //     }
    //     // Delete from s3
    //     const resp = S3.deleteObjectSync({
    //         Bucket: Meteor.settings.S3Bucket,
    //         Key: upload.key,
    //     });

    //     // Delete from collection
    //     Uploads.remove({_id: id});
    // },
});