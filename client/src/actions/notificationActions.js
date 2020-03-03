import { notificationConstants } from "../_constants/notificationConstants";
import { notificatonService } from "../_services/notificationService";

export const notificationActions = {
  toggleNotificationPopup,
  closeNotificationPopup,
  addNotification,
  fetchNotifications
};

function readNotifications(notificationIds) {
  notificatonService.readNotifications(notificationIds).then(
    () => {},
    error => {
      console.log(error);
    }
  );
}

function fetchNotifications(queryOptions, notificationIds) {
  return dispatch => {
    notificatonService.fetchNotifications(queryOptions).then(
      response => {
        if (queryOptions.initialFetch) {
          const { notifications, total } = response[0];
          dispatch(success(notifications, total[0], queryOptions.initialFetch));
          // read notifications
          const ids = notifications
            .filter(e => !e.read)
            .map(e => e._id)
            .concat(notificationIds);
          const uniqueIds = ids
            .filter((item, index) => ids.indexOf(item) === index)
            .filter(item => item !== undefined);
          readNotifications(uniqueIds);

          if (uniqueIds[0] !== undefined) {
            dispatch({
              type: notificationConstants.READ_NOTIFICATIOS,
              readCount: uniqueIds.length
            });
          }
        } else {
          dispatch(success(response));
          // read notifications
          const ids = response
            .filter(e => !e.read)
            .map(e => e._id)
            .concat(notificationIds);
          const uniqueIds = ids
            .filter((item, index) => ids.indexOf(item) === index)
            .filter(item => item !== undefined);
          readNotifications(uniqueIds);

          if (uniqueIds[0] !== undefined) {
            dispatch({
              type: notificationConstants.READ_NOTIFICATIOS,
              readCount: uniqueIds.length
            });
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  };

  function success(notifications, total, initialFetch) {
    return {
      type: notificationConstants.FETCH_NOTIFICATIONS_SUCCESS,
      notifications,
      total,
      initialFetch
    };
  }
}

function toggleNotificationPopup() {
  return dispatch => {
    dispatch({
      type: notificationConstants.TOGGLE_NOTIFICATION_POPUP
    });
  };
}

function closeNotificationPopup() {
  return dispatch => {
    dispatch({ type: notificationConstants.CLOSE_NOTIFICATION_POPUP });
  };
}

function addNotification(data) {
  return dispatch => {
    dispatch({ type: notificationConstants.ADD_NOTIFICATION, data });
  };
}
