import Exa from 'exa-js'

import * as dotenv from 'dotenv'
dotenv.config()

const ex = new Exa(process.env.EXA_SEARCH_API_KEY)

export default async (
  query: string,
  config = {
    type: 'neural',
    useAutoprompt: true,
    // numResults: 10,
  }
) => {
  //? only returns the first paragraph or so of the content
  const res = await ex.searchAndContents(query, config).then(res => {
    console.log(res, 'response')
  })
  return res
}
