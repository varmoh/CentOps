import {
  Button,
  Card,
  ConfirmDeleteButton,
  DataTable,
  Icon,
  Track,
} from 'components';
import { type MouseEventHandler, useCallback, useMemo, useState } from 'react';
import type { ApiClient, ApiClientManifest } from 'types/client';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransButton } from 'i18n/trans/button';
import { Trans } from 'react-i18next';
import { TransTableHead } from 'i18n/trans/table';
import { Link } from 'components/Router/Link';
import { ROUTES } from 'resources/routes-constants';
import { TransTitle } from 'i18n/trans/title';
import { formatDate } from 'utils/date';
import { withAuthorization } from 'hoc/withAuthorization';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from 'services/api';
import { usePagination } from 'hooks/usePagination';
import { initialPaginationData, type Pagination } from 'types/pagination';

export const ClientManifestListPage = withAuthorization(() => {
  const [pagination, setPagination] = usePagination();

  const { clientId } = useParams<{ clientId: string }>();
  const { data: client } = useQuery<ApiClient>({
    queryKey: [`admin/client-by-id?clientId=${clientId}`],
  });
  const { data: manifests, refetch } = useQuery<Pagination<ApiClientManifest>>({
    meta: { pagination },
    queryKey: [
      `admin/clients/manifests/all?clientId=${clientId}`,
      ...Object.values(pagination),
    ],
    initialData: initialPaginationData<ApiClientManifest>(),
  });
  const handleDelete = useCallback(
    async ({ manifestId }: ApiClientManifest) => {
      await api.delete(
        `/admin/clients/manifests?clientId=${clientId}&manifestId=${manifestId}`
      );
      refetch();
    },
    [clientId]
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const handleDuplicate = useCallback<MouseEventHandler<HTMLButtonElement>>(
    async (e) => {
      await api.post(
        `admin/clients/manifests/duplicate?clientId=${clientId}&manifestId=${e.currentTarget.dataset.id}`,
        null
      );
      await refetch();
    },
    []
  );
  const columnHelper = createColumnHelper<ApiClientManifest>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: () => <TransTableHead i18nKey="name" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('gitHelmBranch', {
        id: 'gitHelmBranch',
        header: () => <TransTableHead i18nKey="helmVersion" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('updatedAt', {
        id: 'updatedAt',
        header: () => <TransTableHead i18nKey="updatedAt" />,
        cell: (message) => formatDate(message.getValue()),
      }),
      columnHelper.accessor('deployedAt', {
        id: 'deployedAt',
        header: () => <TransTableHead i18nKey="deployedAt" />,
        cell: (message) => formatDate(message.getValue()),
      }),
      columnHelper.accessor('manifestId', {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { size: 1 },
        cell: (props) => (
          <Track gap={8}>
            <Button
              appearance="text"
              data-id={props.getValue()}
              onClick={handleDuplicate}
            >
              <Icon name="copy" />
              <TransButton i18nKey="duplicate" />
            </Button>
            <Button
              component={Link}
              to={ROUTES.CLIENT_MANIFESTS_DETAILS_ROUTE}
              params={{ manifestId: props.row.original.manifestId }}
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
            <Trans i18nKey="title.clientManifests" defaults="Manifests" />
          </h1>
        </Track>
        <Link
          to={ROUTES.CLIENT_MANIFESTS_DETAILS_ROUTE}
          params={{ manifestId: 'create' }}
        >
          <Button appearance="primary">
            <TransButton i18nKey="addManifest" />
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
            data={manifests.items}
            columns={columns}
            pagination={pagination}
            pagesCount={manifests.totalPages}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </Card>
    </>
  );
});
