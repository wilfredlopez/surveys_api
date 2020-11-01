import { API_URL, LOCALSTORAGE_TOKEN } from '../constants'
import { LoginResponse, SuccessLogin } from 'shared'
import * as H from 'history'
import RouteGetter from '../RouteGetter'
import { UserInput } from 'shared'
import {
  AnswerInput,
  ExpectedCreate,
  SurveyClient,
  SurveyCreateResponse,
  SurveyQuestionClient,
  SurveyUnpolulated,
} from 'shared'

export default class FetchUtilities {
  async fetchOneSurvey(id: string) {
    try {
      const res = await fetch(`${API_URL}/surveys/${id}`)
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      return data as SurveyClient
    } catch (error) {
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error(`unable to fetch survey with id ${id}`)
      }
    }
  }

  async addSurveyAnswers(surveyId: string, answers: AnswerInput[]) {
    try {
      const res = await fetch(`${API_URL}/surveys/answer/${surveyId}`, {
        method: 'POST',
        body: JSON.stringify(answers),
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      const data = await res.json()

      if (data.error) {
        throw new Error(data.error)
      }
      return data as SurveyClient
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw e
      }
      throw new Error('Unable to add survey answers')
    }
  }

  async postNewSurvey(data: ExpectedCreate): Promise<SurveyCreateResponse> {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
    const res = await fetch(API_URL + '/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    const newSurvey = await res.json()

    return newSurvey as SurveyCreateResponse
  }

  async register(input: UserInput) {
    const res = await fetch(API_URL + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    const data = (await res.json()) as LoginResponse
    if (data.token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, data.token)
    }
    return data
  }

  async login({ email, password }: { email: string; password: string }) {
    const res = await fetch(API_URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    const data = (await res.json()) as LoginResponse
    if (data.token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, data.token)
    }
    return data
  }

  async getMySurveys(): Promise<SurveyUnpolulated[] | { error: string }>
  async getMySurveys(): Promise<SurveyUnpolulated[]>
  async getMySurveys(): Promise<{ error: string }>
  async getMySurveys() {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
    const res = await fetch(API_URL + '/mysurveys', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const surveys = await res.json()
    return surveys as SurveyUnpolulated[] | { error: string }
  }

  async updatedSurvey(
    id: string,
    surveyData: Partial<SurveyClient>
  ): Promise<SurveyClient>
  async updatedSurvey(
    id: string,
    surveyData: Partial<SurveyClient>
  ): Promise<{ error: string }>
  async updatedSurvey(id: string, surveyData: Partial<SurveyClient>) {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
    const res = await fetch(API_URL + '/surveys/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(surveyData),
    })

    const data = (await res.json()) as SurveyClient | { error: string }
    return data
  }

  async getUserWithToken(token: string) {
    const res = await fetch(API_URL + '/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = (await res.json()) as LoginResponse
    if (data.error) {
      throw new Error(data.error)
    }

    return data as SuccessLogin
  }

  getToken() {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
    return token
  }

  async updatedSurveyQuestion(
    { qid, sid }: { sid: string; qid: string },
    data: Partial<SurveyQuestionClient>
  ) {
    const token = this.getToken()
    const res = await fetch(API_URL + `/surveys/${sid}/question/${qid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    const question = await res.json()

    return question as SurveyQuestionClient
  }

  handleUnauthorized<T extends { error?: string }>(
    res: T,
    history: H.History<unknown>
  ) {
    if ('error' in res && res.error === 'Unauthorized') {
      history.replace(RouteGetter.path('login'))
    }
  }
}
