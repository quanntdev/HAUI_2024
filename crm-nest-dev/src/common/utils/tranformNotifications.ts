const moment = require('moment');
import { notificationAction } from 'src/components/notifications/enum/notifications.enum';

const MINUTE = 90000;
const HOUR = 3600000;
const DAY = 86400000;
const WEEK = 604800000;
const MONTH = 2592000000;
const YEAR = 31536000000;

function defautData(item: any, time:any, notification: any, reaction:any = null) {
  
  const lognote_title =
  item.customers_name ||
  item.deals_name ||
  item.orders_name ||
  item.tasks_name ||
  item.invoices_code;

  return {
    id: item.id,
    formUser: {
      name:
        item.logNote.user?.profile?.first_name +
        item.logNote.user?.profile?.last_name,
      avatar: item.logNote?.user?.profile?.profileImg,
    },
    logNote: {
      object:reaction ? reaction.object : item.logNote.object,
      objectId:reaction ? reaction?.objectId : item.logNote.objectId,
      content:reaction ? reaction?.comment : item.logNote.comment,
      id:reaction ? reaction?.id :  item?.logNote?.id,
    },
    notification: notification  + ` : <span style='color: red'>${lognote_title}</span></p>`,
    seen: item.seen,
    action: item?.action,
    time: time,
    lognote_title: lognote_title,
  };
}

export function transformNotification(notification: any, Repo:any, langService, lang, lognoteQuery) {
  let data = [];
  let notifications = '';

  let NotificationContent = [];

  for (const notificationItem of notification) {
    for (const lognoteItem of lognoteQuery) {
      if (notificationItem.logNote?.id === lognoteItem.log_notes_id) {
        const obj = { ...notificationItem, ...lognoteItem };
        NotificationContent.push(obj);
        break;
      }
    }
  }
  

  if (Array.isArray(NotificationContent) && NotificationContent.length > 0) {
    data = NotificationContent.map((item: any) => {
      const time = getTime(item?.createdAt);
      switch (item?.action) {
        case notificationAction.MENTION:
          notifications = langService.t('message.notification.mention', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}});
          return  defautData(item, time, notifications);
        case notificationAction.ASSIGNED:
          notifications = langService.t('message.notification.assign', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}});
          return  defautData(item, time, notifications);
        case notificationAction.LEFT:
          notifications = langService.t('message.notification.left', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}});
          return  defautData(item, time, notifications);
        case notificationAction.EDIT:
          notifications = langService.t('message.notification.edit', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}});
          return  defautData(item, time, notifications);
        case notificationAction.COMMENT_IN:
          notifications = langService.t('message.notification.comment', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}})
          return  defautData(item, time, notifications);
        case notificationAction.ATTACH_FILE:
          notifications = langService.t('message.notification.attach_file', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}});
          return  defautData(item, time, notifications);
        case notificationAction.ATTACH_IMAGE:
          notifications = langService.t('message.notification.attach_image', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}});
          return  defautData(item, time, notifications);
        case notificationAction.REACTION :
          notifications = langService.t('message.notification.reacted', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}});
          return  defautData(item, time, notifications, item?.logNote?.notes);
        case notificationAction.DUEDATE_TASK:
          notifications = langService.t('message.notification.task_dueDate', {lang: lang,  args: {value: langService.t(`message.label.${item?.logNote?.object}`, {lang: lang})}});
          return  defautData(item, time, notifications, item?.logNote?.notes);
      }
    });
  }
  return data;
}

function getTime(time: any) {
  const d = new Date(Date.parse(time)).getTime();
  const formattedDate = moment(time).format("YYYY/MM/DD HH:mm");
  const n = new Date().getTime();
  const ot = n - d;
  if (ot < MINUTE) {
    return 'few seconds ago ';
  }
  if (ot < HOUR) {
    const m = Math.ceil(ot / MINUTE);
    return `${m} minutes ago `;
  }
  if (ot < DAY) {
    const h = Math.ceil(ot / HOUR);
    return `${h} hours ago `;
  }
  return `${formattedDate} `;
}
