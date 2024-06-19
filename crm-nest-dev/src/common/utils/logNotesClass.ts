export class DataLogNote {
   user: {};
   objectId: number;
   object: string;
   action: any;
   oldValue: any;
   newValue: any;

  constructor(
    userId: number,
    object: string,
    objectId: number,
    action: any,
    data: any,
  ) {
    this.user = {
      id: userId
    };
    this.object = object;
    this.objectId = objectId;
    this.action = action;
    this.oldValue = data["oldValue"];
    this.newValue = data["newValue"];
  }
}
