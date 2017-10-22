import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Tasks } from '../api/tasks.js';

// Task component - represents a single todo item
export default class Task extends Component {
    toggleChecked() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    deleteThisTask() {
        Meteor.call('tasks.remove', this.props.task._id);
    }

    togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
    }

    // UPLOAD BUTTON
    upload() {
        Meteor.call('tasks.upload', this.props.task._id, ! this.props.task.upload);
    }

      render() {
          // Give tasks a different className when they are checked off,
          // so that we can style them nicely in CSS
          const taskClassName = classnames({
              checked: this.props.task.checked,
              private: this.props.task.private,
          });


          // Client side uploader
        //   var uploader = new Slingshot.Upload("myFileUploads");
          
        //   uploader.send(document.getElementById('input').files[0], function (error, downloadUrl) {
        //     if (error) {
        //       // Log service detailed response
        //       console.error('Error uploading', uploader.xhr.response);
        //       alert (error);
        //     }
        //     else {
        //       Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
        //     }
        //   });
          
          

        return (
          <li className={taskClassName}>
          <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
          </button>
          
          <input
            type="checkbox"
            readOnly
            checked={this.props.task.checked}
            onClick={this.toggleChecked.bind(this)}
            />

            { this.props.showPrivateButton ? (
                <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
                { this.props.task.private ? 'Private' : 'Public' }
                </button>
            ) : '' }

            {/* UPLOAD BUTTON */}
            { this.props.showUploadButton ? (
                <button className="upload" onClick={this.upload.bind(this)}>
                { this.props.task.upload ? 'Upload' : 'upload' }
                </button>
            ) : '' }


            
            <span className="text">
                <strong>{this.props.task.username}</strong>: {this.props.task.text}
            </span>
            </li>
        );
      }
    }
    
    Task.propTypes = {
      // This component gets the task to display through a React prop.
      // We can use propTypes to indicate it is required
      task: PropTypes.object.isRequired,
      showPrivateButton: PropTypes.bool.isRequired,
      showUploadButton: PropTypes.bool.isRequired,//SHOW UPLOAD BUTTON
};