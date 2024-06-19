import * as Faker from "@faker-js/faker";
import { define } from "typeorm-seeding";
import { Contact } from "../../entities";

define(Contact, (faker: typeof Faker) => {
  const contact = new Contact();
  contact.email = 'email+' + Date.now() + '@gmail.com' 
  contact.firstName = 'first name'
  contact.lastName = 'last name'
  contact.gender = 1
  contact.phone = '091234567'
  contact.description = 'example note'
  contact.avatar = 'http://avatar.com'
  contact.createdAt = new Date()
  contact.updatedAt = new Date()
  return contact;
});
