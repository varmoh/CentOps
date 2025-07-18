import 'styles/main.scss';
import type { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout, MainNavigation } from 'components';
import {
  CreateInvitationPage,
  EditParticipantPage,
  NotFoundPage,
  OverviewPage,
  ParticipantsPage,
} from 'pages';
import { ROUTES } from 'resources/routes-constants';
import InstitutionsPages from 'pages/InstitutionsPage';
import MessagesPage from 'pages/MessagesPage';
import ManifestsOverviewPage from 'pages/manifests/ManifestsOverviewPage';
import NewManifestsPage from 'pages/manifests/NewManifestsPage';
import ManifestsUpdatesPage from 'pages/manifests/ManifestsUpdatesPage';
import ManifestsHistoryPage from 'pages/manifests/ManifestsHistoryPage';
import ManifestsHistoryDetailsPage from 'pages/manifests/ManifestsDetailsPage';
import CreateEditManifestPage from 'pages/manifests/CreateEditManifestPage';
import { ClientListPage } from 'pages/client/ClientListPage';
import { ClientDetailsPage } from 'pages/client/ClientDetailsPage';
import { ClientSecretListPage } from 'pages/client/ClientSecretListPage';
import { ClientSecretDetailsPage } from 'pages/client/ClientSecretDetailsPage';
import { ClientSecretDiffPage } from 'pages/client/ClientSecretDiffPage';
import { ClientManifestListPage } from 'pages/client/ClientManifestListPage';
import { UserListPage } from 'pages/user/UserListPage';
import { UserDetailsPage } from 'pages/user/UserDetailsPage';
import { ClusterListPage } from 'pages/cluster/ClusterListPage';
import { ClusterDetailsPage } from 'pages/cluster/ClusterDetailsPage';
import { DocumentationPage } from 'pages/documentation/DocumentationPage';
import { DocumentationEditPage } from 'pages/documentation/DocumentationEditPage';
import { ClientManifestDetailsPage } from 'pages/client/ClientManifestDetailsPage';
import { ClientCertificateList } from 'pages/client/ClientCertificateList';
import { ClientCertificateCreatePage } from 'pages/client/ClientCertificateCreatePage';
import { ClientDeploymentList } from 'pages/client/ClientDeploymentList';
import { ClientDeploymentCreatePage } from 'pages/client/ClientDeploymentCreatePage';
import { ClientPodsList } from 'pages/client/ClientPodsList';
import { UserActivityPage } from 'pages/audit/UserActivityPage';
import { SecretAccessPage } from 'pages/audit/SecretAccessPage';

export const RootComponent: FC = () => {
  return (
    <Routes>
      <Route path={`/`} element={<Navigate to={ROUTES.CLIENT_LIST_ROUTE} />} />
      <Route element={<Layout navigation={<MainNavigation />} />}>
        <Route path={ROUTES.CLIENT_LIST_ROUTE} Component={ClientListPage} />
        <Route
          path={ROUTES.CLIENT_DETAILS_ROUTE}
          Component={ClientDetailsPage}
        />
        <Route
          path={ROUTES.CLIENT_SECRETS_ROUTE}
          Component={ClientSecretListPage}
        />
        <Route
          path={ROUTES.CLIENT_SECRETS_DETAILS_ROUTE}
          Component={ClientSecretDetailsPage}
        />
        <Route
          path={ROUTES.CLIENT_SECRETS_DIFF_ROUTE}
          Component={ClientSecretDiffPage}
        />
        <Route
          path={ROUTES.CLIENT_CERTIFICATES_ROUTE}
          Component={ClientCertificateList}
        />
        <Route
          path={ROUTES.CLIENT_CERTIFICATES_CREATE_ROUTE}
          Component={ClientCertificateCreatePage}
        />
        <Route
          path={ROUTES.CLIENT_DEPLOYMENTS_ROUTE}
          Component={ClientDeploymentList}
        />
        <Route
          path={ROUTES.CLIENT_DEPLOYMENTS_CREATE_ROUTE}
          Component={ClientDeploymentCreatePage}
        />
        <Route path={ROUTES.CLIENT_PODS_ROUTE} Component={ClientPodsList} />
        <Route
          path={ROUTES.CLIENT_MANIFESTS_ROUTE}
          Component={ClientManifestListPage}
        />
        <Route
          path={ROUTES.CLIENT_MANIFESTS_DETAILS_ROUTE}
          Component={ClientManifestDetailsPage}
        />
        <Route path={ROUTES.USER_LIST_ROUTE} Component={UserListPage} />
        <Route path={ROUTES.USER_DETAILS_ROUTE} Component={UserDetailsPage} />
        <Route path={ROUTES.CLUSTER_LIST_ROUTE} Component={ClusterListPage} />
        <Route
          path={ROUTES.CLUSTER_DETAILS_ROUTE}
          Component={ClusterDetailsPage}
        />
        <Route
          path={ROUTES.DOCUMENTATION_ROUTE}
          Component={DocumentationPage}
        />
        <Route
          path={ROUTES.DOCUMENTATION_EDIT_ROUTE}
          Component={DocumentationEditPage}
        />
        <Route
          path={ROUTES.AUDIT_USER_ACTIVITY_ROUTE}
          Component={UserActivityPage}
        />
        <Route
          path={ROUTES.AUDIT_SECRET_ACCESS_ROUTE}
          Component={SecretAccessPage}
        />

        <Route
          path={ROUTES.INVITATION_ROUTE}
          element={<CreateInvitationPage />}
        />
        <Route path={ROUTES.OVERVIEW_ROUTE} element={<OverviewPage />} />
        <Route
          path={ROUTES.PARTICIPANTS_ROUTE}
          element={<ParticipantsPage />}
        />
        <Route
          path={ROUTES.PARTICIPANTS_REQUESTS_ROUTE}
          element={<ParticipantsPage />}
        />
        <Route
          path={ROUTES.PARTICIPANTS_EDIT_ROUTE}
          element={<EditParticipantPage />}
        />
        <Route
          path={ROUTES.PARTICIPANTS_REQUESTS_EDIT_ROUTE}
          element={<EditParticipantPage />}
        />
        <Route path={ROUTES.MESSAGES_PAGE_ROUTE} element={<MessagesPage />} />
        <Route
          path={ROUTES.INSTITUTIONS_ROUTE}
          element={<InstitutionsPages />}
        />
        <Route
          path={ROUTES.MANIFESTS_OVERVIEW_ROUTE}
          element={<ManifestsOverviewPage />}
        />
        <Route
          path={ROUTES.MANIFESTS_NEW_MANIFESTS_ROUTE}
          element={<NewManifestsPage />}
        />
        <Route
          path={ROUTES.MANIFESTS_UPDATES_ROUTE}
          element={<ManifestsUpdatesPage />}
        />
        <Route
          path={ROUTES.MANIFESTS_HISTORY_ROUTE}
          element={<ManifestsHistoryPage />}
        />
        <Route
          path={ROUTES.MANIFESTS_DETAILS_ROUTE}
          element={<ManifestsHistoryDetailsPage />}
        />
        <Route
          path={ROUTES.MANIFESTS_CREATE_EDIT_ROUTE}
          element={<CreateEditManifestPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
