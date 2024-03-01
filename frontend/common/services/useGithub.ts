import { Res } from 'common/types/responses'
import { Req } from 'common/types/requests'
import { service } from 'common/service'

export const githubService = service
  .enhanceEndpoints({ addTagTypes: ['Github'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getGithubIssues: builder.query<Res['github'], Req['getGithubIssues']>({
        providesTags: (res) => [{ id: res?.id, type: 'Github' }],
        query: (query: Req['getGithubIssues']) => ({
          url: `organisations/${query.org_id}/github/issues/`,
        }),
      }),
      getGithubPulls: builder.query<Res['github'], Req['getGithubPulls']>({
        providesTags: (res) => [{ id: res?.id, type: 'Github' }],
        query: (query: Req['getGithubPulls']) => ({
          url: `organisations/${query.org_id}/github/pulls/`,
        }),
      }),
      getGithubRepos: builder.query<Res['github'], Req['getGithubRepos']>({
        providesTags: (res) => [{ id: res?.id, type: 'Github' }],
        query: (query: Req['getGithubRepos']) => ({
          url: `organisations/github/repositories/?${Utils.toParam({
            installation_id: query.installation_id,
          })}`,
        }),
      }),
      // END OF ENDPOINTS
    }),
  })

export async function getGithubIssues(
  store: any,
  data: Req['getGithubIssues'],
  options?: Parameters<typeof githubService.endpoints.getGithub.initiate>[1],
) {
  return store.dispatch(
    githubService.endpoints.getGithubIssues.initiate(data, options),
  )
}
export async function getGithubPulls(
  store: any,
  data: Req['getGithubPulls'],
  options?: Parameters<typeof githubService.endpoints.getGithub.initiate>[1],
) {
  return store.dispatch(
    githubService.endpoints.getGithubPulls.initiate(data, options),
  )
}
export async function getGithubRepos(
  store: any,
  data: Req['getGithubRepos'],
  options?: Parameters<typeof githubService.endpoints.getGithub.initiate>[1],
) {
  return store.dispatch(
    githubService.endpoints.getGithubRepos.initiate(data, options),
  )
}
// END OF FUNCTION_EXPORTS

export const {
  useGetGithubIssuesQuery,
  useGetGithubPullsQuery,
  useGetGithubReposQuery,
  // END OF EXPORTS
} = githubService

/* Usage examples:
const { data, isLoading } = useGetGithubIssuesQuery({ id: 2 }, {}) //get hook
const [createGithub, { isLoading, data, isSuccess }] = useCreateGithubMutation() //create hook
githubService.endpoints.getGithub.select({id: 2})(store.getState()) //access data from any function
*/
