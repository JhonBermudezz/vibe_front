import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardPage from './DashboardPage';
import HabitsPage from './HabitsPage';
import ProfilePage from './ProfilePage';

function DashboardLayout() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    
    return (
        <div className="flex w-full h-full bg-vibe-light-gray">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="flex-grow p-8 overflow-y-auto">
                {currentPage === 'dashboard' && <DashboardPage />}
                {currentPage === 'habits' && <HabitsPage />}
                {currentPage === 'profile' && <ProfilePage />}
            </main>
        </div>
    );
}
export default DashboardLayout;