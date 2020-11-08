import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
} from 'typeorm'
// import { SurveyDB } from 'shared'
import { SurveyQuestion } from './SurveyQuestion'
import { SurveyDB } from 'shared'

@Entity()
export class Survey extends BaseEntity implements SurveyDB {
  @ObjectIdColumn()
  _id: ObjectID

  @Column(() => SurveyQuestion)
  questions: SurveyQuestion[]

  @Column('text', { nullable: false })
  name: string
  @Column('boolean', { default: false })
  open: boolean

  @Column('string')
  creatorId: ObjectID

  @CreateDateColumn()
  createdAt?: string | undefined
  @UpdateDateColumn()
  updatedAt?: string | undefined
}
