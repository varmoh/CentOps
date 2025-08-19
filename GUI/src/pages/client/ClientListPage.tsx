import {
  Button,
  Card,
  ConfirmDeleteButton,
  DataTable,
  Icon,
  Track,
} from 'components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ApiClient } from 'types/client';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransButton } from 'i18n/trans/button';
import { TransNav } from 'i18n/trans/nav';
import { TransTableHead } from 'i18n/trans/table';
import { ROUTES } from 'resources/routes-constants';
import { Link } from 'components/Router/Link';
import { withAuthorization } from 'hoc/withAuthorization';
import { useQuery } from '@tanstack/react-query';
import api from 'services/api';
import { initialPaginationData, type Pagination } from 'types/pagination';
import { usePagination } from 'hooks/usePagination';
import { formatDate } from 'utils/date';
import type { ApiCluster } from 'types/cluster';

export const ClientListPage = withAuthorization(() => {
  const [pagination, setPagination] = usePagination();

  const { data: clients, refetch } = useQuery<Pagination<ApiClient>>({
    meta: { pagination },
    queryKey: [`/admin/clients`, ...Object.values(pagination)],
    initialData: initialPaginationData<ApiClient>(),
  });
  const [clustersPagination] = usePagination({
    pageIndex: 0,
    pageSize: 1000,
  });
  const {
    data: { items: clusters },
  } = useQuery<Pagination<ApiCluster>>({
    meta: { pagination: clustersPagination },
    queryKey: ['admin/clusters', ...Object.values(pagination)],
    initialData: initialPaginationData<ApiCluster>(),
  });
  const [clustersMap, setClustersMap] =
    useState<Map<string, { name: string; ipAddress: string }>>();
  useEffect(() => {
    setClustersMap(
      new Map(
        clusters.map(({ clusterId, name, ipAddress }) => [
          clusterId,
          { name, ipAddress },
        ])
      )
    );
  }, [clusters]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const handleDelete = useCallback(async ({ clientId }: ApiClient) => {
    await api.delete(`/admin/clients?clientId=${clientId}`);
    refetch();
  }, []);
  const columnHelper = createColumnHelper<ApiClient>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: () => <TransTableHead i18nKey="client" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('kubernetesClusterNamespace', {
        id: 'nameSpace',
        header: () => <TransTableHead i18nKey="nameSpace" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('kubernetesClusterId', {
        id: 'clusterAddress',
        header: () => <TransTableHead i18nKey="cluster" />,
        cell: (message) => {
          const value = message.getValue();
          const cluster = clustersMap?.get(value);
          return (cluster && `${cluster.name} (${cluster.ipAddress})`) ?? value;
        },
      }),
      columnHelper.accessor('updatedAt', {
        id: 'updatedAt',
        header: () => <TransTableHead i18nKey="updatedAt" />,
        cell: (message) => formatDate(message.getValue()),
      }),
      columnHelper.accessor('clientId', {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { size: 1 },
        cell: (props) => (
          <Track gap={8}>
            <Button
              appearance="text"
              component={Link}
              to={ROUTES.CLIENT_DETAILS_ROUTE}
              params={{ clientId: props.row.original.clientId }}
            >
              <Icon name="edit" />
              <TransButton i18nKey="edit" />
            </Button>
            <ConfirmDeleteButton
              appearance="text"
              entity={props.row.original}
              entityName="name"
              onConfirm={handleDelete}
            >
              <Icon name="delete" />
              <TransButton i18nKey="delete" />
            </ConfirmDeleteButton>
          </Track>
        ),
      }),
    ],
    [clustersMap]
  );

  return (
    <>
      <Track justify="between">
        <h1>
          <TransNav i18nKey="clients" />
        </h1>
        <Link to={ROUTES.CLIENT_DETAILS_ROUTE} params={{ clientId: 'create' }}>
          <Button appearance="primary">
            <TransButton i18nKey="addClient" />
          </Button>
        </Link>
      </Track>

      <Card>
        <Card disablePadding>
          <DataTable
            data={clients.items}
            columns={columns}
            pagination={pagination}
            pagesCount={clients.totalPages}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </Card>
    </>
  );
});
