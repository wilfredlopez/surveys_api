import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import {
  QuestionType,

  // RawSurveyQuestion,
  SurveyQuestionModel,
} from "shared";
import { BaseEntity } from "./BaseEntity";
import { Survey } from "./Survey";
import { OmitParams } from "./OmitParams.type";

export type QuestionConstructor = OmitParams<SurveyQuestionModel> & {
  survey: Survey;
};

@Entity()
export class SurveyQuestion extends BaseEntity implements SurveyQuestionModel {
  @ManyToOne()
  survey: Survey;
  @Property()
  title: string;
  @Property({ nullable: false })
  options: string[];
  @Property()
  type: QuestionType;
  @Property({ default: [], persist: true })
  answers: string[];

  @Property({ nullable: true })
  metaObject?: object;

  @Property({ nullable: true })
  metaArray?: any[];

  @Property({ nullable: true })
  metaArrayOfStrings?: string[];

  constructor(data: QuestionConstructor) {
    super();
    this.answers = data.answers || [];
    this.options = data.options;
    this.survey = data.survey;
    this.title = data.title;
    this.type = data.type;
  }
}
