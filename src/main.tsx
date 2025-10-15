import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './Pages/Layout.tsx';
import { AboutPage } from './Pages/AboutPage.tsx';
import { ContactPage } from './Pages/ContactPage.tsx';
import { ProductPage } from './Pages/ProductPage.tsx';
import { CaseStudiesPage } from './Pages/CaseStudiesPage.tsx';
import { TermsAndConditionsPage } from './Pages/TermsAndConditionsPage.tsx';
import { BlogPage } from './Pages/BlogPage.tsx';
import { FreeTrialPage } from './Pages/FreeTrialPage.tsx';
import { IndiePlanPage } from './Pages/IndiePlanPage.tsx';
import { StartupPlanPage } from './Pages/StartupPlanPage.tsx';
import { GrowthPlanPage } from './Pages/GrowthPlanPage.tsx';
import { EnterprisePlanPage } from './Pages/EnterprisePlanPage.tsx';
import { JoinWaitlistPage } from './Pages/JoinWaitlistPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "aboutPage", element: <AboutPage /> },
      { path: "contactPage", element: <ContactPage /> },
      { path: "product", element: <ProductPage /> },
      { path: "caseStudies", element: <CaseStudiesPage /> },
      { path: "T&D", element: <TermsAndConditionsPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "free-trial", element: <FreeTrialPage /> },
      { path: "indie-plan", element: <IndiePlanPage /> },
      { path: "startup-plan", element: <StartupPlanPage /> },
      { path: "growth-plan", element: <GrowthPlanPage /> },
      { path: "enterprise-plan", element: <EnterprisePlanPage /> },
      { path: "join-waitlist", element: <JoinWaitlistPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
  </>,
)
