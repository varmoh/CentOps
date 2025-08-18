import { Button, Card, FormSelect, Track } from 'components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { TransButton } from 'i18n/trans/button';
import { TransField } from 'i18n/trans/field';
import { TransTitle } from 'i18n/trans/title';
import { ROUTES } from 'resources/routes-constants';
import { Link, replaceLinkParams } from 'components/Router/Link';
import { Trans, useTranslation } from 'react-i18next';
import { withAuthorization } from 'hoc/withAuthorization';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { initialPaginationData, type Pagination } from 'types/pagination';
import type {
  ApiClient,
  ApiClientManifest,
  ClientDeployment,
} from 'types/client';
import { usePagination } from 'hooks/usePagination';
import { useCallback } from 'react';
import api from 'services/api';
import { useToast } from 'hooks';
import type { AxiosError } from 'axios';
import { FormElement } from 'components/FormElements';

export const ClientDeploymentCreatePage = withAuthorization(() => {
  const { clientId } = useParams<{ clientId: string }>();
  const [pagination] = usePagination({
    pageIndex: 0,
    pageSize: 100,
  });
  const { data: client } = useQuery<ApiClient>({
    queryKey: [`admin/client-by-id?clientId=${clientId}`],
  });
  const {
    data: { items: manifests },
  } = useQuery<Pagination<ApiClientManifest>>({
    meta: { pagination },
    queryKey: [
      `admin/clients/manifests/all?clientId=${clientId}`,
      ...Object.values(pagination),
    ],
    initialData: initialPaginationData<ApiClientManifest>(),
  });

  const { control, handleSubmit } = useForm<ClientDeployment>();

  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const onSubmit: SubmitHandler<ClientDeployment> = useCallback(
    async ({ manifestId }) => {
      try {
        await api.post(`admin/clients/deployments/run`, {
          clientId,
          manifestId,
        });
        navigate(
          replaceLinkParams(ROUTES.CLIENT_DEPLOYMENTS_ROUTE, { clientId })
        );
        toast.open({
          type: 'success',
          title: t('toast.notification'),
          message: t('toast.deploymentCreated', {
            defaultValue: 'Deployed Successfully',
          }),
        });
      } catch (e) {
        toast.open({
          type: 'error',
          title: t('toast.notificationError'),
          message: (e as AxiosError).message,
        });
      }
    },
    [clientId]
  );

  return (
    <>
      <Track direction="vertical" align="left">
        <h6>
          <TransTitle i18nKey="client" values={{ client: client?.name }} />
        </h6>
        <h1>
          <Trans i18nKey="title.clientDeploymentAdd" defaults="Deployment" />
        </h1>
      </Track>

      <Card
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        footer={
          <Track justify="between">
            <Link to={ROUTES.CLIENT_DEPLOYMENTS_ROUTE}>
              <Button appearance="primary" outlined>
                <TransButton i18nKey="cancel" />
              </Button>
            </Link>
            <Button appearance="primary">
              <TransButton i18nKey="deploy" />
            </Button>
          </Track>
        }
      >
        <Track
          gap={8}
          direction="vertical"
          isAlignItems={false}
          style={{ width: '90%', marginLeft: 'auto' }}
        >
          <FormElement label={<TransField i18nKey="nameSpace" />}>
            {client?.kubernetesClusterNamespace}
          </FormElement>
          <Controller
            name="manifestId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormSelect
                {...field}
                placeholder="-"
                label={<TransField i18nKey="manifest" />}
                options={manifests.map(
                  ({ manifestId: value, name: label }) => ({ value, label })
                )}
              />
            )}
          />
        </Track>
      </Card>
    </>
  );
});
