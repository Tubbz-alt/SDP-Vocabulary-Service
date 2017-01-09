import React, { Component, PropTypes } from 'react';
import Notification from './Notification';


export default class NotificationMenu extends Component {
  constructor(props){
    super(props);

    this.state = {
      notifications: props.notifactions
    };
  }

  notificationClick(id, url) {
    console.log(id)
    console.log(url)
    console.log("Test end")
  }

  render() {
    return (
      <div className="notification-menu">
        <ul>
          {this.props.notifications.map((notif) => {
            <Notification notification={notif} onNotifClick={(id, url) => this.notificationClick(id, url)} />
          })}
        </ul>
      </div>
    );
  }
}

NotificationMenu.propTypes = {
  notifications: PropTypes.arrayOf(QuestionWidget.propTypes.notification).isRequired,
  routes: PropTypes.object.isRequired
};
