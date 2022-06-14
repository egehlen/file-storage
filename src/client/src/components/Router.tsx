import { Route, Routes } from 'react-router-dom';
import Layout from './App/Layout';
import About from './Content/About';
import Deleted from './Content/Deleted';
import Files from './Content/Files';

function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={ <Files /> } />
                <Route path='deleted' element={ <Deleted /> } />
                <Route path='about' element={ <About /> } />
            </Route>
        </Routes>
    );
}

export default AppRoutes;