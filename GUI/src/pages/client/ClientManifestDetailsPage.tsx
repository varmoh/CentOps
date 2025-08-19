import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, FormInput, FormYamlEditor, Track } from 'components';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { TransButton } from 'i18n/trans/button';
import { TransField } from 'i18n/trans/field';
import { TransTitle } from 'i18n/trans/title';
import { formatDate } from 'utils/date';
import { ROUTES } from 'resources/routes-constants';
import { Link, replaceLinkParams } from 'components/Router/Link';
import { withAuthorization } from 'hoc/withAuthorization';
import type { ApiClient, ApiClientManifest } from 'types/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import type { AxiosError } from 'axios';
import api from 'services/api';
import { useToast } from 'hooks';
import { useTranslation } from 'react-i18next';
import { yamlParser } from 'components/YamlEditor';

export const ClientManifestDetailsPage = withAuthorization(() => {
  const { clientId, manifestId } = useParams<{
    clientId: string;
    manifestId: 'create' | string;
  }>();
  const { backUrl } = useLocation().state ?? {};
  const isCreateMode = manifestId === 'create';

  const { data: client } = useQuery<ApiClient>({
    queryKey: [`admin/client-by-id?clientId=${clientId}`],
  });
  const { data: manifest } = useQuery<ApiClientManifest | object>({
    enabled: !isCreateMode,
    queryKey: [
      `admin/clients/manifests/get?clientId=${clientId}&manifestId=${manifestId}`,
    ],
  });
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const mutation = useMutation<
    ApiClientManifest,
    AxiosError,
    ApiClientManifest
  >({
    mutationFn: async (data) =>
      (
        await {
          post: async () => api.post(`admin/clients/manifests/create`, data),
          put: async () => api.put(`admin/clients/manifests/update`, data),
        }[data.manifestId ? 'put' : 'post']()
      ).data,

    onSuccess: ({ manifestId }) => {
      navigate(replaceLinkParams(ROUTES.CLIENT_MANIFESTS_ROUTE, { clientId }));
      toast.open({
        type: 'success',
        title: t('toast.notification'),
        message: {
          post: t('toast.manifestCreated', {
            defaultValue: 'Manifest Created Successfully',
          }),
          put: t('toast.manifestUpdated', {
            defaultValue: 'Manifest Updated Successfully',
          }),
        }[manifestId ? 'put' : 'post'],
      });
    },
    onError: (error) => {
      toast.open({
        type: 'error',
        title: t('toast.notificationError'),
        message: error.message,
      });
    },
  });
  const onSubmit: SubmitHandler<ApiClientManifest> = useCallback(
    async (data) => {
      await mutation.mutateAsync({ ...data, clientId: clientId as string });
    },
    [clientId]
  );
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ApiClientManifest>({});
  useEffect(() => {
    if (manifest) reset(manifest);
  }, [manifest]);

  return (
    <>
      <Track direction="vertical" align="left">
        <h6>
          <TransTitle i18nKey="client" values={{ client: client?.name }} />
        </h6>
        <h1>
          {isCreateMode ? (
            <TransTitle i18nKey="manifestAdd" />
          ) : (
            <TransTitle i18nKey="manifestEdit" />
          )}
        </h1>
      </Track>

      <Card
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        footer={
          <Track justify="between">
            <Link to={backUrl ?? ROUTES.CLIENT_MANIFESTS_ROUTE}>
              <Button appearance="primary" outlined>
                <TransButton i18nKey="cancel" />
              </Button>
            </Link>
            <Button appearance="primary" type="submit" disabled={isSubmitting}>
              <TransButton i18nKey="save" />
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
          <FormInput
            {...register('name')}
            label={<TransField i18nKey="name" />}
            type="text"
          />
          <FormInput
            {...register('gitHelmRepository')}
            label={<TransField i18nKey="helmRepository" />}
            type="text"
          />
          <FormInput
            {...register('gitHelmPath')}
            label={<TransField i18nKey="helmPath" />}
            type="text"
          />
          <FormInput
            {...register('gitHelmBranch')}
            label={<TransField i18nKey="helm" />}
          />
          <Controller
            name="helmValues"
            control={control}
            render={({ field }) => (
              <FormYamlEditor
                label={<TransField i18nKey="yaml" />}
                {...field}
                minHeight="340px"
                maxHeight="640px"
              />
            )}
            rules={{
              validate: (value) => {
                const errors = yamlParser(value);
                if (errors.length)
                  return errors.map(({ message }) => message).join(' ');
              },
            }}
          />

          {!isCreateMode && (
            <Controller
              name="updatedAt"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  value={formatDate(field.value)}
                  label={<TransField i18nKey="updatedAt" />}
                  type="text"
                  readOnly
                />
              )}
            />
          )}
        </Track>
      </Card>
    </>
  );
});
