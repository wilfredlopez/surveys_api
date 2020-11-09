import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
  ManyToOne,
} from "@mikro-orm/core";

import { Survey } from ".";
import { BaseEntity } from "./BaseEntity";
import { BaseUser, Plan } from "shared";

@Entity()
export class User
  extends BaseEntity
  implements Omit<BaseUser, "createdAt" | "updatedAt"> {
  @Property()
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
  isAdmin?: boolean | undefined;
  @Property()
  plan: Plan;

  @OneToMany(() => Survey, (b) => b.creator, { cascade: [Cascade.ALL] })
  books = new Collection<Survey>(this);

  @ManyToOne(() => Survey)
  favouriteBook?: Survey;

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
