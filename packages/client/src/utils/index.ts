import { SurveyQuestionClient } from 'shared'

export interface AnswerValue {
  text: string
  count: number
}

export interface OrganizedAnswers {
  total: number
  answers: AnswerValue[]
}

class Utilities {
  getUniqueAnswers(ans: string[]) {
    const unique: Record<string, AnswerValue> = {}

    for (let answer of ans) {
      if (unique[answer]) {
        unique[answer].count = unique[answer].count + 1
        continue
      }
      unique[answer] = {
        text: answer,
        count: 1,
      }
    }
    return Object.values(unique).sort(
      (a, b) => b.count - a.count
    ) as AnswerValue[]
  }

  percentText(ans: AnswerValue, total: number) {
    let percent = (ans.count / total) * 100
    if (isNaN(percent)) {
      percent = 0
    }
    return `${ans.text} (${percent.toFixed(1)}%)`
  }
  findMissingAnswers(
    MAP: Record<string, OrganizedAnswers>,
    questions: SurveyQuestionClient[]
  ) {
    const missing: Record<string, AnswerValue[]> = {} // output

    const orginized = Object.values(MAP)
    const selected: { [key: string]: string } = {}
    // add all selected answers to object
    for (const o of orginized) {
      for (let a of o.answers) {
        selected[a.text] = a.text
      }
    }

    const optionsArr = questions.map(q => ({ id: q._id, opt: q.options }))
    for (const option of optionsArr) {
      for (let q of option.opt) {
        if (!selected[q]) {
          if (Array.isArray(missing[option.id])) {
            missing[option.id].push({
              count: 0,
              text: q,
            })
          } else {
            missing[option.id] = [
              {
                count: 0,
                text: q,
              },
            ]
          }
        }
      }
    }

    return missing
  }
}

const utils = new Utilities()

export default utils
