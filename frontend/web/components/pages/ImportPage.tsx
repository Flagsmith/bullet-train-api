import React, { FC, useEffect, useState } from 'react'
import _data from 'common/data/base/_data'
import {
  useCreateLaunchDarklyProjectImportMutation,
  useGetLaunchDarklyProjectImportQuery,
} from 'common/services/useLaunchDarklyProjectImport'
import AppLoader from 'components/AppLoader'
import InfoMessage from 'components/InfoMessage'
import Input from 'components/base/forms/Input'
import Utils from 'common/utils/utils'
import Button from 'components/base/forms/Button'
import PanelSearch from 'components/PanelSearch'

type ImportPageType = {
  projectId: string
  projectName: string
}

const ImportPage: FC<ImportPageType> = ({ projectId, projectName }) => {
  const [LDKey, setLDKey] = useState<string>('')
  const [importId, setImportId] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAppLoading, setAppIsLoading] = useState<boolean>(false)
  const [projects, setProjects] = useState<{ key: string; name: string }[]>([])
  const [createLaunchDarklyProjectImport, { data, isSuccess }] =
    useCreateLaunchDarklyProjectImportMutation()

  const {
    data: status,
    isSuccess: statusLoaded,
    refetch,
  } = useGetLaunchDarklyProjectImportQuery(
    {
      import_id: `${importId}`,
      project_id: projectId,
    },
    { skip: !importId },
  )

  useEffect(() => {
    const checkImportStatus = async () => {
      setAppIsLoading(true)
      const intervalId = setInterval(async () => {
        await refetch()

        if (statusLoaded && status && status.status.result === 'success') {
          clearInterval(intervalId)
          setAppIsLoading(false)
          window.location.reload()
        }
      }, 1000)
    }

    if (statusLoaded) {
      checkImportStatus()
    }
  }, [statusLoaded, status, refetch])

  useEffect(() => {
    if (isSuccess && data?.id) {
      setImportId(data.id)
      refetch()
    }
  }, [isSuccess, data, refetch])

  const getProjectList = (LDKey: string) => {
    setIsLoading(true)
    _data
      .get(`https://app.launchdarkly.com/api/v2/projects`, '', {
        'Authorization': LDKey,
      })
      .then((res: { items: { key: string; name: string }[] }) => {
        setIsLoading(false)
        setProjects(res.items)
      })
  }

  const createImportLDProjects = (
    LDKey: string,
    key: string,
    projectId: string,
  ) => {
    createLaunchDarklyProjectImport({
      body: { project_key: key, token: LDKey },
      project_id: projectId,
    })
  }

  return (
    <>
      {isAppLoading && (
        <div className='overlay'>
          <div className='title'>Importing Project</div>
          <AppLoader />
        </div>
      )}
      <div className='mt-4'>
        <InfoMessage>
          Import operations will overwrite existing environments and flags in
          your project.
        </InfoMessage>
        <h5>Import LaunchDarkly Projects</h5>
        <label>Set LaunchDarkly key</label>
        <FormGroup>
          <Row className='align-items-start col-md-8'>
            <Flex className='ml-0'>
              <Input
                value={LDKey}
                name='ldkey'
                onChange={(e: InputEvent) =>
                  setLDKey(Utils.safeParseEventValue(e))
                }
                type='text'
                placeholder='My LaunchDarkly key'
              />
            </Flex>
            <Button
              id='save-proj-btn'
              disabled={!LDKey}
              className='ml-3'
              onClick={() => getProjectList(LDKey)}
            >
              {'Next'}
            </Button>
          </Row>
        </FormGroup>
        {isLoading ? (
          <div className='text-center'>
            <Loader />
          </div>
        ) : (
          projects.length > 0 && (
            <div>
              <FormGroup>
                <PanelSearch
                  id='projects-list'
                  className='no-pad panel-projects'
                  listClassName='row mt-n2 gy-4'
                  title='LaunchDarkly Projects'
                  items={projects}
                  renderRow={(
                    { key, name }: { key: string; name: string },
                    i: number,
                  ) => {
                    return (
                      <>
                        <Button
                          className='btn-project'
                          onClick={() =>
                            openConfirm(
                              'Import LaunchDarkly project',
                              <span>
                                Flagsmith will import {<strong>{name}</strong>}{' '}
                                to {<strong>{projectName}</strong>}. Are you
                                sure?
                              </span>,
                              () => {
                                createImportLDProjects(LDKey, key, projectId)
                              },
                              () => {
                                return
                              },
                            )
                          }
                        >
                          <Row className='flex-nowrap'>
                            <h2
                              style={{
                                backgroundColor: Utils.getProjectColour(i),
                              }}
                              className='btn-project-letter mb-0'
                            >
                              {name[0]}
                            </h2>
                            <div className='font-weight-medium btn-project-title'>
                              {name}
                            </div>
                          </Row>
                        </Button>
                      </>
                    )
                  }}
                  renderNoResults={
                    <div>
                      <Row>
                        <div className='font-weight-medium'>No Projects</div>
                      </Row>
                    </div>
                  }
                />
              </FormGroup>
            </div>
          )
        )}
      </div>
    </>
  )
}
export default ImportPage
