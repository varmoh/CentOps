import {
  Button,
  Card,
  ConfirmDeleteButton,
  DataTable,
  Icon,
  Track,
} from 'components';
import { useCallback, useMemo, useState } from 'react';
import type { ApiCluster } from 'types/cluster';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransButton } from 'i18n/trans/button';
import { TransNav } from 'i18n/trans/nav';
import { TransTableHead } from 'i18n/trans/table';
import { ROUTES } from 'resources/routes-constants';
import { Link } from 'components/Router/Link';
import { useQuery } from '@tanstack/react-query';
import { withAuthorization } from 'hoc/withAuthorization';
import api from 'services/api';
import { usePagination } from 'hooks/usePagination';
import { initialPaginationData, type Pagination } from 'types/pagination';
import { formatDate } from 'utils/date';

export const ClusterListPage = withAuthorization(() => {
  const [pagination, setPagination] = usePagination();

  const { data: clusters, refetch } = useQuery<Pagination<ApiCluster>>({
    meta: { pagination },
    queryKey: ['admin/clusters', ...Object.values(pagination)],
    initialData: initialPaginationData<ApiCluster>(),
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const handleDelete = useCallback(async ({ clusterId }: ApiCluster) => {
    await api.delete(`/admin/clusters?clusterId=${clusterId}`);
    refetch();
  }, []);

  const columnHelper = createColumnHelper<ApiCluster>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: () => <TransTableHead i18nKey="clusterName" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('updatedAt', {
        id: 'updatedAt',
        header: () => <TransTableHead i18nKey="updatedAt" />,
        cell: (message) => formatDate(message.getValue()),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { size: 1 },
        cell: (props) => (
          <Track gap={8}>
            <Button
              appearance="text"
              component={Link}
              to={ROUTES.CLUSTER_DETAILS_ROUTE}
              params={{ clusterId: props.row.original.clusterId }}
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
    []
  );

  return (
    <>
      <Track justify="between">
        <Track direction="vertical" align="left">
          <h6>
            <TransNav i18nKey="settings" />
          </h6>
          <h1>
            <TransNav i18nKey="clusters" />
          </h1>
        </Track>
        <Link
          to={ROUTES.CLUSTER_DETAILS_ROUTE}
          params={{ clusterId: 'create' }}
        >
          <Button appearance="primary">
            <TransButton i18nKey="addCluster" />
          </Button>
        </Link>
      </Track>

      <Card>
        <Card disablePadding>
          <DataTable
            data={clusters.items}
            columns={columns}
            pagination={pagination}
            pagesCount={clusters.totalPages}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </Card>
    </>
  );
});
