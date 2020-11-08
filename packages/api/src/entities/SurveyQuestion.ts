import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm'
// import { IsUserAlreadyExist } from './IsUserAlreadyExists'
// import { isValidPlan } from './PlanValidator'
import { QuestionType } from 'shared'
import { ObjectID } from 'mongodb'
import { SurveyQuestionDB } from 'shared'

const QuestionEnum: QuestionType[] = [
  'multi-choice',
  'open-answer',
  'single-choice',
]

@Entity()
export class SurveyQuestion extends BaseEntity implements SurveyQuestionDB {
  @ObjectIdColumn()
  _id: ObjectID
  @Column('text', { nullable: false })
  title: string
  @Column({ default: [] })
  options: string[]
  @Column({
    type: 'enum',
    enum: QuestionEnum,
    nullable: false,
  })
  type: QuestionType
  @Column({ default: [] })
  answers: string[]
  @Column('string', { nullable: false })
  surveyId: ObjectID
}
