import { FC, useEffect, useState } from 'react'
import { useGetGithubReposQuery } from 'common/services/useGithub'
import { useGetGithubRepositoriesQuery } from 'common/services/useGithubRepository'
import Button from './base/forms/Button'
import GitHubRepositoriesSelect from './GitHubRepositoriesSelect'
import GithubRepositoriesTable from './GithubRepositoriesTable'
import DeleteGithubIntegration from './DeleteGithubIntegration'
import { Repository } from 'common/types/responses'

type MyGitHubRepositoriesComponentType = {
  installationId: string
  organisationId: string
  projectId: string
  githubId: string
}

const MyGitHubRepositoriesComponent: FC<MyGitHubRepositoriesComponentType> = ({
  githubId,
  installationId,
  organisationId,
  projectId,
}) => {
  const [reposSelect, setReposSelect] = useState<Repository[]>([])
  const { data: reposFromGithub, isLoading: fetchingReposGH } =
    useGetGithubReposQuery({
      installation_id: installationId,
      organisation_id: organisationId,
    })

  const { data: GithubReposFromFlagsmith, isLoading: fetchingReposFlagsmith } =
    useGetGithubRepositoriesQuery({
      github_id: githubId,
      organisation_id: organisationId,
    })

  useEffect(() => {
    if (reposFromGithub && GithubReposFromFlagsmith) {
      setReposSelect(
        reposFromGithub.repositories.filter((repo) => {
          const same = GithubReposFromFlagsmith.results.some(
            (res) => repo.name === res.repository_name,
          )
          return !same
        }),
      )
    }
  }, [reposFromGithub, GithubReposFromFlagsmith])

  return (
    <>
      {fetchingReposGH || fetchingReposFlagsmith ? (
        <div className='text-center'>
          <Loader />
        </div>
      ) : (
        <>
          <GitHubRepositoriesSelect
            githubId={githubId}
            organisationId={organisationId}
            projectId={projectId}
            repositories={reposSelect}
          />
          <GithubRepositoriesTable
            repos={GithubReposFromFlagsmith?.results}
            githubId={githubId}
            organisationId={organisationId}
          />
          <div className='text-right mt-2'>
            <Button
              className='mr-3'
              id='open-github-win-installations-btn'
              data-test='open-github-win-installations-btn'
              // onClick={this.openGitHubWinInstallations}
              size='small'
            >
              Manage available GitHub Repositories
            </Button>
            <DeleteGithubIntegration
              githubId={githubId}
              organisationId={organisationId}
              onConfirm={() => {
                closeModal()
              }}
            />
          </div>
        </>
      )}
    </>
  )
}

export default MyGitHubRepositoriesComponent
