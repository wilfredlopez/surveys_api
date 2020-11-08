import { Plan, UserDB } from 'shared'

import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsUserAlreadyExist } from '../decorators/IsUserAlreadyExists'
import { isValidPlan } from '../decorators/isValidPlan'
import { ObjectID } from 'mongodb'

const PlanEnum: Plan[] = ['yearly', 'monthly', 'trial']

@Entity()
export class User extends BaseEntity implements UserDB {
  @ObjectIdColumn()
  _id: ObjectID

  @Column({
    length: 100,
  })
  firstname: string
  @Column({
    length: 100,
  })
  lastname: string
  @Column('text')
  @IsUserAlreadyExist({
    message: 'User already exist with that email.',
  })
  email: string
  @Column('text')
  password: string
  @Column('text')
  avatar: string
  @Column('text')
  publicKey: string
  @Column('text')
  privateKey: string
  @Column('boolean', { nullable: true })
  isAdmin?: boolean | undefined

  @Column({
    type: 'text',
    enum: PlanEnum,
    default: 'trial',
  })
  @isValidPlan()
  plan: Plan
  @CreateDateColumn()
  createdAt?: string | undefined
  @UpdateDateColumn()
  updatedAt?: string | undefined
}
