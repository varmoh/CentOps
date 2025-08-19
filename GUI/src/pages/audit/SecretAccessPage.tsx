import { Card, DataTable, Label, Track } from 'components';
import { useMemo, useState } from 'react';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransTableHead } from 'i18n/trans/table';
import { TransTitle } from 'i18n/trans/title';
import { Trans } from 'react-i18next';
import { type AuditSecretsAccess, methodMap } from 'types/audit';
import { formatDate } from 'utils/date';
import { withAuthorization } from 'hoc/withAuthorization';
import type { Method } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { usePagination } from 'hooks/usePagination';
import { initialPaginationData, type Pagination } from 'types/pagination';

export const SecretAccessPage = withAuthorization(() => {
  const [pagination, setPagination] = usePagination();

  const { data: logs } = useQuery<Pagination<AuditSecretsAccess>>({
    meta: { pagination },
    queryKey: ['admin/logs/secrets', ...Object.values(pagination)],
    initialData: initialPaginationData<AuditSecretsAccess>(),
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<AuditSecretsAccess>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('clientName', {
        id: 'clientName',
        header: () => <TransTableHead i18nKey="client" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('secretName', {
        id: 'secretName',
        header: () => <TransTableHead i18nKey="secret" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('action', {
        id: 'method',
        header: () => <TransTableHead i18nKey="operation" />,
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
      columnHelper.accessor('id', {
        id: 'fullName',
        header: () => <TransTableHead i18nKey="usersName" />,
        cell: ({
          row: {
            original: { firstName, lastName },
          },
        }) => [firstName, lastName].filter(Boolean).join(' '),
      }),
      columnHelper.accessor('ipAddress', {
        id: 'ipAddress',
        header: () => <TransTableHead i18nKey="ipAddress" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        id: 'timestamp',
        header: () => <TransTableHead i18nKey="dateTime" />,
        cell: (message) => formatDate(message.getValue()),
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
          <Trans i18nKey="title.auditSecretsAccess" defaults="Secret access" />
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
