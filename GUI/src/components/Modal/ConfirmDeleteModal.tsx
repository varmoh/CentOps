import { Button, Modal, Track } from 'components';
import type { ModalProps } from 'components/Modal/index';
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ButtonProps } from 'components/Button';
import { useToast } from 'hooks';
import { TransButton } from 'i18n/trans/button';
import { get } from 'react-hook-form';

export interface ConfirmDeleteModalProps extends Omit<ModalProps, 'title'> {
  title?: ReactNode;
  name: string;
  onConfirm: () => void;
}

export interface ConfirmDeleteButtonProps<T>
  extends Omit<ButtonProps, 'title'> {
  entity: T;
  entityName?: (keyof T & string) | ((entity: T) => string);
  onConfirm: (entity: T) => Promise<void>;
  title?: ReactNode;
}

export const ConfirmDeleteButton = <T,>({
  entity,
  entityName: getEntityName,
  onConfirm,
  title,
  ...props
}: ConfirmDeleteButtonProps<T>) => {
  const [entityToDelete, setEntityIdToDelete] = useState<T | null>(null);

  const showConfirmDeleteModal = useCallback(
    () => setEntityIdToDelete(entity),
    [entity]
  );
  const closeConfirmDeleteModal = useCallback(
    () => setEntityIdToDelete(null),
    []
  );
  const toast = useToast();

  const { t } = useTranslation();
  const handleConfirm = useCallback(async () => {
    try {
      await onConfirm(entity);
      toast.open({
        type: 'success',
        title: t('toast.deletion'),
        message: t('toast.deletionSuccessfully'),
      });
      closeConfirmDeleteModal();
    } catch {
      toast.open({
        type: 'error',
        title: t('toast.deletion'),
        message: t('toast.deletionFailed'),
      });
    }
  }, [entity]);
  const entityName = useMemo(() => {
    if (typeof getEntityName === 'function') {
      return getEntityName(entity);
    }
    return get(entity, getEntityName ?? '', '');
  }, [entity]);

  return (
    <>
      <Button onClick={showConfirmDeleteModal} {...props} />
      {Boolean(entityToDelete) && (
        <ConfirmDeleteModal
          name={entityName}
          onConfirm={handleConfirm}
          onClose={closeConfirmDeleteModal}
          title={
            title ??
            t('dialog.confirmDeleteTitle.title', {
              defaultValue: 'Do you want to delete {{name}}?',
              name: entityName,
            })
          }
        />
      )}
    </>
  );
};

export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = (props) => {
  return (
    <Modal title={props.title} onClose={props.onClose}>
      <Track justify="end" gap={12}>
        <Button appearance="secondary" onClick={props.onClose}>
          <TransButton i18nKey="cancel" />
        </Button>
        <Button appearance="error" onClick={props.onConfirm}>
          <TransButton i18nKey="delete" />
        </Button>
      </Track>
    </Modal>
  );
};
