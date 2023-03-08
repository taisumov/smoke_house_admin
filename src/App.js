import "./App.css";
import FullMenuComponent from "./components/fullMenuComponent/FullMenuComponent";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import MainPage from "./pages/mainPage/MainPage";
import Login from "./components/Login/Login";
import { RequireAuth } from "./hoc/RequireAuth";
import { AuthProvider } from "./hoc/AuthProvider";
import Header from "./pages/header/Header";
import Sales from "./pages/sales/Sales";
import Advantage from "./pages/advantage/Advantage";
import Video from "./pages/video/Video";
import OrderForm from "./pages/orderForm/OrderForm";
import Photo from "./pages/photo/Photo";
import WorkWithUs from "./pages/workWithUs/WorkWithUs";
import Production from "./pages/production/Production";
import Technology from "./pages/technology/Technology";
import Delivery from "./pages/delivery/Delivery";
import Footer from "./pages/footer/Footer";
import Review from "./pages/review/Review";
import Reviews from "./pages/reviews/Reviews";
import Smoke from "./pages/smoke/Smoke";
import CreateProduct from "./pages/createProduct/CreateProduct";
import EditProduct from "./pages/editProduct/EditProduct";
import SmokeGenerators from "./pages/smokeGenerators/SmokeGenerators";
import SteamGenerators from "./pages/steamGenerators/SteamGenerators";
import DryingCabinets from "./pages/dryingCabinets/DryingCabinets";
import Additional from "./pages/additional/Additional";
import CombiSteamer from "./pages/combiSteamer/CombiSteamer";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="auth" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <FullMenuComponent />
              </RequireAuth>
            }
          >
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <MainPage />
                </RequireAuth>
              }
            >
              <Route
                path="header"
                element={
                  <RequireAuth>
                    <Header />
                  </RequireAuth>
                }
              />
              <Route path="sales" element={<Sales />} />
              <Route path="advantage" element={<Advantage />} />
              <Route path="video" element={<Video />} />
              <Route path="orderForm" element={<OrderForm />} />
              <Route path="footer" element={<Footer />} />
            </Route>
            <Route path="aboutUs/*">
              <Route path="photo" element={<Photo />} />
              <Route path="workWithUs" element={<WorkWithUs />} />
              <Route path="review" element={<Review />} />
              <Route path="production" element={<Production />} />

              {/* <Route
                path="statisticsMember/:eventId"
                element={<div>media</div>}
              />
              <Route
                path="statisticsVisitor/:eventId"
                element={<div>media</div>}
              /> */}
            </Route>
            <Route path="catalog/*">
              <Route path="create/:category" element={<CreateProduct />} />
              <Route path="edit/:id&:category" element={<EditProduct />} />
              <Route path="smoke" element={<Smoke />} />
              <Route path="smokeGenerators" element={<SmokeGenerators />} />
              <Route path="steamGenerators" element={<SteamGenerators />} />
              <Route path="dryingCabinets" element={<DryingCabinets />} />
              <Route path="additional" element={<Additional />} />
              <Route path="combiSteamer" element={<CombiSteamer />} />
            </Route>
            <Route path="technology/*" element={<Technology />}></Route>
            <Route path="delivery/*" element={<Delivery />}></Route>
            <Route path="reviews/*" element={<Reviews />}></Route>
            {/* <Route path="*" element={}/> сюда надо 404  */}
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
