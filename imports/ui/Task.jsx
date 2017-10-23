import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { Tasks } from '../api/tasks.js';

import FileReaderInput from 'react-file-reader-input';

// import { Upload } from './Upload.jsx';

// var FileInput = require('react-simple-file-input');

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
    // upload() {
    //     Meteor.call('tasks.upload', this.props.task._id, ! this.props.task.upload);
    // }


    handleChange = e => {
        const files = [];
        for (let i = 0; i < e.target.files.length; i++) {
          // Convert to Array.
          files.push(e.target.files[i]);
        }
    
        // Build Promise List, each promise resolved by FileReader.onload.
        Promise.all(files.map(file => new Promise((resolve, reject) => {
          let reader = new FileReader();
    
          reader.onload = result => {
            // Resolve both the FileReader result and its original file.
            resolve([result, file]);
          };
    
          // Read the file with format based on this.props.as.
          switch ((this.props.as || 'url').toLowerCase()) {
            case 'binary': {
              reader.readAsBinaryString(file);
              break;
            }
            case 'buffer': {
              reader.readAsArrayBuffer(file);
              break;
            }
            case 'text': {
              reader.readAsText(file);
              break;
            }
            case 'url': {
              reader.readAsDataURL(file);
              break;
            }
          }
        })))
        .then(zippedResults => {
          // Run the callback after all files have been read.
          this.props.onChange(e, zippedResults);
        });
      }

      triggerInput = e => {
        ReactDOM.findDOMNode(this._reactFileReaderInput).click();
        }
    

      render() {
            const hiddenInputStyle = this.props.children ? {
            // If user passes in children, display children and hide input.
            position: 'absolute',
            top: '-9999px'
            } : {};

            const {as, style, ...props} = this.props;
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

            <form>
               
                <FileReaderInput as="binary" id="my-file-input"
                                onChange={this.handleChange}
                                >
                <button checked={this.props.task.checked} onClick={this.toggleChecked.bind(this)}>Upload a file</button>
                </FileReaderInput>
                {this.props.children}
            </form>

            {/* <div className="_react-file-reader-input" onClick={this.triggerInput} style={style}>
                <input {...props} children={undefined} type="file"
                    onChange={this.handleChange} ref={c => this._reactFileReaderInput = c}
                    onClick={() => {this._reactFileReaderInput.value = null;}}
                    style={hiddenInputStyle}/>
                {this.props.children}
            </div> */}

            {/* UPLOAD BUTTON */}
            {/* { this.props.showUploadButton ? (
                <button className="upload" onClick={this.upload.bind(this)}>
                { this.props.task.upload ? 'Upload' : 'upload' }
                </button>
            ) : '' } */}

            {/* <FileInput
            readAs='binary'
            multiple
            
            onLoadStart={ this.showProgressBar }
            onLoad={ this.handleFileSelected }
            onProgress={ this.updateProgressBar }
            
            cancelIf={ checkIfFileIsIncorrectFiletype }
            abortIf={ this.cancelButtonClicked }
            
            onCancel={ this.showInvalidFileTypeMessage }
            onAbort={ this.resetCancelButtonClicked }
            /> */}
            
            <br></br>
            
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
    //   showUploadButton: PropTypes.bool.isRequired,//SHOW UPLOAD BUTTON
};