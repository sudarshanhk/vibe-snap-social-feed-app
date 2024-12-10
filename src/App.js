
import SignIn from "./components/signin/signin.component";
import Feeds from "./routes/feeds/feeds.component";

import Profile from "./routes/profile/profile.component";
import { Route , Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route element={<SignIn />} path="/" />
        <Route element={<Feeds />} path="/feed" />
        <Route element={<Profile />} path="/profile" />
      </Routes>
    </div>
  );
}

export default App;
