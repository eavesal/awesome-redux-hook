import { camelizeKeys } from 'humps'
import 'isomorphic-fetch'
import { normalize, schema, Schema } from 'normalizr'

// Extracts the next page URL from Github API response.
function getNextPageUrl(response: Response) {
  const link = response.headers.get('link')
  if (!link) {
    return null
  }

  const nextLink = link
    .split(',')
    .find((s: string) => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return null
  }

  return nextLink.split(';')[0].slice(1, -1)
}

const API_ROOT = 'https://api.github.com/'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
async function callApi(endpoint: string, schema: Schema) {
  const fullUrl =
    endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint

  return (
    fetch(fullUrl)
      .then(response =>
        response.json().then(json => Promise.resolve({ json, response }))
      )
      // @ts-ignore
      .then(({ json, response }: any) => {
        if (!response.ok) {
          return Promise.reject(json)
        }

        const camelizedJson = camelizeKeys(json)
        const nextPageUrl = getNextPageUrl(response)

        return Object.assign({}, normalize(camelizedJson, schema), {
          nextPageUrl,
        })
      })
      .then(
        (response: Response) => ({ response }),
        (error: Error) => ({ error: error.message || 'Something bad happened' })
      )
  )
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/gaearon/normalizr

// Schemas for Github API responses.
// @ts-ignore
const userSchema = new schema.Entity('users', {
  idAttribute: 'login',
})

//@ts-ignore
const repoSchema = new schema.Entity('repos', {
  idAttribute: 'fullName',
})

repoSchema.define({
  owner: userSchema,
})

const userSchemaArray = new schema.Array(userSchema)
const repoSchemaArray = new schema.Array(repoSchema)

// api services
export const fetchUser = (login: string) =>
  callApi(`users/${login}`, userSchema)
export const fetchRepo = (fullName: string) =>
  callApi(`repos/${fullName}`, repoSchema)
export const fetchStarred = (url: string) => callApi(url, repoSchemaArray)
export const fetchStargazers = (url: string) => callApi(url, userSchemaArray)
