import { notificationConstants } from "../_constants/notificationConstants";
import { userConstants } from "../_constants/userConstants";

export function notification(
  state = {
    isOpen: false,
    notifications: [],
    allNotificationsCount: 0
  },
  action
) {
  switch (action.type) {
    case notificationConstants.FETCH_NOTIFICATIONS_SUCCESS:
      if (action.initialFetch) {
        return {
          ...state,
          notifications: action.notifications,
          allNotificationsCount: action.total.count
        };
      }
      return {
        ...state,
        notifications: [...state.notifications, ...action.notifications]
      };

    case notificationConstants.CLOSE_NOTIFICATION_POPUP:
      return {
        ...state,
        isOpen: false
      };
    case notificationConstants.TOGGLE_NOTIFICATION_POPUP:
      return {
        ...state,
        isOpen: !state.isOpen
      };
    case notificationConstants.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.data.notification, ...state.notifications],
        allNotificationsCount: state.allNotificationsCount + 1
      };
    case notificationConstants.READ_NOTIFICATIOS:
      return {
        ...state,
        notifications: state.notifications.map(e => {
          return {
            ...e,
            read: true
          };
        })
      };
    case userConstants.GETUSER_SUCCESS:
      return {
        ...state,
        allNotificationsCount: action.user.allNotifications
      };
    default:
      return state;
  }
}
