import {
  Entity,
  ManyToOne,
  Property,
  Collection,
  OneToMany,
  Cascade,
} from "@mikro-orm/core";
import {
  // RawSurvey,
  SurveyModel,
} from "shared";

import { BaseEntity } from "./BaseEntity";
import { User } from "./index";
import { SurveyQuestion } from ".";
import { OmitParams } from "./OmitParams.type";

interface SurveyEntityModel extends Omit<SurveyModel, "questions"> {
  creator: User;
}
@Entity()
export class Survey extends BaseEntity implements SurveyEntityModel {
  @ManyToOne()
  creator: User;
  @Property()
  creatorId: string;
  @Property({ nullable: false })
  name: string;
  @Property({ default: false })
  open: boolean;

  @OneToMany(() => SurveyQuestion, (b) => b.survey, {
    cascade: [Cascade.ALL],
    default: [],
  })
  questions = new Collection<SurveyQuestion>(this);
  @Property({ nullable: true })
  metaObject?: object;

  @Property({ nullable: true })
  metaArray?: any[];

  @Property({ nullable: true })
  metaArrayOfStrings?: string[];

  constructor(data: OmitParams<SurveyEntityModel>) {
    super();
    this.name = data.name;
    this.open = data.open;
    this.creator = data.creator;
    this.creatorId = String(data.creator);
  }
}
