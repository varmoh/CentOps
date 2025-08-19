import {
  Button,
  Card,
  ConfirmDeleteButton,
  DataTable,
  Icon,
  Label,
  Track,
} from 'components';
import { useCallback, useMemo, useState } from 'react';
import type { ApiClient, ApiClientCertificate } from 'types/client';
import { createColumnHelper, type SortingState } from '@tanstack/react-table';
import { TransButton } from 'i18n/trans/button';
import { Trans, useTranslation } from 'react-i18next';
import { TransTableHead } from 'i18n/trans/table';
import { Link } from 'components/Router/Link';
import { ROUTES } from 'resources/routes-constants';
import { TransTitle } from 'i18n/trans/title';
import { TransLabel } from 'i18n/trans/label';
import { withAuthorization } from 'hoc/withAuthorization';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { usePagination } from 'hooks/usePagination';
import { initialPaginationData, type Pagination } from 'types/pagination';
import api from 'services/api';
import { formatDate } from 'utils/date';
import { download } from 'utils/file';
import { ConfirmButton } from 'components/Modal/ConfirmModal';
import { useToast } from 'hooks';

export const ClientCertificateList = withAuthorization(() => {
  const [pagination, setPagination] = usePagination();
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client } = useQuery<ApiClient>({
    queryKey: [`admin/client-by-id?clientId=${clientId}`],
  });
  const { data: certificates, refetch } = useQuery<
    Pagination<ApiClientCertificate>
  >({
    meta: { pagination },
    queryKey: [
      `admin/clients/certificates?clientId=${clientId}`,
      ...Object.values(pagination),
    ],
    initialData: initialPaginationData<ApiClientCertificate>(),
  });

  const toast = useToast();
  const { t } = useTranslation();
  const handleGenerateCertificate = useCallback(async () => {
    try {
      await api.post(
        `admin/clients/certificates/generate?clientId=${clientId}`,
        null
      );
      await refetch();
      toast.open({
        type: 'success',
        title: t('toast.notification'),
        message: t('toast.certificateCreated', {
          defaultValue: 'Certificate Created Successfully',
        }),
      });
    } catch {
      toast.open({
        type: 'error',
        title: t('toast.notificationError'),
        message: t('toast.certificateCreationFailed', {
          defaultValue: 'Certificate Creation Failed',
        }),
      });
    }
  }, [clientId]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const handleDelete = useCallback(
    async ({ clientId, certificateId }: ApiClientCertificate) => {
      await api.delete(
        `admin/clients/certificates?clientId=${clientId}&certificateId=${certificateId}`
      );
      await refetch();
    },
    []
  );
  const columnHelper = createColumnHelper<ApiClientCertificate>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('certificateId', {
        id: 'certificateId',
        header: () => <TransTableHead i18nKey="certificate" />,
        cell: (message) => message.getValue(),
      }),
      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: () => <TransTableHead i18nKey="createdAt" />,
        cell: (message) => formatDate(message.getValue()),
      }),
      columnHelper.accessor('revoked', {
        id: 'status',
        header: '',
        enableSorting: false,
        meta: { size: 1 },
        cell: (message) => {
          const deleted = message.getValue();
          return (
            <Label type={deleted ? 'error' : 'success'}>
              <Icon name={deleted ? 'danger' : 'check'} size="small" />
              <TransLabel i18nKey={deleted ? 'revoked' : 'valid'} />
            </Label>
          );
        },
      }),
      columnHelper.accessor('revoked', {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { size: 1 },
        cell: ({ row: { original }, getValue }) => (
          <Track gap={8}>
            <ConfirmDeleteButton
              appearance="text"
              entity={original}
              entityName="certificateId"
              onConfirm={handleDelete}
              disabled={getValue()}
            >
              <Icon name="delete" />
              <TransButton i18nKey="delete" />
            </ConfirmDeleteButton>
            <Button
              appearance="text"
              component="a"
              href={`/admin/clients/certificates/download?clientId=${clientId}&certificateId=${original.certificateId}`}
              download={original.certificateId}
              data-type={`application/x-x509-ca-cert`}
              data-path="publicKey"
              disabled={getValue()}
              onClick={download}
            >
              <TransButton i18nKey="download" />
            </Button>
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
            <Trans i18nKey="title.clientCertificates" defaults="Certificates" />
          </h1>
        </Track>
        <ConfirmButton
          appearance="primary"
          title={
            <Trans
              i18nKey="dialog.confirtGenerateCertificate.title"
              defaults="Are you sure you want to generate a new certificate?"
            />
          }
          onConfirm={handleGenerateCertificate}
          button={<TransButton i18nKey="generateCertificate" />}
        />
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
            data={certificates.items}
            columns={columns}
            pagination={pagination}
            pagesCount={certificates.totalPages}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
          />
        </Card>
      </Card>
    </>
  );
});
