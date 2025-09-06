import React from 'react';
import { useLogoutHandler } from '../utils/logoutHandler';

function Navbar({ user, setUser }) {
  const logout = useLogoutHandler(setUser);

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Ticket 🎫</a>
      </div>

      <div className="flex-none flex items-center gap-3">
        {/* Show user role */}
        {user?.role && (
          <div className='flex gap-4'>
            <span className="text-white font-medium inline">
            {user.fullName}
          </span>
          <span className="text-white font-medium inline">
            {user.role}
          </span>
          </div>
        )}

        {/* Avatar dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src={user?.profilePic} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <button className="btn btn-error w-full" onClick={logout}>
              Logout
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
