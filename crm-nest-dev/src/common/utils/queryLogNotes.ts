import { LogNoteActions } from 'src/components/log-notes/enum/log-note-actions.enum';
import { DEFAULT_LIMIT_PAGINATE } from 'src/constants';
import { IsNull, In } from 'typeorm';
import { PaginationResponse } from '../dtos/pagination';
const moment = require('moment');

//CONSTANT
const BOT = {
  author: {
    id: null,
    first_name: 'QI',
    last_name: 'CRM',
    profileImg: null,
  },
  time: null,
  type: 'log',
};

function createdUSer(data: any, time: any, object: any) {
  return {
    id: data?.id,
    first_name: data?.profile?.first_name,
    last_name: data?.profile?.last_name,
    profileImg: data?.profile?.profileImg,
    time: time,
    object: object,
  };
}

const MINUTE = 90000;
const HOUR = 3600000;
const DAY = 86400000;
const WEEK = 604800000;
const MONTH = 2592000000;
const YEAR = 31536000000;
//--------------------//

function getQueryAction(action, disAction, listLognoteIds) {
  if (action !== null && disAction === null) {
    return action;
  } else if (action === null && disAction !== null) {
    return In(listLognoteIds);
  }
  return null;
}

export async function getLogNotes(
  repository: any,
  objectId: number,
  ObjectName: any,
  offset = 0,
  limit = DEFAULT_LIMIT_PAGINATE,
  action = null,
  disAction = null,
  show = null,
  listLognoteIds: any = null,
) {
 
  const queryAction = getQueryAction(action, disAction, listLognoteIds);

  const query = {
    where: {
      objectId,
      notes: IsNull(),
      object: ObjectName,
      action: queryAction,
      emoji: IsNull(),
    },
    skip: show === 'all' ? undefined : offset,
    take: show === 'all' ? undefined : limit,
    relations: {
      user: { profile: true },
      note: { user: { profile: true }, note: { user: { profile: true } } },
    },
    order: { id: 'DESC' },
  };

  const [logNotes, total] = await Promise.all([
    repository.find(query),
    repository.count(query),
  ]);

  const response = new PaginationResponse<any>(logNotes, total);
  return response;
}

const compareTextAction = (action: any) => {
  switch (action) {
    case 'customers':
      return 'Customer';
    case 'deals':
      return 'Deal';
    case 'orders':
      return 'Order';
    case 'invoices':
      return 'Invoice';
    case 'payments':
      return 'Payment';
    case 'tasks':
      return 'Task';
    default:
      return action;
  }
};

function convertObject(value: any, lang: any, i18n: any) {
  switch (value) {
    case 'contacts':
      return i18n.t('message.label.contacts', {
        lang: lang,
      });

    case 'deals':
      return i18n.t('message.label.deals', {
        lang: lang,
      });

    case 'customers':
      return i18n.t('message.label.customers', {
        lang: lang,
      });

    case 'tasks':
      return i18n.t('message.label.tasks', {
        lang: lang,
      });

    case 'invoices':
      return i18n.t('message.label.invoices', {
        lang: lang,
      });

    case 'orders':
      return i18n.t('message.label.orders', {
        lang: lang,
      });

    case 'payments':
      return i18n.t('message.label.payments', {
        lang: lang,
      });

    case 'payment_partner':
      return i18n.t('message.label.payment_partner', {
        lang: lang,
      });

    case 'invoice_partner':
      return i18n.t('message.label.invoice_partner', {
        lang: lang,
      });

    default:
      return value;
  }
}

export function transformLogNote(logNoteList: any, lang: any, i18n: any) {
  let convertedLogNotes = { items: [], total: logNoteList.total };
  if (Array.isArray(logNoteList?.items) && logNoteList?.items?.length > 0) {
    convertedLogNotes.items = logNoteList?.items?.map((item: any) => {
      const time = getTime(item?.created_at, lang, i18n);
      const userName = `${item?.user?.profile?.first_name} ${item?.user?.profile?.last_name}`;
      const createdUser: any = createdUSer(
        item?.user,
        item?.created_at,
        item?.object,
      );
      let oldObject: any;
      let newObject: any;

      switch (item?.action) {
        case LogNoteActions.CREATE:
          return {
            id: item?.id,

            comment: i18n.t('message.lognote.create', {
              lang: lang,
              args: { name: convertObject(item?.object, lang, i18n) },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.EDIT:
          return {
            id: item?.id,

            comment: i18n.t('message.lognote.edit', {
              lang: lang,
              args: { name: convertObject(item?.object, lang, i18n) },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_STATUS:
          [oldObject, newObject] = formatStatusName(
            item?.oldValue,
            item?.newValue,
          );
          if (oldObject == 'REQUEST SENDING' && newObject == 'CREATED') {
            return {
              id: item?.id,
              comment: formatCommentChangeStatus(
                oldObject,
                newObject,
                convertObject(item?.object, lang, i18n),
                i18n.t('message.lognote.status', {
                  lang: lang,
                }),
                lang,
                i18n,
              ),
              ...BOT,
              createdUser,
            };
          } else {
            return {
              id: item?.id,
              comment: formatComment(
                oldObject,
                newObject,
                convertObject(item?.object, lang, i18n),
                i18n.t('message.lognote.status', {
                  lang: lang,
                }),
                lang,
                i18n,
              ),
              ...BOT,
              createdUser,
            };
          }

        case LogNoteActions.CHANGE_PUBLIC:
          [oldObject, newObject] = formatStatusName(
            item?.oldValue,
            item.newValue,
          );

          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.security', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_DESCRIPTION:
          return {
            id: item?.id,

            comment: i18n.t('message.lognote.change_descriptions', {
              lang: lang,
              args: {
                name2: convertObject(item?.object, lang, i18n),
                name1: i18n.t('message.lognote.Descriptions', {
                  lang: lang,
                }),
              },
            }),

            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_CARD_VISIT:
          return {
            id: item?.id,

            comment: i18n.t('message.lognote.change_card_visit', {
              lang: lang,
              args: {
                name1: convertObject(item?.object, lang, i18n),
                name2: i18n.t('message.lognote.card_visit', {
                  lang: lang,
                }),
              },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_ARCHIVE:
          [oldObject, newObject] = formatStatusName(
            item?.oldValue,
            item.newValue,
          );

          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              i18n.t('message.label.tasks', {
                lang: lang,
              }),
              i18n.t('message.lognote.archive', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_PRIORITY:
          [oldObject, newObject] = formatStatusName(
            item?.oldValue,
            item.newValue,
          );

          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.priority', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CREATE_CHECKLIST:
          const newCheckList = JSON.parse(item.newValue)?.toUpperCase();
          return {
            id: item?.id,
            comment: formatCreateFromObject(
              newCheckList,
              userName,
              time,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.check_list', {
                lang: lang,
              }),

              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.USER_ASIGN:
          const newUser = JSON.parse(item.newValue);
          return {
            id: item?.id,
            comment: formatUserAsignObject(
              newUser,
              userName,
              time,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.join', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.USER_LEFT_TASK:
          const leftUser = JSON.parse(item.newValue);
          return {
            id: item?.id,
            comment: formatUserAsignObject(
              leftUser,
              userName,
              time,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.left', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.LEFT_CHECKLIST_ITEM:
          const leftData = JSON.parse(item.newValue);
          return {
            id: item?.id,
            comment: formatDoneObject(
              leftData,
              userName,
              time,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.left', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.DONE_CHECKLIST_ITEM:
          const doneData = JSON.parse(item.newValue);
          return {
            id: item?.id,
            comment: formatDoneObject(
              doneData,
              userName,
              time,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.done', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_DELIVERY_DATE:
          [oldObject, newObject] = formatStatusName(
            item?.oldValue,
            item?.newValue,
          );
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.delivery_date', {
                lang: lang,
              }),
              lang,
              i18n,
            ),

            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_NAME:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.name', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_VALUE:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.value', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_COUNTRY_NAME:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.country_name', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_INVOICE_CUSTOMER_NAME:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.invoice_customer_name', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_PROVINCE:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.label.payments', {
                lang: lang,
              }),

              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_CURENCY:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.currency', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_DUE_DATE:
          [oldObject, newObject] = formatDate(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.due_date', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_START_DATE:
          [oldObject, newObject] = formatDate(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.start_date', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_METHOD:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.payment_method', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_INVOCE:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.label.invoices', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_AMOUNT:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.amount', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_VAT:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              'VAT',
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_DATE:
          [oldObject, newObject] = formatDate(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: formatComment(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.date', {
                lang: lang,
              }),
              lang,
              i18n,
            ),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CREATE_ORDER_ITEM:
          const newCreateOrderItem = JSON.parse(item?.newValue);
          return {
            id: item?.id,
            comment: i18n.t('message.lognote.create_order_item', {
              lang: lang,
              args: {
                name: newCreateOrderItem,
              },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.DELETE_ORDER_ITEM:
          const oldValueDelete = JSON.parse(item?.oldValue);
          return {
            id: item?.id,
            comment: i18n.t('message.lognote.delete_order_item', {
              lang: lang,
              args: {
                name: oldValueDelete,
              },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CREATE_INVOICE:
          const dataInvoice = JSON.parse(item?.newValue);
          return {
            id: item?.id,
            comment: i18n.t('message.lognote.create_invoice', {
              lang: lang,
              args: {
                name: dataInvoice,
              },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CREATE_PAYMENT:
          const dataPayment = JSON.parse(item?.newValue);
          return {
            id: item?.id,
            comment: i18n.t('message.lognote.create_payment', {
              lang: lang,
              args: {
                name1: dataPayment?.code,
                name2: dataPayment?.status,
                name3: dataPayment?.paymentDate,
              },
            }),

            ...BOT,
            createdUser,
          };

        case LogNoteActions.CREATE_PAYMENT_PARTNER:
          const dataPaymentPartner = JSON.parse(item?.newValue);
          return {
            id: item?.id,
            comment: i18n.t('message.lognote.create_payment', {
              lang: lang,
              args: {
                name1: dataPaymentPartner?.code,
                name2: dataPaymentPartner?.status,
                name3: dataPaymentPartner?.paymentDate,
              },
            }),

            ...BOT,
            createdUser,
          };

        case LogNoteActions.COMMENT:
          let type = 'comment';
          let timeEdited = '';
          if (
            new Date(item?.updated_at).getTime() !=
            new Date(item?.created_at).getTime()
          ) {
            type = 'edit-comment';
            timeEdited = getTime(item?.updated_at, lang, i18n);
          }

          const replyData = item?.note?.map((it) => ({
            id: it?.id,
            comment: it?.comment,
            reaction: it?.emoji,
            note_id: item?.id,
            author: {
              id: it?.user?.id,
              first_name: it?.user?.profile?.first_name,
              last_name: it?.user?.profile?.last_name,
              profileImg: it?.user?.profile?.profileImg,
            },
            deleted: it?.isHide,
            time:
              new Date(it?.updated_at).getTime() !=
              new Date(it?.created_at).getTime()
                ? getTime(it?.updated_at, lang, i18n)
                : getTime(it?.created_at, lang, i18n),
            type:
              new Date(it?.updated_at).getTime() !=
              new Date(it?.created_at).getTime()
                ? 'edit-comment'
                : 'comment',
            ReplyReaction: it?.note?.map((its) => ({
              id: its?.id,
              comment: its?.comment,
              reaction: its?.emoji,
              note_id: it?.id,
              author: {
                id: its?.user?.id,
                first_name: its?.user?.profile?.first_name,
                last_name: its?.user?.profile?.last_name,
                profileImg: its?.user?.profile?.profileImg,
              },
              deleted: its?.isHide,
              time:
                new Date(its?.updated_at).getTime() !=
                new Date(its?.created_at).getTime()
                  ? getTime(its?.updated_at, lang, i18n)
                  : getTime(its?.created_at, lang, i18n),
              type:
                new Date(its?.updated_at).getTime() !=
                new Date(its?.created_at).getTime()
                  ? 'edit-comment'
                  : 'comment',
            })),
          }));
          return {
            id: item?.id,
            comment: item?.comment,
            author: {
              id: item?.user?.id,
              first_name: item?.user?.profile?.first_name,
              last_name: item?.user?.profile?.last_name,
              profileImg: item?.user?.profile?.profileImg,
            },
            deleted: item?.isHide,
            time: type === 'edit-comment' ? timeEdited : time,
            type: type,
            replyData: replyData,
            createdUser,
          };

        case LogNoteActions.UPLOAD_FILE:
          const replyDataImage = item?.note?.map((it) => ({
            id: it?.id,
            comment: it?.comment,
            reaction: it?.emoji,
            note_id: item?.id,
            author: {
              id: it?.user?.id,
              first_name: it?.user?.profile?.first_name,
              last_name: it?.user?.profile?.last_name,
              profileImg: it?.user?.profile?.profileImg,
            },
            time:
              new Date(it?.updated_at).getTime() !=
              new Date(it?.created_at).getTime()
                ? getTime(it?.updated_at, lang, i18n)
                : getTime(it?.created_at, lang, i18n),
            type:
              new Date(it?.updated_at).getTime() !=
              new Date(it?.created_at).getTime()
                ? 'edit-comment'
                : 'comment',
          }));
          return {
            id: item?.id,
            attachment: item?.attachment,
            comment: i18n.t('message.lognote.attach_image', {
              lang: lang,
            }),
            type: 'file',
            replyData: replyDataImage,
            createdUser,
          };

        case LogNoteActions.UPLOAD_FILE_RAW:
          const replyDataFile = item?.note?.map((it) => ({
            id: it?.id,
            comment: it?.comment,
            reaction: it?.emoji,
            note_id: item?.id,
            author: {
              id: it?.user?.id,
              first_name: it?.user?.profile?.first_name,
              last_name: it?.user?.profile?.last_name,
              profileImg: it?.user?.profile?.profileImg,
            },
            time:
              new Date(it?.updated_at).getTime() !=
              new Date(it?.created_at).getTime()
                ? getTime(it?.updated_at, lang, i18n)
                : getTime(it?.created_at, lang, i18n),
            type:
              new Date(it?.updated_at).getTime() !=
              new Date(it?.created_at).getTime()
                ? 'edit-comment'
                : 'comment',
          }));
          return {
            id: item?.id,
            attachment: item?.attachment,
            comment: i18n.t('message.lognote.attach_file', {
              lang: lang,
            }),
            type: 'file-raw',
            replyData: replyDataFile,
            createdUser,
          };

        case LogNoteActions.CREATE_ORDER:
          const orderDetail = JSON.parse(item?.newValue);
          return {
            id: item?.id,
            comment: i18n.t('message.lognote.create_order', {
              lang: lang,
              args: {
                name: orderDetail,
              },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CREATE_DEAL:
          const dealDetail = JSON.parse(item?.newValue);
          return {
            id: item?.id,
            // comment: `This [${dealDetail?.name}] deal has been created`,
            comment: i18n.t('message.lognote.create_deal', {
              lang: lang,
              args: {
                name: dealDetail,
              },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_GENDER:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,

            comment: formatChangeGender(
              oldObject,
              newObject,
              convertObject(item?.object, lang, i18n),
              i18n.t('message.lognote.gender', {
                lang: lang,
              }),
              lang,
              i18n,
            ),

            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_PHONE:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: i18n.t('message.lognote.change_phone', {
              lang: lang,
              args: {
                name1: convertObject(item?.object, lang, i18n),
                name2: i18n.t('message.lognote.phone', {
                  lang: lang,
                }),
                name3: `${oldObject}`,
                name4: `${newObject}`,
              },
            }),
            ...BOT,
            createdUser,
          };

        case LogNoteActions.CHANGE_EMAIL:
          [oldObject, newObject] = formatName(item?.oldValue, item?.newValue);
          return {
            id: item?.id,
            comment: i18n.t('message.lognote.change_email', {
              lang: lang,
              args: {
                name1: convertObject(item?.object, lang, i18n),
                name2: i18n.t('message.lognote.email', {
                  lang: lang,
                }),
                name3: `${oldObject}`,
                name4: `${newObject}`,
              },
            }),
            ...BOT,
            createdUser,
          };

        default:
          break;
      }
    });
  }
  return convertedLogNotes;
}

function getTime(time: any, lang: any, i18n: any) {
  const d = new Date(Date.parse(time)).getTime();
  const formattedDate = moment(time).format('YYYY-MM-DD HH:mm');
  const n = new Date().getTime();
  const ot = n - d;
  if (ot < MINUTE) {
    return i18n.t('message.lognote.few_second_ago', {
      lang: lang,
    });
  }
  if (ot < HOUR) {
    const m = Math.ceil(ot / MINUTE);
    return i18n.t('message.lognote.minutes_ago', {
      lang: lang,
      args: {
        time: m,
      },
    });
  }
  if (ot < DAY) {
    const h = Math.ceil(ot / HOUR);
    return i18n.t('message.lognote.hours_ago', {
      lang: lang,
      args: {
        time: h,
      },
    });
  }
  return `${formattedDate} `;
}

function formatDate(oldValue: any, newValue: any) {
  const oldVal =
    JSON.parse(oldValue) &&
    moment(JSON.parse(oldValue))?.format('MMM DD h:mm A');
  const newVal = moment(JSON.parse(newValue))?.format('MMM DD h:mm A');
  return [oldVal, newVal];
}

function formatNumber(oldValue: any, newValue: any) {
  const oldVal = Intl.NumberFormat('en-US').format(
    Number(JSON.parse(oldValue)),
  );
  const newVal = Intl.NumberFormat('en-US').format(
    Number(JSON.parse(newValue)),
  );
  return [oldVal, newVal];
}

function formatStatusName(oldValue: any, newValue: any) {
  const oldVal = JSON.parse(oldValue)?.toUpperCase();
  const newVal = JSON.parse(newValue)?.toUpperCase();
  return [oldVal, newVal];
}

function formatName(oldValue: any, newValue: any) {
  const oldVal = oldValue ? JSON.parse(oldValue) : '';
  const newVal = newValue ? JSON.parse(newValue) : '';
  return [oldVal, newVal];
}

function formatComment(
  oldData: any,
  newData: any,
  object: any,
  columnchange: any,
  lang: any,
  i18n: any,
) {
  const args = {
    name1: compareTextAction(object),
    name2: columnchange,
    name3: '',
    name4: '',
  };

  if (oldData) {
    args.name3 = oldData;
    args.name4 = newData;

    return i18n.t('message.lognote.change_name', {
      lang,
      args,
    });
  }

  args.name3 = newData;

  return i18n.t('message.lognote.update_name', {
    lang,
    args,
  });
}

function formatCommentChangeStatus(
  oldData: any,
  newData: any,
  object: any,
  columnchange: any,
  lang: any,
  i18n: any,
) {
  return oldData
    ? i18n.t('message.lognote.change_status', {
        lang: lang,
        args: {
          name1: compareTextAction(object),
          name2: columnchange,
        },
      })
    : i18n.t('message.lognote.update_status', {
        lang: lang,
        args: {
          name1: compareTextAction(object),
          name2: columnchange,
          name3: newData,
        },
      });
}

function formatCreateFromObject(
  newData: any,
  userName: any,
  time: any,
  object: any,
  columnchange: any,
  lang,
  i18n,
) {
  return i18n.t('message.lognote.create_check_list', {
    lang: lang,
    args: {
      name1: newData,
      name2: columnchange,
      name3: object,
    },
  });
}

function formatUserAsignObject(
  newData: any,
  userName: any,
  time: any,
  object: any,
  columnchange: any,
  lang: any,
  i18n: any,
) {
  return i18n.t('message.lognote.user_asign', {
    lang: lang,
    args: {
      name1: newData,
      name2: columnchange,
      name3: object,
    },
  });
}

function formatDoneObject(
  newData: any,
  userName: any,
  time: any,
  object: any,
  columnchange: any,
  lang: any,
  i18n: any,
) {
  return i18n.t('message.lognote.done_object', {
    lang: lang,
    args: {
      name1: userName,
      name2: columnchange,
      name3: newData,
      name4: object,
      name5: time,
    },
  });
}

function formatChangeGender(
  oldData: any,
  newData: any,
  object: any,
  columnchange: any,
  lang: any,
  i18n: any,
) {
  if (oldData == 0) {
    oldData = i18n.t('message.lognote.female', {
      lang: lang,
    });
    newData = i18n.t('message.lognote.male', {
      lang: lang,
    });
  } else if (oldData == 1) {
    oldData = i18n.t('message.lognote.male', {
      lang: lang,
    });
    newData = i18n.t('message.lognote.female', {
      lang: lang,
    });
  } else if (oldData == null) {
    if (newData == 1) {
      newData = i18n.t('message.lognote.male', {
        lang: lang,
      });
    } else {
      newData = i18n.t('message.lognote.female', {
        lang: lang,
      });
    }
  }

  return i18n.t('message.lognote.change_gender', {
    lang: lang,
    args: {
      name1: object,
      name2: oldData,
      name3: newData,
    },
  });
}
