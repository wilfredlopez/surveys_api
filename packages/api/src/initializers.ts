import { userDb } from './db'
import { BaseUser } from './interfaces'
import { UserHelper } from './interfaces/BaseUserGenerator'
import apiUtils from './utils'

async function initializeAdminUser() {
  const admin = new UserHelper({
    email: 'admin@admin.com',
    firstname: 'admin',
    lastname: 'admin',
    password: 'administraror',
    isAdmin: true,
  })

  const exists = await userDb.exists({
    email: admin.email,
  })

  if (exists) {
    return
  }
<<<<<<< HEAD

  const password = await apiUtils.hashPassword(admin.password)
  admin.password = password
  const user = User.create(admin)
=======
  const password = await apiUtils.hashPassword(admin.password)
  admin.password = password
  const user = await userDb.create(admin)
>>>>>>> c6b32e8327e35dd2eeea10090ca13ed04328718e
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

<<<<<<< HEAD
  const allUsers = await User.find({})
=======
  const allUsers = await userDb.find({})
>>>>>>> c6b32e8327e35dd2eeea10090ca13ed04328718e

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
