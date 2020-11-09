import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { QuestionType, RawSurveyQuestion } from "shared";
import { BaseEntity } from "./BaseEntity";
import { Survey } from "./Survey";

interface SI extends Omit<RawSurveyQuestion, "updatedAt" | "createdAt"> {
  survey: Survey;
}
@Entity()
export class SurveyQuestion extends BaseEntity implements SI {
  @ManyToOne()
  survey: Survey;
  @Property()
  title: string;
  @Property({ nullable: false })
  options: string[];
  @Property()
  type: QuestionType;
  @Property({ default: [] })
  answers: string[];

  @Property()
  metaObject?: object;

  @Property()
  metaArray?: any[];

  @Property()
  metaArrayOfStrings?: string[];

  constructor(data: SI) {
    super();
    this.answers = data.answers || [];
    this.options = data.options;
    this.survey = data.survey;
    this.title = data.title;
    this.type = data.type;
  }
}
