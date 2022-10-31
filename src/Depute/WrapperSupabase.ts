import { PostgrestResponse } from '@supabase/supabase-js'

import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type Depute = Database['public']['Tables']['Depute']['Row']

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

type PromiseFunction<T> = () => Promise<T>

function retryOperation<T>(
  operation: PromiseFunction<T>,
  delay: number,
  retries: number
) {
  return new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason) => {
        console.error(`${operation.name} failed: ${reason.message}`)
        if (retries > 0) {
          console.log(`Retrying ${operation.name}... ${retries} retry left...`)
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject)
        }
        return reject(reason)
      })
  })
}

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetDeputesFromSupabaseWithRetries() {
  return await retryOperation(GetDeputesFromSupabase, 1000, 3)
}

export async function GetDeputesFromSupabase() {
  return await supabaseClient.from('Depute').select().then(handleSupabaseError)
}

export async function CreateDeputeToSupabase(data: Depute) {
  return await supabaseClient
    .from('Depute')
    .insert([data])
    .select()
    .then(handleSupabaseError)
}

export async function UpdateDeputeToSupabase(data: Depute) {
  return await supabaseClient
    .from('Depute')
    .update(data)
    .match({ Slug: data.Slug })
    .select()
    .then(handleSupabaseError)
}

export async function DeleteDeputeToSupabase(data: Depute) {
  return await supabaseClient
    .from('Depute')
    .delete()
    .match({ Slug: data.Slug })
    .select()
    .then(handleSupabaseError)
}
