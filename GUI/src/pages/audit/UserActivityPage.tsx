import { Card, DataTable, Label, Track } from 'components';
import { useMemo, useState } from 'react';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransTableHead } from 'i18n/trans/table';
import { TransTitle } from 'i18n/trans/title';
import { Trans } from 'react-i18next';
import { type AuditUserActivity, methodMap } from 'types/audit';
import type { Method } from 'axios';
import { formatDate } from 'utils/date';
import { withAuthorization } from 'hoc/withAuthorization';
import { useQuery } from '@tanstack/react-query';
import { usePagination } from 'hooks/usePagination';
import { initialPaginationData, type Pagination } from 'types/pagination';

export const UserActivityPage = withAuthorization(() => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      desc: true,
      id: 'createdAt',
    },
  ]);
  const [sortBy] = sorting;
  const [pagination, setPagination] = usePagination({
    ...(sortBy.desc && {
      order: 'desc',
    }),
    sort: sortBy.id,
  });

  const { data: logs } = useQuery<Pagination<AuditUserActivity>>({
    meta: {
      pagination,
    },
    queryKey: ['admin/logs/user', ...Object.values(pagination)],
    initialData: initialPaginationData<AuditUserActivity>(),
  });

  const columnHelper = createColumnHelper<AuditUserActivity>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('logId', {
        id: 'fullName',
        header: () => <TransTableHead i18nKey="usersName" />,
        cell: ({
          row: {
            original: { firstName, lastName },
          },
        }) => [firstName, lastName].filter(Boolean).join(' '),
      }),
      columnHelper.accessor('method', {
        id: 'method',
        header: () => <TransTableHead i18nKey="method" />,
        cell: (message) => {
          const value = message.getValue<Method>().toLowerCase() as Method;
          const type = methodMap.get(value);

          if (!type) return null;

          return (
            <Label type={type} inline>
              {value.toUpperCase()}
            </Label>
          );
        },
      }),
      columnHelper.accessor('path', {
        id: 'path',
        header: () => <TransTableHead i18nKey="path" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('ipAddress', {
        id: 'ipAddress',
        header: () => <TransTableHead i18nKey="ipAddress" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: () => <TransTableHead i18nKey="dateTime" />,
        cell: (message) => formatDate(message.getValue()),
        meta: { size: 1 },
      }),
    ],
    []
  );

  return (
    <>
      <Track direction="vertical" align="left">
        <h6>
          <TransTitle i18nKey="audit" />
        </h6>
        <h1>
          <Trans i18nKey="title.auditUserActivity" defaults="User activity" />
        </h1>
      </Track>

      <Card>
        <Card disablePadding>
          <DataTable
            data={logs.items}
            columns={columns}
            pagination={pagination}
            pagesCount={logs.totalPages}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </Card>
    </>
  );
});
