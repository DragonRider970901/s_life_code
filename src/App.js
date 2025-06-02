import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import Root from './Root';
import Test from './features/test/Test';
import Home from './features/pages/Home';
import Result from './features/pages/Result';
import Signup from './features/pages/Signup';
import Login from './features/pages/Login';
import Dashboard from './features/pages/Dashboard';
import ForgotPassword from './features/pages/ForgotPassword';
import ResetPassword from './features/pages/ResetPassword';
import AdminDashboardLayout from './features/layouts/AdminDashboardLayout';
import Stats from './features/pages/admin/Stats';
import ManageUsers from './features/pages/admin/ManageUsers';
import AddContentCreator from './features/pages/admin/AddContentCreator';
import ViewContentCreator from './features/pages/admin/ViewContentCreators';
import AddAdmin from './features/pages/admin/AddAdmin';
import SendMessage from './features/pages/admin/SendMessage';
import TestTools from './features/pages/tools/TestTools';
import SurveyTools from './features/pages/tools/SurveyTools';
import ContentTools from './features/pages/tools/ContentTools';
import MachineLearning from './features/pages/tools/MachineLearning';
import ChangePassword from './features/pages/profile/ChangePassword';
import EditProfile from './features/pages/profile/EditProfile';
import Logout from './features/pages/profile/Logout';
import Notifications from './features/pages/profile/Notifications';
import DataVisualisation from './features/pages/tools/DataVisualisation';
import AccessLogs from './features/pages/tools/AccessLogs';
import CreatorDashboardLayout from './features/layouts/CreatorDashboardLayout';
import CreateArticle from './features/pages/creator/CreateArticle';
import MyArticles from './features/pages/creator/MyArticles';
import Chat from './features/pages/Chat';
import CreateSurvey from './features/pages/creator/CreateSurvey';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />} >
        <Route index element={<Home />} />
        <Route path='test' element={<Test />} />
        <Route path='result' element={<Result />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='reset-password/:token' element={<ResetPassword />} />
        <Route path='admin' element={<AdminDashboardLayout />} >
          <Route path='stats' element={<Stats />} />
          <Route path='manage-users' element={<ManageUsers />} />
          <Route path='add-content-creator' element={<AddContentCreator />} />
          <Route path='view-content-creator' element={<ViewContentCreator />} />
          <Route path='add-admin' element={<AddAdmin />} />
          <Route path='chats' element={<Chat />} />
          <Route path='test-tools' element={<TestTools />} />
          <Route path='survey-tools' element={<SurveyTools />} />
          <Route path='content-tools' element={<ContentTools />} />
          <Route path='machine-learning' element={<MachineLearning />} />
          <Route path='change-password' element={<ChangePassword />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='logout' element={<Logout />} />
          <Route path='notifications' element={<Notifications />} />
          <Route path='data-visualisation' element={<DataVisualisation />} />
          <Route path='access-logs' element={<AccessLogs />} />
          
        </Route>

        <Route path='creator' element={<CreatorDashboardLayout />} >
          <Route path='create-article' element={<CreateArticle />} />
          <Route path='my-articles' element={<MyArticles />} />
          <Route path='mentions-and-messages' element={<AddContentCreator />} />
          <Route path='feedback-inbox' element={<ViewContentCreator />} />
          <Route path='drafts' element={<AddAdmin />} />
          <Route path='ideas-vault' element={<TestTools />} />
          <Route path='change-password' element={<ChangePassword />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='logout' element={<Logout />} />
          <Route path='notifications' element={<Notifications />} />
          <Route path='chats' element={<Chat />} />
          <Route path='create-survey-full' element={<CreateSurvey />} />
        </Route>
      </Route>
    )
  )
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}

export default App;
