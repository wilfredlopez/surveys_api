import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core";

import { Survey } from ".";
import { BaseEntity } from "./BaseEntity";
import { BaseUser, Plan, UserModel } from "shared";

@Entity()
export class User extends BaseEntity implements UserModel {
  @Property({ unique: true })
  email: string;
  @Property()
  firstname: string;
  @Property()
  lastname: string;
  @Property()
  password: string;
  @Property()
  avatar: string;
  @Property()
  publicKey: string;
  @Property()
  privateKey: string;
  @Property({ default: false })
  isAdmin?: boolean | undefined;
  @Property()
  plan: Plan;

  @OneToMany(() => Survey, (survey) => survey.creator, {
    cascade: [Cascade.ALL],
  })
  surveys = new Collection<Survey>(this);

  constructor(user: BaseUser) {
    super();
    this.avatar = user.avatar;
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.isAdmin = user.isAdmin;
    this.password = user.password;
    this.plan = user.plan;
    this.privateKey = user.privateKey;
    this.publicKey = user.publicKey;
  }
}
