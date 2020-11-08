import { User } from './entities/User'
import { BaseUser } from './interfaces'
import { UserHelper } from './interfaces/BaseUserGenerator'
import apiUtils from './utils'

async function initializeAdminUser() {
  const admin = new UserHelper({
    email: 'test@test.com',
    firstname: 'wilfred',
    lastname: 'lopez',
    password: 'password',
    isAdmin: true,
  })

  const exists = await User.findOne({
    email: admin.email,
  })

  if (exists) {
    return
  }

  const password = await apiUtils.hashPassword(admin.password)
  admin.password = password
  const user = User.create(admin)
  await user.save()
  return
}

async function migrateUsers() {
  const baseUserDefault: Partial<BaseUser> = {
    // avatar: '',
    // email: '',
    // firstname: '',
    // lastname: '',
    // password: '',
    plan: 'trial',
    privateKey: 'invalid',
    publicKey: 'invalid',
    isAdmin: false,
  }

  const keys = Object.keys(baseUserDefault) as (keyof BaseUser)[]

  const allUsers = await User.find({})

  let totalModified = 0

  for (let u of allUsers) {
    let modified = false
    for (let key of keys) {
      if (typeof u[key] === 'undefined') {
        //@ts-ignore
        u[key] = baseUserDefault[key]!
        modified = true
      }
    }

    if (modified) {
      totalModified++
      await u.save()
    }
  }
  if (totalModified) {
    console.log({ usersModified: totalModified })
  }
}

export default async function initializers() {
  await initializeAdminUser()
  await migrateUsers()
  console.log('Initializers Successfully run.')
}