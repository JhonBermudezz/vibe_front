import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from 'flowbite-react';
import { 
  HiOutlineViewGrid, 
  HiOutlineCheckCircle, 
  HiOutlineUserCircle, 
  HiOutlineLogout 
} from 'react-icons/hi';

const NAVIGATION_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: <HiOutlineViewGrid className="h-6 w-6" /> },
  { id: 'habits', name: 'Mis Hábitos', icon: <HiOutlineCheckCircle className="h-6 w-6" /> },
  { id: 'profile', name: 'Mi Perfil', icon: <HiOutlineUserCircle className="h-6 w-6" /> },
];

function Sidebar({ currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();

  const userDisplayName = user?.username || 'Entusiasta';

  return (
    <aside className="flex flex-col h-screen w-72 bg-white p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-6 p-2">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-vibe-purple text-white font-bold text-xl">
          {userDisplayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display font-semibold text-vibe-dark-slate">{userDisplayName}</h1>
          <p className="font-sans text-sm text-vibe-medium-gray">Nivel {user?.level || 1}</p>
        </div>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(item.id);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 group
                  ${currentPage === item.id 
                    ? 'bg-vibe-teal text-white shadow-md' 
                    : 'text-vibe-dark-slate hover:bg-vibe-light-gray'
                  }`}
              >
                <div className={currentPage === item.id ? 'text-white' : 'text-vibe-medium-gray'}>
                  {item.icon}
                </div>
                <span className="font-display font-semibold text-sm">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <Button 
          onClick={logout} 
          className="w-full bg-vibe-coral hover:opacity-90 text-white font-sans font-bold"
        >
          <HiOutlineLogout className="mr-2 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;