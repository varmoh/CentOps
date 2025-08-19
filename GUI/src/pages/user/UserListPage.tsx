import {
  Button,
  Card,
  ConfirmDeleteButton,
  DataTable,
  Icon,
  Track,
} from 'components';
import { useCallback, useMemo, useState } from 'react';
import type { ApiUser } from 'types/user';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransButton } from 'i18n/trans/button';
import { TransNav } from 'i18n/trans/nav';
import { TransTableHead } from 'i18n/trans/table';
import { ROUTES } from 'resources/routes-constants';
import { Link } from 'components/Router/Link';
import { withAuthorization } from 'hoc/withAuthorization';
import { useQuery } from '@tanstack/react-query';
import api from 'services/api';
import { userName } from 'utils/user';
import { usePagination } from 'hooks/usePagination';
import { initialPaginationData, type Pagination } from 'types/pagination';
import { formatDate } from 'utils/date';

export const UserListPage = withAuthorization(() => {
  const [pagination, setPagination] = usePagination();

  const { data: users, refetch } = useQuery<Pagination<ApiUser>>({
    meta: { pagination },
    queryKey: ['/admin/users', ...Object.values(pagination)],
    initialData: initialPaginationData<ApiUser>(),
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const handleDelete = useCallback(async ({ userId }: ApiUser) => {
    await api.delete(`/admin/users?userId=${userId}`);
    refetch();
  }, []);
  const columnHelper = createColumnHelper<ApiUser>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('userId', {
        id: 'userName',
        header: () => <TransTableHead i18nKey="usersName" />,
        cell: (props) => userName(props.row.original),
      }),
      columnHelper.accessor('idCode', {
        id: 'idCode',
        header: () => <TransTableHead i18nKey="identificationNo" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('updatedAt', {
        id: 'updatedAt',
        header: () => <TransTableHead i18nKey="updatedAt" />,
        cell: (message) => formatDate(message.getValue()),
      }),
      columnHelper.accessor('userId', {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { size: 1 },
        cell: (props) => (
          <Track gap={8}>
            <Button
              appearance="text"
              component={Link}
              to={ROUTES.USER_DETAILS_ROUTE}
              params={{ userId: props.row.original.userId }}
            >
              <Icon name="edit" />
              <TransButton i18nKey="edit" />
            </Button>
            <ConfirmDeleteButton
              appearance="text"
              entity={props.row.original}
              entityName="firstName"
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
            <TransNav i18nKey="users" />
          </h1>
        </Track>
        <Link to={ROUTES.USER_DETAILS_ROUTE} params={{ userId: 'create' }}>
          <Button appearance="primary">
            <TransButton i18nKey="addUser" />
          </Button>
        </Link>
      </Track>

      <Card>
        <Card disablePadding>
          <DataTable
            data={users.items}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
            pagesCount={users.totalPages}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </Card>
    </>
  );
});
