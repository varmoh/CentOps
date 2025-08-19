import {
  Button,
  Card,
  ConfirmDeleteButton,
  DataTable,
  Icon,
  Track,
} from 'components';
import { useCallback, useMemo, useState } from 'react';
import type { ApiClient, ApiClientSecret } from 'types/client';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransButton } from 'i18n/trans/button';
import { Trans } from 'react-i18next';
import { TransTableHead } from 'i18n/trans/table';
import { Link } from 'components/Router/Link';
import { ROUTES } from 'resources/routes-constants';
import { TransTitle } from 'i18n/trans/title';
import { withAuthorization } from 'hoc/withAuthorization';
import { useQuery } from '@tanstack/react-query';
import api from 'services/api';
import { useParams } from 'react-router-dom';
import { usePagination } from 'hooks/usePagination';
import { initialPaginationData, type Pagination } from 'types/pagination';
import { formatDate } from 'utils/date';

export const ClientSecretListPage = withAuthorization(() => {
  const [pagination, setPagination] = usePagination();

  const { clientId } = useParams<{ clientId: string }>();
  const { data: client } = useQuery<ApiClient>({
    queryKey: [`admin/client-by-id?clientId=${clientId}`],
  });
  const { data: secrets, refetch } = useQuery<Pagination<ApiClientSecret>>({
    meta: { pagination },
    queryKey: [
      `admin/clients/secrets/all?clientId=${clientId}`,
      ...Object.values(pagination),
    ],
    initialData: initialPaginationData<ApiClientSecret>(),
  });
  const handleDelete = useCallback(
    async ({ id: secretId }: ApiClientSecret) => {
      await api.delete(
        `/admin/clients/secrets/delete?clientId=${clientId}&id=${secretId}`
      );
      refetch();
    },
    [clientId]
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<ApiClientSecret>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: () => <TransTableHead i18nKey="name" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('environment', {
        id: 'environment',
        header: () => <TransTableHead i18nKey="environment" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('updatedAt', {
        id: 'updatedAt',
        header: () => <TransTableHead i18nKey="updatedAt" />,
        cell: (message) => formatDate(message.getValue()),
      }),
      columnHelper.accessor('id', {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { size: 1 },
        cell: (props) => (
          <Track gap={8}>
            <Button
              component={Link}
              to={ROUTES.CLIENT_SECRETS_DETAILS_ROUTE}
              params={{ secretId: props.row.original.id }}
              appearance="text"
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
            <TransTitle i18nKey="client" values={{ client: client?.name }} />
          </h6>
          <h1>
            <Trans i18nKey="title.clientSecrets" defaults="Secrets" />
          </h1>
        </Track>
        <Link
          to={ROUTES.CLIENT_SECRETS_DETAILS_ROUTE}
          params={{ secretId: 'create' }}
        >
          <Button appearance="primary">
            <TransButton i18nKey="addSecret" />
          </Button>
        </Link>
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
        <Card disablePadding>
          <DataTable
            data={secrets.items}
            columns={columns}
            pagination={pagination}
            pagesCount={secrets.totalPages}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </Card>
    </>
  );
});
