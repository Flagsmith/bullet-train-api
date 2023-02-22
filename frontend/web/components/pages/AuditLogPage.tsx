import React, { Component, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { FC } from 'react'; // we need this to make JSX compile

import ConfigProvider from 'common/providers/ConfigProvider';
const PanelSearch = require('../../components/PanelSearch');
const ProjectProvider = require('common/providers/ProjectProvider');
import ToggleChip from '../ToggleChip';
import Utils from 'common/utils/utils';
import { AuditLogItem, Project } from 'common/types/responses';
import { RouterChildContext } from 'react-router';
import { useGetAuditLogsQuery } from 'common/services/useAuditLog';
import useSearchThrottle from 'common/useSearchThrottle';
import AuditLog from "../AuditLog";

type AuditLogType = {
    router: RouterChildContext['router']
    match: {
        params: {
            environmentId: string
            projectId: string
        }
    }
}

const AuditLogPage: FC<AuditLogType> = (props) => {
    const projectId = props.match.params.projectId;
    const [page, setPage] = useState(1);
    const { searchInput, search, setSearchInput } = useSearchThrottle(Utils.fromParam().search, () => {
        setPage(1);
    });

    const hasHadResults = useRef(false);
    const [environment, setEnvironment] = useState(Utils.fromParam().env);


    useEffect(() => {
        props.router.history.replace(`${document.location.pathname}?${Utils.toParam({
            env: environment,
            search,
        })}`);
    }, [search, environment]);

    const renderRow = ({ created_date, log, author }: AuditLogItem) => {
        return (
            <Row space className='list-item audit__item' key={created_date}>
                <Flex>
                    <div
                        className='audit__log'
                    >
                        {log}
                    </div>
                    {!!author && (
                        <div
                            className='audit__author'
                        >
                            {`${author.first_name} ${author.last_name}`}
                        </div>
                    )}

                </Flex>
                <div className='audit__date'>{moment(created_date).format('Do MMM YYYY HH:mma')}</div>
            </Row>
        );
    };

    const { env: envFilter } = Utils.fromParam();

    const hasRbacPermission = Utils.getPlansPermission('AUDIT') || !Utils.getFlagsmithHasFeature('scaleup_audit');
    if (!hasRbacPermission) {
        return (
            <div>
                <div className='text-center'>
                    To access this feature please upgrade your account to scaleup or higher.
                </div>
            </div>
        );
    }
    return (
        <div className='app-container container'>
            <div>
                <div>
                    <h3>Audit Log</h3>
                    <p>
                        View all activity that occured generically across the project and specific to this environment.
                    </p>
                    <FormGroup>
                        <div>
                            <div className='audit'>
                                <div className='font-weight-bold mb-2'>
                                    Filter by environments:
                                </div>
                                <ProjectProvider>
                                    {({ project }: { project: Project }) => (
                                        <Row>
                                            {project && project.environments && project.environments.map(env => (
                                                <ToggleChip active={envFilter === `${env.id}`}
                                                            onClick={() => setEnvironment(env.id)}
                                                            className='mr-2 mb-4'>
                                                    {env.name}
                                                </ToggleChip>
                                            ))}
                                        </Row>
                                    )}
                                </ProjectProvider>
                                <FormGroup>
                                    <AuditLog pageSize={10} environmentId={environment} projectId={projectId}/>
                                </FormGroup>
                            </div>
                        </div>
                    </FormGroup>
                </div>
            </div>
        </div>
    );
};


export default ConfigProvider(AuditLogPage);
