import { Survey } from '../../entities/Survey'
import { SurveyQuestion } from '../../entities/SurveyQuestion'
import { getConnection } from 'typeorm'

export default async function getSurveyWithQuestions(surveys: Survey[]) {
  const connection = await getConnection()
  const ids = surveys.map(s => s._id)
  const quests = await connection.getMongoRepository(SurveyQuestion).find({
    where: {
      surveyId: {
        $in: ids,
      },
    },
  })

  const output: Survey[] = []

  const qmap: Record<string, SurveyQuestion[]> = {}

  for (let q of quests) {
    const key = String(q.surveyId)
    const map = qmap[key]
    if (map) {
      map.push(q)
    } else {
      qmap[key] = [q]
    }
  }

  for (let sir of surveys) {
    sir.questions = qmap[String(sir._id)] || []
    output.push(sir)
  }
  return output
}
