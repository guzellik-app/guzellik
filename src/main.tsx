import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import { SearchResults } from './components/SearchResults.tsx';
import { ListingDetail } from './components/ListingDetail.tsx';
import { ClinicProfile } from './components/ClinicProfile.tsx';
import { DashboardLayout } from './components/Dashboard.tsx';
import { NavigationProvider } from './NavigationContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NavigationProvider>
        <Routes>
          <Route path="/" element={<App lang="en" />} />
          <Route path="/de" element={<App lang="de" />} />
          <Route path="/tr" element={<App lang="tr" />} />
          
          <Route path="/chatmt" element={<SearchResults lang="en" />} />
          <Route path="/de/chatmt" element={<SearchResults lang="de" />} />
          <Route path="/tr/chatmt" element={<SearchResults lang="tr" />} />

          <Route path="/chatmt/:slug" element={<ListingDetail lang="en" />} />
          <Route path="/de/chatmt/:slug" element={<ListingDetail lang="de" />} />
          <Route path="/tr/chatmt/:slug" element={<ListingDetail lang="tr" />} />

          <Route path="/mt/:slug" element={<ClinicProfile lang="en" />} />
          <Route path="/de/mt/:slug" element={<ClinicProfile lang="de" />} />
          <Route path="/tr/mt/:slug" element={<ClinicProfile lang="tr" />} />

          <Route path="/dashboard/*" element={<DashboardLayout lang="en" />} />
          <Route path="/de/dashboard/*" element={<DashboardLayout lang="de" />} />
          <Route path="/tr/dashboard/*" element={<DashboardLayout lang="tr" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NavigationProvider>
    </BrowserRouter>
  </StrictMode>,
);
