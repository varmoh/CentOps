import {
  Button,
  Card,
  ConfirmDeleteButton,
  DataTable,
  Icon,
  Label,
  Title,
  Track,
} from 'components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type ApiClient,
  type ApiClientDeployment,
  type ApiClientDeploymentStatus,
  type ClientDeploymentStatus,
  ClientDeploymentStatuses,
} from 'types/client';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransButton } from 'i18n/trans/button';
import { Trans } from 'react-i18next';
import { TransTableHead } from 'i18n/trans/table';
import { Link } from 'components/Router/Link';
import { ROUTES } from 'resources/routes-constants';
import { TransTitle } from 'i18n/trans/title';
import { TransLabel } from 'i18n/trans/label';
import { formatDate } from 'utils/date';
import type { LabelProps } from 'components/Label';
import type { IconName } from 'components/Icon';
import { withAuthorization } from 'hoc/withAuthorization';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { usePagination } from 'hooks/usePagination';
import { initialPaginationData, type Pagination } from 'types/pagination';
import api from 'services/api';
import clsx from 'clsx';
import type { TitleType } from 'components/Title';
import { ConfirmButton } from 'components/Modal/ConfirmModal';
import JsonView from '@uiw/react-json-view';
import { TransDialog } from 'i18n/trans/dialog';

const statusMap = new Map<
  ClientDeploymentStatus,
  { icon: IconName; type: LabelProps['type'] }
>([
  [ClientDeploymentStatuses.DEPLOYED, { icon: 'check', type: 'success' }],
  [ClientDeploymentStatuses.DEPLOYING, { icon: 'warning', type: 'warning' }],
  [ClientDeploymentStatuses.FAILED, { icon: 'danger', type: 'error' }],
]);

export const ClientDeploymentList = withAuthorization(() => {
  const [pagination, setPagination] = usePagination();

  const { clientId } = useParams<{ clientId: string }>();
  const { data: client } = useQuery<ApiClient>({
    queryKey: [`admin/client-by-id?clientId=${clientId}`],
  });
  const [status, setStatus] = useState<ApiClientDeploymentStatus>({
    health: {
      status: 'Unknown',
      lastTransitionTime: new Date().toISOString(),
    },
    status: 'Unknown',
    errors: [],
  });
  useEffect(() => {
    if (client)
      api
        .get<ApiClientDeploymentStatus>(
          `admin/clients/deployments/status?appName=${client.argoAppDeploymentName}`
        )
        .then(({ data }) => setStatus(data));
  }, [client]);

  const { data: deployments, refetch } = useQuery<
    Pagination<ApiClientDeployment>
  >({
    meta: { pagination },
    queryKey: [
      `admin/clients/deployments/all?clientId=${clientId}`,
      ...Object.values(pagination),
    ],
    initialData: initialPaginationData<ApiClientDeployment>(),
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const handleDelete = useCallback(async () => {
    if (client)
      await api.delete(
        `/admin/clients/deployments/delete?appName=${client.argoAppDeploymentName}`
      );
    await refetch();
  }, [client]);
  const handleDeleteById = useCallback(
    async ({ deploymentId }: ApiClientDeployment) => {
      await api.delete(
        `/admin/clients/deployments/delete-by-id?deploymentId=${deploymentId}`
      );
      await refetch();
    },
    []
  );

  const columnHelper = createColumnHelper<ApiClientDeployment>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('manifestName', {
        id: 'manifestName',
        header: () => <TransTableHead i18nKey="manifestName" />,
        cell: (message) => (
          <Link
            to={ROUTES.CLIENT_MANIFESTS_DETAILS_ROUTE}
            params={{ manifestId: message.row.original.manifestId }}
          >
            {message.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor('manifestGitHelmBranch', {
        id: 'manifestGitHelmBranch',
        header: () => <TransTableHead i18nKey="manifestVersion" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('deployedBy', {
        id: 'deployedBy',
        header: () => <TransTableHead i18nKey="deployedBy" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        id: 'deployedAt',
        header: () => <TransTableHead i18nKey="deployedAt" />,
        cell: (message) => formatDate(message.getValue()),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: '',
        enableSorting: false,
        meta: { size: 1, align: 'right' },
        cell: (message) => {
          const value = message.getValue<ClientDeploymentStatus>();
          const status = statusMap.get(value);
          if (!status) return null;

          return (
            <Label type={status.type} inline>
              <Icon name={status.icon} size="small" />
              <TransLabel i18nKey={`deployment.${value}`} />
            </Label>
          );
        },
      }),
      columnHelper.accessor('id', {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { size: 1 },
        cell: ({ row: { original } }) => (
          <Track gap={8}>
            <ConfirmDeleteButton
              appearance="text"
              entity={original}
              entityName={({
                manifestName,
                manifestGitHelmBranch,
                createdAt,
              }) =>
                `${manifestName} ${manifestGitHelmBranch} (${formatDate(createdAt)})`
              }
              onConfirm={handleDeleteById}
            >
              <Icon name="delete" />
              <TransButton i18nKey="delete" />
            </ConfirmDeleteButton>
          </Track>
        ),
      }),
    ],
    [client]
  );

  return (
    <>
      <Track justify="between">
        <Track direction="vertical" align="left">
          <h6>
            <TransTitle i18nKey="client" values={{ client: client?.name }} />
          </h6>
          <h1>
            <Trans i18nKey="title.clientDeployments" defaults="Deployments" />
          </h1>
        </Track>
        <Track gap={8}>
          <ConfirmDeleteButton
            appearance="secondary"
            entity={{}}
            onConfirm={handleDelete}
            disabled={!client}
            title={<TransDialog i18nKey="confirmDeleteDeploymentTitle" />}
          >
            <Icon name="delete" />
            <TransButton i18nKey="deleteDeployment" />
          </ConfirmDeleteButton>
          <Link
            to={ROUTES.CLIENT_DEPLOYMENTS_CREATE_ROUTE}
            params={{ clientId }}
          >
            <Button appearance="primary">
              <TransButton i18nKey="newDeployment" />
            </Button>
          </Link>
        </Track>
      </Track>

      <Card
        footer={
          <Link to={ROUTES.CLIENT_DETAILS_ROUTE}>
            <Button appearance="primary" outlined>
              <TransButton i18nKey="backToClient" />
            </Button>
          </Link>
        }
      >
        <Card
          style={{
            margin: -16,
            marginBottom: 16,
            background: '#f6f6f6',
            borderBottom: '1px solid #d2d3d8',
          }}
          bordered={false}
        >
          <Track justify="between" style={{ gap: 4 }}>
            <Card style={{ flexGrow: 1, flexBasis: 0 }} shadow>
              <strong className="h5">
                <Trans
                  i18nKey="client.deployments.status.appHealth"
                  defaults="App health"
                />
              </strong>
              <Title
                className="h1"
                type={
                  clsx('error', {
                    success: status?.health.status === 'Healthy',
                    warning: status?.health.status === 'Unknown',
                  })
                    .split(' ')
                    .pop() as TitleType
                }
              >
                <Icon name="heart" size="medium" />
                {status?.health.status}
              </Title>
            </Card>
            <Card style={{ flexGrow: 1, flexBasis: 0 }} shadow>
              <strong className="h5">
                <Trans
                  i18nKey="client.deployments.status.syncStatus"
                  defaults="Sync status"
                />
                <Title
                  className="h1"
                  type={
                    clsx('error', {
                      success: status?.status === 'Synced',
                      warning: status?.status === 'Unknown',
                    })
                      .split(' ')
                      .pop() as TitleType
                  }
                >
                  <Icon name="heart" size="medium" />
                  {status?.status}
                </Title>
              </strong>
            </Card>
            <Card style={{ flexGrow: 1, flexBasis: 0 }} shadow>
              <strong className="h5">
                <Trans
                  i18nKey="client.deployments.status.appConditions.title"
                  defaults="App conditions"
                />
                {!status?.errors?.length ? (
                  <Title className="h1" type="warning">
                    <Icon name="warning" size="medium" />
                    <Trans
                      i18nKey="client.deployments.status.appConditions.status.unknown"
                      defaults="Unknown"
                    />
                  </Title>
                ) : (
                  <ConfirmButton
                    component={Title}
                    className="h1"
                    type="error"
                    title={
                      <Trans
                        i18nKey="client.deployments.status.appConditions.dialog.title"
                        defaults="Error details"
                      />
                    }
                    confirm={false}
                    cancel={
                      <Button>
                        <TransButton i18nKey="close" />
                      </Button>
                    }
                    button={
                      <>
                        <Icon name="error" size="medium" />
                        <Trans
                          i18nKey="client.deployments.status.appConditions.status.errors"
                          defaults="(1)[{{count}} error];(2-inf)[{{count}} errors];"
                          values={{ count: status?.errors.length }}
                          tOptions={{ postProcess: 'interval' }}
                        />
                      </>
                    }
                  >
                    <JsonView value={status?.errors} displayDataTypes={false} />
                  </ConfirmButton>
                )}
              </strong>
            </Card>
          </Track>
        </Card>
        <Card disablePadding>
          <DataTable
            data={deployments.items}
            columns={columns}
            pagination={pagination}
            pagesCount={deployments.totalPages}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </Card>
    </>
  );
});
