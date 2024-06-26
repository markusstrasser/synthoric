import Exa from 'exa-js'

import * as dotenv from 'dotenv'
dotenv.config()

const ex = new Exa(process.env.EXA_SEARCH_API_KEY)

//? only returns the first paragraph or so of the content
ex.searchAndContents('interactive physics explorations', {
  type: 'neural',
  useAutoprompt: true,
  numResults: 10,
  text: true,
}).then((res) => {
  console.log(res, 'response')
})
