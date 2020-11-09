import {
  Entity,
  ManyToOne,
  Property,
  Collection,
  OneToMany,
  Cascade,
} from "@mikro-orm/core";
import { RawSurvey } from "shared";
import { BaseEntity } from "./BaseEntity";
import { User } from "./index";
import { SurveyQuestion } from ".";

interface SI
  extends Omit<
    RawSurvey,
    "creator" | "updatedAt" | "createdAt" | "creatorId" | "questions"
  > {
  creator: User;
}
@Entity()
export class Survey extends BaseEntity implements SI {
  @ManyToOne()
  creator: User;
  @Property({ nullable: false })
  name: string;
  @Property({ default: false })
  open: boolean;

  @OneToMany(() => SurveyQuestion, (b) => b.survey, { cascade: [Cascade.ALL] })
  questions = new Collection<SurveyQuestion>(this);
  @Property()
  metaObject?: object;

  @Property()
  metaArray?: any[];

  @Property()
  metaArrayOfStrings?: string[];

  constructor(data: SI) {
    super();
    this.name = data.name;
    this.open = data.open;
    this.creator = data.creator;
  }
}
