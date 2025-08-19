import { createTrans } from 'i18n/trans/index';
import { Trans } from 'react-i18next';

export const TransButton = createTrans({
  addClient: <Trans i18nKey="button.addClient" defaults="Add Client" />,
  addCluster: <Trans i18nKey="button.addCluster" defaults="Add cluster" />,
  addManifest: <Trans i18nKey="button.addManifest" defaults="Add Manifest" />,
  addSecret: <Trans i18nKey="button.addSecret" defaults="Add Secret" />,
  addUser: <Trans i18nKey="button.addUser" defaults="Add User" />,
  cancel: <Trans i18nKey="button.cancel" defaults="Cancel" />,
  certificates: <Trans i18nKey="button.certificates" defaults="Certificates" />,
  close: <Trans i18nKey="button.close" defaults="Close" />,
  confirm: <Trans i18nKey="button.confirm" defaults="Confirm" />,
  back: <Trans i18nKey="button.back" defaults="Back" />,
  backToClient: (
    <Trans i18nKey="button.backToClient" defaults="Back to client" />
  ),
  backToSecrets: (
    <Trans i18nKey="button.backToSecrets" defaults="Back to secrets" />
  ),
  delete: <Trans i18nKey="button.delete" defaults="Delete" />,
  deleteDeployment: (
    <Trans i18nKey="button.deleteDeployment" defaults="Delete deployment" />
  ),
  deploy: <Trans i18nKey="button.deploy" defaults="Deploy" />,
  deployment: <Trans i18nKey="button.deployment" defaults="Deployment" />,
  difference: <Trans i18nKey="button.difference" defaults="Difference" />,
  download: <Trans i18nKey="button.download" defaults="Download" />,
  duplicate: <Trans i18nKey="button.duplicate" defaults="Duplicate" />,
  edit: <Trans i18nKey="button.edit" defaults="Edit" />,
  generate: <Trans i18nKey="button.generate" defaults="Generate" />,
  generateCertificate: (
    <Trans
      i18nKey="button.generateCertificate"
      defaults="Generate certificate"
    />
  ),
  manifests: <Trans i18nKey="button.manifests" defaults="Manifests" />,
  newDeployment: (
    <Trans i18nKey="button.newDeployment" defaults="New deployment" />
  ),
  revoke: <Trans i18nKey="button.revoke" defaults="Revoke" />,
  rollback: <Trans i18nKey="button.rollback" defaults="Rollback" />,
  save: <Trans i18nKey="button.save" defaults="Save" />,
  secrets: <Trans i18nKey="button.secrets" defaults="Secrets" />,
  testConnection: (
    <Trans i18nKey="button.testConnection" defaults="Test connection" />
  ),
});
