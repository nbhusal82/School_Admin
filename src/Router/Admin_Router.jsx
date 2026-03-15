import Achievement from "../component/pages/academic/Achievement";
import Event from "../component/pages/academic/Event";
import QuestionBankAdmin from "../component/pages/academic/Question__Bank";
import Dashboard from "../component/pages/Dashboard";
import FAQPage from "../component/pages/FAQs";
import Gallery from "../component/pages/Gallery_Content";
import Review from "../component/pages/Review";
import Team from "../component/pages/Team/Team";


export const adminRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "review",
    element: <Review />,
  },
  {
    path: "faqs",
    element: <FAQPage />,
  },
  {
    path: "team",
    element: <Team />,
  },
  {
    path: "event",
    element: <Event />,
  },
  {
    path: "question-bank",
    element: <QuestionBankAdmin />,
  },
  {
    path: "achievement",
    element: <Achievement />,
  },
  {
    path: "gallery",
    element: <Gallery />,
  },
];
