import { API_URL, LOCALSTORAGE_TOKEN } from '../constants'
import { SuccessLoginClient, LoginResponseClient } from 'shared'
import * as H from 'history'
import RouteGetter from '../RouteGetter'
import { UserClient } from 'shared'
import {
  UserInput,
  AnswerInput,
  ExpectedCreate,
  SurveyClient,
  SurveyCreateResponse,
  SurveyQuestionClient,
  SurveyUnpolulated,
  PlaceOrderRequesInput,
} from 'shared'

async function wrapFetchPost<Returning extends any>(url: string, data: Object) {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
  const result = await res.json()
  return result as Returning
}
async function wrapFetchGet<Returning extends any>(url: string) {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, {
    headers: headers,
  })
  const result = await res.json()
  return result as Returning
}

export default class FetchUtilities {
  async deleteSurvey(surveyId: string) {
    const res = await fetch(`${API_URL}/survey/${surveyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getToken()}`,
      },
    })
    const data = await res.json()
    return data
  }
  async placeOrder(info: PlaceOrderRequesInput) {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const data = await wrapFetchPost<UserClient>(`${API_URL}/order`, info)

    return data
  }

  async fetchOneSurvey(id: string, publicKey: string) {
    try {
      const data = await wrapFetchGet<SurveyClient>(
        `${API_URL}/survey/${id}?publicKey=${publicKey}`
      )
      // const res = await fetch(`${API_URL}/surveys/${id}`)
      // const data = await res.json()
      if ('error' in data) {
        throw new Error(data['error'] as any)
      }
      return data
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
      const res = await fetch(`${API_URL}/survey/answer/${surveyId}`, {
        method: 'PUT',
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
    const res = await fetch(API_URL + '/survey', {
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
    const res = await fetch(API_URL + '/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    const data = (await res.json()) as LoginResponseClient
    if (data.token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, data.token)
    }
    return data
  }

  async login({ email, password }: { email: string; password: string }) {
    const res = await fetch(API_URL + '/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    const data = (await res.json()) as LoginResponseClient
    if (data.token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, data.token)
    }
    return data as SuccessLoginClient
  }

  async getMySurveys(): Promise<SurveyUnpolulated[] | { error: string }>
  async getMySurveys(): Promise<SurveyUnpolulated[]>
  async getMySurveys(): Promise<{ error: string }>
  async getMySurveys() {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
    const res = await fetch(API_URL + '/survey/mysurveys', {
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
    const res = await fetch(API_URL + '/survey/' + id, {
      method: 'PUT',
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
    const res = await fetch(API_URL + '/user/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = (await res.json()) as LoginResponseClient
    if (data.error) {
      throw new Error(data.error)
    }

    return data as SuccessLoginClient
  }

  getToken() {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
    return token
  }

  async updatedSurveyQuestion(
    { qid }: { sid: string; qid?: string },
    data: Partial<SurveyQuestionClient>
  ) {
    const token = this.getToken()
    const res = await fetch(API_URL + `/question/${qid}`, {
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
